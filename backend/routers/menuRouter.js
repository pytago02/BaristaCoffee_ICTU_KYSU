const express = require("express");
const router = express.Router();
const menuController = require("../controlers/menuController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");
const {upload} = require("../upload");

router.get("/getAllMenu", menuController.getAllMenu);
router.get("/getMenuById/:id", auth, authRole(["admin", "staff"]), menuController.getMenuById);
router.post("/createMenu", auth, authRole("admin"), upload.single("image"), menuController.createMenu);
router.put("/updateMenu/:id", auth, authRole("admin"), upload.single("image"), menuController.updateMenu);
router.put("/deleteMenu/:id", auth, authRole("admin"), menuController.deleteMenu);
router.put("/changeIsActive/:id", auth, authRole("admin"), menuController.changeIsActive);
router.put("/updateMenuTutorial", auth, authRole("admin"), menuController.updateMenuTutorial);

module.exports = router;