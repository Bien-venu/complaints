const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const authController = require("../controllers/authController");

// Protect all routes
router.use(authController.protect);

router
  .route("/")
  .get(discussionController.getAllDiscussions)
  .post(
    authController.restrictTo("citizen"),
    discussionController.createDiscussion
  );

router.route("/:id/comments").post(discussionController.addComment);

router.route("/:id/resolve").patch(
  authController.restrictTo("sector_admin", "district_admin"),
  discussionController.markDiscussionAsResolved // Make sure this exists in your controller
);

module.exports = router;
