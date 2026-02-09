const express = require("express");
const CacheController = require("../controllers/cache.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cache
 *     description: Redis cache management routes
 */

/**
 * @swagger
 * /cache:
 *   get:
 *     summary: Get all cache keys
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: List of all cache keys
 *         content:
 *           application/json:
 *             example:
 *               status: "SUCCESS"
 *               count: 3
 *               data: ["key1", "key2", "key3"]
 */
router.get("/", CacheController.getAllKeys);

/**
 * @swagger
 * /cache/{key}:
 *   get:
 *     summary: Get a specific cache key
 *     tags: [Cache]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Cache key to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Value of cache key
 *         content:
 *           application/json:
 *             example:
 *               status: "SUCCESS"
 *               key: "key1"
 *               data: { "temp": 25 }
 */
router.get("/:key", CacheController.getByKey);

/**
 * @swagger
 * /cache/{key}:
 *   delete:
 *     summary: Delete a cache key
 *     tags: [Cache]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Cache key to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             example:
 *               status: "SUCCESS"
 *               message: "Cache key 'key1' deleted successfully"
 */
router.delete("/:key", CacheController.deleteByKey);

/**
 * @swagger
 * /cache:
 *   delete:
 *     summary: Clear all cache
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             example:
 *               status: "SUCCESS"
 *               message: "All cache cleared successfully"
 */
router.delete("/", CacheController.clearAll);

module.exports = router;
