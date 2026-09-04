import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Calendar, Umbrella } from 'lucide-react';

const ForecastChart = ({ data, unit = 'C' }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map(item => ({
    name: item.day_name || item.date,
    Max: unit === 'F' ? Math.round(item.max_temp_f) : Math.round(item.max_temp_c),
    Min: unit === 'F' ? Math.round(item.min_temp_f) : Math.round(item.min_temp_c),
    Rain: item.chance_of_rain || 0,
    condition: item.condition
  }));

  const unitSymbol = `°${unit}`;

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-300 font-semibold text-sm">
            <Calendar size={18} className="text-cyan-400" />
            <span>7-Day Temperature Trend ({unitSymbol})</span>
          </div>
          <span className="text-xs text-gray-400">High / Low Forecast</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 3', 'dataMax + 3']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '12px',
                  color: '#fff' 
                }} 
              />
              <Area type="monotone" dataKey="Max" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#maxGrad)" />
              <Area type="monotone" dataKey="Min" stroke="#818cf8" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#minGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Cards Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">7-Day Daily Breakdown</h4>
        <div className="grid grid-cols-1 gap-2">
          {data.map((day, idx) => {
            const max = unit === 'F' ? Math.round(day.max_temp_f) : Math.round(day.max_temp_c);
            const min = unit === 'F' ? Math.round(day.min_temp_f) : Math.round(day.min_temp_c);

            return (
              <div 
                key={idx}
                className="glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 w-32">
                  {day.icon && (
                    <img src={day.icon} alt={day.condition} className="w-8 h-8" />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-white">{idx === 0 ? 'Today' : day.day_name}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[90px]">{day.condition}</p>
                  </div>
                </div>

                {day.chance_of_rain > 0 && (
                  <div className="flex items-center gap-1 text-xs text-cyan-300 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                    <Umbrella size={12} />
                    <span>{day.chance_of_rain}% rain</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="text-cyan-300">{max}°</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-indigo-300">{min}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
