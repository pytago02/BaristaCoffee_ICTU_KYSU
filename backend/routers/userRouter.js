const express = require("express");
const router = express.Router();
const userController = require("../controlers/userController");
const auth = require("../middlewares/authMiddleware");
const authRole = require("../middlewares/roleMiddleware");
const { uploadAvatar } = require("../upload");

router.post("/register", userController.register);
router.post("/registerStaff",auth, authRole(["admin"]), userController.registerStaff);
router.post("/staffLogin", userController.staffLogin);
router.post("/customerLogin", userController.customerLogin);

router.get("/getAllUser", auth, authRole(["admin", "staff"]), userController.getAllUsers);
router.get("/getUserById/:id", auth, authRole(["admin", "staff"]), userController.getUserById);
router.get("/getMe", auth, userController.getMe);
router.put("/updateUser/:id", auth, authRole(["admin", "staff"]), userController.updateUser);
router.put("/deleteUser/:id", auth, authRole(["admin"]), userController.deleteUser);
// router.put("/changePassword/:id", auth, userController.changePassword);
router.put("/changePassword/:id", auth, (req, res, next) => {
  if (req.user.role !== "admin" && req.user.user_id != req.params.id) {
    return res.status(403).json({ message: "Bạn không có quyền đổi mật khẩu người khác!" });
  }
  next();
}, userController.changePassword);

router.put("/changeIsActive/:id", auth, authRole(["admin"]), userController.changeIsActive);
router.get("/getStaffAcount", auth, authRole(["admin"]), userController.getStaffAcount);
router.get("/getCustomerAcount", auth, authRole(["admin"]), userController.getCustomerAcount);
router.put("/resetPassword/:id", auth, authRole(["admin"]), userController.resetPassword);

router.put("/updateAvatar/:id", auth, uploadAvatar.single("avatar"), userController.updateAvatar);


module.exports = router;