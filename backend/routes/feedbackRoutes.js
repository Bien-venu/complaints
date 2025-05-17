const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post(
  "/",
  authController.restrictTo("citizen"),
  feedbackController.submitFeedback
);

router.get(
  "/analytics",
  authController.restrictTo("district_admin", "super_admin"),
  feedbackController.getFeedbackAnalytics
);

module.exports = router;
