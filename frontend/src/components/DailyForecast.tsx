import React from 'react';
import { DailyForecastItem } from '../types';
import { Calendar, Umbrella } from 'lucide-react';

interface DailyForecastProps {
  daily: DailyForecastItem[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate min and max temps across the 7 days for bar scaling
  const minOverall = Math.min(...daily.map(d => d.minTemp));
  const maxOverall = Math.max(...daily.map(d => d.maxTemp));
  const tempRange = Math.max(1, maxOverall - minOverall);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-700/60 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          7-Day Weather Outlook
        </h3>
      </div>

      <div className="space-y-3">
        {daily.slice(0, 7).map((item, idx) => {
          const dateObj = new Date(item.date);
          const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

          const leftPercent = Math.max(0, ((item.minTemp - minOverall) / tempRange) * 100);
          const rightPercent = Math.min(100, Math.max(leftPercent + 15, ((item.maxTemp - minOverall) / tempRange) * 100));

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl glass-card hover:bg-slate-800/80 transition-colors"
            >
              {/* Day Name */}
              <div className="w-28 text-sm font-semibold text-slate-200">{dayName}</div>

              {/* Condition Icon & Text */}
              <div className="flex items-center gap-2 w-36">
                <span className="text-xl">
                  {item.condition.includes('Rain') ? '🌧️' :
                   item.condition.includes('Thunderstorm') ? '⛈️' :
                   item.condition.includes('Cloud') ? '⛅' : '☀️'}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">{item.condition}</span>
              </div>

              {/* Rain Probability */}
              <div className="w-16 text-right">
                {item.precipProbability > 0 ? (
                  <span className="text-xs font-bold text-sky-400 inline-flex items-center gap-0.5">
                    <Umbrella className="w-3 h-3" /> {item.precipProbability}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">-</span>
                )}
              </div>

              {/* Temp Bar */}
              <div className="flex items-center gap-3 flex-1 max-w-xs ml-4">
                <span className="text-xs font-bold text-slate-400 w-8 text-right">{Math.round(item.minTemp)}°</span>
                <div className="relative h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 rounded-full"
                    style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white w-8">{Math.round(item.maxTemp)}°</span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
