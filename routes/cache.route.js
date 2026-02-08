const express = require("express");
const CacheController = require("../controllers/cache.controller");

const router = express.Router();

router.get("/", CacheController.getAllKeys);
router.get("/:key", CacheController.getByKey);
router.delete("/:key", CacheController.deleteByKey);
router.delete("/", CacheController.clearAll);

module.exports = router;