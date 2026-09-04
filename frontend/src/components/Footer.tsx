import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <span>WeatherGPT — SIH Problem Statement SIH26068</span>
          <span>•</span>
          <span className="text-cyan-400">Powered by Open-Meteo & Anthropic AI</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Live Data Verified
          </span>
          <span>•</span>
          <span>Coverage: 700+ Indian Districts & 195+ World Capitals</span>
        </div>
      </div>
    </footer>
  );
};
