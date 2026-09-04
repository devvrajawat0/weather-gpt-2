const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getForecast);
router.get('/hourly', weatherController.getHourly);
router.get('/search', weatherController.searchLocations);

module.exports = router;
