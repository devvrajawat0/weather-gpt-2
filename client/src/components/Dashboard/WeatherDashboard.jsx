import React, { useState } from 'react';
import { useWeather } from '../../hooks/useWeather';
import CurrentWeather from './CurrentWeather';
import ForecastChart from './ForecastChart';
import HourlyForecast from './HourlyForecast';
import WeatherMap from './WeatherMap';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Search, MapPin } from 'lucide-react';

const WeatherDashboard = ({ initialCity = 'Delhi' }) => {
  const { city, weatherData, forecast, hourly, loading, error, fetchWeather } = useWeather(initialCity);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  if (loading && !weatherData) {
    return <LoadingSpinner text="Fetching latest weather data..." />;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-xl font-bold">
          <MapPin className="text-cyan-400" />
          {city} Weather Dashboard
        </div>
        
        <form onSubmit={handleSearch} className="w-full sm:w-auto relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search city..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </form>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Current & Hourly) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CurrentWeather data={weatherData} />
          <HourlyForecast data={hourly} />
        </div>

        {/* Right Column (Chart & Map) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-4 md:p-6 rounded-2xl h-[400px]">
            <h3 className="font-semibold mb-4 text-gray-300">5-Day Temperature Forecast</h3>
            <ForecastChart data={forecast} />
          </div>
          
          <div className="glass-panel p-1 rounded-2xl h-[400px] overflow-hidden relative border border-white/10">
             <WeatherMap lat={weatherData?.coord?.lat} lon={weatherData?.coord?.lon} city={city} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
