const express = require('express');
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");
const requestController = require("../controlers/requestController");

router.get('/getPendingRequests', auth, authRole(['admin', 'staff']), requestController.getPendingRequests);
router.put('/updateRequestStatus/:id', auth, authRole(['admin', 'staff']), requestController.updateRequestStatus);
router.post('/callStaff', requestController.callStaff);
router.post('/requestPayment', requestController.requestPayment);


module.exports = router;
