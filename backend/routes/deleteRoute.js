const express = require('express');
const router = express.Router();
const { deleteData } = require('../controllers/deleteController');

// DELETE /delete route to delete key-value pairs from Redis
router.delete('/delete', deleteData);

module.exports = router;
