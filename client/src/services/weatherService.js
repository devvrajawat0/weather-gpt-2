import axios from 'axios';

// Weather code mappings to text and icons
const WMO_CODES = {
  0: { text: 'Clear Sky', icon: '☀️' },
  1: { text: 'Mainly Clear', icon: '🌤️' },
  2: { text: 'Partly Cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Foggy', icon: '🌫️' },
  48: { text: 'Depositing Rime Fog', icon: '🌫️' },
  51: { text: 'Light Drizzle', icon: '🌦️' },
  53: { text: 'Moderate Drizzle', icon: '🌦️' },
  55: { text: 'Dense Drizzle', icon: '🌧️' },
  61: { text: 'Slight Rain', icon: '🌧️' },
  63: { text: 'Moderate Rain', icon: '🌧️' },
  65: { text: 'Heavy Rain', icon: '🌧️' },
  71: { text: 'Slight Snow', icon: '❄️' },
  73: { text: 'Moderate Snow', icon: '❄️' },
  75: { text: 'Heavy Snow', icon: '❄️' },
  80: { text: 'Slight Rain Showers', icon: '🌦️' },
  81: { text: 'Moderate Rain Showers', icon: '🌧️' },
  82: { text: 'Violent Rain Showers', icon: '⛈️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm with Hail', icon: '⛈️' }
};

export function normalizeOpenMeteoResponse(cityInfo, data) {
  if (!data || !data.current) return null;

  const curr = data.current;
  const hourly = data.hourly || {};
  const daily = data.daily || {};

  const tempC = curr.temperature_2m ?? 25;
  const tempF = tempC * 9/5 + 32;
  const feelsC = curr.apparent_temperature ?? tempC;
  const feelsF = feelsC * 9/5 + 32;

  const wCode = curr.weather_code ?? 0;
  const wInfo = WMO_CODES[wCode] || { text: 'Partly Cloudy', icon: '🌤️' };

  // Parse Hourly Forecast (next 24 hours)
  const hourlyTimes = hourly.time || [];
  const nextHourly = hourlyTimes.slice(0, 24).map((tStr, idx) => {
    const hTempC = hourly.temperature_2m?.[idx] ?? tempC;
    const hCode = hourly.weather_code?.[idx] ?? wCode;
    const hInfo = WMO_CODES[hCode] || { text: 'Clear', icon: '☀️' };
    const rainProb = hourly.precipitation_probability?.[idx] ?? 0;

    return {
      time: tStr.split('T')[1] || tStr,
      full_time: tStr,
      temp_c: hTempC,
      temp_f: hTempC * 9/5 + 32,
      condition: hInfo.text,
      icon: hInfo.icon,
      chance_of_rain: rainProb,
      precip_mm: hourly.precipitation?.[idx] ?? 0,
      humidity: hourly.relative_humidity_2m?.[idx] ?? 50,
      wind_kph: Math.round(hourly.wind_speed_10m?.[idx] ?? 10)
    };
  });

  // Parse Daily Forecast (7 days)
  const dailyTimes = daily.time || [];
  const dailyList = dailyTimes.map((dStr, idx) => {
    const dObj = new Date(dStr);
    const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dCode = daily.weather_code?.[idx] ?? wCode;
    const dInfo = WMO_CODES[dCode] || { text: 'Clear', icon: '☀️' };
    const maxC = daily.temperature_2m_max?.[idx] ?? tempC + 2;
    const minC = daily.temperature_2m_min?.[idx] ?? tempC - 3;
    const maxF = maxC * 9/5 + 32;
    const minF = minC * 9/5 + 32;
    const uvVal = daily.uv_index_max?.[idx] ?? 4;

    return {
      date: dStr,
      day_name: dayName,
      max_temp_c: maxC,
      min_temp_c: minC,
      max_temp_f: maxF,
      min_temp_f: minF,
      condition: dInfo.text,
      icon: dInfo.icon,
      chance_of_rain: daily.precipitation_probability_max?.[idx] ?? 0,
      precip_mm: 0,
      uv: uvVal,
      humidity: curr.relative_humidity_2m || 50,
      max_wind_kph: Math.round(curr.wind_speed_10m || 10),
      sunrise: '06:00 AM',
      sunset: '06:30 PM'
    };
  });

  const uvVal = daily.uv_index_max?.[0] ?? 4;
  let uvText = 'Low';
  if (uvVal >= 8) uvText = 'Very High';
  else if (uvVal >= 6) uvText = 'High';
  else if (uvVal >= 3) uvText = 'Moderate';

  return {
    city: cityInfo.name || 'Selected City',
    country: cityInfo.country || 'Global',
    region: cityInfo.admin1 || cityInfo.name,
    lat: cityInfo.latitude,
    lon: cityInfo.longitude,
    temp_c: tempC,
    temp_f: tempF,
    feelslike_c: feelsC,
    feelslike_f: feelsF,
    temp_max_c: dailyList[0]?.max_temp_c ?? tempC + 2,
    temp_min_c: dailyList[0]?.min_temp_c ?? tempC - 3,
    temp_max_f: dailyList[0]?.max_temp_f ?? tempF + 4,
    temp_min_f: dailyList[0]?.min_temp_f ?? tempF - 5,
    condition: wInfo.text,
    condition_code: wCode,
    icon: wInfo.icon,
    humidity: curr.relative_humidity_2m ?? 50,
    wind_kph: Math.round(curr.wind_speed_10m ?? 10),
    wind_mph: Math.round((curr.wind_speed_10m ?? 10) * 0.621371),
    wind_dir: getWindDirection(curr.wind_direction_10m || 0),
    wind_degree: curr.wind_direction_10m || 0,
    visibility_km: 10,
    visibility_miles: 6.2,
    uv: uvVal,
    uv_text: uvText,
    pressure_mb: Math.round(curr.surface_pressure ?? 1012),
    precip_mm: curr.precipitation ?? 0,
    precip_in: (curr.precipitation ?? 0) / 25.4,
    cloud: 20,
    is_day: true,
    aqi: {
      us_epa_index: 1,
      pm2_5: 12,
      pm10: 20,
      category: 'Good',
      badge_color: 'emerald'
    },
    sunrise: '06:00 AM',
    sunset: '06:30 PM',
    moon_phase: 'Waxing Crescent',
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    last_updated_epoch: Math.floor(Date.now() / 1000),
    fetched_at: Date.now(),
    hourly: nextHourly,
    daily: dailyList,
    alerts: []
  };
}

function getWindDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export async function fetchWeather(queryLocation) {
  // Check if query is lat,lon
  let searchName = queryLocation;
  let targetLat = null;
  let targetLon = null;

  if (queryLocation.includes(',')) {
    const parts = queryLocation.split(',');
    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
      targetLat = parseFloat(parts[0]);
      targetLon = parseFloat(parts[1]);
      searchName = `Location (${targetLat.toFixed(2)}, ${targetLon.toFixed(2)})`;
    }
  }

  // 1. Geocode location if not coordinates
  let cityInfo = { name: searchName, country: '', latitude: targetLat, longitude: targetLon };

  if (targetLat === null || targetLon === null) {
    try {
      const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryLocation)}&count=1`);
      if (geoRes.data?.results?.[0]) {
        const res = geoRes.data.results[0];
        cityInfo = {
          name: res.name,
          country: res.country || '',
          admin1: res.admin1,
          latitude: res.latitude,
          longitude: res.longitude
        };
      }
    } catch (err) {
      console.warn('Geocoding error:', err.message);
    }
  }

  if (cityInfo.latitude === null || cityInfo.longitude === null) {
    // Default fallback coordinates for Delhi if geocoding failed
    cityInfo.latitude = 28.61;
    cityInfo.longitude = 77.20;
    cityInfo.name = queryLocation;
  }

  // 2. Fetch real-time weather from Open-Meteo API
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.latitude}&longitude=${cityInfo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto`;
    const res = await axios.get(weatherUrl);
    const normalized = normalizeOpenMeteoResponse(cityInfo, res.data);
    if (normalized) return normalized;
  } catch (err) {
    console.error('Open-Meteo fetch error:', err.message);
  }

  throw new Error(`Unable to fetch real-time weather for "${queryLocation}".`);
}

export async function fetchWeatherByCoords(lat, lon) {
  return fetchWeather(`${lat},${lon}`);
}

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
    return (geoRes.data?.results || []).map(item => ({
      name: item.name,
      region: item.admin1 || item.country || '',
      country: item.country || '',
      lat: item.latitude,
      lon: item.longitude,
      query: `${item.name}, ${item.country || ''}`
    }));
  } catch (err) {
    return [];
  }
}
