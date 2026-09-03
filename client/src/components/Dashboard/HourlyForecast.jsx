import React from 'react';
import { formatTemp, getWeatherIcon } from '../../utils/helpers';

const HourlyForecast = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Take next 24 hours (8 items, 3 hours apart)
  const hourlyData = data.slice(0, 8);

  return (
    <div className="glass-panel p-4 md:p-6 rounded-2xl">
      <h3 className="font-semibold mb-4 text-gray-300">Today's Timeline</h3>
      
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-3 snap-x">
        {hourlyData.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const isNow = index === 0;

          return (
            <div 
              key={item.dt} 
              className={`flex flex-col items-center min-w-[80px] p-3 rounded-2xl snap-center transition-all ${
                isNow 
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span className={`text-xs font-medium mb-2 ${isNow ? 'text-cyan-400' : 'text-gray-400'}`}>
                {isNow ? 'Now' : time}
              </span>
              <span className="text-3xl mb-2 drop-shadow-md">
                {getWeatherIcon(item.weather[0].icon)}
              </span>
              <span className="text-lg font-bold">
                {formatTemp(item.main.temp)}
              </span>
              <span className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                💧 {item.main.humidity}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
