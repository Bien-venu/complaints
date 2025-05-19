const Queue = require("bull");


const apiQueue = new Queue("api requests", {
  redis: { host: "127.0.0.1", port: 6379 },
});


apiQueue.process(async (job) => {
  
  return processRequest(job.data);
});


app.post("/api/resource", async (req, res) => {
  const job = await apiQueue.add(req.body);
  res.json({ jobId: job.id });
});


app.get("/api/job/:id", async (req, res) => {
  const job = await apiQueue.getJob(req.params.id);
  res.json({ status: await job.getState() });
});
