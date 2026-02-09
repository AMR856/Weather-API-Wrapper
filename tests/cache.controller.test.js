const request = require("supertest");
const express = require("express");
const CacheController = require("../controllers/cache.controller");
const HTTPStatusText = require("../utils/HTTPStatusText");
const errorHandler = require("../utils/errorHandler");
const app = express();

app.get("/", CacheController.getAllKeys);
app.get("/:key", CacheController.getByKey);
app.delete("/:key", CacheController.deleteByKey);
app.delete("/", CacheController.clearAll);
app.use(errorHandler);

const mockRedis = {
  keys: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  flushAll: jest.fn(),
};

app.locals.redisClient = mockRedis;

describe("CacheController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return all cache keys", async () => {
      mockRedis.keys.mockResolvedValue(["key1", "key2"]);

      const res = await request(app).get("/");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(HTTPStatusText.SUCCESS);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toEqual(["key1", "key2"]);
    });
  });

  describe("GET /:key", () => {
    it("should return cache value for a key", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ temp: 25 }));

      const res = await request(app).get("/weather:cairo");
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(HTTPStatusText.SUCCESS);
      expect(res.body.key).toBe("weather:cairo");
      expect(res.body.data).toEqual({ temp: 25 });
    });

    it("should return 404 if key not found", async () => {
      mockRedis.get.mockResolvedValue(null);

      const res = await request(app).get("/unknown-key");
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(HTTPStatusText.FAIL);
      expect(res.body.message).toBe("Cache key not found");
    });
  });

  describe("DELETE /:key", () => {
    it("should delete a cache key", async () => {
      mockRedis.del.mockResolvedValue(1);

      const res = await request(app).delete("/weather:cairo");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(HTTPStatusText.SUCCESS);
      expect(res.body.message).toContain("deleted successfully");
    });

    it("should return 404 if key does not exist", async () => {
      mockRedis.del.mockResolvedValue(0);

      const res = await request(app).delete("/missing-key");

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe(HTTPStatusText.FAIL);
      expect(res.body.message).toBe("Cache key not found");
    });
  });

  describe("DELETE /", () => {
    it("should clear all cache", async () => {
      mockRedis.flushAll.mockResolvedValue("OK");

      const res = await request(app).delete("/");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(HTTPStatusText.SUCCESS);
      expect(res.body.message).toBe("All cache cleared successfully");
    });
  });
});
