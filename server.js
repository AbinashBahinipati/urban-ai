require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the current directory (for earth.jpg, etc.)
app.use(express.static(__dirname));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve index.html for all other routes (Catch-all)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
