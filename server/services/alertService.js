const weatherService = require('./weatherService');
const { v4: uuidv4 } = require('uuid');

function generateSafetyTips(alertType) {
  switch (alertType) {
    case 'Heatwave alert': return ['Stay hydrated', 'Avoid outdoor activities during peak sun hours', 'Wear light clothing'];
    case 'Cold wave alert': return ['Wear layers', 'Keep indoors warm', 'Protect extremities'];
    case 'High wind warning':
    case 'Wind advisory': return ['Secure loose outdoor items', 'Stay away from large trees', 'Drive cautiously'];
    case 'Heavy rain likely':
    case 'Flood risk': return ['Avoid low-lying areas', 'Do not drive through flooded roads', 'Keep emergency kit ready'];
    case 'Low visibility warning': return ['Drive slowly', 'Use fog lights', 'Keep safe distance'];
    case 'Thunderstorm warning': return ['Stay indoors', 'Avoid using electrical appliances', 'Stay away from windows'];
    default: return ['Stay safe and follow local authorities'];
  }
}

module.exports = {
  getAlerts: async (lat, lon) => {
    try {
      const current = await weatherService.getWeatherByCoords(lat, lon);
      const weather = await weatherService.getCurrentWeather(current.city);
      const alerts = [];

      if (weather.temp > 42) alerts.push({ title: 'Heatwave alert', severity: 'RED' });
      else if (weather.temp < 4) alerts.push({ title: 'Cold wave alert', severity: 'ORANGE' });

      const windKmh = weather.wind_speed * 3.6;
      if (windKmh > 60) alerts.push({ title: 'High wind warning', severity: 'RED' });
      else if (windKmh > 40) alerts.push({ title: 'Wind advisory', severity: 'ORANGE' });

      if (weather.humidity > 90 && weather.clouds > 80) alerts.push({ title: 'Heavy rain likely', severity: 'YELLOW' });
      if (weather.visibility < 1000) alerts.push({ title: 'Low visibility warning', severity: 'ORANGE' });

      const desc = (weather.description || '').toLowerCase();
      if (desc.includes('thunderstorm')) alerts.push({ title: 'Thunderstorm warning', severity: 'RED' });
      if (desc.includes('heavy rain')) alerts.push({ title: 'Flood risk', severity: 'ORANGE' });

      return alerts.map(a => ({
        id: uuidv4(),
        title: a.title,
        description: `Conditions indicating ${a.title.toLowerCase()} observed.`,
        severity: a.severity,
        safetyTips: generateSafetyTips(a.title),
        affectedArea: weather.city,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Alert Service Error:', error);
      return [];
    }
  },
  getAlertsForCity: async (city) => {
    try {
      const weather = await weatherService.getCurrentWeather(city);
      const alerts = [];

      if (weather.temp > 42) alerts.push({ title: 'Heatwave alert', severity: 'RED' });
      else if (weather.temp < 4) alerts.push({ title: 'Cold wave alert', severity: 'ORANGE' });

      const windKmh = weather.wind_speed * 3.6;
      if (windKmh > 60) alerts.push({ title: 'High wind warning', severity: 'RED' });
      else if (windKmh > 40) alerts.push({ title: 'Wind advisory', severity: 'ORANGE' });

      if (weather.humidity > 90 && weather.clouds > 80) alerts.push({ title: 'Heavy rain likely', severity: 'YELLOW' });
      if (weather.visibility < 1000) alerts.push({ title: 'Low visibility warning', severity: 'ORANGE' });

      const desc = (weather.description || '').toLowerCase();
      if (desc.includes('thunderstorm')) alerts.push({ title: 'Thunderstorm warning', severity: 'RED' });
      if (desc.includes('heavy rain')) alerts.push({ title: 'Flood risk', severity: 'ORANGE' });

      return alerts.map(a => ({
        id: uuidv4(),
        title: a.title,
        description: `Conditions indicating ${a.title.toLowerCase()} observed.`,
        severity: a.severity,
        safetyTips: generateSafetyTips(a.title),
        affectedArea: weather.city,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Alert Service Error:', error);
      return [];
    }
  },
  generateSafetyTips
};
