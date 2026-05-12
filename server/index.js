const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Session = require('./models/Session'); // Import our new Blueprint

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows our server to read JSON data from React

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Backend!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// --- API ROUTES ---

// 1. SAVE or UPDATE a Session (Triggered by "Save Session" in React)
app.post('/api/sessions', async (req, res) => {
  try {
    const { title, learningRate, choices } = req.body;
    
    // Create a new session in the database
    const newSession = new Session({
      title,
      learningRate,
      choices
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("Error saving session:", error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// 2. GET ALL Sessions (Triggered by the History Page in React)
app.get('/api/sessions', async (req, res) => {
  try {
    // Fetches all sessions, sorted by newest first
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});


// Start the engine
app.listen(PORT, () => {
  console.log(`🚀 Server is sprinting on port ${PORT}`);
});