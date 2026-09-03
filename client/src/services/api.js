import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const sendChatMessage = (message, sessionId) => {
  return api.post('/chat', { message, sessionId });
};

export const getCurrentWeather = (city) => {
  return api.get(`/weather/current?city=${encodeURIComponent(city)}`);
};

export const getForecast = (city) => {
  return api.get(`/weather/forecast?city=${encodeURIComponent(city)}`);
};

export const getHourlyForecast = (city) => {
  return api.get(`/weather/hourly?city=${encodeURIComponent(city)}`);
};

export const getAlerts = (city) => {
  return api.get(`/alerts?city=${encodeURIComponent(city)}`);
};

export default api;
