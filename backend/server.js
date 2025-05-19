const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const catchAsync = require("./utils/catchAsync");


require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const groupRoutes = require("./routes/groupRoutes"); 


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});


io.on("connection", (socket) => {
  console.log("New client connected");

  
  socket.on("joinRoom", ({ userId, role }) => {
    if (role === "citizen") {
      socket.join(`user-${userId}`);
      socket.join(`citizens`);
    } else if (role === "sector_admin") {
      socket.join(`sector-${userId}`);
      socket.join(`sector-admins`);
    } else if (role === "district_admin") {
      socket.join(`district-${userId}`);
      socket.join(`district-admins`);
    } else if (role === "super_admin") {
      socket.join(`super-admins`);
    }
    console.log(`User ${userId} joined room for ${role}`);
  });

  
  socket.on("joinGroupRoom", (groupId) => {
    socket.join(`group-${groupId}`);
    console.log(`User joined group room ${groupId}`);
  });

  socket.on("newGroupAnnouncement", (data) => {
    io.to(`group-${data.groupId}`).emit("groupAnnouncement", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(mongoSanitize());
app.use(xss());
app.use(hpp());


const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/groups", groupRoutes); 

app.set("io", io);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err.stack);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.use((err, req, res, next) => {
  
  const groupErrors = [
    "Group not found",
    "You are not a member of this group",
    "Only the group creator can perform this action",
    "Group creator cannot leave the group",
  ];

  if (groupErrors.includes(err.message)) {
    err.statusCode = err.statusCode || 403;
  }

  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}...`
  );
});


process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});


process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
