const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();


router.use(authController.protect);

router.get(
  "/",
  userController.getAllUsers
);
router.post(
  "/:id/assign-role",
  authController.restrictTo("super_admin", "district_admin"),
  userController.assignRole
);

router.get("/me", authController.getMe);

module.exports = router;
