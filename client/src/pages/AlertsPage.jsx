import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, Info } from 'lucide-react';
import AlertBanner from '../components/Alerts/AlertBanner';
import AlertList from '../components/Alerts/AlertList';
import { getAlerts } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AlertsPage = () => {
  const [city, setCity] = useState('Mumbai');
  const [searchInput, setSearchInput] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlertsData(city);
  }, [city]);

  const fetchAlertsData = async (cityName) => {
    setLoading(true);
    try {
      const data = await getAlerts(cityName);
      setAlerts(data || []);
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={32} />
          Disaster Alerts
        </h1>
        <p className="text-gray-400">Stay informed about severe weather conditions and natural disasters.</p>
      </div>

      <div className="glass-panel p-4 rounded-xl mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search alerts for a city..."
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors">
            Search
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold mb-4">Alerts for {city}</h2>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          <AlertBanner alerts={alerts} />
          <AlertList alerts={alerts} />
        </div>
      )}

      <div className="mt-12 glass-panel p-6 rounded-2xl border border-blue-500/20 bg-blue-900/10">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-400">
          <Info size={20} />
          Safety Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-2">During Heavy Rain/Floods:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Move to higher ground if flash flooding is possible.</li>
              <li>Do not walk, swim, or drive through flood waters.</li>
              <li>Stay off bridges over fast-moving water.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">During Cyclones/High Winds:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Stay indoors, away from windows and glass doors.</li>
              <li>Secure loose outdoor items.</li>
              <li>Keep emergency kits ready with batteries and flashlights.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
