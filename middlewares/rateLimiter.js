const rateLimit = require("express-rate-limit");
const rateLimiterParams = require("../utils/rateLimiterParams");

const weatherLimiter = {
  limiter: rateLimit({
    windowMs: rateLimiterParams.windowMs,
    max: rateLimiterParams.max,
    message: { error: rateLimiterParams.message },
  }),
};

module.exports = weatherLimiter;
