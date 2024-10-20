const { client } = require('../config/redisClient');

// GET /datashow route to display all stored data
const showData = async (req, res) => {
	try {
		const keys = await client.keys('*'); // Fetch all keys from Redis

		if (keys.length === 0) {
			return res.status(404).send('No data found');
		}

		// Fetch values for all keys
		const values = await Promise.all(keys.map(key => client.get(key)));
		const result = keys.map((key, index) => ({ key, value: values[index] }));

		res.send(result);
	} catch (err) {
		res.status(500).send(`Error retrieving all data from Redis: ${err.message}`);
	}
};

module.exports = {
	showData,
};
