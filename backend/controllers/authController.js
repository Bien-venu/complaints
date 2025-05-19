const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");
const groupController = require("../controllers/groupController");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs"); 

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role, assignedLocation } = req.body;

  
  const userCount = await User.countDocuments();
  if (
    userCount === 0 &&
    role &&
    ["super_admin", "district_admin", "sector_admin"].includes(role)
  ) {
    
  } else if (role && role !== "citizen") {
    return next(
      new AppError(
        "You can only register as a citizen. Admin roles must be assigned by existing admins.",
        400
      )
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: role || "citizen",
    assignedLocation,
  });
  
  await groupController.autoJoinGroups(newUser);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  
  
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }
  
  
  const hashedInputPassword = await bcrypt.hash(password, 12);

  const isMatchDirectly = await bcrypt.compare("bienvenu1234", user.password);

  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  
  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  
  const currentUser = req.user;

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  
  const userData = {
    id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    assignedLocation: currentUser.assignedLocation,
    createdAt: currentUser.createdAt,
    updatedAt: currentUser.updatedAt,
  };

  res.status(200).json({
    status: "success",
    data: {
      user: userData,
    },
  });
});



exports.protect = catchAsync(async (req, res, next) => {
  
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
