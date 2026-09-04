const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || 'demo_key_replace_me';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setInCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Transform WeatherAPI response into standard normalized schema
function normalizeWeatherAPIResponse(data) {
  if (!data || !data.location || !data.current) return null;

  const loc = data.location;
  const curr = data.current;
  const forecastDays = data.forecast?.forecastday || [];

  // Parse EPA Air Quality
  const epaIndex = curr.air_quality?.['us-epa-index'] || 1;
  const epaCategories = {
    1: { category: 'Good', color: 'emerald' },
    2: { category: 'Moderate', color: 'amber' },
    3: { category: 'Unhealthy for Sensitive Groups', color: 'orange' },
    4: { category: 'Unhealthy', color: 'red' },
    5: { category: 'Very Unhealthy', color: 'purple' },
    6: { category: 'Hazardous', color: 'rose' }
  };
  const aqiInfo = epaCategories[epaIndex] || epaCategories[1];

  // Parse UV Text
  const uvVal = curr.uv ?? 0;
  let uvText = 'Low';
  if (uvVal >= 11) uvText = 'Extreme';
  else if (uvVal >= 8) uvText = 'Very High';
  else if (uvVal >= 6) uvText = 'High';
  else if (uvVal >= 3) uvText = 'Moderate';

  // Parse Hourly Forecast (next 24 hours)
  const allHours = forecastDays.flatMap(day => day.hour || []);
  const nowEpoch = Math.floor(Date.now() / 1000);
  const nextHourly = allHours
    .filter(h => h.time_epoch >= nowEpoch - 3600)
    .slice(0, 24)
    .map(h => ({
      time: h.time,
      time_epoch: h.time_epoch,
      temp_c: h.temp_c,
      temp_f: h.temp_f,
      condition: h.condition?.text || 'Clear',
      icon: h.condition?.icon ? `https:${h.condition.icon}` : '☀️',
      chance_of_rain: h.chance_of_rain ?? h.chance_of_snow ?? 0,
      precip_mm: h.precip_mm ?? 0,
      humidity: h.humidity,
      wind_kph: h.wind_kph
    }));

  // Parse 7-Day Daily Forecast
  const daily = forecastDays.map(day => {
    const dateObj = new Date(day.date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: day.date,
      day_name: dayName,
      max_temp_c: day.day.maxtemp_c,
      min_temp_c: day.day.mintemp_c,
      max_temp_f: day.day.maxtemp_f,
      min_temp_f: day.day.mintemp_f,
      condition: day.day.condition?.text || 'Clear',
      icon: day.day.condition?.icon ? `https:${day.day.condition.icon}` : '☀️',
      chance_of_rain: day.day.daily_chance_of_rain ?? 0,
      precip_mm: day.day.totalprecip_mm ?? 0,
      uv: day.day.uv ?? 0,
      humidity: day.day.avghumidity ?? 50,
      max_wind_kph: day.day.maxwind_kph ?? 10,
      sunrise: day.astro?.sunrise || '06:00 AM',
      sunset: day.astro?.sunset || '06:30 PM'
    };
  });

  // Parse Weather Alerts
  const alertsList = (data.alerts?.alert || []).map((alert, idx) => ({
    id: `alert-${idx}`,
    title: alert.event || alert.headline || 'Weather Advisory',
    severity: (alert.severity || 'Moderate').toUpperCase(),
    description: alert.desc || alert.headline || 'Severe weather warning in effect.',
    instruction: alert.instruction || 'Follow local authority advice and stay safe.',
    areas: alert.areas || loc.name,
    effective: alert.effective || new Date().toISOString(),
    expires: alert.expires || ''
  }));

  const astro = forecastDays[0]?.astro || {};

  return {
    city: loc.name,
    country: loc.country,
    region: loc.region,
    lat: loc.lat,
    lon: loc.lon,
    temp_c: curr.temp_c,
    temp_f: curr.temp_f,
    feelslike_c: curr.feelslike_c,
    feelslike_f: curr.feelslike_f,
    temp_max_c: forecastDays[0]?.day?.maxtemp_c ?? curr.temp_c + 2,
    temp_min_c: forecastDays[0]?.day?.mintemp_c ?? curr.temp_c - 3,
    temp_max_f: forecastDays[0]?.day?.maxtemp_f ?? curr.temp_f + 4,
    temp_min_f: forecastDays[0]?.day?.mintemp_f ?? curr.temp_f - 5,
    condition: curr.condition?.text || 'Clear',
    condition_code: curr.condition?.code || 1000,
    icon: curr.condition?.icon ? `https:${curr.condition.icon}` : '☀️',
    humidity: curr.humidity,
    wind_kph: curr.wind_kph,
    wind_mph: curr.wind_mph,
    wind_dir: curr.wind_dir,
    wind_degree: curr.wind_degree,
    visibility_km: curr.vis_km,
    visibility_miles: curr.vis_miles,
    uv: uvVal,
    uv_text: uvText,
    pressure_mb: curr.pressure_mb,
    precip_mm: curr.precip_mm,
    precip_in: curr.precip_in,
    cloud: curr.cloud,
    is_day: curr.is_day === 1,
    aqi: {
      us_epa_index: epaIndex,
      pm2_5: curr.air_quality?.pm2_5 ? Math.round(curr.air_quality.pm2_5) : null,
      pm10: curr.air_quality?.pm10 ? Math.round(curr.air_quality.pm10) : null,
      category: aqiInfo.category,
      badge_color: aqiInfo.color
    },
    sunrise: astro.sunrise || '06:00 AM',
    sunset: astro.sunset || '06:30 PM',
    moon_phase: astro.moon_phase || 'Waxing Crescent',
    last_updated: curr.last_updated || new Date().toLocaleString(),
    last_updated_epoch: curr.last_updated_epoch || Math.floor(Date.now() / 1000),
    fetched_at: Date.now(),
    hourly: nextHourly,
    daily: daily,
    alerts: alertsList
  };
}

// OpenWeatherMap fallback transformer
function normalizeOpenWeatherResponse(currentData, forecastData, aqiData) {
  if (!currentData) return null;
  const tempC = currentData.main?.temp ?? 25;
  const tempF = tempC * 9/5 + 32;
  const feelsC = currentData.main?.feels_like ?? tempC;
  const feelsF = feelsC * 9/5 + 32;

  const hourlyList = (forecastData?.list || []).slice(0, 24).map(item => ({
    time: item.dt_txt,
    time_epoch: item.dt,
    temp_c: item.main.temp,
    temp_f: item.main.temp * 9/5 + 32,
    condition: item.weather[0]?.main || 'Clear',
    icon: `https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`,
    chance_of_rain: Math.round((item.pop || 0) * 100),
    precip_mm: item.rain?.['3h'] || 0,
    humidity: item.main.humidity,
    wind_kph: Math.round((item.wind.speed || 0) * 3.6)
  }));

  const dailyList = (forecastData?.list || []).filter((_, i) => i % 8 === 0).map(item => {
    const d = new Date(item.dt_txt);
    return {
      date: item.dt_txt.split(' ')[0],
      day_name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      max_temp_c: item.main.temp_max,
      min_temp_c: item.main.temp_min,
      max_temp_f: item.main.temp_max * 9/5 + 32,
      min_temp_f: item.main.temp_min * 9/5 + 32,
      condition: item.weather[0]?.main || 'Clear',
      icon: `https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`,
      chance_of_rain: Math.round((item.pop || 0) * 100),
      precip_mm: item.rain?.['3h'] || 0,
      uv: 5,
      humidity: item.main.humidity,
      max_wind_kph: Math.round((item.wind.speed || 0) * 3.6),
      sunrise: '06:00 AM',
      sunset: '06:30 PM'
    };
  });

  return {
    city: currentData.name,
    country: currentData.sys?.country || 'IN',
    region: currentData.name,
    lat: currentData.coord?.lat || 28.61,
    lon: currentData.coord?.lon || 77.20,
    temp_c: tempC,
    temp_f: tempF,
    feelslike_c: feelsC,
    feelslike_f: feelsF,
    temp_max_c: currentData.main?.temp_max ?? tempC + 2,
    temp_min_c: currentData.main?.temp_min ?? tempC - 2,
    temp_max_f: (currentData.main?.temp_max ?? tempC + 2) * 9/5 + 32,
    temp_min_f: (currentData.main?.temp_min ?? tempC - 2) * 9/5 + 32,
    condition: currentData.weather?.[0]?.description || 'Clear Sky',
    condition_code: currentData.weather?.[0]?.id || 800,
    icon: `https://openweathermap.org/img/wn/${currentData.weather?.[0]?.icon || '01d'}@2x.png`,
    humidity: currentData.main?.humidity || 50,
    wind_kph: Math.round((currentData.wind?.speed || 3.5) * 3.6),
    wind_mph: Math.round((currentData.wind?.speed || 3.5) * 2.237),
    wind_dir: 'NE',
    wind_degree: currentData.wind?.deg || 45,
    visibility_km: (currentData.visibility || 10000) / 1000,
    visibility_miles: (currentData.visibility || 10000) / 1609.34,
    uv: 4,
    uv_text: 'Moderate',
    pressure_mb: currentData.main?.pressure || 1012,
    precip_mm: currentData.rain?.['1h'] || 0,
    precip_in: (currentData.rain?.['1h'] || 0) / 25.4,
    cloud: currentData.clouds?.all || 20,
    is_day: true,
    aqi: {
      us_epa_index: aqiData?.main?.aqi || 1,
      pm2_5: aqiData?.components?.pm2_5 || 12,
      pm10: aqiData?.components?.pm10 || 20,
      category: 'Good',
      badge_color: 'emerald'
    },
    sunrise: new Date((currentData.sys?.sunrise || Date.now()/1000) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date((currentData.sys?.sunset || Date.now()/1000) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    moon_phase: 'Waxing Crescent',
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    last_updated_epoch: Math.floor(Date.now() / 1000),
    fetched_at: Date.now(),
    hourly: hourlyList,
    daily: dailyList,
    alerts: []
  };
}

module.exports = {
  getWeatherData: async (queryLocation) => {
    const key = `weather_${queryLocation}`;
    const cached = getFromCache(key);
    if (cached) return cached;

    // 1. Try WeatherAPI.com if key is configured or default demo key
    try {
      const weatherApiKey = process.env.WEATHER_API_KEY || 'demo_key';
      if (weatherApiKey && weatherApiKey !== 'demo_key') {
        const response = await axios.get(`${WEATHER_API_BASE}/forecast.json`, {
          params: {
            key: weatherApiKey,
            q: queryLocation,
            days: 7,
            aqi: 'yes',
            alerts: 'yes'
          }
        });
        const normalized = normalizeWeatherAPIResponse(response.data);
        if (normalized) {
          setInCache(key, normalized);
          return normalized;
        }
      }
    } catch (err) {
      console.warn('WeatherAPI.com call failed, trying OpenWeatherMap fallback:', err.message);
    }

    // 2. OpenWeatherMap fallback
    try {
      const owmKey = process.env.OPENWEATHER_API_KEY;
      if (owmKey && owmKey !== 'demo_key_replace_me') {
        const [currRes, fcastRes] = await Promise.all([
          axios.get('https://api.openweathermap.org/data/2.5/weather', { params: { q: queryLocation, appid: owmKey, units: 'metric' } }),
          axios.get('https://api.openweathermap.org/data/2.5/forecast', { params: { q: queryLocation, appid: owmKey, units: 'metric' } })
        ]);
        const normalized = normalizeOpenWeatherResponse(currRes.data, fcastRes.data, null);
        if (normalized) {
          setInCache(key, normalized);
          return normalized;
        }
      }
    } catch (err) {
      console.warn('OpenWeatherMap call failed:', err.message);
    }

    throw new Error(`Unable to fetch real-time weather for "${queryLocation}". Please verify API keys.`);
  },

  searchLocations: async (query) => {
    if (!query || query.length < 2) return [];
    try {
      const weatherApiKey = process.env.WEATHER_API_KEY;
      if (weatherApiKey && weatherApiKey !== 'demo_key') {
        const response = await axios.get(`${WEATHER_API_BASE}/search.json`, {
          params: { key: weatherApiKey, q: query }
        });
        return (response.data || []).map(item => ({
          name: item.name,
          region: item.region,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
          query: `${item.name}, ${item.country}`
        }));
      }
    } catch (err) {
      console.warn('WeatherAPI search failed:', err.message);
    }
    return [];
  }
};
