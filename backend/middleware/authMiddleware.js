const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Group = require("../models/Group");


exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};


exports.checkComplaintOwnership = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return next(new AppError("No complaint found with that ID", 404));
    }

    
    if (req.user.role === "super_admin") return next();

    
    if (
      req.user.role === "district_admin" &&
      complaint.location.district === req.user.assignedLocation.district
    ) {
      return next();
    }

    
    if (
      req.user.role === "sector_admin" &&
      complaint.location.sector === req.user.assignedLocation.sector
    ) {
      return next();
    }

    
    if (
      req.user.role === "citizen" &&
      complaint.user._id.toString() === req.user._id.toString()
    ) {
      return next();
    }

    return next(
      new AppError("You are not authorized to access this complaint", 403)
    );
  } catch (err) {
    next(err);
  }
};

exports.authorizeReportAccess = (reportType) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    
    if (userRole === "super_admin") return next();

    
    if (
      userRole === "district_admin" &&
      ["complaints", "feedback"].includes(reportType)
    )
      return next();

    
    if (userRole === "sector_admin" && reportType === "complaints")
      return next();

    return next(new AppError("Unauthorized to access this report", 403));
  };
};

exports.checkGroupMembership = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  const isMember = group.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    return next(new AppError("You are not a member of this group", 403));
  }

  req.group = group;
  next();
});

exports.checkGroupCreator = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  if (group.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Only the group creator can perform this action", 403)
    );
  }

  req.group = group;
  next();
});