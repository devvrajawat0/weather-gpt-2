const weatherService = require('../services/weatherService');

module.exports = {
  getCurrentWeather: async (req, res, next) => {
    try {
      const { city, lat, lon } = req.query;
      if (city) {
        const data = await weatherService.getCurrentWeather(city);
        return res.json(data);
      } else if (lat && lon) {
        const data = await weatherService.getWeatherByCoords(lat, lon);
        return res.json(data);
      }
      res.status(400).json({ error: 'Provide city or lat/lon' });
    } catch (error) {
      next(error);
    }
  },
  getForecast: async (req, res, next) => {
    try {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: 'City is required' });
      const data = await weatherService.getForecast(city);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
  getHourly: async (req, res, next) => {
    try {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: 'City is required' });
      const data = await weatherService.getHourlyForecast(city);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
  getAirQuality: async (req, res, next) => {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });
      const data = await weatherService.getAirQuality(lat, lon);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
};
