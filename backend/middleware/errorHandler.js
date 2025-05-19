module.exports = (err, req, res, next) => {
  if (err.status === 429) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: err.message || "Please slow down your requests",
      retryAfter: req.rateLimit?.resetTime,
    });
  }
  next(err);
};
