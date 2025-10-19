const express = require("express");
const router = express.Router();
const chatbotController = require("../controlers/chatbotController");

router.post("/ask", chatbotController.chatWithGemini);

module.exports = router;
