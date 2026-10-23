const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig } = require('../controllers/gigController');

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', createGig);

module.exports = router;
