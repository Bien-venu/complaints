const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authController = require("../controllers/authController");
const {
  checkGroupMembership,
  checkGroupCreator,
} = require("../middleware/authMiddleware");

// Protect all routes
router.use(authController.protect);

// Group management
router.post(
  "/",
  authController.restrictTo("district_admin", "sector_admin"),
  groupController.createGroup
);

router.get("/", groupController.getAllGroups);
router.get("/:groupId", checkGroupMembership, groupController.getGroup);

router.post("/:groupId/join", groupController.joinGroup);
router.post(
  "/:groupId/leave",
  checkGroupMembership,
  groupController.leaveGroup
);

// Announcements
router.post(
  "/:groupId/announcements",
  checkGroupCreator,
  groupController.postAnnouncement
);

router.get(
  "/:groupId/announcements",
  checkGroupMembership,
  groupController.getAnnouncements
);

module.exports = router;
