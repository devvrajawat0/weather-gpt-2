import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatTemp, getWeatherIcon } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="font-semibold text-white mb-1">{data.fullDate}</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getWeatherIcon(data.icon)}</span>
          <div>
            <p className="text-cyan-400 font-bold">{formatTemp(data.temp)}</p>
            <p className="text-xs text-gray-400 capitalize">{data.desc}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-500">No forecast data available</div>;
  }

  // Process data for the chart (taking one reading per day, usually around noon)
  const chartData = data
    .filter((item, index) => index % 8 === 0 || index === 0)
    .slice(0, 5)
    .map(item => {
      const date = new Date(item.dt * 1000);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        temp: Math.round(item.main.temp),
        temp_min: Math.round(item.main.temp_min),
        temp_max: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        desc: item.weather[0].description
      };
    });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val}°`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#22d3ee" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              activeDot={{ r: 6, fill: "#22d3ee", stroke: "#0f172a", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-white/10">
        {chartData.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
            <span className="text-xs text-gray-400 font-medium mb-1">{day.name}</span>
            <span className="text-xl mb-1">{getWeatherIcon(day.icon)}</span>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold">{day.temp_max}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;
