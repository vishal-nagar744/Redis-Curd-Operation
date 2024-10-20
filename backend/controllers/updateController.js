const { client, publisher } = require('../config/redisClient');

const updateData = async (req, res) => {
	try {
		const { key, value } = req.body;

		// Validate that key and value are provided and are strings
		if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
			return res.status(400).send('Key and value must be provided as strings');
		}

		// Check if the key exists in Redis
		const existingValue = await client.get(key);
		if (!existingValue) {
			return res.status(404).send(`Key '${key}' not found`);
		}

		// Update the key-value pair in Redis
		await client.set(key, value);

		// Create a notification message
		const timestamp = new Date().toISOString();
		const notification = {
			key,
			value,
			timestamp,
			message: `The value for key '${key}' has been updated to '${value}' at ${timestamp}.`,
		};

		// Publish an update notification
		await publisher.publish('data_updates', JSON.stringify(notification));

		// Send a success response
		res.send(`Data updated in Redis with key: ${key}`);
	} catch (err) {
		res.status(500).send(`Error updating data in Redis: ${err.message}`);
	}
};

module.exports = {
	updateData,
};
