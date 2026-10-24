const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'hustleyouth_super_secret_key_123';

// 1. REGISTER USER
const register = async (req, res) => {
  try {
    const { name, school, whatsapp, email, password } = req.body;

    if (!name || !school || !whatsapp || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Semua kolom wajib diisi ler!' });
    }

    // Format WA
    let formattedWa = whatsapp.trim();
    if (formattedWa.startsWith('0')) {
      formattedWa = '62' + formattedWa.slice(1);
    }

    // Cek email/WA udah terdaftar belum
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1 OR whatsapp = $2', [email, formattedWa]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email atau No WA udah terdaftar bro!' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `user-${randomUUID().slice(0, 8)}`;

    const newUser = await pool.query(
      'INSERT INTO users (id, name, school, whatsapp, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, school, whatsapp, email',
      [id, name, school, formattedWa, email, hashedPassword]
    );

    // Generate Token JWT
    const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil ler!',
      token,
      user: newUser.rows[0]
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email & password wajib diisi!' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Email atau password salah ler!' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Email atau password salah ler!' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      status: 'success',
      message: 'Login sukses bro!',
      token,
      user: {
        id: user.id,
        name: user.name,
        school: user.school,
        whatsapp: user.whatsapp,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { register, login };
