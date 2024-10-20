const { client, publisher, clients } = require('../config/redisClient');

const storeData = async (req, res) => {
	try {
		const { key, value } = req.body;

		if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
			return res.status(400).send('Key and value must be provided as strings');
		}

		await client.set(key, value);

		const timestamp = new Date().toISOString();
		const notification = {
			key,
			value,
			timestamp,
			message: `The value for key '${key}' has been updated to '${value}' at ${timestamp}.`,
		};

		await publisher.publish('data_updates', JSON.stringify(notification));

		res.send(`Data stored in Redis with key: ${key}`);
	} catch (err) {
		res.status(500).send(`Error storing data in Redis: ${err.message}`);
	}
};

module.exports = {
	storeData,
};
