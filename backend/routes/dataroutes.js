const express = require('express');
const { showData } = require('../controllers/dataController');

const router = express.Router();

router.get('/show', showData);

module.exports = router;
