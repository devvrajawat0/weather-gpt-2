import React, { useState } from 'react';
import { useWeather } from '../../hooks/useWeather';
import CurrentWeather from './CurrentWeather';
import WeatherInsights from './WeatherInsights';
import ForecastChart from './ForecastChart';
import HourlyForecast from './HourlyForecast';
import WeatherMap from './WeatherMap';
import SkeletonLoader from '../Common/SkeletonLoader';
import { Search, MapPin, Navigation, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

const WeatherDashboard = ({ initialCity = 'Delhi', onCityChange }) => {
  const {
    city,
    unit,
    weatherData,
    insights,
    loading,
    error,
    suggestions,
    isSearching,
    lastUpdatedText,
    fetchWeather,
    fetchWeatherByLocation,
    handleSearchQuery,
    clearSuggestions,
    toggleUnit,
    refreshWeather
  } = useWeather(initialCity);

  const [searchInput, setSearchInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      if (onCityChange) onCityChange(searchInput.trim());
      setSearchInput('');
      clearSuggestions();
    }
  };

  const handleSelectSuggestion = (suggestedItem) => {
    fetchWeather(suggestedItem.query || suggestedItem.name);
    if (onCityChange) onCityChange(suggestedItem.name);
    setSearchInput('');
    clearSuggestions();
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Control Bar */}
      <div className="glass-panel p-4 md:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 relative z-30">
        
        {/* City Title & Quick Geolocation */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <MapPin size={22} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              {weatherData?.city || city}
              {weatherData?.country && (
                <span className="text-xs font-normal text-cyan-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  {weatherData.country}
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400">Live Weather & AI Insights</p>
          </div>
        </div>

        {/* Search Bar & Auto-Suggestions Dropdown */}
        <div className="w-full md:w-96 relative">
          <form onSubmit={onSearchSubmit} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearchQuery(e.target.value);
              }}
              onFocus={() => {
                if (searchInput) handleSearchQuery(searchInput);
              }}
              placeholder="Search city (e.g., London, Tokyo, Mumbai)..."
              className="w-full pl-11 pr-24 py-2.5 bg-black/40 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 backdrop-blur-md transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold hover:scale-105 transition-transform"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50 max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-cyan-500/20 border-b border-white/5 flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-xs text-gray-400">{item.region}, {item.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: Geolocation, Unit Toggle, Refresh */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={fetchWeatherByLocation}
            title="Use My Location"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white backdrop-blur-md transition-all hover:scale-105"
          >
            <Navigation size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Use My Location</span>
          </button>

          <button
            onClick={toggleUnit}
            title="Toggle Temperature Unit"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-cyan-300 backdrop-blur-md transition-all hover:scale-105"
          >
            °{unit === 'C' ? 'C → °F' : 'F → °C'}
          </button>

          <button
            onClick={handleManualRefresh}
            title="Refresh Weather"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md transition-all hover:scale-105"
          >
            <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/15 border border-red-500/40 text-red-200 p-4 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => fetchWeather(city)}
            className="px-4 py-1.5 bg-red-500/30 hover:bg-red-500/40 text-white rounded-xl text-xs font-semibold border border-red-400/40 transition-all flex-shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        weatherData && (
          <div className="space-y-8">
            {/* Main Weather Hero Card */}
            <CurrentWeather 
              data={weatherData} 
              unit={unit} 
              lastUpdatedText={lastUpdatedText}
              onRefresh={handleManualRefresh}
            />

            {/* AI Insights Recommendations Section */}
            <WeatherInsights insights={insights} />

            {/* Hourly & 7-Day Forecast Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <HourlyForecast data={weatherData.hourly} unit={unit} />
                
                {/* Weather Map */}
                <div className="glass-panel p-2 rounded-2xl border border-white/10 h-72 overflow-hidden relative">
                  <WeatherMap lat={weatherData.lat} lon={weatherData.lon} city={weatherData.city} />
                </div>
              </div>

              <div className="lg:col-span-2">
                <ForecastChart data={weatherData.daily} unit={unit} />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherDashboard;
