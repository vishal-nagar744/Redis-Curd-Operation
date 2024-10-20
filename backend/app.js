require('dotenv').config();
const express = require('express');
const { connectRedisClients } = require('./config/redisClient');
const cors = require('cors'); // Import the cors package
const notificationRoutes = require('./routes/showNotificationRoute');
const storeRoutes = require('./routes/addRoute');
const dataRoutes = require('./routes/dataroutes');
const updateRoutes = require('./routes/updateRoute');
const deleteRoutes = require('./routes/deleteRoute');

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URI, // Replace with your React app's URL
	})
);

// Connect to Redis clients
connectRedisClients();

// Setup routes
app.use('/shownotifications', notificationRoutes);
app.use('/addnotifications', storeRoutes);
app.use('/data', dataRoutes);
app.use('/updatenotifications', updateRoutes);
app.use('/deletenotifications', deleteRoutes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
