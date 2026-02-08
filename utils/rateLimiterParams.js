const rateLimiterParams = {
  windowMs: Number(process.env.WINDOW_MS),
  max: Number(process.env.MAX_REQUESTS_COUNT),
  message: "Too many requests for weather data, slow down!",
};

module.exports = rateLimiterParams;