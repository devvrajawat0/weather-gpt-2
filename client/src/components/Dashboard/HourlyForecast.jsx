import React from 'react';
import { Clock, Umbrella } from 'lucide-react';

const HourlyForecast = ({ data, unit = 'C' }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
      <div className="flex items-center gap-2 text-gray-300 font-semibold text-sm">
        <Clock size={18} className="text-cyan-400" />
        <span>24-Hour Forecast</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-white/20">
        {data.map((item, index) => {
          const temp = unit === 'F' ? Math.round(item.temp_f) : Math.round(item.temp_c);
          const timeStr = item.time ? item.time.split(' ')[1] || item.time : '--';
          const rainChance = item.chance_of_rain ?? 0;

          return (
            <div
              key={index}
              className={`flex-shrink-0 w-20 p-3 rounded-xl border text-center transition-all ${
                index === 0 
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-cyan-400/40 shadow-lg' 
                  : 'bg-black/20 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-[11px] font-medium text-gray-400 mb-1">
                {index === 0 ? 'Now' : timeStr}
              </p>
              
              {item.icon && (
                <img 
                  src={item.icon} 
                  alt={item.condition}
                  className="w-10 h-10 mx-auto my-1 drop-shadow" 
                />
              )}

              <p className="font-extrabold text-base text-white">
                {temp}°
              </p>

              {rainChance > 0 && (
                <div className="flex items-center justify-center gap-0.5 text-[10px] text-cyan-300 mt-1 font-semibold">
                  <Umbrella size={10} />
                  <span>{rainChance}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
