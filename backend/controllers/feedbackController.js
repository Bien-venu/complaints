const Feedback = require("../models/Feedback");
const catchAsync = require("../utils/catchAsync");

exports.submitFeedback = catchAsync(async (req, res, next) => {
  const { serviceType, rating, comments } = req.body;

  const feedback = await Feedback.create({
    serviceType,
    rating,
    comments,
    user: req.user._id,
    location: req.user.assignedLocation,
  });

  res.status(201).json({
    status: "success",
    data: { feedback },
  });
});

exports.getFeedbackAnalytics = catchAsync(async (req, res, next) => {
  
  const filter = {};
  if (req.user.role === "district_admin") {
    filter["location.district"] = req.user.assignedLocation.district;
  }

  const analytics = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$serviceType",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
        latestComments: {
          $push: { $cond: [{ $ne: ["$comments", ""] }, "$comments", null] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        serviceType: "$_id",
        averageRating: 1,
        count: 1,
        latestComments: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { analytics },
  });
});
