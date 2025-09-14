import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from Purchase!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Purchase API is running!' });
});

export default app;
