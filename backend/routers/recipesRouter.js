const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");
const recipesController = require("../controlers/recipesController");

router.get("/getAllRecipes", auth, authRole(["admin", "staff", "barista"]), recipesController.getAllRecipes);
router.get("/getRecipesByMenuId/:menu_id", auth, authRole(["admin", "staff", "barista"]), recipesController.getRecipesByMenuId);
router.post("/addIngredientToMenu", auth, authRole(["admin"]), recipesController.addIngredientToMenu);
router.post("/updateIngredientInMenu", auth, authRole(["admin"]), recipesController.updateIngredientInMenu);
router.post("/deleteIngredientFromMenu", auth, authRole(["admin"]), recipesController.deleteIngredientFromMenu);

module.exports = router;