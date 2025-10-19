const express = require("express");
const router = express.Router();
const orderController = require("../controlers/orderController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");

router.get("/getAllOrder", auth, authRole(["admin", "staff"]), orderController.getAllOrder);
router.get("/getOrdersByRange", auth, authRole(["admin", "staff"]), orderController.getOrdersByRange);
router.get("/getOrdersByDate", auth, authRole(["admin", "staff"]), orderController.getOrdersByDate);
router.get("/getOrdersByCustomerName", auth, authRole(["admin", "staff"]), orderController.getOrdersByCustomerName);
router.get("/getOrdersByUserId/:user_id", auth, orderController.getOrdersByUserId);
router.get("/getOrdersByTableId/:table_id", auth, authRole(["admin", "staff"]), orderController.getOrdersByTableId);
router.post("/addOrderToTable", orderController.addOrderToTable);
router.put("/updateOrderItem", auth, authRole(["admin", "staff"]), orderController.updateOrderItem);
router.post('/updateStatusOrder', auth, authRole(["admin", "staff"]), orderController.updateStatusOrder);
router.get("/getPendingOrders", auth, authRole(["admin", "staff"]), orderController.getPendingOrders);


module.exports = router;