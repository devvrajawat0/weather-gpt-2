import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] gap-4">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center text-yellow-400"
        >
          <Sun size={40} />
        </motion.div>
        
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-white/80 drop-shadow-md translate-y-2 translate-x-2"
        >
          <Cloud size={32} fill="currentColor" />
        </motion.div>
      </div>
      
      <p className="text-cyan-400 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
