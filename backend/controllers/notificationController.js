const { getLatestNotification } = require('../config/redisClient');

const getLatestNotificationRoute = (req, res) => {
	const notification = getLatestNotification(); // Get the latest notification

	if (notification) {
		res.send(notification.message); // Send the formatted message
	} else {
		res.status(404).send('No notifications available');
	}
};

module.exports = {
	getLatestNotificationRoute,
};
