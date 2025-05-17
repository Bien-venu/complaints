const Discussion = require("../models/Discussion");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createDiscussion = catchAsync(async (req, res, next) => {
  const { title, description, tags } = req.body;

  if (req.user.role !== "citizen") {
    return next(new AppError("Only citizens can create discussions", 403));
  }

  const discussion = await Discussion.create({
    title,
    description,
    createdBy: req.user._id,
    location: req.user.assignedLocation,
    tags,
  });

  try {
    // Check if Socket.IO is available
    if (!req.io) {
      console.warn(
        "Socket.IO not available - proceeding without realtime notification"
      );
    } else {
      // Notify relevant admins
      req.io
        .to(`district-${req.user.assignedLocation.district}`)
        .emit("newDiscussion", discussion);
      req.io
        .to(`sector-${req.user.assignedLocation.sector}`)
        .emit("newDiscussion", discussion);
    }
  } catch (ioError) {
    console.error("Socket.IO error:", ioError);
    // Continue even if Socket.IO fails
  }

  res.status(201).json({
    status: "success",
    data: {
      discussion,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { text, isOfficialResponse } = req.body;
  const discussionId = req.params.id;

  const discussion = await Discussion.findById(discussionId);

  if (!discussion) {
    return next(new AppError("No discussion found with that ID", 404));
  }

  // Check if user can comment (citizens or admins from the same location)
  if (
    req.user.role === "citizen" &&
    discussion.createdBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new AppError("You can only comment on your own discussions", 403)
    );
  }

  if (
    req.user.role === "sector_admin" &&
    discussion.location.sector !== req.user.assignedLocation.sector
  ) {
    return next(
      new AppError("You can only comment on discussions in your sector", 403)
    );
  }

  if (
    req.user.role === "district_admin" &&
    discussion.location.district !== req.user.assignedLocation.district
  ) {
    return next(
      new AppError("You can only comment on discussions in your district", 403)
    );
  }

  const comment = {
    user: req.user._id,
    text,
    isOfficialResponse: isOfficialResponse || false,
  };

  discussion.comments.push(comment);
  await discussion.save();

  // Notify participants
  req.io
    .to(`discussion-${discussion._id}`)
    .emit("newComment", { discussionId, comment });

  res.status(200).json({
    status: "success",
    data: {
      discussion,
    },
  });
});

exports.markDiscussionAsResolved = catchAsync(async (req, res, next) => {
  const discussionId = req.params.id;

  const discussion = await Discussion.findById(discussionId);

  if (!discussion) {
    return next(new AppError("No discussion found with that ID", 404));
  }

  // Only admins from the same location can resolve
  if (
    req.user.role === "sector_admin" &&
    discussion.location.sector !== req.user.assignedLocation.sector
  ) {
    return next(
      new AppError("You can only resolve discussions in your sector", 403)
    );
  }

  if (
    req.user.role === "district_admin" &&
    discussion.location.district !== req.user.assignedLocation.district
  ) {
    return next(
      new AppError("You can only resolve discussions in your district", 403)
    );
  }

  discussion.status = "resolved";
  discussion.resolvedAt = new Date();
  await discussion.save();

  // Notify participants
  req.io
    .to(`discussion-${discussion._id}`)
    .emit("discussionResolved", discussion);

  res.status(200).json({
    status: "success",
    data: {
      discussion,
    },
  });
});

exports.getAllDiscussions = catchAsync(async (req, res, next) => {
  // Build filter based on user role
  const filter = {};

  // Citizens can only see their own discussions
  if (req.user.role === "citizen") {
    filter.createdBy = req.user._id;
  }
  // Sector admins see discussions in their sector
  else if (req.user.role === "sector_admin") {
    filter["location.sector"] = req.user.assignedLocation.sector;
    filter["location.district"] = req.user.assignedLocation.district;
  }
  // District admins see discussions in their district
  else if (req.user.role === "district_admin") {
    filter["location.district"] = req.user.assignedLocation.district;
  }
  // Super admins can see all discussions (no filter)

  // Optional query parameters
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.tags) {
    filter.tags = { $in: req.query.tags.split(",") };
  }

  const discussions = await Discussion.find(filter)
    .populate("createdBy", "name email role")
    .populate("comments.user", "name email role")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: discussions.length,
    data: {
      discussions,
    },
  });
});
