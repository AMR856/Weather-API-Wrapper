const express = require("express");
const SystemController = require("../controllers/system.controller");

const router = express.Router();

router.get("/", SystemController.getApiInfo);

router.get("/health", SystemController.healthCheck);

router.get("/limits", SystemController.getRateLimits);

module.exports = router;
