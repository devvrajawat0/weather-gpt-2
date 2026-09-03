const alertService = require('../services/alertService');
const db = require('../models/database');

module.exports = {
  getAlerts: async (req, res, next) => {
    try {
      const { city } = req.query;
      if (!city) return res.status(400).json({ error: 'City is required' });
      const alerts = await alertService.getAlertsForCity(city);
      
      // Log alerts to database
      for (const alert of alerts) {
        db.saveAlert(alert.title, alert.description, alert.severity, city);
      }
      
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  },
  getRecentAlerts: (req, res, next) => {
    try {
      const alerts = db.getRecentAlerts();
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  }
};
