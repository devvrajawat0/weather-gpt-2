import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WeatherDashboard from '../components/Dashboard/WeatherDashboard';

const DashboardPage = () => {
  const location = useLocation();
  const [initialCity, setInitialCity] = useState('Delhi');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get('city');
    if (cityParam) {
      setInitialCity(cityParam);
    }
  }, [location.search]);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <WeatherDashboard initialCity={initialCity} />
      </div>
    </div>
  );
};

export default DashboardPage;
