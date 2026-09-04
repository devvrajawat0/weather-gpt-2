import React from 'react';
import ChatWindow from '../components/Chat/ChatWindow';
import Sidebar from '../components/Layout/Sidebar';
import { useWeather } from '../hooks/useWeather';

const ChatPage = () => {
  const { weatherData, unit, fetchWeather } = useWeather('Delhi');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="hidden lg:block lg:col-span-1 h-full overflow-y-auto">
          <Sidebar onSelectCity={(city) => fetchWeather(city)} />
        </div>
        <div className="lg:col-span-3 h-full">
          <ChatWindow weatherData={weatherData} unit={unit} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
