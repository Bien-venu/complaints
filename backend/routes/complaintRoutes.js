const express = require("express");
const complaintController = require("../controllers/complaintController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/", complaintController.submitComplaint);
router.get("/sector", complaintController.getComplaintsForSectorAdmin);
router.put(
  "/:id/escalate",
  authController.restrictTo("sector_admin"),
  complaintController.escalateToDistrictAdmin
);
router.put(
  "/:id/resolve",
  authController.restrictTo("sector_admin", "district_admin"),
  complaintController.resolveComplaint
);
router.get(
  "/admin/dashboard",
  authController.restrictTo("super_admin"),
  complaintController.getDashboardData
);

module.exports = router;
