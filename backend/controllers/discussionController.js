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
    
    if (!req.io) {
      console.warn(
        "Socket.IO not available - proceeding without realtime notification"
      );
    } else {
      
      req.io
        .to(`district-${req.user.assignedLocation.district}`)
        .emit("newDiscussion", discussion);
      req.io
        .to(`sector-${req.user.assignedLocation.sector}`)
        .emit("newDiscussion", discussion);
    }
  } catch (ioError) {
    console.error("Socket.IO error:", ioError);
    
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

  
  if (
    req.user.role === "citizen" &&
    discussion.location.sector !== req.user.assignedLocation.sector
  ) {
    return next(
      new AppError("You can only comment on discussions in your sector", 403)
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
  
  const filter = {};

  
  if (req.user.role === "citizen") {
    filter["location.sector"] = req.user.assignedLocation.sector;
    filter["location.district"] = req.user.assignedLocation.district;
  }
  
  else if (req.user.role === "sector_admin") {
    filter["location.sector"] = req.user.assignedLocation.sector;
    filter["location.district"] = req.user.assignedLocation.district;
  }
  
  else if (req.user.role === "district_admin") {
    filter["location.district"] = req.user.assignedLocation.district;
  }
  

  
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

exports.getDiscussionById = catchAsync(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id)
    .populate("createdBy", "name email role")
    .populate("comments.user", "name email role");

  if (!discussion) {
    return next(new AppError("No discussion found with that ID", 404));
  }

  
  if (req.user.role === "citizen") {
      if (
        discussion.location.district !== req.user.assignedLocation.district ||
        discussion.location.sector !== req.user.assignedLocation.sector
      ) {
        return next(
          new AppError("You can only view discussions in your sector", 403)
        );
      }
  } else if (req.user.role === "sector_admin") {
    if (
      discussion.location.district !== req.user.assignedLocation.district ||
      discussion.location.sector !== req.user.assignedLocation.sector
    ) {
      return next(
        new AppError("You can only view discussions in your sector", 403)
      );
    }
  } else if (req.user.role === "district_admin") {
    if (discussion.location.district !== req.user.assignedLocation.district) {
      return next(
        new AppError("You can only view discussions in your district", 403)
      );
    }
  }
  

  res.status(200).json({
    status: "success",
    data: {
      discussion,
    },
  });
});
