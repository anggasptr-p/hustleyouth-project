const pool = require('../config/db');
const { randomUUID } = require('crypto');

// 1. GET ALL GIGS (Support Query Filter Kategori & Search)
const getGigs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM gigs WHERE 1=1';
    const params = [];

    if (category && category !== 'Semua') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (LOWER(title) LIKE LOWER($${params.length}) OR LOWER(description) LIKE LOWER($${params.length}))`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. GET GIG BY ID
const getGigById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM gigs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Jasa kaga ketemu ler!' });
    }

    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. CREATE NEW GIG
const createGig = async (req, res) => {
  try {
    const { title, category, freelancer_name, school, price, whatsapp, description, image_url } = req.body;

    // Validasi inputan wajib
    if (!title || !category || !freelancer_name || !school || !price || !whatsapp || !description) {
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi bro!' });
    }

    // Auto-format WhatsApp (Ubah 08xx jadi 628xx)
    let formattedWa = whatsapp.trim();
    if (formattedWa.startsWith('0')) {
      formattedWa = '62' + formattedWa.slice(1);
    }

    const id = `gig-${randomUUID().slice(0, 8)}`;
    const query = `
      INSERT INTO gigs (id, title, category, freelancer_name, school, price, whatsapp, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      id, title, category, freelancer_name, school, 
      parseInt(price), formattedWa, description, image_url || null
    ];

    const result = await pool.query(query, values);
    res.status(201).json({
      status: 'success',
      message: 'Jasa berhasil dipublish, mantap ler!',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getGigs, getGigById, createGig };
