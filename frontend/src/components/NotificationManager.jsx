import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../public/css/NotificationManager.css';

function NotificationManager() {
	// State management for Add, Update, Delete, and Show
	const [key, setKey] = useState('');
	const [value, setValue] = useState('');
	const [message, setMessage] = useState('');
	const [notification, setNotification] = useState('');

	// Handle Add Notification
	const handleAdd = async event => {
		event.preventDefault();
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/addnotifications`, { key, value });
			setMessage('Data stored successfully');
			setKey('');
			setValue('');
		} catch (error) {
			console.error('Error storing data:', error);
			setMessage('Error storing data');
		}
	};

	// Handle Update Notification
	const handleUpdate = async event => {
		event.preventDefault();
		try {
			const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/updatenotifications/update`, {
				key,
				value,
			});
			setMessage('Data updated successfully');
			setKey('');
			setValue('');
		} catch (error) {
			console.error('Error updating data:', error.message);
			setMessage('Error updating data');
		}
	};

	// Handle Delete Notification
	const handleDelete = async event => {
		event.preventDefault();
		try {
			const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/deletenotifications/delete`, {
				data: { key },
			});
			setMessage(response.data);
			setKey('');
		} catch (error) {
			console.error('Error deleting data:', error);
			setMessage(`Error deleting data: ${error.message}`);
		}
	};

	// Fetch and show the latest notification
	const fetchLatestNotification = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/shownotifications/latest-notification`
			);
			if (response.data) {
				setNotification(response.data);
			} else {
				setNotification('No notifications available');
			}
		} catch (error) {
			console.error('Error fetching latest notification:', error);
			setNotification('Error fetching notification');
		}
	};

	useEffect(() => {
		// Fetch the latest notification when the component mounts
		fetchLatestNotification();

		// Set up an interval to fetch the latest notification every 5 seconds
		const intervalId = setInterval(fetchLatestNotification, 5000);

		// Cleanup the interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="notification-manager">
			<h1>Notification Manager</h1>
			<form className="form-container">
				<h2>Add or Update Data</h2>
				<input type="text" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} required />
				<input type="text" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} required />
				<div className="button-container">
					<button type="submit" onClick={handleAdd}>
						Add
					</button>
					<button type="button" onClick={handleUpdate}>
						Update
					</button>
				</div>
			</form>
			<div className="delete-container">
				<h2>Delete Data</h2>
				<input type="text" placeholder="Enter key to delete" value={key} onChange={e => setKey(e.target.value)} />
				<button onClick={handleDelete}>Delete</button>
			</div>
			<div className="message-container">{message && <p>{message}</p>}</div>
			<div className="notification-container">
				<h2>Latest Notification</h2>
				<p>{notification}</p>
			</div>
		</div>
	);
}

export default NotificationManager;
