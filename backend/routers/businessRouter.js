const express = require('express');
const router = express.Router();
const businessController = require('../controlers/businessController');
const auth = require('../middlewares/authMiddleware');
const authRole = require('../middlewares/roleMiddleware');

router.get('/getAllBusiness', auth, authRole(['admin']), businessController.getAllBusiness);
router.put('/updateBusiness', auth, authRole('admin'), businessController.updateBusiness);
router.get("/revenueByCategory",auth, authRole('admin'), businessController.getRevenueByCategory);
router.get("/forecasts", auth, authRole('admin'), businessController.getForecasts);
router.get("/getQuantityOrderItems", auth, authRole('admin'), businessController.getQuantityOrderItems);
router.get("/getBusinessToday", auth, authRole('admin'), businessController.getBusinessToday);
router.get("/getHotTables", auth, authRole('admin'), businessController.getHotTables);
router.post("/getQuantityItemByMonth", auth, authRole('admin'), businessController.getQuantityItemByMonth);

module.exports = router;