const db = require('../models/database');
const weatherService = require('../services/weatherService');
const geminiService = require('../services/geminiService');

module.exports = {
  chat: async (req, res, next) => {
    try {
      const { message, sessionId } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = db.createSession();
      }

      // Simple regex city detection
      let city = null;
      const match = message.match(/(?:weather in|weather for|forecast for)\s+([a-zA-Z\s]+)|([a-zA-Z\s]+)\s+weather/i);
      if (match) {
        city = match[1] || match[2];
      }

      let weatherData = null;
      if (city) {
        try {
          weatherData = await weatherService.getCurrentWeather(city.trim());
        } catch (err) {
          console.error(`Could not fetch weather for ${city}:`, err.message);
        }
      }

      const history = db.getSessionMessages(currentSessionId);
      const aiReply = await geminiService.chat(message, weatherData, history);

      db.saveMessage(currentSessionId, 'user', message);
      db.saveMessage(currentSessionId, 'ai', aiReply, weatherData);

      res.json({
        reply: aiReply,
        sessionId: currentSessionId,
        weatherData
      });
    } catch (error) {
      next(error);
    }
  },
  getHistory: (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const messages = db.getSessionMessages(sessionId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
};
