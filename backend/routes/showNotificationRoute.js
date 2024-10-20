const express = require('express');
const {
	getLatestNotificationRoute,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/latest-notification', getLatestNotificationRoute);

module.exports = router;
