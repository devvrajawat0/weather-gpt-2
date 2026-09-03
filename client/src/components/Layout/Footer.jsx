import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            <p className="flex items-center gap-1">
              Built for SIH 2026 | Ministry of Earth Sciences <Heart size={14} className="text-red-500" />
            </p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-400">
              React
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-400">
              Tailwind v4
            </span>
            <span className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-400">
              OpenWeatherMap
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
