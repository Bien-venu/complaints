const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A discussion must have a title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "A discussion must have a description"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      province: String,
      district: String,
      sector: String,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        isOfficialResponse: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for optimized queries
discussionSchema.index({ status: 1 });
discussionSchema.index({ createdBy: 1 });
discussionSchema.index({ "location.district": 1 });
discussionSchema.index({ "location.sector": 1 });
discussionSchema.index({ tags: 1 });

module.exports = mongoose.model("Discussion", discussionSchema);

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

  // Notify relevant admins via WebSocket
  req.io
    .to(`district-${req.user.assignedLocation.district}`)
    .emit("newDiscussion", discussion);
  req.io
    .to(`sector-${req.user.assignedLocation.sector}`)
    .emit("newDiscussion", discussion);

  res.status(201).json({
    status: "success",
    data: { discussion },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { text, isOfficialResponse } = req.body;
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) return next(new AppError("Discussion not found", 404));

  // Authorization checks
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

  // Real-time notification
  req.io
    .to(`discussion-${discussion._id}`)
    .emit("newComment", { discussionId: discussion._id, comment });

  res.status(200).json({
    status: "success",
    data: { discussion },
  });
});

exports.resolveDiscussion = catchAsync(async (req, res, next) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) return next(new AppError("Discussion not found", 404));

  // Authorization
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
    data: { discussion },
  });
});