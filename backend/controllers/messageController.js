const Message = require("../models/Message");
const catchAsync = require("../utils/catchAsync");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { receiverId, message } = req.body;

  // Citizens can only message admins
  if (req.user.role === "citizen") {
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.role === "citizen") {
      return next(
        new AppError("Citizens can only message government officials", 403)
      );
    }
  }

  // Admins can only message citizens or lower-level admins
  if (req.user.role === "sector_admin") {
    const receiver = await User.findById(receiverId);
    if (receiver.role === "district_admin" || receiver.role === "super_admin") {
      return next(
        new AppError("You cannot message higher-level officials", 403)
      );
    }
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    message,
  });

  // Real-time notification
  req.io.to(`user-${receiverId}`).emit("newMessage", newMessage);

  res.status(201).json({
    status: "success",
    data: { message: newMessage },
  });
});

exports.getUserMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .sort("-createdAt")
    .populate("sender receiver", "name role");

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: { messages },
  });
});
