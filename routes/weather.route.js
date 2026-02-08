const express = require("express");
const router = express.Router();
const WeatherController = require('../controllers/weather.controller');

router.get("/", WeatherController.getWeatherByCity); // Using query parameters
router.get("/:city", WeatherController.getWeatherByCity); // Using resource parameter

module.exports = router;
