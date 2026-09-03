const axios = require('axios');
const { OPENWEATHER_API_KEY } = require('../config/config');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

async function fetchFromApi(endpoint, params) {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key is missing');
  }
  const key = `${endpoint}?${new URLSearchParams(params).toString()}`;
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: { ...params, appid: OPENWEATHER_API_KEY, units: 'metric' }
    });
    setInCache(key, response.data);
    return response.data;
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch weather data');
  }
}

module.exports = {
  getCurrentWeather: async (city) => {
    const data = await fetchFromApi('/weather', { q: city });
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_dir: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    };
  },
  getForecast: async (city) => {
    const data = await fetchFromApi('/forecast', { q: city });
    return data.list.filter((item, index) => index % 8 === 0).map(item => ({
      date: item.dt_txt,
      temp: item.main.temp,
      description: item.weather[0].description
    }));
  },
  getHourlyForecast: async (city) => {
    const data = await fetchFromApi('/forecast', { q: city });
    return data.list.slice(0, 8).map(item => ({
      time: item.dt_txt,
      temp: item.main.temp,
      description: item.weather[0].description
    }));
  },
  getWeatherByCoords: async (lat, lon) => {
    const data = await fetchFromApi('/weather', { lat, lon });
    return {
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description
    };
  },
  getAirQuality: async (lat, lon) => {
    const data = await fetchFromApi('/air_pollution', { lat, lon });
    return data.list[0];
  }
};
