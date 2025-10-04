const express = require("express");
const router = express.Router();
const tablesController = require("../controlers/tablesController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");

router.get("/getAllTables", auth, authRole(["admin", "staff"]), tablesController.getAllTables);
router.get("/getAllTablesByStatus/:status", auth, authRole(["admin", "staff"]), tablesController.getAllTablesByStatus);
router.get("/getTablesById/:id", auth, authRole(["admin", "staff"]), tablesController.getTablesById);
router.get("/getAllTablesByZone/:zoneId", auth, authRole(["admin", "staff"]), tablesController.getAllTablesByZone);
router.get("/getAllZonesWithTables", auth, authRole(["admin", "staff"]), tablesController.getAllZonesWithTables);
router.get("/getInforTableById/:table_id", tablesController.getInforTableById);

router.post("/createTable", auth, authRole("admin"), tablesController.createTable);
router.put("/updateTable/:id", auth, authRole("admin"), tablesController.updateTable);
router.put("/deleteTable/:id", auth, authRole("admin"), tablesController.deleteTable);
router.put("/updateStausTable/:id", auth, authRole(["admin", "staff"]), tablesController.updateStausTable);


module.exports = router;