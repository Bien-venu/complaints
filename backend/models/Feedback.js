const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: [
      "health",
      "education",
      "transport",
      "sanitation",
      "security",
      "other",
    ],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
    maxlength: [1000, "Comments cannot exceed 1000 characters"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
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
});

// Indexes for analytics
feedbackSchema.index({ serviceType: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ "location.district": 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
