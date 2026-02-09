const express = require("express");
const SystemController = require("../controllers/system.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: System
 *     description: System and API information routes
 */

/**
 * @swagger
 * /system:
 *   get:
 *     summary: Get basic API info
 *     tags: [System]
 *     description: Returns the API name, version, environment, and status
 *     responses:
 *       200:
 *         description: API info
 *         content:
 *           application/json:
 *             example:
 *               name: "Weather API"
 *               version: "1.0.0"
 *               environment: "development"
 *               status: "running"
 */
router.get("/", SystemController.getApiInfo);

/**
 * @swagger
 * /system/health:
 *   get:
 *     summary: Health check of the API
 *     description: Returns the status of API and Redis, uptime, and timestamp
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API health status
 *         content:
 *           application/json:
 *             example:
 *               status: "ok"
 *               uptime: 123.45
 *               timestamp: "2026-02-09T12:00:00.000Z"
 *               services:
 *                 api: "up"
 *                 redis: "connected"
 */
router.get("/health", SystemController.healthCheck);

/**
 * @swagger
 * /system/limits:
 *   get:
 *     summary: Get API rate limit settings
 *     description: Returns the configured rate limiting rules
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Rate limit info
 *         content:
 *           application/json:
 *             example:
 *               rateLimit:
 *                 window: "1 Minutes"
 *                 maxRequests: 5
 *                 message: "Too many requests"
 */
router.get("/limits", SystemController.getRateLimits);

module.exports = router;
