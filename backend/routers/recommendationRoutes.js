const express = require("express");
const router = express.Router();
const recommendationController = require("../controlers/recommendationController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");

// Gợi ý món cho user
router.get( "/getRecommendations/:user_id", recommendationController.getRecommendations);

module.exports = router;
