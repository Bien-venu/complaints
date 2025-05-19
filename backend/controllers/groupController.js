const User = require("../models/User"); 
const Group = require("../models/Group");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.createGroup = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  
  if (!["district_admin", "sector_admin"].includes(req.user.role)) {
    return next(
      new AppError("Only district or sector admins can create groups", 403)
    );
  }

  
  const group = await Group.create({
    name,
    description,
    location: req.user.assignedLocation,
    createdBy: req.user._id,
    members: [{ user: req.user._id }], 
  });

  
  const locationFilter = {
    "assignedLocation.province": req.user.assignedLocation.province,
    "assignedLocation.district": req.user.assignedLocation.district,
  };

  
  if (req.user.role === "sector_admin") {
    locationFilter["assignedLocation.sector"] = req.user.assignedLocation.sector;
  }

  const users = await User.find(locationFilter);

  
  const newMembers = users
    .filter(user => user._id.toString() !== req.user._id.toString())
    .map(user => ({ user: user._id }));

  if (newMembers.length > 0) {
    group.members.push(...newMembers);
    await group.save();
  }

  
  const populatedGroup = await Group.findById(group._id)
    .populate("members.user", "name email role");

  res.status(201).json({
    status: "success",
    data: {
      group: populatedGroup,
    },
  });
});


exports.joinGroup = catchAsync(async (req, res, next) => {
  let group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  
  const isMember = group.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    return next(new AppError("You are already a member of this group", 400));
  }

  
  const userLocation = req.user.assignedLocation;
  const groupLocation = group.location;

  const locationMatch =
    userLocation.province === groupLocation.province &&
    userLocation.district === groupLocation.district &&
    (req.user.role === "district_admin" ||
      userLocation.sector === groupLocation.sector);

  if (!locationMatch) {
    return next(new AppError("Your location does not match this group", 403));
  }

  
  group.members.push({ user: req.user._id });
  await group.save();

  
  group = await Group.findById(group._id)
    .populate("members.user", "name email role")
    .populate("announcements.postedBy", "name email role");

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});


exports.autoJoinGroups = catchAsync(async (user) => {
  
  const groups = await Group.find({
    "location.province": user.assignedLocation.province,
    "location.district": user.assignedLocation.district,
    ...(user.role === "citizen" && {
      "location.sector": user.assignedLocation.sector,
    }),
  });

  
  for (const group of groups) {
    
    const isMember = group.members.some(member => 
      member.user.toString() === user._id.toString()
    );
    
    if (!isMember) {
      group.members.push({ user: user._id });
      await group.save();
    }
  }

  return groups;
});


exports.syncUserGroups = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId)


  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  
  await Group.updateMany(
    { "members.user": user._id },
    { $pull: { members: { user: user._id } } }
  );
  
  
  const groups = await this.autoJoinGroups(user);

  res.status(200).json({
    status: 'success',
    message: `User has been synced with groups`,
    data: {
      groups
    }
  });
});


exports.getGroupMembers = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId)
    .populate("members.user", "name email role");

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  
  const isMember = group.members.some(
    (member) => member.user._id.toString() === req.user._id.toString()
  );

  if (!isMember && !["district_admin", "sector_admin"].includes(req.user.role)) {
    return next(new AppError("You are not authorized to view this group's members", 403));
  }

  res.status(200).json({
    status: "success",
    results: group.members.length,
    data: {
      members: group.members,
    },
  });
});


exports.postAnnouncement = catchAsync(async (req, res, next) => {
  const { message } = req.body;
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  
  if (group.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Only the group creator can post announcements", 403)
    );
  }

  group.announcements.push({
    message,
    postedBy: req.user._id,
  });

  await group.save();

  res.status(201).json({
    status: "success",
    data: {
      announcement: group.announcements[group.announcements.length - 1],
    },
  });
});


exports.getAnnouncements = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId).populate(
    "announcements.postedBy",
    "name email role"
  );

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  
  const isMember = group.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    return next(new AppError("You are not a member of this group", 403));
  }

  res.status(200).json({
    status: "success",
    results: group.announcements.length,
    data: {
      announcements: group.announcements,
    },
  });
});


exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    "location.province": req.user.assignedLocation.province,
    "location.district": req.user.assignedLocation.district,
    ...(req.user.role === "citizen" && {
      "location.sector": req.user.assignedLocation.sector,
    }),
  });

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
    },
  });
});


exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId)
    .populate("members.user", "name email role")
    .populate("announcements.postedBy", "name email role");

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});


exports.leaveGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return next(new AppError("Group not found", 404));
  }

  
  if (group.createdBy.toString() === req.user._id.toString()) {
    return next(new AppError("Group creator cannot leave the group", 400));
  }

  group.members = group.members.filter(
    (member) => member.user.toString() !== req.user._id.toString()
  );

  await group.save();

  res.status(200).json({
    status: "success",
    data: null,
  });
});
