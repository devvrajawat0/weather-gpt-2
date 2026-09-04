import React, { useState, useEffect } from 'react';
import { LocationItem } from '../types';
import { fetchDistricts, fetchCapitals } from '../services/api';
import { Search, MapPin, Globe, Building2, ChevronRight, Filter } from 'lucide-react';

interface ExplorerViewProps {
  onSelectLocation: (location: LocationItem) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ onSelectLocation }) => {
  const [activeTab, setActiveTab] = useState<'districts' | 'capitals'>('districts');
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [capitals, setCapitals] = useState<LocationItem[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [continents, setContinents] = useState<string[]>([]);
  
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const dData = await fetchDistricts();
        setDistricts(dData.allDistricts);
        setStates(Object.keys(dData.districtsByState).sort());

        const cData = await fetchCapitals();
        setCapitals(cData.allCapitals);
        setContinents(Object.keys(cData.capitalsByContinent).sort());
      } catch (err) {
        console.error("Failed to load explorer datasets:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentList = activeTab === 'districts' ? districts : capitals;

  const filteredList = currentList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.state && item.state.toLowerCase().includes(search.toLowerCase())) ||
      (item.country && item.country.toLowerCase().includes(search.toLowerCase()));

    if (selectedGroup === 'all') return matchesSearch;

    if (activeTab === 'districts') {
      return matchesSearch && item.state === selectedGroup;
    } else {
      return matchesSearch && item.continent === selectedGroup;
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Globe className="w-3.5 h-3.5" /> Static Offline Database
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Location Explorer
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Browse and search live weather across all 700+ Indian districts and 195+ country capitals across the world with zero geocoding latency.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start md:self-center">
          <button
            onClick={() => {
              setActiveTab('districts');
              setSelectedGroup('all');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'districts'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🇮🇳 Indian Districts</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px]">700+</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('capitals');
              setSelectedGroup('all');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'capitals'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌐 World Capitals</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px]">195+</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab === 'districts' ? 'district or state' : 'capital or country'}...`}
            className="w-full bg-slate-950/80 text-white text-sm placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 border border-slate-700/80 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* State / Continent Dropdown */}
        <div className="relative w-full sm:w-64 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full bg-slate-950/80 text-white text-sm rounded-xl px-3 py-2.5 border border-slate-700/80 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">
              {activeTab === 'districts' ? 'All States & UTs' : 'All Continents'}
            </option>
            {activeTab === 'districts'
              ? states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))
              : continents.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
          </select>
        </div>

      </div>

      {/* Grid of Location Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-xs font-semibold text-slate-400">
            Showing {filteredList.length} locations
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredList.map((loc) => (
              <div
                key={loc.id}
                onClick={() => onSelectLocation(loc)}
                className="glass-panel rounded-2xl p-4 border border-slate-700/60 hover:border-cyan-500/50 hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">
                      {loc.type === 'district' ? '🇮🇳' : '🌐'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {loc.type === 'district' ? 'District' : 'Capital'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {loc.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    {loc.state ? `State: ${loc.state}` : `Country: ${loc.country}`}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}
                  </span>
                  <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                    View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
