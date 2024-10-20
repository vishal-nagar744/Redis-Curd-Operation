const express = require('express');
const router = express.Router();
const { updateData } = require('../controllers/updateController');

// PUT /update route to update key-value pairs in Redis
router.put('/update', updateData);

module.exports = router;
