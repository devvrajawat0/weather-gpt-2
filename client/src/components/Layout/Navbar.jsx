import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, Search, CloudLightning, Home, MessageSquare, LayoutDashboard, BellAlert } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/dashboard?city=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/chat', label: 'Chat', icon: MessageSquare },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/alerts', label: 'Alerts', icon: BellAlert },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <CloudLightning className="text-cyan-400 h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
                WeatherGPT
              </span>
            </NavLink>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-white/10 text-cyan-400' : 'hover:bg-white/5 hover:text-cyan-300'
                    }`
                  }
                >
                  <link.icon size={16} />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors w-48"
              />
              <button type="submit" className="absolute right-2 top-1.5 text-gray-400 hover:text-white">
                <Search size={16} />
              </button>
            </form>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-white/10"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none"
              />
            </form>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-white/10 text-cyan-400' : 'hover:bg-white/5'
                  }`
                }
              >
                <link.icon size={20} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
