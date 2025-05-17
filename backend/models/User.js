const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["super_admin", "district_admin", "sector_admin", "citizen"],
    default: "citizen",
  },
  assignedLocation: {
    province: {
      type: String,
      required: [true, "Please provide your province"],
    },
    district: {
      type: String,
      required: [true, "Please provide your district"],
    },
    sector: {
      type: String,
      required: [true, "Please provide your sector"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Indexes for performance optimization
userSchema.index({ role: 1 });
userSchema.index({ "assignedLocation.district": 1 });
userSchema.index({ "assignedLocation.sector": 1 });

module.exports = mongoose.model("User", userSchema);
