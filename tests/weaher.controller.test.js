const express = require("express");
const request = require("supertest");
const WeatherController = require("../controllers/weather.controller");
const CustomError = require("../utils/customError");
const HTTPStatusText = require("../utils/HTTPStatusText");
const errorHandler = require("../utils/errorHandler");

const mockRedis = {
  get: jest.fn(),
  setEx: jest.fn(),
};

jest.mock('axios');
const axios = require('axios');
const app = express();

app.use(express.json());
app.locals.redisClient = mockRedis;

app.get("/weather", WeatherController.getWeatherByCity);
app.get("/weather/:city", WeatherController.getWeatherByCity);
app.use(errorHandler);

describe("WeatherController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if city is missing", async () => {
    const res = await request(app).get("/weather");

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(HTTPStatusText.FAIL);
    expect(res.body.message).toMatch(
      "City is required (via route param or query)",
    );
  });

  it("should return weather data from cache", async () => {
    const cachedWeather = { temp: 25 };

    mockRedis.get.mockResolvedValue(JSON.stringify(cachedWeather));

    const res = await request(app).get("/weather/some-city");

    expect(mockRedis.get).toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.body.meta.cached).toBe(true);
    expect(res.body.data).toEqual(cachedWeather);
  });

  it("should fetch weather from API and cache it", async () => {
    const apiWeather = { temp: 30 };

    mockRedis.get.mockResolvedValue(null);

    axios.get.mockResolvedValue({
      data: apiWeather,
    });

    const res = await request(app).get("/weather/some-city");

    expect(mockRedis.get).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(mockRedis.setEx).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.body.meta.cached).toBe(false);
    expect(res.body.data).toEqual(apiWeather);
  });

  it("should skip cache when refresh=true", async () => {
    axios.get.mockResolvedValue({
      data: { temp: 35 },
    });

    const res = await request(app).get("/weather/some-city?refresh=true");

    expect(mockRedis.get).not.toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(mockRedis.setEx).toHaveBeenCalled();

    expect(res.statusCode).toBe(200);
    expect(res.body.meta.cached).toBe(false);
  });

  it("should respect unit and days query params", async () => {
    axios.get.mockResolvedValue({
      data: { temp: 15 },
    });
    const unit = "metric";
    const days = 3;
    await request(app).get(`/weather/cairo?unit=${unit}&days=${days}`);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`unitGroup=${unit}`),
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`days=${days}`),
    );
  });

  it("should handle API errors gracefully", async () => {
    mockRedis.get.mockResolvedValue(null);

    axios.get.mockRejectedValue(
      new CustomError("API is down", 500, HTTPStatusText.ERROR),
    );

    const res = await request(app).get("/weather/cairo");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("API is down");
    expect(res.body.status).toBe(HTTPStatusText.ERROR);
  });
});
