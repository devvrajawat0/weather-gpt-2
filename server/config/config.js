require('dotenv').config({ path: '../.env' });

module.exports = {
  PORT: process.env.PORT || 5000,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
