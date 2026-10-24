const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS gigs (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      category VARCHAR(50) NOT NULL,
      freelancer_name VARCHAR(100) NOT NULL,
      school VARCHAR(100) NOT NULL,
      price INT NOT NULL,
      whatsapp VARCHAR(20) NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      school VARCHAR(100) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id VARCHAR(50) PRIMARY KEY,
      user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
      post_type VARCHAR(20) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      likes_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('Database Neon DB & semua tabel (gigs, users, posts) aman ler! 🚀');
  } catch (err) {
    console.error('Error koneksi Neon DB:', err.message);
  }
};

initDB();

module.exports = pool;
