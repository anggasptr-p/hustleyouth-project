const pool = require('../config/db');
const { randomUUID } = require('crypto');

// 1. GET ALL POSTS (Join dengan tabel Users)
const getPosts = async (req, res) => {
  try {
    const { type } = req.query; // 'hiring' atau 'seeking_job'
    let query = `
      SELECT 
        posts.id, posts.post_type, posts.content, posts.image_url, 
        posts.likes_count, posts.created_at,
        users.name AS author_name, users.school, users.whatsapp
      FROM posts
      JOIN users ON posts.user_id = users.id
    `;
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      query += ` WHERE posts.post_type = $1`;
    }

    query += ' ORDER BY posts.created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json({ status: 'success', data: result.rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 2. CREATE NEW STREAM POST
const createPost = async (req, res) => {
  try {
    const { user_id, post_type, content, image_url } = req.body;

    if (!user_id || !post_type || !content) {
      return res.status(400).json({ status: 'error', message: 'User ID, tipe post, dan isi konten wajib diisi!' });
    }

    const id = `post-${randomUUID().slice(0, 8)}`;
    const query = `
      INSERT INTO posts (id, user_id, post_type, content, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await pool.query(query, [id, user_id, post_type, content, image_url || null]);

    res.status(201).json({
      status: 'success',
      message: 'Postingan Stream berhasil terbit ler!',
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// 3. LIKE POST
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Postingan kagak ketemu ler!' });
    }

    res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { getPosts, createPost, likePost };
