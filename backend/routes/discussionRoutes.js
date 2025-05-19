const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(discussionController.getAllDiscussions)
  .post(
    authController.restrictTo("citizen"),
    discussionController.createDiscussion
  );

router.get("/:id", discussionController.getDiscussionById);

router.route("/:id/comments").post(discussionController.addComment);

router.route("/:id/resolve").patch(
  authController.restrictTo("sector_admin", "district_admin"),
  discussionController.markDiscussionAsResolved
);

module.exports = router;
