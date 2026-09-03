import React from 'react';
import { formatTemp, getWeatherIcon, getBackgroundGradient } from '../../utils/helpers';
import { Droplets, Wind } from 'lucide-react';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  const { name, main, weather, wind } = data;
  const condition = weather?.[0]?.main || 'Clear';
  const desc = weather?.[0]?.description || '';
  const icon = weather?.[0]?.icon || '01d';
  
  const gradientClass = getBackgroundGradient(condition);

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border border-white/20 bg-gradient-to-br ${gradientClass} text-white p-4 animate-fade-in`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-xs text-white/80 capitalize">{desc}</p>
        </div>
        <div className="text-3xl" aria-hidden="true">
          {getWeatherIcon(icon)}
        </div>
      </div>

      <div className="my-3">
        <span className="text-4xl font-extrabold tracking-tighter">
          {main?.temp ? formatTemp(main.temp) : '--'}
        </span>
        <span className="text-sm ml-2 text-white/70">
          Feels like {main?.feels_like ? formatTemp(main.feels_like) : '--'}
        </span>
      </div>

      <div className="flex gap-4 text-xs mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center gap-1">
          <Droplets size={14} className="text-blue-200" />
          <span>{main?.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={14} className="text-gray-200" />
          <span>{wind?.speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
