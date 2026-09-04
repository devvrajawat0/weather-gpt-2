const weatherService = require('../services/weatherService');

module.exports = {
  getCurrentWeather: async (req, res, next) => {
    try {
      const { city, lat, lon, q } = req.query;
      let query = city || q;
      if (!query && lat && lon) {
        query = `${lat},${lon}`;
      }
      if (!query) {
        query = 'Delhi';
      }
      const data = await weatherService.getWeatherData(query);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  },
  getForecast: async (req, res, next) => {
    try {
      const { city, q } = req.query;
      const query = city || q || 'Delhi';
      const data = await weatherService.getWeatherData(query);
      res.json(data.daily || []);
    } catch (error) {
      next(error);
    }
  },
  getHourly: async (req, res, next) => {
    try {
      const { city, q } = req.query;
      const query = city || q || 'Delhi';
      const data = await weatherService.getWeatherData(query);
      res.json(data.hourly || []);
    } catch (error) {
      next(error);
    }
  },
  searchLocations: async (req, res, next) => {
    try {
      const { q } = req.query;
      if (!q) return res.json([]);
      const locations = await weatherService.searchLocations(q);
      res.json(locations);
    } catch (error) {
      next(error);
    }
  }
};
