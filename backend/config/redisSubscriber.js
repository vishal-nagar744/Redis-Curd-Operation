const { subscriber, clients } = require('./client');

subscriber.subscribe('data_updates', message => {
	const data = JSON.parse(message);
	console.log(`Received update notification:`, data.message);

	// Notify all connected clients
	clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
});

module.exports = subscriber;
