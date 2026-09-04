import React from 'react';
import { AirQuality } from '../types';
import { ShieldAlert, Activity } from 'lucide-react';

interface AqiWidgetProps {
  aqi: AirQuality;
}

export const AqiWidget: React.FC<AqiWidgetProps> = ({ aqi }) => {
  if (!aqi) return null;

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'green': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'bg-emerald-500' };
      case 'yellow': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: 'bg-amber-500' };
      case 'orange': return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', bar: 'bg-orange-500' };
      case 'red': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', bar: 'bg-rose-500' };
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', bar: 'bg-purple-500' };
      default: return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'bg-emerald-500' };
    }
  };

  const colors = getSeverityColors(aqi.severity);
  const aqiPercentage = Math.min(100, Math.max(5, (aqi.usAqi / 300) * 100));

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Air Quality Index (AQI)
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
            {aqi.label}
          </span>
        </div>

        {/* AQI Score */}
        <div className="flex items-baseline gap-3 my-3">
          <span className="text-5xl font-extrabold text-white tracking-tight">{aqi.usAqi}</span>
          <span className="text-sm font-semibold text-slate-400">US AQI Index</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden my-3">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all duration-700`}
            style={{ width: `${aqiPercentage}%` }}
          />
        </div>
      </div>

      {/* Pollutant breakdown */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
        <div className="glass-card p-2.5 rounded-xl text-xs">
          <div className="text-slate-400 font-medium">PM 2.5</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.pm2_5 ? `${aqi.pm2_5.toFixed(1)} µg/m³` : 'N/A'}</div>
        </div>
        <div className="glass-card p-2.5 rounded-xl text-xs">
          <div className="text-slate-400 font-medium">PM 10</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.pm10 ? `${aqi.pm10.toFixed(1)} µg/m³` : 'N/A'}</div>
        </div>
        <div className="glass-card p-2.5 rounded-xl text-xs">
          <div className="text-slate-400 font-medium">Ozone (O3)</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.o3 ? `${aqi.o3.toFixed(1)} µg/m³` : 'N/A'}</div>
        </div>
        <div className="glass-card p-2.5 rounded-xl text-xs">
          <div className="text-slate-400 font-medium">NO2</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.no2 ? `${aqi.no2.toFixed(1)} µg/m³` : 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};
