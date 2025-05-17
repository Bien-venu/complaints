const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for your complaint"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description for your complaint"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "escalated"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Complaint must belong to a user"],
    },
    sectorAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    districtAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    escalationLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    location: {
      province: String,
      district: String,
      sector: String,
    },
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

// Indexes for performance optimization
complaintSchema.index({ status: 1 });
complaintSchema.index({ user: 1 });
complaintSchema.index({ sectorAdmin: 1 });
complaintSchema.index({ districtAdmin: 1 });
complaintSchema.index({ "location.sector": 1 });
complaintSchema.index({ "location.district": 1 });
complaintSchema.index({ createdAt: -1 });

// Populate user data when querying complaints
complaintSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email role",
  })
    .populate({
      path: "sectorAdmin",
      select: "name email",
    })
    .populate({
      path: "districtAdmin",
      select: "name email",
    });
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
