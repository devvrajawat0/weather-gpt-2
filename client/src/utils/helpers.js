export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌡️';
};

export const formatTemp = (temp) => {
  return `${Math.round(temp)}°C`;
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
};

export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500';
    case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'green': return 'bg-green-500/20 text-green-400 border-green-500';
    default: return 'bg-blue-500/20 text-blue-400 border-blue-500';
  }
};

export const getBackgroundGradient = (weatherCondition) => {
  const condition = weatherCondition?.toLowerCase() || '';
  if (condition.includes('clear')) return 'from-blue-400 to-blue-600';
  if (condition.includes('cloud')) return 'from-gray-500 to-slate-600';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'from-blue-700 to-slate-800';
  if (condition.includes('thunderstorm')) return 'from-slate-800 to-purple-900';
  if (condition.includes('snow')) return 'from-blue-100 to-blue-300';
  return 'from-slate-700 to-slate-900';
};
