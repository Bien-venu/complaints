const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["complaints", "feedback", "engagement", "performance"],
    required: true,
  },
  generatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  filters: {
    timeRange: { start: Date, end: Date },
    location: { province: String, district: String, sector: String },
    status: String,
    escalationLevel: Number,
  },
  data: mongoose.Schema.Types.Mixed, // Stores dynamic report data
  createdAt: { type: Date, default: Date.now },
});

// Indexes for fast querying
reportSchema.index({ type: 1 });
reportSchema.index({
  "filters.timeRange.start": 1,
  "filters.timeRange.end": 1,
});
reportSchema.index({ generatedBy: 1 });

module.exports = mongoose.model("Report", reportSchema);
