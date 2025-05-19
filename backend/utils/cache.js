const apicache = require("apicache");
const cache = apicache.middleware;

module.exports = {
  cache,
  middleware: (duration) => cache(duration),
};
