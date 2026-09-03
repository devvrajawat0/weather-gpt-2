import React, { useState } from 'react';
import { getSeverityColor, formatTime } from '../../utils/helpers';
import { AlertCircle, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertCard = ({ alert, index }) => {
  const [expanded, setExpanded] = useState(false);
  const severityClass = getSeverityColor(alert.severity);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-panel border-l-4 rounded-xl overflow-hidden transition-all duration-300 ${severityClass.replace('bg-', 'hover:bg-').split(' ')[0]} ${severityClass.split(' ').find(c => c.startsWith('border-'))}`}
    >
      <div 
        className="p-4 cursor-pointer flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-2 rounded-full bg-black/20 ${severityClass.split(' ').find(c => c.startsWith('text-'))}`}>
          <AlertCircle size={20} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{alert.title}</h3>
            <div className={`px-2 py-1 text-xs font-bold rounded-md uppercase tracking-wider bg-black/30 ${severityClass.split(' ').find(c => c.startsWith('text-'))}`}>
              {alert.severity}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {alert.affected_area || 'Widespread'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatTime(alert.timestamp || Date.now())}
            </span>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors mt-1">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 pt-0 border-t border-white/5 mt-2"
        >
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-1">Description</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {alert.description}
              </p>
            </div>
            
            {alert.safety_tips && (
              <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">Safety Guidelines</h4>
                <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                  {alert.safety_tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="text-xs text-gray-500 italic">
              Source: {alert.source || 'Meteorological Department'}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const AlertList = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">No Active Alerts</h3>
        <p className="text-gray-400">All clear! There are currently no severe weather warnings for this region.</p>
      </div>
    );
  }

  // Sort alerts by severity roughly
  const sortedAlerts = [...alerts].sort((a, b) => {
    const sevA = a.severity?.toLowerCase() === 'red' ? 3 : a.severity?.toLowerCase() === 'orange' ? 2 : 1;
    const sevB = b.severity?.toLowerCase() === 'red' ? 3 : b.severity?.toLowerCase() === 'orange' ? 2 : 1;
    return sevB - sevA;
  });

  return (
    <div className="space-y-4">
      {sortedAlerts.map((alert, index) => (
        <AlertCard key={alert.id || index} alert={alert} index={index} />
      ))}
    </div>
  );
};

export default AlertList;
