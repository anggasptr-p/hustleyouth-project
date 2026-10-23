const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); // Panggil init DB Neon

const gigRoutes = require('./routes/gigRoutes'); // Import routes

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

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend HustleYouth + Neon DB Nyala!' });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
