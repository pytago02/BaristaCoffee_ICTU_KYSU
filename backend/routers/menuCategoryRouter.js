const express = require("express");
const router = express.Router();
const menuCategoryController = require("../controlers/menuCaregoryController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");

router.get("/getAllMenuCategory", auth, authRole(["admin", "staff"]), menuCategoryController.getAllCategoryMenu);
router.post("/createMenuCategory", auth, authRole("admin"), menuCategoryController.createCategoryMenu);
router.put("/updateMenuCategory/:id", auth, authRole("admin"), menuCategoryController.updateCategoryMenu);
router.put("/deleteMenuCategory/:id", auth, authRole("admin"), menuCategoryController.deleteCategoryMenu);

module.exports = router;