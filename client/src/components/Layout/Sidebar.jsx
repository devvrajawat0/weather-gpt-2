import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 
  'Kolkata', 'Hyderabad', 'Pune', 'Jaipur'
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-white/10 h-full">
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20 font-medium text-sm">
          <Navigation size={16} />
          Current Location
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Popular Cities
        </h3>
        <div className="space-y-1">
          {cities.map((city) => (
            <NavLink
              key={city}
              to={`/dashboard?city=${city}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive 
                    ? 'bg-white/10 text-cyan-400 shadow-sm' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <MapPin size={16} className={({ isActive }) => isActive ? 'text-cyan-400' : 'text-gray-500'} />
              {city}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
