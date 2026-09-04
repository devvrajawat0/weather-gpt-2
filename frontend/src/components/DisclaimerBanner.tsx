import React from 'react';
import { Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full glass-card border border-amber-500/20 bg-amber-500/5 rounded-2xl p-4 my-6 flex items-start gap-3 text-xs text-amber-200/90">
      <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <strong className="font-bold text-amber-300">Official Warning Disclaimer:</strong> WeatherGPT forecasts, AI responses, and environmental insights are generated for informational purposes only. During extreme weather events or disasters, always refer to official warnings issued by the <strong>India Meteorological Department (IMD)</strong>, NDMA, or local municipal authorities.
      </div>
    </div>
  );
};
