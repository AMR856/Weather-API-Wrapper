const weatherLimiter = require("../middlewares/rateLimiter");
const rateLimiterParams = require("../utils/rateLimiterParams");

class SystemController {
  static getApiInfo(req, res) {
    const appName = "Weather API";
    const version = process.env.VERSION || "1.0.0";
    const environment = process.env.NODE_ENV || "development";
    const status = "running";
    res.json({
      name: appName,
      version: version,
      environment: environment,
      status: status,
    });
  }

  static async healthCheck(req, res, next) {
    const status = "ok";
    const api = "up";
    try {
      const redisStatus = req.app.locals.redisClient
        ? "connected"
        : "disconnected";

      res.json({
        status: status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
          api: api,
          redis: redisStatus,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static getRateLimits(req, res) {
    res.json({
      rateLimit: {
        window: `${rateLimiterParams.windowMs / 1000} Minutes`,
        maxRequests: rateLimiterParams.max,
        message: rateLimiterParams.message,
      },
    });
  }
}

module.exports = SystemController;
