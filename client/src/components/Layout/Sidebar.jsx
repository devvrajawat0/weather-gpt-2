import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 
  'Kolkata', 'Hyderabad', 'Pune', 'Jaipur', 'Bhopal', 'Tokyo', 'London', 'New York'
];

const Sidebar = ({ onSelectCity }) => {
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    if (onSelectCity) onSelectCity(city);
    navigate(`/dashboard?city=${encodeURIComponent(city)}`);
  };

  return (
    <aside className="w-full glass-panel border-r border-white/10 h-full rounded-2xl p-4 flex flex-col space-y-4">
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Popular Cities
        </h3>
        <div className="space-y-1">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all text-left"
            >
              <MapPin size={16} className="text-cyan-400" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
