const express = require("express");
const router = express.Router();

const { getHealthStatus, askQuestion } = require("../controllers/aiController");
const { validateAskQuestion } = require("../validators/aiValidator");

// Health-check endpoints
router.get("/health", getHealthStatus);
router.get("/ai/health", getHealthStatus);

// Question processing endpoints
router.post("/ask", validateAskQuestion, askQuestion);
router.post("/ai/ask", validateAskQuestion, askQuestion);

module.exports = router;
