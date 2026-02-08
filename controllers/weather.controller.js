const axios = require("axios");
const CustomError = require("../utils/customError");
const HTTPStatusText = require("../utils/HTTPStatusText");

class WeatherController {
  static async getWeatherByCity(req, res, next) {
    try {
      let city = req.params.city || req.query.city;

      if (!city) {
        throw new CustomError(
          "City is required (via route param or query)",
          400,
          HTTPStatusText.FAIL
        );
      }

      city = city.toLowerCase().trim().replace(/\s+/g, " ").toLowerCase();;

      const {
        unit = "us",
        days = 7,
        refresh = "false",
      } = req.query;

      const redisClient = req.app.locals.redisClient;
      const cacheKey = `${city}:unit=${unit}:days=${days}`;

      if (refresh !== "true") {
        const cacheData = await redisClient.get(cacheKey);

        if (cacheData) {
          return res.json({
            message: `Weather fetched successfully for ${city} (from cache)`,
            meta: { unit, days, cached: true },
            data: JSON.parse(cacheData),
          });
        }
      }

      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
        city
      )}?unitGroup=${unit}&key=${process.env.API_KEY}&contentType=json&days=${days}`;

      const response = await axios.get(url);

      await redisClient.setEx(
        cacheKey,
        3600,
        JSON.stringify(response.data)
      );

      res.json({
        message: `Weather fetched successfully for ${city} (from API)`,
        meta: { unit, days, cached: false },
        data: response.data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WeatherController;
