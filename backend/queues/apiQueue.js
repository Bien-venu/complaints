const Queue = require("bull");

const apiQueue = new Queue("api requests", {
  redis: { host: "127.0.0.1", port: 6379 },
});

apiQueue.process();

module.exports = apiQueue;
