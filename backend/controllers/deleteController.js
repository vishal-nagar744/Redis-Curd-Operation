const { client, publisher } = require('../config/redisClient');

const deleteData = async (req, res) => {
	try {
		const { key } = req.body;

		// Validate that key is provided and is a string
		if (!key || typeof key !== 'string') {
			return res.status(400).send('Key must be provided as a string');
		}

		// Check if the key exists in Redis
		const existingValue = await client.get(key);
		if (!existingValue) {
			return res.status(404).send(`Key '${key}' not found`);
		}

		// Delete the key-value pair from Redis
		await client.del(key);

		// Create a notification message
		const timestamp = new Date().toISOString();
		const notification = {
			key,
			timestamp,
			message: `The key '${key}' has been deleted at ${timestamp}.`,
		};

		// Publish a delete notification
		await publisher.publish('data_updates', JSON.stringify(notification));

		// Send a success response
		res.send(`Data deleted from Redis with key: ${key}`);
	} catch (err) {
		res.status(500).send(`Error deleting data from Redis: ${err.message}`);
	}
};

module.exports = {
	deleteData,
};
