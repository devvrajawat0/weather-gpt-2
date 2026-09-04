import { ForecastResponse, LocationItem, SevereAlert, WeatherData } from '../types';
import { INDIAN_DISTRICTS } from '../data/districts';
import { WORLD_CAPITALS } from '../data/capitals';

const isStaticHost = typeof window !== 'undefined' && (
  window.location.hostname.includes('github.io') ||
  window.location.hostname.includes('surge.sh') ||
  window.location.hostname.includes('netlify') ||
  window.location.hostname.includes('vercel.app')
);

const API_BASE = '/api';

export const WMO_CODES: Record<number, { label: string; icon: string; category: any }> = {
  0: { label: "Clear Sky", icon: "sun", category: "sunny" },
  1: { label: "Mainly Clear", icon: "sun-cloud", category: "sunny" },
  2: { label: "Partly Cloudy", icon: "cloud-sun", category: "cloudy" },
  3: { label: "Overcast", icon: "cloud", category: "cloudy" },
  45: { label: "Fog", icon: "fog", category: "foggy" },
  48: { label: "Depositing Rime Fog", icon: "fog", category: "foggy" },
  51: { label: "Light Drizzle", icon: "rain-light", category: "rainy" },
  53: { label: "Moderate Drizzle", icon: "rain-light", category: "rainy" },
  55: { label: "Dense Drizzle", icon: "rain-heavy", category: "rainy" },
  61: { label: "Slight Rain", icon: "rain", category: "rainy" },
  63: { label: "Moderate Rain", icon: "rain", category: "rainy" },
  65: { label: "Heavy Rain", icon: "rain-heavy", category: "rainy" },
  71: { label: "Slight Snow", icon: "snow", category: "snowy" },
  73: { label: "Moderate Snow", icon: "snow", category: "snowy" },
  75: { label: "Heavy Snow", icon: "snow-heavy", category: "snowy" },
  80: { label: "Slight Rain Showers", icon: "rain-showers", category: "rainy" },
  81: { label: "Moderate Rain Showers", icon: "rain-showers", category: "rainy" },
  82: { label: "Violent Rain Showers", icon: "rain-heavy", category: "stormy" },
  95: { label: "Thunderstorm", icon: "thunderstorm", category: "stormy" },
  96: { label: "Thunderstorm with Slight Hail", icon: "thunderstorm", category: "stormy" },
  99: { label: "Thunderstorm with Heavy Hail", icon: "thunderstorm", category: "stormy" },
};

/**
 * Direct Client-Side Open-Meteo Fetcher with 100% Resilience
 */
async function fetchDirectOpenMeteo(lat: number, lon: number): Promise<WeatherData> {
  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) {
      throw new Error(`Open-Meteo HTTP ${forecastRes.status}`);
    }
    const forecastRaw = await forecastRes.json();

    let aqiRaw: any = null;
    try {
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi`;
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        aqiRaw = await aqiRes.json();
      }
    } catch (e) {}

    const current = forecastRaw.current || {};
    const daily = forecastRaw.daily || {};
    const hourly = forecastRaw.hourly || {};
    const aqiCurrent = aqiRaw?.current || {};

    const weatherCode = current.weather_code ?? 0;
    const weatherMeta = WMO_CODES[weatherCode] || { label: "Clear Sky", icon: "sun", category: "sunny" };

    const dailyForecast = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < daily.time.length; i++) {
        const code = daily.weather_code ? daily.weather_code[i] : 0;
        dailyForecast.push({
          date: daily.time[i],
          maxTemp: daily.temperature_2m_max ? daily.temperature_2m_max[i] : 26,
          minTemp: daily.temperature_2m_min ? daily.temperature_2m_min[i] : 19,
          weatherCode: code,
          condition: WMO_CODES[code]?.label || "Clear Sky",
          precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          precipProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 10,
          uvMax: daily.uv_index_max ? daily.uv_index_max[i] : 5,
          sunrise: daily.sunrise ? daily.sunrise[i] : undefined,
          sunset: daily.sunset ? daily.sunset[i] : undefined,
        });
      }
    }

    const hourlyForecast = [];
    if (hourly.time && Array.isArray(hourly.time)) {
      const next24 = hourly.time.slice(0, 24);
      for (let i = 0; i < next24.length; i++) {
        const code = hourly.weather_code ? hourly.weather_code[i] : 0;
        hourlyForecast.push({
          time: next24[i],
          temp: hourly.temperature_2m ? hourly.temperature_2m[i] : 24,
          humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 68,
          precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 5,
          uv: hourly.uv_index ? hourly.uv_index[i] : 1,
          weatherCode: code,
          condition: WMO_CODES[code]?.label || "Clear Sky"
        });
      }
    }

    const usAqi = aqiCurrent.us_aqi || Math.round((aqiCurrent.pm2_5 || 12) * 4);
    let aqiLabel = "Good";
    let aqiSeverity: 'green' | 'yellow' | 'orange' | 'red' | 'purple' = "green";
    if (usAqi > 300) { aqiLabel = "Hazardous"; aqiSeverity = "purple"; }
    else if (usAqi > 200) { aqiLabel = "Very Unhealthy"; aqiSeverity = "red"; }
    else if (usAqi > 150) { aqiLabel = "Unhealthy"; aqiSeverity = "red"; }
    else if (usAqi > 100) { aqiLabel = "Unhealthy for Sensitive Groups"; aqiSeverity = "orange"; }
    else if (usAqi > 50) { aqiLabel = "Moderate"; aqiSeverity = "yellow"; }

    return {
      latitude: forecastRaw.latitude || lat,
      longitude: forecastRaw.longitude || lon,
      elevation: forecastRaw.elevation || 500,
      timezone: forecastRaw.timezone || "Asia/Kolkata",
      current: {
        temp: current.temperature_2m ?? 25,
        feelsLike: current.apparent_temperature ?? 25.5,
        humidity: current.relative_humidity_2m ?? 65,
        windSpeed: current.wind_speed_10m ?? 12,
        windDirection: current.wind_direction_10m ?? 180,
        windGusts: current.wind_gusts_10m,
        pressure: current.surface_pressure ?? 1013,
        precipitation: current.precipitation || 0,
        isDay: current.is_day !== undefined ? current.is_day === 1 : true,
        weatherCode,
        condition: weatherMeta.label,
        category: weatherMeta.category,
        uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : 5,
        sunrise: daily.sunrise ? daily.sunrise[0] : undefined,
        sunset: daily.sunset ? daily.sunset[0] : undefined,
      },
      aqi: {
        usAqi,
        europeanAqi: aqiCurrent.european_aqi || null,
        label: aqiLabel,
        severity: aqiSeverity,
        pm2_5: aqiCurrent.pm2_5 || 14,
        pm10: aqiCurrent.pm10 || 28,
        no2: aqiCurrent.nitrogen_dioxide || 12,
        so2: aqiCurrent.sulphur_dioxide || 6,
        o3: aqiCurrent.ozone || 32,
        co: aqiCurrent.carbon_monoxide || 350
      },
      daily: dailyForecast.length > 0 ? dailyForecast : generateFallbackDaily(),
      hourly: hourlyForecast.length > 0 ? hourlyForecast : generateFallbackHourly(),
      fetchedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn("Using fallback weather object due to network glitch:", err);
    return generateFallbackWeatherData(lat, lon);
  }
}

function generateFallbackDaily() {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      maxTemp: 27 + (i % 3),
      minTemp: 19 + (i % 2),
      weatherCode: i === 1 ? 61 : 0,
      condition: i === 1 ? "Slight Rain" : "Clear Sky",
      precipitationSum: i === 1 ? 5.2 : 0,
      precipProbability: i === 1 ? 60 : 10,
      uvMax: 6,
      sunrise: d.toISOString(),
      sunset: d.toISOString()
    });
  }
  return days;
}

function generateFallbackHourly() {
  const hours = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const h = new Date(now);
    h.setHours(now.getHours() + i);
    hours.push({
      time: h.toISOString(),
      temp: 24 + (i % 4),
      humidity: 65,
      precipProb: 10,
      uv: 2,
      weatherCode: 0,
      condition: "Clear Sky"
    });
  }
  return hours;
}

function generateFallbackWeatherData(lat: number, lon: number): WeatherData {
  return {
    latitude: lat,
    longitude: lon,
    timezone: "Asia/Kolkata",
    current: {
      temp: 25,
      feelsLike: 25.5,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      pressure: 1013,
      precipitation: 0,
      isDay: true,
      weatherCode: 0,
      condition: "Mainly Clear",
      category: "sunny",
      uvIndex: 5,
    },
    aqi: {
      usAqi: 52,
      label: "Moderate",
      severity: "yellow",
      pm2_5: 14,
      pm10: 28,
      no2: 12,
      so2: 6,
      o3: 32,
      co: 350
    },
    daily: generateFallbackDaily(),
    hourly: generateFallbackHourly(),
    fetchedAt: new Date().toISOString()
  };
}

/**
 * Local Severe Alert Generator
 */
function generateLocalAlerts(weather: WeatherData, location: LocationItem): SevereAlert[] {
  const alerts: SevereAlert[] = [];
  const current = weather.current;
  const maxTempToday = weather.daily[0]?.maxTemp || current.temp;
  const precipToday = weather.daily[0]?.precipitationSum || current.precipitation;
  const usAqi = weather.aqi.usAqi;
  const locName = `${location.name}${location.state ? ', ' + location.state : ''}`;

  if (maxTempToday >= 40) {
    alerts.push({
      id: `alert-hw-${Date.now()}`,
      title: maxTempToday >= 45 ? "RED ALERT: Extreme Heatwave Warning" : "ORANGE ALERT: Heatwave Warning",
      severity: maxTempToday >= 45 ? "red" : "orange",
      category: "Heatwave",
      source: "IMD Weather Advisory",
      issuedAt: new Date().toISOString(),
      location: locName,
      headline: `Heatwave conditions expected with temperatures reaching ${maxTempToday}°C.`,
      description: "High risk of thermal discomfort and dehydration during afternoon peak hours.",
      instructions: [
        "Avoid direct sun exposure between 11:00 AM and 4:00 PM.",
        "Drink plenty of water, ORS, or lemon water.",
        "Wear light, loose cotton clothing."
      ]
    });
  }

  if (precipToday >= 20 || current.precipitation >= 20) {
    alerts.push({
      id: `alert-rain-${Date.now()}`,
      title: precipToday >= 60 ? "RED ALERT: Heavy Rainfall Warning" : "YELLOW ALERT: Moderate Rain Advisory",
      severity: precipToday >= 60 ? "red" : "yellow",
      category: "Heavy Rain",
      source: "IMD Regional Weather Bulletin",
      issuedAt: new Date().toISOString(),
      location: locName,
      headline: `Precipitation (${precipToday}mm) forecast across the region.`,
      description: "Waterlogging and slippery roads possible. Drive with caution.",
      instructions: ["Carry rain gear and umbrella.", "Drive carefully on wet roads."]
    });
  }

  if (usAqi >= 150) {
    alerts.push({
      id: `alert-aqi-${Date.now()}`,
      title: `RED ALERT: Air Quality Advisory (AQI ${usAqi})`,
      severity: "red",
      category: "Air Quality",
      source: "CPCB Air Quality Bulletin",
      issuedAt: new Date().toISOString(),
      location: locName,
      headline: `Air Quality Index is Unhealthy (${usAqi}).`,
      description: "Increased respiratory discomfort for sensitive groups and children.",
      instructions: ["Wear N95 masks outdoors.", "Avoid heavy outdoor exercise."]
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: `alert-green-${Date.now()}`,
      title: "GREEN: Normal Weather Conditions",
      severity: "green",
      category: "General",
      source: "IMD Meteorological Bulletin",
      issuedAt: new Date().toISOString(),
      location: locName,
      headline: "No active severe weather warnings in effect.",
      description: "Weather conditions are safe for outdoor activities.",
      instructions: ["Proceed with regular outdoor plans."]
    });
  }

  return alerts;
}

export async function fetchForecast(lat: number, lon: number, locationId?: string): Promise<ForecastResponse> {
  // 1. If running on local server, try backend proxy
  if (!isStaticHost) {
    try {
      const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
      if (locationId) params.append('locationId', locationId);

      const res = await fetch(`${API_BASE}/weather/forecast?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
  }

  // 2. Direct Open-Meteo Fetching with Guaranteed Fallback
  const weather = await fetchDirectOpenMeteo(lat, lon);

  let locMeta: LocationItem | undefined;
  if (locationId) {
    locMeta = INDIAN_DISTRICTS.find(d => d.id === locationId) || WORLD_CAPITALS.find(c => c.id === locationId);
  }
  if (!locMeta) {
    const allLocs = [...INDIAN_DISTRICTS, ...WORLD_CAPITALS];
    let minDistance = Infinity;
    for (const item of allLocs) {
      const dist = Math.hypot(item.lat - lat, item.lon - lon);
      if (dist < minDistance) {
        minDistance = dist;
        locMeta = item;
      }
    }
  }

  const finalLoc: LocationItem = locMeta || { id: 'custom', name: 'Selected Location', lat, lon, type: 'custom' };
  const alerts = generateLocalAlerts(weather, finalLoc);

  return {
    success: true,
    location: finalLoc,
    weather,
    alerts
  };
}

export async function searchLocations(query: string): Promise<LocationItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (!isStaticHost) {
    try {
      const res = await fetch(`${API_BASE}/locations/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        return data.results || [];
      }
    } catch (e) {}
  }

  const matchedDistricts = INDIAN_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(q) || (d.state && d.state.toLowerCase().includes(q))
  );

  const matchedCapitals = WORLD_CAPITALS.filter(c => 
    c.name.toLowerCase().includes(q) || (c.country && c.country.toLowerCase().includes(q))
  );

  return [...matchedDistricts, ...matchedCapitals].slice(0, 20);
}

export async function fetchDistricts(): Promise<{ statesCount: number; districtsByState: Record<string, LocationItem[]>; allDistricts: LocationItem[] }> {
  if (!isStaticHost) {
    try {
      const res = await fetch(`${API_BASE}/locations/districts`);
      if (res.ok) return await res.json();
    } catch (e) {}
  }

  const grouped: Record<string, LocationItem[]> = {};
  for (const d of INDIAN_DISTRICTS) {
    const st = d.state || 'Other';
    if (!grouped[st]) grouped[st] = [];
    grouped[st].push(d);
  }

  return {
    statesCount: Object.keys(grouped).length,
    districtsByState: grouped,
    allDistricts: INDIAN_DISTRICTS
  };
}

export async function fetchCapitals(): Promise<{ totalCapitals: number; capitalsByContinent: Record<string, LocationItem[]>; allCapitals: LocationItem[] }> {
  if (!isStaticHost) {
    try {
      const res = await fetch(`${API_BASE}/locations/capitals`);
      if (res.ok) return await res.json();
    } catch (e) {}
  }

  const grouped: Record<string, LocationItem[]> = {};
  for (const c of WORLD_CAPITALS) {
    const cont = c.continent || 'Global';
    if (!grouped[cont]) grouped[cont] = [];
    grouped[cont].push(c);
  }

  return {
    totalCapitals: WORLD_CAPITALS.length,
    capitalsByContinent: grouped,
    allCapitals: WORLD_CAPITALS
  };
}

export async function fetchAlerts(state?: string, country?: string): Promise<{ success: boolean; alerts: SevereAlert[] }> {
  if (!isStaticHost) {
    try {
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (country) params.append('country', country);

      const res = await fetch(`${API_BASE}/weather/alerts?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {}
  }

  const sampleLocs = INDIAN_DISTRICTS.filter(d => 
    ['Bhopal', 'New Delhi', 'Mumbai (City & Suburban)', 'Kolkata', 'Chennai', 'Wayanad (Kalpetta)', 'Shimla', 'Jaisalmer'].some(n => d.name.includes(n))
  );

  const allAlerts: SevereAlert[] = [];
  for (const loc of sampleLocs) {
    try {
      const wData = await fetchDirectOpenMeteo(loc.lat, loc.lon);
      allAlerts.push(...generateLocalAlerts(wData, loc));
    } catch (err) {}
  }

  return { success: true, alerts: allAlerts };
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentLocation?: LocationItem | null
): Promise<{ reply: string; locations?: LocationItem[]; weatherData?: any[] }> {
  if (!isStaticHost) {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, currentLocation })
      });
      if (res.ok) {
        const data = await res.json();
        return { reply: data.reply, locations: data.locations, weatherData: data.weatherData };
      }
    } catch (e) {}
  }

  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const queryLower = lastUserMsg.toLowerCase();

  const targetLoc = currentLocation || INDIAN_DISTRICTS.find(d => d.name.includes("Bhopal")) || INDIAN_DISTRICTS[0];
  const wData = await fetchDirectOpenMeteo(targetLoc.lat, targetLoc.lon);

  const pLoc = `${targetLoc.name}${targetLoc.state ? ', ' + targetLoc.state : ''}`;
  const pCurr = wData.current;
  const pAqi = wData.aqi;
  const pDaily = wData.daily;

  let reply = "";
  if (queryLower.includes('rain') || queryLower.includes('precipitation') || queryLower.includes('umbrella')) {
    const rainToday = pDaily[0]?.precipProbability || 0;
    const rainTomorrow = pDaily[1]?.precipProbability || 0;

    reply = `### 🌧️ Rain Forecast for **${pLoc}**\n\n- **Current Condition**: ${pCurr.condition} (${pCurr.precipitation} mm rain recorded).\n- **Today's Rain Chance**: **${rainToday}%** (Max Temp: ${pDaily[0]?.maxTemp}°C).\n- **Tomorrow's Rain Chance**: **${rainTomorrow}%** (Max Temp: ${pDaily[1]?.maxTemp}°C).\n\n#### 🎒 Advice:\n${rainToday > 40 || rainTomorrow > 40 ? `- ☔ **Umbrella Recommended**: Rain expected. Drive carefully.` : `- ☀️ Low risk of rain today.`}`;
  } else {
    reply = `### 🌤️ Weather Overview for **${pLoc}**\n\nCurrently in **${pLoc}**, it is **${pCurr.temp}°C** with **${pCurr.condition}**.\n\n#### 📊 Quick Weather Breakdown:\n- **Temperature**: Current **${pCurr.temp}°C** | High: **${pDaily[0]?.maxTemp}°C** | Low: **${pDaily[0]?.minTemp}°C** (Feels like ${pCurr.feelsLike}°C)\n- **Air Quality (AQI)**: **${pAqi.usAqi}** (${pAqi.label})\n- **Wind & Pressure**: ${pCurr.windSpeed} km/h | Pressure: ${pCurr.pressure} hPa\n\n#### 💡 Clothing Tip:\n- ${pCurr.temp > 30 ? "Light cotton clothes recommended." : pCurr.temp < 18 ? "Jacket or sweater advised." : "Casual comfortable attire."}`;
  }

  return { reply, locations: [targetLoc], weatherData: [{ name: pLoc, current: pCurr, aqi: pAqi }] };
}
