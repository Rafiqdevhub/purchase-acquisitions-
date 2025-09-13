import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.get("/health", (req, res) => {
  const health = {
    status: "OK",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  };
  res.json(health);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
