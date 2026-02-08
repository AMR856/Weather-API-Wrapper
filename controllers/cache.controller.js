const CustomError = require("../utils/customError");
const HTTPStatusText = require("../utils/HTTPStatusText");

class CacheController {
  static async getAllKeys(req, res, next) {
    try {
      const redisClient = req.app.locals.redisClient;
      const keys = await redisClient.keys("*");

      res.json({
        status: HTTPStatusText.SUCCESS,
        count: keys.length,
        data: keys,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByKey(req, res, next) {
    try {
      const { key } = req.params;
      const redisClient = req.app.locals.redisClient;

      const value = await redisClient.get(key);

      if (!value) {
        throw new CustomError(
          "Cache key not found",
          404,
          HTTPStatusText.FAIL
        );
      }

      res.json({
        status: HTTPStatusText.SUCCESS,
        key,
        data: JSON.parse(value),
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteByKey(req, res, next) {
    try {
      const { key } = req.params;
      const redisClient = req.app.locals.redisClient;

      const deleted = await redisClient.del(key);

      if (!deleted) {
        throw new CustomError(
          "Cache key not found",
          404,
          HTTPStatusText.FAIL
        );
      }

      res.json({
        status: HTTPStatusText.SUCCESS,
        message: `Cache key '${key}' deleted successfully`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async clearAll(req, res, next) {
    try {
      const redisClient = req.app.locals.redisClient;
      await redisClient.flushAll();

      res.json({
        status: HTTPStatusText.SUCCESS,
        message: "All cache cleared successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CacheController;
