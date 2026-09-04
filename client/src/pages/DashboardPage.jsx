import React from 'react';
import { useSearchParams } from 'react-router-dom';
import WeatherDashboard from '../components/Dashboard/WeatherDashboard';
import WhyWeatherGPT from '../components/Common/WhyWeatherGPT';

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || 'Delhi';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <WeatherDashboard initialCity={cityParam} />
      <WhyWeatherGPT />
    </div>
  );
};

export default DashboardPage;
