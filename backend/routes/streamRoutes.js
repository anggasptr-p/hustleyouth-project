const express = require('express');
const router = express.Router();
const { getPosts, createPost, likePost } = require('../controllers/streamController');

router.get('/', getPosts);
router.post('/', createPost);
router.patch('/:id/like', likePost);

module.exports = router;
