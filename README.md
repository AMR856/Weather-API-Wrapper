# Weather API

## 📖 Project Overview

This project is a **Weather API** built with **Node.js** and **Express**, designed to fetch and return weather data from a **3rd-party weather service** (Visual Crossing API) while implementing **Redis caching** for performance optimization.

The project demonstrates:

* Fetching and integrating **3rd-party APIs**.
* Implementing **Redis caching** to reduce API calls and improve response times.
* Handling environment variables securely for API keys and database connections.
* Using **rate limiting** to prevent abuse.
* Graceful server shutdown and clean architecture with controllers, routes, and middleware.
* API documentation with **Swagger**.
* Automated testing with **Jest**.

---

## 🌐 Features

* `GET /weather/:city` or `GET /weather?city=<city>`: Fetch weather data by city.
* **Cache-aware responses**: Returns data from Redis if available.
* `GET /cache` and `DELETE /cache`: Inspect and manage cached data.
* `GET /system/health`: Health check endpoint for server monitoring.
* `GET /system/limits`: Check your rate limit status.
* **Swagger API docs** available at `/api-docs`.
* **Automated tests** using Jest and Supertest.
* Graceful shutdown with Redis cleanup.
* Environment-variable configuration for API keys and server settings.

---

## ⚡ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/weather-api.git
cd weather-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup environment variables:**

Create a `.env` file in the project root:

```env
PORT=3000
API_URL=/api/v1
API_KEY=YOUR_VISUAL_CROSSING_API_KEY
REDIS_URL=redis://localhost:6379
```

4. **Run Redis locally** or use a hosted Redis service.

---

## 🚀 Running the Project

### Development (with auto-reload):

```bash
npm run dev
```

### Production:

```bash
npm start
```

### Tests:

```bash
npm test
```

This will run the **Jest test suite**, covering **Weather, Cache, and System controllers**.

---

## 🔗 API Endpoints

### Weather

| Method | Endpoint               | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | `/weather/:city`       | Fetch weather for a city      |
| GET    | `/weather?city=<city>` | Alternative query-param style |

**Query Parameters**:

* `unit` (optional): `us | metric | uk` — defaults to `us`
* `days` (optional): number of forecast days — defaults to `7`
* `refresh` (optional): `true` to bypass cache

---

### Cache

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/cache`      | List all cache keys           |
| GET    | `/cache/:key` | Get cached data for a key     |
| DELETE | `/cache/:key` | Delete a specific cache entry |
| DELETE | `/cache`      | Clear all cache               |

---

### System

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/system/health` | Check server health    |
| GET    | `/system/limits` | Check rate limit usage |
| GET    | `/system`        | Get basic API info     |

---

## 📚 Swagger Documentation

Swagger UI is integrated for all routes.
**Access it at:**

```
http://localhost:3000/api-docs
```

All endpoints include:

* **Tags**: `Weather`, `Cache`, `System`
* **Parameters**: Path and query parameters defined
* **Responses**: Example response bodies for 200 status

---

## 🔧 Tech Stack

* **Node.js**: Runtime
* **Express**: Web framework
* **Axios**: HTTP client for fetching 3rd-party API
* **Redis**: In-memory caching
* **dotenv**: Environment variables
* **express-rate-limit**: Rate limiting
* **Swagger (swagger-jsdoc & swagger-ui-express)**: API documentation
* **Jest + Supertest**: Automated testing

---

## 🛠 Architecture & Structure

```
├─ controllers/
│   ├─ weather.controller.js
│   ├─ cache.controller.js
│   └─ system.controller.js
├─ routes/
│   ├─ weather.route.js
│   ├─ cache.route.js
│   └─ system.route.js
├─ utils/
│   ├─ customError.js
│   ├─ errorHandler.js
│   ├─ rateLimiterParams.js
│   └─ HTTPStatusText.js
├─ middlewares/
│   └─ rateLimiter.js
├─ config/
│   ├  redisUtils.js
│   └─ swagger.js
├─ tests/
│   ├─ weather.controller.test.js
│   ├─ cache.controller.test.js
│   └─ system.controller.test.js
├─ server.js
└─ .env
```

* **Controllers**: Business logic and API responses
* **Routes**: API endpoints
* **Middlewares**: Rate limiting, error handling
* **Redis Utils**: Redis connection and caching functions
* **Tests**: Jest test suites for all controllers
