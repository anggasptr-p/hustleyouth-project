const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // Panggil init DB Neon

const gigRoutes = require('./routes/gigRoutes'); // Import routes
const authRoutes = require('./routes/authRoutes');
const streamRoutes = require('./routes/streamRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend HustleYouth + Neon DB Nyala!' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
// Routes API Utama
app.use('/api/gigs', gigRoutes);
// Routes Login auth
app.use('/api/auth', authRoutes);
// Routes stream
app.use('/api/posts', streamRoutes)
// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend HustleYouth + Neon DB Nyala!' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
// Tambahin module.exports di baris paling bawah server.js
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
}

module.exports = app;
