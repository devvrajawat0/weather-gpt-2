import React from 'react';
import { CurrentWeather, LocationItem } from '../types';
import { Wind, Droplets, Gauge, Sun, Compass, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface WeatherCardProps {
  location: LocationItem;
  current: CurrentWeather;
  maxTemp?: number;
  minTemp?: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ location, current, maxTemp, minTemp }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/60 shadow-2xl relative overflow-hidden transition-all">
      {/* Glow background accent */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Location & Time Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{location.type === 'district' ? '🇮🇳' : '🌐'}</span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {location.name}
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-400 mt-1">
            {location.state ? `${location.state}, India` : location.country || 'Global Location'} • {current.category.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Live Feed (Open-Meteo)
          </span>
        </div>
      </div>

      {/* Main Temperature & Weather Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
        
        {/* Left Column: Big Temp & Condition */}
        <div className="flex items-center gap-6">
          <div className="text-7xl lg:text-8xl select-none animate-float">
            {current.category === 'sunny' ? (current.isDay ? '☀️' : '🌙') :
             current.category === 'rainy' ? '🌧️' :
             current.category === 'stormy' ? '⛈️' :
             current.category === 'snowy' ? '❄️' :
             current.category === 'foggy' ? '🌫️' : '⛅'}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl lg:text-7xl font-extrabold text-white tracking-tighter">
                {Math.round(current.temp)}°
              </span>
              <span className="text-2xl font-bold text-slate-400">C</span>
            </div>
            <div className="text-lg font-semibold text-slate-200 mt-1">
              {current.condition}
            </div>
            <div className="text-sm text-slate-400 mt-0.5">
              Feels like <span className="font-semibold text-slate-200">{Math.round(current.feelsLike)}°C</span>
            </div>
            {(maxTemp !== undefined && minTemp !== undefined) && (
              <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-300">
                <span className="flex items-center text-rose-400"><ArrowUp className="w-3.5 h-3.5 mr-0.5" /> High: {Math.round(maxTemp)}°C</span>
                <span className="flex items-center text-sky-400"><ArrowDown className="w-3.5 h-3.5 mr-0.5" /> Low: {Math.round(minTemp)}°C</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Wind */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Wind Speed</div>
              <div className="text-base font-bold text-white">{current.windSpeed} <span className="text-xs text-slate-400 font-normal">km/h</span></div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3" /> Direction: {current.windDirection}°
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Humidity</div>
              <div className="text-base font-bold text-white">{current.humidity}%</div>
              <div className="text-[11px] text-slate-400">Dew Point normal</div>
            </div>
          </div>

          {/* UV Index */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">UV Index</div>
              <div className="text-base font-bold text-white">{current.uvIndex} <span className="text-xs text-slate-400 font-normal">/ 11</span></div>
              <div className="text-[11px] text-amber-400 font-medium">
                {current.uvIndex >= 6 ? 'High' : current.uvIndex >= 3 ? 'Moderate' : 'Low'}
              </div>
            </div>
          </div>

          {/* Atmospheric Pressure */}
          <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Pressure</div>
              <div className="text-base font-bold text-white">{Math.round(current.pressure)} <span className="text-xs text-slate-400 font-normal">hPa</span></div>
              <div className="text-[11px] text-slate-400">Surface pressure</div>
            </div>
          </div>

        </div>

      </div>

      {/* Solar Times Banner */}
      {(current.sunrise || current.sunset) && (
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>🌅 Sunrise: <strong className="text-slate-200">{current.sunrise ? new Date(current.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌇 Sunset: <strong className="text-slate-200">{current.sunset ? new Date(current.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
