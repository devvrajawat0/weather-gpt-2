import React from 'react';
import { formatTemp, getWeatherIcon, getBackgroundGradient, getWindDirection, formatTime } from '../../utils/helpers';
import { Droplets, Wind, Gauge, Eye, Cloud, Sun, Sunrise, Sunset } from 'lucide-react';

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { name, sys, main, weather, wind, visibility, clouds, dt } = data;
  const condition = weather?.[0]?.main || 'Clear';
  const desc = weather?.[0]?.description || '';
  const icon = weather?.[0]?.icon || '01d';
  
  const gradientClass = getBackgroundGradient(condition);

  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br ${gradientClass} text-white p-6 relative`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {name}
              <span className="text-sm font-normal px-2 py-0.5 bg-white/20 rounded-md backdrop-blur-md">
                {sys?.country}
              </span>
            </h2>
            <p className="text-white/80 mt-1 capitalize">{desc}</p>
          </div>
          <div className="text-6xl animate-float" aria-hidden="true">
            {getWeatherIcon(icon)}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-extrabold tracking-tighter">
              {main?.temp ? formatTemp(main.temp) : '--'}
            </span>
          </div>
          <p className="text-white/80 mt-1">
            Feels like {main?.feels_like ? formatTemp(main.feels_like) : '--'} • 
            H: {main?.temp_max ? formatTemp(main.temp_max) : '--'} L: {main?.temp_min ? formatTemp(main.temp_min) : '--'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-black/20 rounded-xl p-3 backdrop-blur-md flex items-center gap-3 border border-white/10">
            <Droplets className="text-blue-300" size={24} />
            <div>
              <p className="text-xs text-white/60">Humidity</p>
              <p className="font-semibold">{main?.humidity}%</p>
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 backdrop-blur-md flex items-center gap-3 border border-white/10">
            <Wind className="text-gray-300" size={24} />
            <div>
              <p className="text-xs text-white/60">Wind</p>
              <p className="font-semibold">{wind?.speed} m/s {getWindDirection(wind?.deg)}</p>
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 backdrop-blur-md flex items-center gap-3 border border-white/10">
            <Gauge className="text-purple-300" size={24} />
            <div>
              <p className="text-xs text-white/60">Pressure</p>
              <p className="font-semibold">{main?.pressure} hPa</p>
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-3 backdrop-blur-md flex items-center gap-3 border border-white/10">
            <Eye className="text-green-300" size={24} />
            <div>
              <p className="text-xs text-white/60">Visibility</p>
              <p className="font-semibold">{visibility ? (visibility / 1000).toFixed(1) : '--'} km</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-black/20 rounded-xl p-4 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <Sunrise className="text-yellow-400" size={20} />
            <div>
              <p className="text-xs text-white/60">Sunrise</p>
              <p className="font-medium text-sm">{sys?.sunrise ? formatTime(sys.sunrise * 1000) : '--'}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Sunset className="text-orange-400" size={20} />
            <div>
              <p className="text-xs text-white/60">Sunset</p>
              <p className="font-medium text-sm">{sys?.sunset ? formatTime(sys.sunset * 1000) : '--'}</p>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-center text-white/50 mt-4">
          Updated: {dt ? formatTime(dt * 1000) : '--'}
        </p>
      </div>
    </div>
  );
};

export default CurrentWeather;
