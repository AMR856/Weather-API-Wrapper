require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const weatherLimiter = require("./middlewares/rateLimiter");
const errorHandler = require('./utils/errorHandler');
const redisUtils = require("./config/redisUtils");

const weatherRouter = require("./routes/weather.route");
const cacheRouter = require("./routes/cache.route");
const systemRouter = require("./routes/system.route");
app.use(weatherLimiter.limiter);
app.use(errorHandler);
app.use(`/weather`, weatherRouter);
app.use(`/cache`, cacheRouter);
app.use(`/system`, systemRouter);

let redisClient;

(async () => {
  redisClient = await redisUtils.connect();

  app.locals.redisClient = redisClient;

  app.use(weatherLimiter.limiter);
  app.use(`${process.env.API_URL}/weather`, weatherRouter);
  app.use(`${process.env.API_URL}/cache`, cacheRouter);
  app.use(`${process.env.API_URL}/system`, systemRouter);


  const server = app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    console.log("\nShutting down gracefully...");
    await redisUtils.closeConnection(redisClient);
    try {
      server.close(() => {
        console.log("Express server closed");
        process.exit(0);
      });
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
