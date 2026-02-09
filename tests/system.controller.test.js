const request = require("supertest");
const express = require("express");
const SystemController = require("../controllers/system.controller");

const windowMSMock =  60000;
const maxRequestsMock = 5;
const messageMock = "Too many requests";

jest.mock("../utils/rateLimiterParams", () => ({
  windowMs: windowMSMock,
  max: maxRequestsMock,
  message: messageMock,
}));
const rateLimiterParams = require("../utils/rateLimiterParams");

const app = express();
app.get("/system/info", SystemController.getApiInfo);
app.get("/system/health", SystemController.healthCheck);
app.get("/system/limits", SystemController.getRateLimits);

app.locals.redisClient = { connected: true };

describe("SystemController", () => {
  describe("GET /system/info", () => {
    it("should return API info", async () => {
      const res = await request(app).get("/system/info");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("name", "Weather API");
      expect(res.body).toHaveProperty("version");
      expect(res.body).toHaveProperty("environment");
      expect(res.body).toHaveProperty("status", "running");
    });
  });

  describe("GET /system/health", () => {
    it("should return health status with Redis info", async () => {
      const res = await request(app).get("/system/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "ok");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body.services).toHaveProperty("api", "up");
      expect(res.body.services).toHaveProperty("redis", "connected");
    });

    it("should return 'disconnected' if Redis is not available", async () => {
      app.locals.redisClient = null;
      const res = await request(app).get("/system/health");
      expect(res.body.services.redis).toBe("disconnected");

      app.locals.redisClient = { connected: true };
    });
  });

  describe("GET /system/limits", () => {
    it("should return rate limiter info", async () => {
      const res = await request(app).get("/system/limits");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("rateLimit");
      expect(res.body.rateLimit).toHaveProperty(
        "window",
        `${rateLimiterParams.windowMs / 1000} Minutes`
      );
      expect(res.body.rateLimit).toHaveProperty("maxRequests", rateLimiterParams.max);
      expect(res.body.rateLimit).toHaveProperty("message", rateLimiterParams.message);
    });
  });
});
