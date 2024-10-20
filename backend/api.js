const express = require('express');
const redis = require('redis');

const app = express();
app.use(express.json());

// Create and connect Redis clients
const client = redis.createClient({
	url: 'redis://localhost:6379',
});
const publisher = redis.createClient({
	url: 'redis://localhost:6379',
});
const subscriber = redis.createClient({
	url: 'redis://localhost:6379',
});

// In-memory store for the latest notification
let latestNotification = null;
let clients = []; // Array to hold connected clients for SSE

Promise.all([client.connect(), publisher.connect(), subscriber.connect()])
	.then(() => {
		console.log('Connected to Redis');
	})
	.catch(err => {
		console.error('Redis connection error:', err);
	});

// POST /store route to store key-value pairs in Redis
app.post('/store', async (req, res) => {
	try {
		const { key, value } = req.body;

		// Validate that key and value are provided and are strings
		if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
			return res.status(400).send('Key and value must be provided as strings');
		}

		// Store the key-value pair in Redis
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

		// Update the in-memory store
		latestNotification = notification;

		// Notify all connected clients
		clients.forEach(client => client.res.write(`data: ${JSON.stringify(notification)}\n\n`));

		res.send(`Data stored in Redis with key: ${key}`);
	} catch (err) {
		res.status(500).send(`Error storing data in Redis: ${err.message}`);
	}
});

// GET /datashow route to display all stored data
app.get('/datashow', async (req, res) => {
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
});

// GET /latest-notification route to fetch the latest notification
app.get('/latest-notification', (req, res) => {
	if (latestNotification) {
		res.send(latestNotification.message);
	} else {
		res.status(404).send('No notifications available');
	}
});

// Subscribe to the 'data_updates' channel and handle incoming messages
subscriber.subscribe('data_updates', message => {
	const data = JSON.parse(message);
	latestNotification = data;
	console.log(`Received update notification:`, data.message);

	// Notify all connected SSE clients
	clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
