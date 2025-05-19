const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.submitComplaint = catchAsync(async (req, res, next) => {
  const { title, description, location } = req.body;

  if (req.user.role !== "citizen") {
    return next(new AppError("Only citizens can submit complaints", 403));
  }

  const sectorAdmin = await User.findOne({
    role: "sector_admin",
    "assignedLocation.sector": location.sector,
    "assignedLocation.district": location.district,
  });

  if (!sectorAdmin) {
    return next(new AppError("No sector admin found for this location", 404));
  }

  const complaint = await Complaint.create({
    title,
    description,
    user: req.user._id,
    sectorAdmin: sectorAdmin._id,
    location,
  });

  req.io.to(`sector-${sectorAdmin._id}`).emit("newComplaint", complaint);

  res.status(201).json({
    status: "success",
    data: {
      complaint,
    },
  });
});

exports.getComplaintsForSectorAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "sector_admin") {
    return next(new AppError("Only sector admins can access this route", 403));
  }

  const complaints = await Complaint.find({
    "location.sector": req.user.assignedLocation.sector,
    "location.district": req.user.assignedLocation.district,
    escalationLevel: 0,
  });

  res.status(200).json({
    status: "success",
    results: complaints.length,
    data: {
      complaints,
    },
  });
});


exports.getComplaintsForDistrictAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "district_admin") {
    return next(
      new AppError("Only district admins can access this route", 403)
    );
  }

  const complaints = await Complaint.find({
    "location.district": req.user.assignedLocation.district,
    escalationLevel: 1,
    districtAdmin: req.user._id,
  });

  res.status(200).json({
    status: "success",
    results: complaints.length,
    data: {
      complaints,
    },
  });
});


exports.getCitizenComplaints = catchAsync(async (req, res, next) => {
  if (req.user.role !== "citizen") {
    return next(new AppError("Only citizens can access this route", 403));
  }

  const complaints = await Complaint.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: complaints.length,
    data: {
      complaints,
    },
  });
});

exports.escalateToDistrictAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== "sector_admin") {
    return next(
      new AppError("Only sector admins can escalate complaints", 403)
    );
  }

  const complaint = await Complaint.findOne({
    _id: req.params.id,
    "location.sector": req.user.assignedLocation.sector,
    "location.district": req.user.assignedLocation.district,
    escalationLevel: 0,
  });

  if (!complaint) {
    return next(
      new AppError("No complaint found with that ID in your sector", 404)
    );
  }

  const districtAdmin = await User.findOne({
    role: "district_admin",
    "assignedLocation.district": req.user.assignedLocation.district,
  });

  if (!districtAdmin) {
    return next(new AppError("No district admin found for this district", 404));
  }

  complaint.status = "escalated";
  complaint.escalationLevel = 1;
  complaint.districtAdmin = districtAdmin._id;
  await complaint.save();

  req.io
    .to(`district-${districtAdmin._id}`)
    .emit("complaintEscalated", complaint);

  res.status(200).json({
    status: "success",
    data: {
      complaint,
    },
  });
});

exports.resolveComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return next(new AppError("No complaint found with that ID", 404));
  }

  if (
    req.user.role === "sector_admin" &&
    complaint.sectorAdmin._id.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError("You can only resolve complaints assigned to you", 403)
    );
  }

  if (
    req.user.role === "district_admin" &&
    complaint.districtAdmin._id.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError("You can only resolve complaints escalated to you", 403)
    );
  }

  complaint.status = "resolved";
  complaint.resolvedAt = Date.now();
  await complaint.save();

  req.io.to(`user-${complaint.user._id}`).emit("complaintResolved", complaint);
  if (complaint.sectorAdmin) {
    req.io
      .to(`sector-${complaint.sectorAdmin._id}`)
      .emit("complaintResolved", complaint);
  }
  if (complaint.districtAdmin) {
    req.io
      .to(`district-${complaint.districtAdmin._id}`)
      .emit("complaintResolved", complaint);
  }

  res.status(200).json({
    status: "success",
    data: {
      complaint,
    },
  });
});

exports.getDashboardData = catchAsync(async (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return next(
      new AppError("Only super admins can access dashboard data", 403)
    );
  }

  const [
    totalComplaints,
    pendingComplaints,
    inProgressComplaints,
    resolvedComplaints,
    escalatedComplaints,
  ] = await Promise.all([
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: "pending" }),
    Complaint.countDocuments({ status: "in_progress" }),
    Complaint.countDocuments({ status: "resolved" }),
    Complaint.countDocuments({ status: "escalated" }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      counts: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        escalated: escalatedComplaints,
      },
    },
  });
});
