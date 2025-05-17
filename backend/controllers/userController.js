const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.assignRole = catchAsync(async (req, res, next) => {
  const { role, assignedLocation } = req.body;
  const userId = req.params.id;

  console.log(req.user);

  // 1) Check if the requesting user has permission to assign this role
  if (req.user.role === "district_admin" && role !== "sector_admin") {
    return next(new AppError("You can only assign sector admin roles", 403));
  }

  if (
    req.user.role === "super_admin" &&
    !["district_admin", "sector_admin"].includes(role)
  ) {
    return next(
      new AppError("You can only assign district or sector admin roles", 403)
    );
  }

  // 2) Check if the assigned location is under the admin's jurisdiction
  if (
    req.user.role === "district_admin" &&
    assignedLocation.district !== req.user.assignedLocation.district
  ) {
    return next(
      new AppError("You can only assign admins within your district", 403)
    );
  }

  if (
    req.user.role === "super_admin" &&
    assignedLocation.province !== req.user.assignedLocation.province
  ) {
    return next(
      new AppError("You can only assign admins within your province", 403)
    );
  }

  // 3) Update user role and location
  const user = await User.findByIdAndUpdate(
    userId,
    {
      role,
      assignedLocation,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});
