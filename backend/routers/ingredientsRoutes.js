const express = require("express");
const router = express.Router();
const ingredientsController = require("../controlers/ingredientsController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");
const { uploadIngredient } = require("../upload");

router.get("/getAllIngredients", auth, authRole(["admin", "staff"]), ingredientsController.getAllIngredients);
router.get("/getIngredientById/:id", auth, authRole(["admin", "staff"]), ingredientsController.getIngredientById);
router.post("/createIngredient", auth, authRole("admin"), uploadIngredient.single("image"), ingredientsController.createIngredient);
router.put("/updateIngredient/:id", auth, authRole(["admin", "staff"]), uploadIngredient.single("image"), ingredientsController.updateIngredient);
router.put("/deleteIngredient/:id", auth, authRole("admin"), ingredientsController.deleteIngredient);
router.put("/updateImage/:id", auth, uploadIngredient.single("image"), ingredientsController.updateImage);

module.exports = router;
