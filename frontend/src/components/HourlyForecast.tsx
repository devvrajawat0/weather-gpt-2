import React from 'react';
import { HourlyForecastItem } from '../types';
import { Clock, Umbrella } from 'lucide-react';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-5 border border-slate-700/60 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          24-Hour Forecast
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {hourly.slice(0, 24).map((item, idx) => {
          const dateObj = new Date(item.time);
          const hourLabel = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={idx}
              className="flex-shrink-0 w-24 p-3 rounded-2xl glass-card text-center hover:border-cyan-500/50 transition-all group"
            >
              <div className="text-xs font-semibold text-slate-400 mb-1">{hourLabel}</div>
              <div className="text-2xl my-1 group-hover:scale-110 transition-transform">
                {item.condition.includes('Rain') ? '🌧️' :
                 item.condition.includes('Thunderstorm') ? '⛈️' :
                 item.condition.includes('Cloud') ? '⛅' : '☀️'}
              </div>
              <div className="text-sm font-bold text-white mb-1">{Math.round(item.temp)}°C</div>
              {item.precipProb > 0 && (
                <div className="flex items-center justify-center text-[10px] text-sky-400 font-semibold gap-0.5">
                  <Umbrella className="w-2.5 h-2.5" />
                  {item.precipProb}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
