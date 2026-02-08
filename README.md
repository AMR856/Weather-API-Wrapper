# Weather API

## 📖 Project Overview

This project is a **Weather API** built with **Node.js** and **Express**, designed to fetch and return weather data from a **3rd-party weather service** (Visual Crossing API) while implementing **Redis caching** for performance optimization.

The project demonstrates:

* Fetching and integrating **3rd-party APIs**.
* Implementing **Redis caching** to reduce API calls and improve response times.
* Handling environment variables securely for API keys and database connections.
* Using **rate limiting** to prevent abuse.
* Graceful server shutdown and clean architecture with controllers, routes, and middleware.

---

## 🌐 Features

* `GET /weather/:city` or `GET /weather?city=<city>`: Fetch weather data by city.
* **Cache-aware responses**: Returns data from Redis if available.
* `GET /cache` and `DELETE /cache`: Inspect and manage cached data.
* `GET /system/health`: Health check endpoint for server monitoring.
* `GET /system/limits`: Check your rate limit status.
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

### Test (placeholder):

```bash
npm test
```

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

---

## 🔧 Tech Stack

* **Node.js**: Runtime
* **Express**: Web framework
* **Axios**: HTTP client for fetching 3rd-party API
* **Redis**: In-memory caching
* **dotenv**: Environment variables
* **express-rate-limit**: Rate limiting

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
│   └─ redisUtils.js
├─ server.js
└─ .env
```

* **Controllers**: Handle business logic and API responses
* **Routes**: Define endpoints
* **Middlewares**: Rate limiting, error handling
* **Redis Utils**: Handles Redis connection and operations

Solution for Weather API Project https://roadmap.sh/projects/weather-api-wrapper-service