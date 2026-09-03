import { useState, useEffect } from 'react';
import { getCurrentWeather, getForecast, getHourlyForecast } from '../services/api';

export const useWeather = (initialCity = 'Delhi') => {
  const [city, setCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      fetchAllWeatherData(city);
    }
  }, [city]);

  const fetchAllWeatherData = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const [current, fcast, hour] = await Promise.all([
        getCurrentWeather(cityName).catch(() => null),
        getForecast(cityName).catch(() => []),
        getHourlyForecast(cityName).catch(() => [])
      ]);
      
      setWeatherData(current);
      setForecast(fcast || []);
      setHourly(hour || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = (newCity) => {
    setCity(newCity);
  };

  return {
    city,
    weatherData,
    forecast,
    hourly,
    loading,
    error,
    fetchWeather
  };
};
