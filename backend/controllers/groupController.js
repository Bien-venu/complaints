const User = require("../models/User"); // Assuming your User model is in '../models/User'
const Group = require("../models/Group");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create a new group (Admin only)
exports.createGroup = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  // Only district/sector admins can create groups
  if (!["district_admin", "sector_admin"].includes(req.user.role)) {
    return next(
      new AppError("Only district or sector admins can create groups", 403)
    );
  }

  const group = await Group.create({
    name,
    description,
    location: req.user.assignedLocation,
    createdBy: req.user._id,
    members: [{ user: req.user._id }], // Add creator as first member
  });

  res.status(201).json({
    status: "success",
    data: {
      group,
    },
  });
});

// Join a group (Location-matched users only)
exports.joinGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  // Check if user already in group
  const isMember = group.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    return next(new AppError("You are already a member of this group", 400));
  }

  // Verify location match
  const userLocation = req.user.assignedLocation;
  const groupLocation = group.location;

  const locationMatch =
    userLocation.province === groupLocation.province &&
    userLocation.district === groupLocation.district &&
    (req.user.role === "district_admin" ||
      userLocation.sector === groupLocation.sector);

  if (!locationMatch) {
    return next(new AppError("Your location does not match this group", 403));
  }

  // Add user to group
  group.members.push({ user: req.user._id });
  await group.save();

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// Post announcement (Group creator only)
exports.postAnnouncement = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  // Check if user is the group creator
  if (group.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Only the group creator can post announcements", 403)
    );
  }

  group.announcements.push({
    message,
    postedBy: req.user._id,
  });

  await group.save();

  res.status(201).json({
    status: "success",
    data: {
      announcement: group.announcements[group.announcements.length - 1],
    },
  });
});

// Get group announcements (Members only)
exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId).populate(
    "announcements.postedBy",
    "name email role"
  );

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  // Check if user is a member
  const isMember = group.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    return next(new AppError("You are not a member of this group", 403));
  }

  res.status(200).json({
    status: "success",
    results: group.announcements.length,
    data: {
      announcements: group.announcements,
    },
  });
});

// Get all groups for user's location
exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    "location.province": req.user.assignedLocation.province,
    "location.district": req.user.assignedLocation.district,
    ...(req.user.role === "citizen" && {
      "location.sector": req.user.assignedLocation.sector,
    }),
  });

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
    },
  });
});

// Get specific group details
exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId)
    .populate("members.user", "name email role")
    .populate("announcements.postedBy", "name email role");

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

// Leave a group
exports.leaveGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  // Can't leave if you're the creator
  if (group.createdBy.toString() === req.user._id.toString()) {
    return next(new AppError("Group creator cannot leave the group", 400));
  }

  group.members = group.members.filter(
    (member) => member.user.toString() !== req.user._id.toString()
  );

  await group.save();

  res.status(200).json({
    status: "success",
    data: null,
  });
});
