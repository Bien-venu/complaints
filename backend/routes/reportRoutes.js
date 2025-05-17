const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authController = require("../controllers/authController");

// Debug: Check if methods exist
console.log({
  generateComplaintReport: typeof reportController.generateComplaintReport,
  exportCSV: typeof reportController.exportComplaintReportCSV,
  exportPDF: typeof reportController.exportComplaintReportPDF,
});

// Protect all routes
router.use(authController.protect);

// Complaint Reports
router.get(
  "/complaints",
  authController.restrictTo("super_admin", "district_admin", "sector_admin"),
  reportController.generateComplaintReport
);

router.get(
  "/complaints/:id/csv",
  authController.restrictTo("super_admin", "district_admin", "sector_admin"),
  reportController.exportComplaintReportCSV
);

router.get(
  "/complaints/:id/pdf",
  authController.restrictTo("super_admin", "district_admin", "sector_admin"),
  reportController.exportComplaintReportPDF
);

// Feedback Reports
router.get(
  "/feedback",
  authController.restrictTo("super_admin", "district_admin"),
  reportController.generateFeedbackReport
);

// Performance Reports
router.get(
  "/performance",
  authController.restrictTo("super_admin"),
  reportController.generatePerformanceReport
);

module.exports = router;
