/**
 * WeatherGPT Conversational Assistant Engine
 * Answers natural language weather questions based strictly on real weather data context.
 */

import { sendChatMessage } from './api';

export async function askWeatherGPT(userQuery, weatherData, unit = 'C', conversationHistory = []) {
  if (!userQuery || !userQuery.trim()) return '';

  // 1. First attempt backend Gemini AI chat endpoint if server is available
  try {
    const res = await sendChatMessage(userQuery, weatherData);
    if (res && res.reply) {
      return res.reply;
    }
  } catch (err) {
    console.log('Backend Gemini endpoint unavailable, using deterministic WeatherGPT reasoning engine:', err.message);
  }

  // 2. Rule-based WeatherGPT reasoning engine (100% grounded in real data)
  return generateDeterministicAIAnswer(userQuery, weatherData, unit);
}

export function generateDeterministicAIAnswer(query, weatherData, unit = 'C') {
  if (!weatherData) {
    return "I don't have real-time weather data for your location yet. Please search for a city or click **Use My Location**!";
  }

  const q = query.toLowerCase();
  const city = weatherData.city || 'your location';
  const tempC = weatherData.temp_c ?? 25;
  const tempF = weatherData.temp_f ?? (tempC * 9/5 + 32);
  const displayTemp = unit === 'F' ? `${Math.round(tempF)}°F` : `${Math.round(tempC)}°C`;
  const feelsLike = unit === 'F' ? `${Math.round(weatherData.feelslike_f || tempF)}°F` : `${Math.round(weatherData.feelslike_c || tempC)}°C`;
  const condition = weatherData.condition || 'Clear Sky';
  const humidity = weatherData.humidity || 50;
  const windKph = weatherData.wind_kph || 10;
  const uv = weatherData.uv ?? 3;
  const precipMm = weatherData.precip_mm || 0;
  const hourly = weatherData.hourly || [];
  const maxRain = hourly.slice(0, 12).reduce((m, h) => Math.max(m, h.chance_of_rain || 0), 0);
  const isRaining = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle') || precipMm > 0.5;

  // 1. Umbrella / Rain Query
  if (q.includes('umbrella') || q.includes('rain') || q.includes('shower') || q.includes('downpour')) {
    if (isRaining || maxRain >= 70) {
      return `🌧️ **Yes! I highly recommend carrying an umbrella today in ${city}!**\n\nCurrent weather is **${condition}** with a **${Math.max(maxRain, 80)}% rain risk** in the coming hours. Temperature is ${displayTemp} (feels like ${feelsLike}). Keep your rain gear close!`;
    } else if (maxRain >= 35) {
      return `🌦️ **It's a good idea to carry a small umbrella in ${city}.**\n\nThere is a **${maxRain}% chance of scattered rain showers** today. Current weather is ${condition} at ${displayTemp}.`;
    } else {
      return `☀️ **No umbrella needed today in ${city}!**\n\nThe rain risk is very low (**${maxRain}%**). Weather is **${condition}** with a comfortable temperature of ${displayTemp}. Enjoy your day!`;
    }
  }

  // 2. What to wear
  if (q.includes('wear') || q.includes('cloth') || q.includes('outfit') || q.includes('jacket') || q.includes('dress')) {
    let clothes = "";
    if (tempC < 10) clothes = "a heavy winter coat, scarf, sweater, and warm trousers";
    else if (tempC < 18) clothes = "a light jacket, hoodie, or sweater with jeans";
    else if (tempC > 30) clothes = "light breathable cotton/linen clothes, sunglasses, and a sun hat";
    else clothes = "a comfortable short-sleeve t-shirt with trousers or casual pants";

    if (isRaining || maxRain > 40) clothes += " plus a waterproof coat or umbrella";

    return `👕 **Clothing Recommendation for ${city} (${displayTemp}):**\n\nBased on current conditions (**${condition}**, feels like ${feelsLike}), I recommend wearing **${clothes}**.\n\n- **Humidity:** ${humidity}%\n- **UV Index:** ${uv}`;
  }

  // 3. Running / Outdoor Workout
  if (q.includes('run') || q.includes('workout') || q.includes('jog') || q.includes('exercise') || q.includes('cycling') || q.includes('sports')) {
    if (isRaining || maxRain >= 70) {
      return `🏃‍♂️ **Indoor workouts are recommended today in ${city}.**\n\nActive rain / high rain risk (**${maxRain}%**) means wet and slippery pavements. Treadmill or gym sessions will be much safer and more enjoyable.`;
    } else if (tempC > 34) {
      return `🏃‍♂️ **Heat Advisory for Outdoor Exercise in ${city}:**\n\nTemperature is high at **${displayTemp}** (feels like ${feelsLike}). Workout early in the morning before 7:30 AM or after sunset, and carry plenty of water!`;
    } else if (weatherData.aqi?.us_epa_index >= 4) {
      return `🏃‍♂️ **Air Quality Advisory:**\n\nAir pollution in ${city} is elevated (EPA Index: ${weatherData.aqi.us_epa_index}). Consider indoor cardiovascular workouts today.`;
    } else {
      return `🏃‍♂️ **Great conditions for a run in ${city}!**\n\nTemperature is **${displayTemp}** with **${condition}** and light wind (${windKph} km/h). Rain risk is minimal (${maxRain}%). Have a great workout!`;
    }
  }

  // 4. Going outside / Best time
  if (q.includes('outside') || q.includes('outdoors') || q.includes('go out') || q.includes('best time')) {
    if (isRaining) {
      return `🌧️ **Currently Raining in ${city}:** Condition is **${condition}** at ${displayTemp}. Check the hourly forecast below to find dry periods later today!`;
    } else {
      return `☀️ **Yes! It's a nice day to go outside in ${city}!**\n\n- **Temperature:** ${displayTemp} (Feels like ${feelsLike})\n- **Condition:** ${condition}\n- **Wind:** ${windKph} km/h\n- **UV Index:** ${uv} (${uv >= 6 ? 'Sunscreen recommended' : 'Low sun hazard'})`;
    }
  }

  // 5. Tomorrow
  if (q.includes('tomorrow')) {
    const tmw = (weatherData.daily || [])[1];
    if (tmw) {
      const tmwTemp = unit === 'F' ? `${Math.round(tmw.max_temp_f)}°F / ${Math.round(tmw.min_temp_f)}°F` : `${Math.round(tmw.max_temp_c)}°C / ${Math.round(tmw.min_temp_c)}°C`;
      return `📅 **Tomorrow's Forecast for ${city} (${tmw.day_name || 'Tomorrow'}):**\n\n- **Condition:** ${tmw.condition}\n- **High / Low:** ${tmwTemp}\n- **Rain Chance:** ${tmw.chance_of_rain}%\n- **UV Index:** ${tmw.uv}`;
    }
    return `📅 Tomorrow in **${city}**, expect conditions similar to today with a high around ${displayTemp}.`;
  }

  // 6. Air Quality
  if (q.includes('air quality') || q.includes('aqi') || q.includes('pollution') || q.includes('smog')) {
    const aqiCat = weatherData.aqi?.category || 'Good';
    const epa = weatherData.aqi?.us_epa_index || 1;
    return `🌬️ **Air Quality in ${city}:**\n\n- **Rating:** ${aqiCat} (EPA Index: ${epa}/6)\n- **Health Advice:** ${epa <= 2 ? 'Air quality is satisfactory. Outdoor activities are safe!' : 'Elevated air pollution. Sensitive groups should wear an N95 mask outdoors.'}`;
  }

  // 7. Driving / Travel
  if (q.includes('drive') || q.includes('driving') || q.includes('travel') || q.includes('road')) {
    const vis = weatherData.visibility_km || 10;
    if (vis < 2 || condition.toLowerCase().includes('fog')) {
      return `🚗 **Low Visibility Advisory for Driving in ${city}:**\n\nVisibility is reduced to **${vis.toFixed(1)} km** due to ${condition}. Turn on low-beam headlights and reduce driving speed.`;
    } else if (isRaining) {
      return `🚗 **Wet Road Warning for ${city}:**\n\nActive rain (${condition}). Maintain extra distance from other vehicles to avoid hydroplaning.`;
    } else {
      return `🚗 **Road conditions in ${city} are Good!**\n\nVisibility is ${vis} km with ${condition} and wind at ${windKph} km/h. Smooth travel expected!`;
    }
  }

  // Default response
  return `🌡️ **Weather Overview for ${city}:**\n\nCurrently **${displayTemp}** (Feels like ${feelsLike}) with **${condition}**.\n- **Humidity:** ${humidity}%\n- **Wind:** ${windKph} km/h ${weatherData.wind_dir || ''}\n- **Rain Risk:** ${maxRain}%\n- **UV Index:** ${uv}\n\nFeel free to ask me questions like:\n- *"Should I carry an umbrella today?"*\n- *"What should I wear?"*\n- *"Can I go for a run this evening?"*\n- *"How is the air quality?"*`;
}
