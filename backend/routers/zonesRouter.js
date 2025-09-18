const express = require("express");
const router = express.Router();
const zoneController = require("../controlers/zoneController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");

router.get("/getAllZones", auth, authRole("admin"), zoneController.getAllZones);
router.post("/createZone", auth, authRole("admin"), zoneController.createZone);
router.put("/updateZone/:id", auth, authRole("admin"), zoneController.updateZone);
router.put("/deleteZone/:id", auth, authRole("admin"), zoneController.deleteZone);


module.exports = router;