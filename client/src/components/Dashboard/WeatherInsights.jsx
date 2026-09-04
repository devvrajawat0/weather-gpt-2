import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CloudRain, Shirt, Activity, Sun, Car, Sparkles } from 'lucide-react';

const WeatherInsights = ({ insights }) => {
  if (!insights) return null;

  const { rainRisk, wear, outdoor, uvInsight, aqiInsight, travel } = insights;

  const cards = [
    { key: 'rain', data: rainRisk, defaultIcon: CloudRain },
    { key: 'wear', data: wear, defaultIcon: Shirt },
    { key: 'outdoor', data: outdoor, defaultIcon: Activity },
    { key: 'uv', data: uvInsight, defaultIcon: Sun },
    { key: 'aqi', data: aqiInsight, defaultIcon: ShieldCheck },
    { key: 'travel', data: travel, defaultIcon: Car }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'red': return 'border-red-500/30 bg-red-500/10 text-red-300';
      case 'orange': return 'border-orange-500/30 bg-orange-500/10 text-orange-300';
      case 'amber': case 'yellow': return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'emerald': case 'green': return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'purple': return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
      case 'blue': case 'indigo': default: return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="text-cyan-400" size={20} />
        <h3 className="text-xl font-bold text-white">WeatherGPT Intelligent Recommendations</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ key, data }) => {
          if (!data) return null;
          const colorClass = getColorClasses(data.color);

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className={`glass-panel p-5 rounded-2xl border ${colorClass} backdrop-blur-md shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" aria-hidden="true">{data.icon}</span>
                    <h4 className="font-bold text-white text-base">{data.title}</h4>
                  </div>
                  {data.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-current opacity-90`}>
                      {data.badge}
                    </span>
                  )}
                </div>

                <p className="font-semibold text-sm text-cyan-200 mb-1.5">
                  {data.recommendation}
                </p>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  {data.tip}
                </p>
              </div>

              {data.level && (
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-400">
                  <span>Status Rating</span>
                  <span className="font-semibold text-white">{data.level}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherInsights;
