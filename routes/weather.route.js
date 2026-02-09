const express = require("express");
const WeatherController = require("../controllers/weather.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Weather
 *     description: Weather data and forecast routes
 */

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Get weather data using query parameters
 *     tags: [Weather]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         description: City name
 *         schema:
 *           type: string
 *       - in: query
 *         name: unit
 *         required: false
 *         description: Unit system (us or metric)
 *         schema:
 *           type: string
 *           default: "us"
 *       - in: query
 *         name: days
 *         required: false
 *         description: Number of forecast days
 *         schema:
 *           type: integer
 *           default: 7
 *       - in: query
 *         name: refresh
 *         required: false
 *         description: Force refresh from cache
 *         schema:
 *           type: string
 *           default: "false"
 *     responses:
 *       200:
 *         description: Weather data
 *         content:
 *           application/json:
 *             example:
 *               message: "Weather fetched successfully"
 *               meta: { unit: "us", days: 7, cached: false }
 *               data: { temp: 30 }
 */
router.get("/", WeatherController.getWeatherByCity);

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     summary: Get weather by city path parameter
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         description: City name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data
 *         content:
 *           application/json:
 *             example:
 *               message: "Weather fetched successfully"
 *               meta: { unit: "us", days: 7, cached: false }
 *               data: { temp: 30 }
 */
router.get("/:city", WeatherController.getWeatherByCity);

module.exports = router;
