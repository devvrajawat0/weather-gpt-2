import Anthropic from '@anthropic-ai/sdk';
import { getWeatherData } from './weatherService.js';
import { INDIAN_DISTRICTS } from '../data/districts.js';
import { WORLD_CAPITALS } from '../data/capitals.js';

let anthropicClient = null;
if (process.env.ANTHROPIC_API_KEY) {
  try {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  } catch (e) {
    console.warn("Failed to initialize Anthropic client:", e.message);
  }
}

/**
 * Helper to match location names in query string
 */
function findLocationsInText(text) {
  const queryLower = text.toLowerCase();
  const matched = [];

  // Check Indian districts
  for (const d of INDIAN_DISTRICTS) {
    const dNameLower = d.name.toLowerCase().split('(')[0].trim();
    if (queryLower.includes(dNameLower)) {
      matched.push(d);
    }
  }

  // Check World Capitals
  for (const c of WORLD_CAPITALS) {
    const cNameLower = c.name.toLowerCase().split('(')[0].trim();
    if (queryLower.includes(cNameLower) && !matched.some(m => m.id === c.id)) {
      matched.push(c);
    }
  }

  return matched;
}

/**
 * Main AI Chat Processor
 */
export async function processChatQuery(messages, currentLocation = null) {
  const lastUserMsg = messages[messages.length - 1]?.content || "";

  // 1. Identify locations mentioned in query
  let targetLocations = findLocationsInText(lastUserMsg);

  // If no location mentioned in prompt, fallback to currentLocation if provided, or default to Bhopal / Delhi
  if (targetLocations.length === 0) {
    if (currentLocation && currentLocation.lat && currentLocation.lon) {
      targetLocations.push(currentLocation);
    } else {
      // Default fallback
      targetLocations.push(INDIAN_DISTRICTS.find(d => d.name.includes("Bhopal")) || INDIAN_DISTRICTS[0]);
    }
  }

  // 2. Fetch live weather context for up to 2 target locations
  const weatherContexts = [];
  for (const loc of targetLocations.slice(0, 2)) {
    try {
      const data = await getWeatherData(loc.lat, loc.lon);
      weatherContexts.push({
        location: loc.name + (loc.state ? `, ${loc.state}` : loc.country ? `, ${loc.country}` : ''),
        locObj: loc,
        weather: data
      });
    } catch (err) {
      console.warn(`Could not fetch weather context for ${loc.name}:`, err.message);
    }
  }

  // 3. If Anthropic client exists, call Claude API with live context
  if (anthropicClient && process.env.ANTHROPIC_API_KEY) {
    try {
      const systemPrompt = `You are WeatherGPT, an expert AI Weather Assistant designed for forecasting, climate explanations, agricultural advice, clothing/travel recommendations, and location comparison.
      
Real live weather data fetched for the user's query:
${JSON.stringify(weatherContexts, null, 2)}

Instructions:
- Respond in a warm, concise, professional, conversational tone.
- Use clean Markdown with bullet points, bold text, and clear sections.
- When answering weather questions ("Will it rain in Bhopal tomorrow?"), reference exact temperatures (°C), precipitation %, humidity, AQI, and wind speeds from the provided live weather data.
- Offer practical advice: Clothing recommendations, Outdoor/Travel tips, and Agricultural/Farmer advisories when relevant.
- Compare locations side-by-side if multiple locations are mentioned.
- Keep responses informative and clear. Always include a brief note if severe conditions exist.`;

      const formattedMessages = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: systemPrompt,
        messages: formattedMessages
      });

      const replyText = response.content[0]?.text || "I'm sorry, I couldn't process your request.";
      return {
        reply: replyText,
        locations: weatherContexts.map(w => w.locObj),
        weatherData: weatherContexts.map(w => ({ name: w.location, current: w.weather.current, aqi: w.weather.aqi }))
      };
    } catch (error) {
      console.error("Anthropic API call failed, using intelligent fallback engine:", error.message);
    }
  }

  // 4. Intelligent Fallback Weather Response Generator (No API Key Required)
  const queryLower = lastUserMsg.toLowerCase();
  let reply = "";

  if (weatherContexts.length === 0) {
    reply = "I couldn't fetch live weather data for the specified location right now. Please try searching for a specific district in India (e.g. Bhopal, Jaipur, Wayanad) or a world capital (e.g. Tokyo, Paris).";
    return { reply, locations: [], weatherData: [] };
  }

  const primary = weatherContexts[0];
  const pLoc = primary.location;
  const pCurr = primary.weather.current;
  const pAqi = primary.weather.aqi;
  const pDaily = primary.weather.daily;

  // Scenario A: Comparison between 2 locations
  if (weatherContexts.length >= 2) {
    const sec = weatherContexts[1];
    const sLoc = sec.location;
    const sCurr = sec.weather.current;

    const tempDiff = (pCurr.temp - sCurr.temp).toFixed(1);
    const warmerLoc = pCurr.temp > sCurr.temp ? pLoc : sLoc;

    reply = `### 🌤️ Weather Comparison: **${pLoc}** vs **${sLoc}**

Here is the real-time weather comparison between **${pLoc}** and **${sLoc}**:

| Weather Parameter | ${pLoc} | ${sLoc} |
| :--- | :--- | :--- |
| **Current Temperature** | **${pCurr.temp}°C** (Feels like ${pCurr.feelsLike}°C) | **${sCurr.temp}°C** (Feels like ${sCurr.feelsLike}°C) |
| **Condition** | ${pCurr.condition} | ${sCurr.condition} |
| **Humidity** | ${pCurr.humidity}% | ${sCurr.humidity}% |
| **Wind Speed** | ${pCurr.windSpeed} km/h | ${sCurr.windSpeed} km/h |
| **Air Quality (AQI)** | ${pAqi.usAqi} (${pAqi.label}) | ${sec.weather.aqi.usAqi} (${sec.weather.aqi.label}) |
| **Precipitation** | ${pCurr.precipitation} mm | ${sCurr.precipitation} mm |

#### 📊 Key Insights & Recommendation:
- **Temperature Difference**: **${warmerLoc}** is currently warmer by **${Math.abs(tempDiff)}°C**.
- **Comfort & Travel**: ${pCurr.temp > 32 ? `Stay hydrated in ${pLoc} as temperatures are warm.` : `Enjoy pleasant weather conditions in ${pLoc}.`}
- **Air Quality**: ${pAqi.usAqi > 150 ? `⚠️ Outdoor mask advised in ${pLoc} due to elevated AQI (${pAqi.usAqi}).` : `Air quality is fair.`}`;
  } 
  // Scenario B: Rain / Rain forecast query
  else if (queryLower.includes('rain') || queryLower.includes('precipitation') || queryLower.includes('umbrella')) {
    const rainToday = pDaily[0]?.precipProbability || 0;
    const rainTomorrow = pDaily[1]?.precipProbability || 0;

    reply = `### 🌧️ Rain Forecast for **${pLoc}**

- **Current Condition**: ${pCurr.condition} with **${pCurr.precipitation} mm** recorded precipitation.
- **Today's Rain Chance**: **${rainToday}%** chance of rainfall (Max Temp: ${pDaily[0]?.maxTemp}°C).
- **Tomorrow's Rain Chance**: **${rainTomorrow}%** chance of rain (Max Temp: ${pDaily[1]?.maxTemp}°C).

#### 🎒 Travel & Clothing Advice:
${rainToday > 40 || rainTomorrow > 40 
  ? `- ☔ **Umbrella Recommended**: High chance of rain. Carry rain gear and drive carefully on wet roads.`
  : `- ☀️ **Low Rain Risk**: Rain is unlikely today. Good conditions for outdoor travel.`}
${pAqi.usAqi > 100 ? `- 😷 **Air Quality**: AQI is ${pAqi.usAqi} (${pAqi.label}). Sensitive groups should limit prolonged outdoor exertion.` : ''}`;
  }
  // Scenario C: Agriculture / Farmer advice query
  else if (queryLower.includes('farmer') || queryLower.includes('agri') || queryLower.includes('crop') || queryLower.includes('irrigation')) {
    reply = `### 🌾 Agricultural Weather Advisory for **${pLoc}**

- **Current Temp**: ${pCurr.temp}°C (Feels like ${pCurr.feelsLike}°C)
- **Relative Humidity**: ${pCurr.humidity}%
- **Wind Speed**: ${pCurr.windSpeed} km/h
- **7-Day Rain Summary**: ${pDaily.slice(0, 5).reduce((acc, d) => acc + (d.precipitationSum || 0), 0).toFixed(1)} mm accumulated rain expected.

#### 🚜 Farming & Field Management Guidance:
1. **Irrigation Schedule**: ${pDaily[0]?.precipProbability > 50 ? "Postpone artificial irrigation as moderate to heavy rainfall is expected today." : "Soil moisture is normal. Regular irrigation can proceed early morning or late evening."}
2. **Pesticide Spraying**: ${pCurr.windSpeed > 20 ? "⚠️ Avoid spraying pesticides/fertilizers today due to high wind speeds (" + pCurr.windSpeed + " km/h) causing spray drift." : "Wind conditions are suitable for pesticide and fertilizer application."}
3. **Harvesting & Storage**: ${pDaily[1]?.precipProbability > 60 ? "Protect harvested crops in dry storage to prevent moisture damage from upcoming rain." : "Weather is suitable for field preparation and crop harvesting."}`;
  }
  // Scenario D: General / Tomorrow / Current Weather Summary
  else {
    const today = pDaily[0] || {};
    const tomorrow = pDaily[1] || {};

    reply = `### 🌤️ Weather Overview for **${pLoc}**

Currently in **${pLoc}**, it is **${pCurr.temp}°C** with **${pCurr.condition}**.

#### 📊 Quick Weather Breakdown:
- **Temperature**: Current **${pCurr.temp}°C** | High: **${today.maxTemp}°C** | Low: **${today.minTemp}°C** (Feels like ${pCurr.feelsLike}°C)
- **Air Quality (AQI)**: **${pAqi.usAqi}** (${pAqi.label}) ${pAqi.usAqi > 150 ? '⚠️ Unhealthy' : '✅ Safe'}
- **Wind & Pressure**: ${pCurr.windSpeed} km/h | Pressure: ${pCurr.pressure} hPa
- **Tomorrow's Forecast**: ${tomorrow.condition} with High of **${tomorrow.maxTemp}°C**, Low of **${tomorrow.minTemp}°C** (${tomorrow.precipProbability}% rain probability).

#### 💡 Smart Tips:
- **Clothing**: ${pCurr.temp > 30 ? "Lightweight, breathable cotton clothes are ideal." : pCurr.temp < 18 ? "Warm jacket or sweater recommended." : "Comfortable casual clothing."}
- **Outdoors**: ${pCurr.uvIndex >= 6 ? "☀️ High UV Index (" + pCurr.uvIndex + "). Wear sunscreen and sunglasses." : "UV Index is moderate."}`;
  }

  return {
    reply,
    locations: weatherContexts.map(w => w.locObj),
    weatherData: weatherContexts.map(w => ({ name: w.location, current: w.weather.current, aqi: w.weather.aqi }))
  };
}
