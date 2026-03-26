require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the current directory (for earth.jpg, etc.)
app.use(express.static(__dirname));

// Initialize Gemini (Handle missing key gracefully)
const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// GEMINI CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!genAI) {
      return res.json({ reply: "I'm in 'Offline Mode' right now because your GEMINI_API_KEY is not configured in the .env file. Please add it to start chatting!" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    const result = await model.generateContent(
      `You are an AI assistant for Urban Heat Island (UHI) analysis. Answer clearly:\n${userMessage}`
    );

    const response = await result.response;
    const reply = response.text();

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      reply: "Error from Gemini. Please check your API key and connection."
    });
  }
});

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
    .catch(err => {
      console.warn('⚠️  MONGODB_URI failed. Starting server in development mode (Chatbot functionality may require Gemini).');
    });

// Start Server
app.listen(port, () => {
    console.log(`✅ Gemini server running on http://localhost:${port}`);
});
