const Report = require("../models/Report");
const Complaint = require("../models/Complaint");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Feedback = require("../models/Feedback");

exports.generateComplaintReport = catchAsync(async (req, res, next) => {
  const { timeRange, location, status, escalationLevel } = req.query;

  // 1. Build filters based on query params
  const filter = {};

  if (timeRange) {
    const [start, end] = timeRange.split(",");
    filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
  }

  if (location) {
    const [province, district, sector] = location.split(",");
    if (province) filter["location.province"] = province;
    if (district) filter["location.district"] = district;
    if (sector) filter["location.sector"] = sector;
  }

  if (status) filter.status = status;
  if (escalationLevel) filter.escalationLevel = parseInt(escalationLevel);

  // 2. Apply role-based restrictions (e.g., district admins only see their district)
  if (req.user.role === "district_admin") {
    filter["location.district"] = req.user.assignedLocation.district;
  } else if (req.user.role === "sector_admin") {
    filter["location.sector"] = req.user.assignedLocation.sector;
    filter["location.district"] = req.user.assignedLocation.district;
  }

  // 3. Aggregate complaint data
  const complaints = await Complaint.aggregate([
    { $match: filter },
    {
      $group: {
        _id: {
          status: "$status",
          escalationLevel: "$escalationLevel",
          district: "$location.district",
          sector: "$location.sector",
        },
        count: { $sum: 1 },
        avgResolutionTime: {
          $avg: { $subtract: ["$resolvedAt", "$createdAt"] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id.status",
        escalationLevel: "$_id.escalationLevel",
        district: "$_id.district",
        sector: "$_id.sector",
        count: 1,
        avgResolutionTime: 1,
      },
    },
  ]);

  // 4. Save report to DB
  const report = await Report.create({
    type: "complaints",
    generatedBy: req.user._id,
    filters: {
      timeRange: timeRange
        ? {
            start: new Date(timeRange.split(",")[0]),
            end: new Date(timeRange.split(",")[1]),
          }
        : null,
      location: location
        ? {
            province: location.split(",")[0],
            district: location.split(",")[1],
            sector: location.split(",")[2],
          }
        : null,
      status,
      escalationLevel: escalationLevel ? parseInt(escalationLevel) : null,
    },
    data: complaints,
  });

  res.status(200).json({
    status: "success",
    data: { report },
  });
});

const csvWriter = require("csv-writer").createObjectCsvWriter;
const PDFDocument = require("pdfkit");

exports.exportComplaintReportCSV = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) return next(new AppError("Report not found", 404));

  const csv = csvWriter({
    path: "complaint_report.csv",
    header: [
      { id: "status", title: "Status" },
      { id: "escalationLevel", title: "Escalation Level" },
      { id: "district", title: "District" },
      { id: "sector", title: "Sector" },
      { id: "count", title: "Count" },
      { id: "avgResolutionTime", title: "Avg Resolution Time (ms)" },
    ],
  });

  await csv.writeRecords(report.data);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=complaint_report.csv"
  );
  require("fs").createReadStream("complaint_report.csv").pipe(res);
});

exports.exportComplaintReportPDF = catchAsync(async (req, res, next) => {
  const report = await Report.findById(req.params.id);
  if (!report) return next(new AppError("Report not found", 404));

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="complaint_report.pdf"`
  );
  doc.pipe(res);

  doc.fontSize(20).text("Complaint Report", { align: "center" });
  doc.moveDown();

  // Add filters info
  if (report.filters.timeRange) {
    doc
      .fontSize(12)
      .text(
        `Time Range: ${report.filters.timeRange.start.toDateString()} to ${report.filters.timeRange.end.toDateString()}`
      );
  }
  if (report.filters.location) {
    doc
      .fontSize(12)
      .text(
        `Location: ${report.filters.location.province || "All"} ${
          report.filters.location.district || ""
        } ${report.filters.location.sector || ""}`
      );
  }
  doc.moveDown();

  // Generate table
  const headers = [
    "Status",
    "Escalation",
    "District",
    "Sector",
    "Count",
    "Avg Time",
  ];
  const rows = report.data.map((item) => [
    item.status || "-",
    item.escalationLevel || "-",
    item.district || "-",
    item.sector || "-",
    item.count.toString(),
    item.avgResolutionTime
      ? `${Math.round(item.avgResolutionTime / (1000 * 60 * 60 * 24))} days`
      : "-",
  ]);

  // Draw table
  const margin = 50;
  const rowHeight = 20;
  const colWidths = [80, 70, 90, 90, 50, 70];
  let y = doc.y;

  // Headers
  headers.forEach((header, i) => {
    doc
      .rect(
        margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
        y,
        colWidths[i],
        rowHeight
      )
      .stroke();
    doc
      .font("Helvetica-Bold")
      .text(
        header,
        margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
        y + 5,
        { width: colWidths[i] - 10 }
      );
  });

  // Rows
  rows.forEach((row) => {
    y += rowHeight;
    row.forEach((cell, i) => {
      doc
        .rect(
          margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y,
          colWidths[i],
          rowHeight
        )
        .stroke();
      doc
        .font("Helvetica")
        .text(
          cell,
          margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          y + 5,
          { width: colWidths[i] - 10 }
        );
    });
  });

  doc.end();
});

exports.generateFeedbackReport = catchAsync(async (req, res, next) => {
  const filter = {};

  // Apply role-based filters
  if (req.user.role === "district_admin") {
    filter["location.district"] = req.user.assignedLocation.district;
  }

  const feedbackStats = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$serviceType",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
        positiveComments: {
          $sum: {
            $cond: [{ $gte: ["$rating", 4] }, 1, 0],
          },
        },
        negativeComments: {
          $sum: {
            $cond: [{ $lte: ["$rating", 2] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        serviceType: "$_id",
        averageRating: 1,
        count: 1,
        satisfactionPercentage: {
          $multiply: [{ $divide: ["$positiveComments", "$count"] }, 100],
        },
        _id: 0,
      },
    },
  ]);

  // Save report to database
  const report = await Report.create({
    type: "feedback",
    generatedBy: req.user._id,
    data: feedbackStats,
  });

  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});

// Performance Reports
exports.generatePerformanceReport = catchAsync(async (req, res, next) => {
  // Only super admin can access this
  if (req.user.role !== "super_admin") {
    return next(
      new AppError("Only super admins can generate performance reports", 403)
    );
  }

  const performanceStats = await Complaint.aggregate([
    {
      $group: {
        _id: {
          district: "$location.district",
          sector: "$location.sector",
        },
        totalComplaints: { $sum: 1 },
        resolvedComplaints: {
          $sum: {
            $cond: [{ $eq: ["$status", "resolved"] }, 1, 0],
          },
        },
        avgResolutionTime: {
          $avg: {
            $cond: [
              { $eq: ["$status", "resolved"] },
              { $subtract: ["$resolvedAt", "$createdAt"] },
              null,
            ],
          },
        },
        escalationRate: {
          $avg: {
            $cond: [{ $gt: ["$escalationLevel", 0] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        district: "$_id.district",
        sector: "$_id.sector",
        resolutionRate: {
          $cond: [
            { $eq: ["$totalComplaints", 0] },
            0,
            { $divide: ["$resolvedComplaints", "$totalComplaints"] },
          ],
        },
        avgResolutionDays: {
          $divide: ["$avgResolutionTime", 1000 * 60 * 60 * 24],
        },
        escalationRate: { $multiply: ["$escalationRate", 100] },
        _id: 0,
      },
    },
  ]);

  // Save report to database
  const report = await Report.create({
    type: "performance",
    generatedBy: req.user._id,
    data: performanceStats,
  });

  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});
