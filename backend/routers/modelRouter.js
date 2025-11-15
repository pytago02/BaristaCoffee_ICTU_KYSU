// routers/modelRouter.js
const express = require("express");
const router = express.Router();
const modelController = require("../controlers/modelController");
const auth = require('../middlewares/authMiddleware');
const authRole = require('../middlewares/roleMiddleware');

router.post("/train",auth, authRole(['admin']), modelController.trainModel); // trigger training
router.post("/predict",auth, authRole(['admin']), modelController.predict); // predict & save
router.get("/forecasts",auth, authRole(['admin']), modelController.getForecasts); // list saved forecasts

module.exports = router;
