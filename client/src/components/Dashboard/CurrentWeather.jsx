import React from 'react';
import { Droplets, Wind, Gauge, Eye, Sun, Sunrise, Sunset, CloudRain, ShieldCheck, Thermometer } from 'lucide-react';

const CurrentWeather = ({ data, unit = 'C', lastUpdatedText = 'Updated just now', onRefresh }) => {
  if (!data) return null;

  const temp = unit === 'F' ? Math.round(data.temp_f) : Math.round(data.temp_c);
  const feelsLike = unit === 'F' ? Math.round(data.feelslike_f) : Math.round(data.feelslike_c);
  const maxTemp = unit === 'F' ? Math.round(data.temp_max_f) : Math.round(data.temp_max_c);
  const minTemp = unit === 'F' ? Math.round(data.temp_min_f) : Math.round(data.temp_min_c);
  const unitSymbol = `°${unit}`;

  const condition = data.condition || 'Clear';
  const condLower = condition.toLowerCase();

  // Dynamic Weather Reactions
  let gradientClass = 'from-blue-600/30 via-slate-900 to-slate-900 border-blue-500/20';
  let glowColor = 'rgba(59, 130, 246, 0.15)';

  if (condLower.includes('sun') || condLower.includes('clear')) {
    if (data.is_day === false) {
      gradientClass = 'from-indigo-950 via-slate-900 to-purple-950 border-indigo-500/30';
      glowColor = 'rgba(129, 140, 248, 0.2)';
    } else {
      gradientClass = 'from-amber-500/20 via-slate-900 to-slate-900 border-amber-500/30';
      glowColor = 'rgba(245, 158, 11, 0.2)';
    }
  } else if (condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('thunderstorm')) {
    gradientClass = 'from-cyan-900/40 via-slate-900 to-slate-950 border-cyan-500/30';
    glowColor = 'rgba(6, 182, 212, 0.2)';
  } else if (condLower.includes('cloud') || condLower.includes('overcast')) {
    gradientClass = 'from-slate-700/30 via-slate-900 to-slate-900 border-slate-500/30';
    glowColor = 'rgba(148, 163, 184, 0.15)';
  }

  // UV badge color
  const uvVal = data.uv ?? 0;
  let uvColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (uvVal >= 8) uvColor = 'bg-red-500/20 text-red-300 border-red-500/30';
  else if (uvVal >= 6) uvColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  else if (uvVal >= 3) uvColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  // AQI Badge color
  const aqiCategory = data.aqi?.category || 'Good';
  const aqiEpa = data.aqi?.us_epa_index || 1;
  let aqiColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (aqiEpa >= 4) aqiColor = 'bg-red-500/20 text-red-300 border-red-500/30';
  else if (aqiEpa === 3) aqiColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
  else if (aqiEpa === 2) aqiColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  return (
    <div className={`rounded-3xl p-6 md:p-8 bg-gradient-to-br ${gradientClass} backdrop-blur-xl border shadow-2xl relative overflow-hidden transition-all duration-500`}>
      {/* Background ambient lighting */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4"
        style={{ background: glowColor }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {data.city}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-md text-cyan-200">
                {data.country}
              </span>
            </div>
            <p className="text-gray-300 mt-1 text-base capitalize flex items-center gap-2">
              <span>{condition}</span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-400">{lastUpdatedText}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {data.icon && (
              <img 
                src={data.icon} 
                alt={condition}
                className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-float"
              />
            )}
          </div>
        </div>

        {/* Large Temp Display */}
        <div className="mb-8 flex flex-wrap items-baseline gap-4">
          <div className="flex items-baseline">
            <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
              {temp}
            </span>
            <span className="text-3xl md:text-4xl font-medium text-cyan-400 ml-1">
              {unitSymbol}
            </span>
          </div>
          
          <div className="text-sm text-gray-300 space-y-1 border-l border-white/15 pl-4 py-1">
            <p className="flex items-center gap-1.5">
              <Thermometer size={16} className="text-cyan-400" />
              <span>Feels like <strong>{feelsLike}{unitSymbol}</strong></span>
            </p>
            <p className="text-xs text-gray-400">
              High: <strong>{maxTemp}{unitSymbol}</strong> • Low: <strong>{minTemp}{unitSymbol}</strong>
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
              <Droplets size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Humidity</p>
              <p className="font-bold text-sm text-white">{data.humidity}%</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Wind size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Wind Speed</p>
              <p className="font-bold text-sm text-white">{data.wind_kph} km/h {data.wind_dir}</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Sun size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">UV Index</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-sm text-white">{uvVal}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${uvColor}`}>
                  {data.uv_text}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Air Quality</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-sm text-white">EPA {aqiEpa}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border truncate max-w-[80px] ${aqiColor}`}>
                  {aqiCategory}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
              <Gauge size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Pressure</p>
              <p className="font-bold text-sm text-white">{data.pressure_mb} mb</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Eye size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Visibility</p>
              <p className="font-bold text-sm text-white">{data.visibility_km} km</p>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
              <CloudRain size={20} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase font-medium">Precipitation</p>
              <p className="font-bold text-sm text-white">{data.precip_mm} mm</p>
            </div>
          </div>
        </div>

        {/* Sunrise / Sunset Row */}
        <div className="flex justify-between items-center bg-black/20 rounded-2xl p-4 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <Sunrise className="text-yellow-400" size={22} />
            <div>
              <p className="text-[11px] text-gray-400 uppercase">Sunrise</p>
              <p className="font-semibold text-sm text-white">{data.sunrise}</p>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/15"></div>

          <div className="flex items-center gap-3">
            <Sunset className="text-orange-400" size={22} />
            <div>
              <p className="text-[11px] text-gray-400 uppercase">Sunset</p>
              <p className="font-semibold text-sm text-white">{data.sunset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
