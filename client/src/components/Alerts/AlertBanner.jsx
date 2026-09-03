import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertBanner = ({ alerts }) => {
  const [dismissed, setDismissed] = useState(false);

  // Find the most critical alert
  const criticalAlert = alerts?.find(a => 
    a.severity?.toLowerCase() === 'red' || 
    a.severity?.toLowerCase() === 'extreme' ||
    a.title?.toLowerCase().includes('warning')
  );

  if (!criticalAlert || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-r-xl relative overflow-hidden group shadow-lg shadow-red-500/10 mb-6"
      >
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setDismissed(true)}
            className="text-red-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5 animate-pulse" size={24} />
          <div>
            <h3 className="font-bold text-red-100 flex items-center gap-2">
              CRITICAL WEATHER ALERT
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] uppercase rounded-full font-bold">
                Active
              </span>
            </h3>
            <p className="text-red-200/90 text-sm mt-1 font-medium">
              {criticalAlert.title}
            </p>
            <p className="text-red-300/80 text-xs mt-1 line-clamp-2">
              {criticalAlert.description}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
