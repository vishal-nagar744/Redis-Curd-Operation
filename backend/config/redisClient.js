const redis = require('redis');

const client = redis.createClient({ url: process.env.REDIS_URL });
const publisher = redis.createClient({ url: process.env.REDIS_URL });
const subscriber = redis.createClient({ url: process.env.REDIS_URL });

let latestNotification = null;

const connectRedisClients = async () => {
	try {
		await Promise.all([client.connect(), publisher.connect(), subscriber.connect()]);
		console.log('Connected to Redis');

		// Subscribe to 'data_updates' and handle incoming messages
		subscriber.subscribe('data_updates', message => {
			const data = JSON.parse(message);
			latestNotification = data; // Update the global variable
			console.log(`Received update notification: ${data.message}`);
		});
	} catch (err) {
		console.error('Redis connection error:', err);
	}
};

module.exports = {
	client,
	publisher,
	subscriber,
	connectRedisClients,
	getLatestNotification: () => latestNotification, // Export a function to get the latest notification
};
