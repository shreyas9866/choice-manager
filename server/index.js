const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Route & Middleware Imports
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware'); 
const Session = require('./models/Session'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Backend!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// --- PUBLIC API ROUTES ---
// Mount the auth routes. Anyone can access these to sign up or log in.
app.use('/api/auth', authRoutes);


// --- PROTECTED API ROUTES ---
// Notice the 'authMiddleware' injected into the middle of these routes. 
// It checks the token and adds 'req.user' (the user's ID) to the request!

// 1. SAVE or UPDATE a Session 
app.post('/api/sessions', authMiddleware, async (req, res) => {
  try {
    const { title, learningRate, choices } = req.body;
    
    const newSession = new Session({
      user: req.user, // <-- IMPORTANT: We tether the session to the logged-in user!
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

// 2. GET ALL Sessions for the LOGGED IN USER
app.get('/api/sessions', authMiddleware, async (req, res) => {
  try {
    // Only fetch sessions where the 'user' field matches the logged-in user's ID
    const sessions = await Session.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// 3. DELETE a Single Session
app.delete('/api/sessions/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure the user deleting the session actually owns it!
    const deletedSession = await Session.findOneAndDelete({ _id: id, user: req.user });
    
    if (!deletedSession) {
      return res.status(404).json({ error: "Session not found or you don't have permission to delete it." });
    }

    res.status(200).json({ message: '✅ Session deleted successfully' });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// 4. DELETE ALL Sessions for the LOGGED IN USER
app.delete('/api/sessions', authMiddleware, async (req, res) => {
  try {
    // Only delete sessions belonging to this specific user
    await Session.deleteMany({ user: req.user }); 
    res.status(200).json({ message: '✅ Your history has been cleared' });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Start the engine
app.listen(PORT, () => {
  console.log(`🚀 Server is sprinting on port ${PORT}`);
});