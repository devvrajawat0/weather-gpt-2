import { useState, useEffect, useCallback } from 'react';
import { fetchWeather as apiFetchWeather, searchLocations } from '../services/weatherService';
import { generateWeatherInsights } from '../services/insightService';

export const useWeather = (initialCity = 'Delhi') => {
  // Load saved preferences from localStorage
  const savedCity = typeof window !== 'undefined' ? localStorage.getItem('weathergpt_last_city') || initialCity : initialCity;
  const savedUnit = typeof window !== 'undefined' ? localStorage.getItem('weathergpt_unit') || 'C' : 'C';

  const [city, setCity] = useState(savedCity);
  const [unit, setUnit] = useState(savedUnit); // 'C' or 'F'
  const [weatherData, setWeatherData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastUpdatedText, setLastUpdatedText] = useState('Updated just now');

  // Persist preferences
  useEffect(() => {
    if (unit) localStorage.setItem('weathergpt_unit', unit);
  }, [unit]);

  useEffect(() => {
    if (city) localStorage.setItem('weathergpt_last_city', city);
  }, [city]);

  // Main data fetch function
  const loadWeather = useCallback(async (locationQuery) => {
    const q = locationQuery || city || 'Delhi';
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchWeather(q);
      setWeatherData(data);
      setInsights(generateWeatherInsights(data, unit));
      setCity(data.city);
      setLastUpdatedText('Updated just now');
    } catch (err) {
      console.error('Weather load error:', err);
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [city, unit]);

  // Initial load
  useEffect(() => {
    loadWeather(savedCity);
  }, []);

  // Re-generate insights on unit change
  useEffect(() => {
    if (weatherData) {
      setInsights(generateWeatherInsights(weatherData, unit));
    }
  }, [unit, weatherData]);

  // Update relative timestamp ("Updated X minutes ago")
  useEffect(() => {
    const interval = setInterval(() => {
      if (!weatherData?.fetched_at) return;
      const mins = Math.floor((Date.now() - weatherData.fetched_at) / 60000);
      if (mins <= 0) setLastUpdatedText('Updated just now');
      else if (mins === 1) setLastUpdatedText('Updated 1 min ago');
      else setLastUpdatedText(`Updated ${mins} mins ago`);
    }, 30000);
    return () => clearInterval(interval);
  }, [weatherData]);

  // Geolocation API ("Use My Location")
  const fetchWeatherByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeather(`${latitude},${longitude}`);
      },
      (geoErr) => {
        setLoading(false);
        if (geoErr.code === 1) {
          setError('Location permission denied. Please search for a city manually.');
        } else {
          setError('Unable to retrieve your location. Please try again.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [loadWeather]);

  // Auto-suggest search
  const handleSearchQuery = async (queryText) => {
    if (!queryText || queryText.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchLocations(queryText);
      setSuggestions(results || []);
    } catch (err) {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  return {
    city,
    unit,
    weatherData,
    insights,
    loading,
    error,
    suggestions,
    isSearching,
    lastUpdatedText,
    fetchWeather: loadWeather,
    fetchWeatherByLocation,
    handleSearchQuery,
    clearSuggestions: () => setSuggestions([]),
    toggleUnit,
    refreshWeather: () => loadWeather(city)
  };
};
