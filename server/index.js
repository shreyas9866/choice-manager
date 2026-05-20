const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

// Route & Middleware Imports
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware'); 
const Session = require('./models/Session'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*", // This allows requests from anywhere (like your future Vercel URL)
  credentials: true
}));
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
    // THE FIX: We added 'historyLog' here so it actually grabs the chart data!
    const { title, learningRate, choices, historyLog } = req.body;
    
    const newSession = new Session({
      user: req.user, 
      title,
      learningRate,
      choices,
      historyLog // THE FIX: Tell MongoDB to save the chart!
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
// ==========================================
// GLOBAL ANALYTICS ROUTE
// ==========================================
app.get('/api/analytics/global', async (req, res) => {
  try {
    const allSessions = await Session.find();
    
    // We will group data like this: { "Sunny": { "pizza": [6.5, 7.0], "ramen": [5.0] } }
    const contextData = {};

    allSessions.forEach(session => {
      session.choices.forEach(choice => {
        // Normalize names so "Pizza" and "pizza" are grouped together
        const name = choice.name.toLowerCase().trim();
        
        for (const [ctx, qVal] of Object.entries(choice.qValues)) {
          if (!contextData[ctx]) contextData[ctx] = {};
          if (!contextData[ctx][name]) contextData[ctx][name] = [];
          contextData[ctx][name].push(qVal);
        }
      });
    });

    // Average the arrays and format for Recharts
    const chartData = Object.keys(contextData).map(ctx => {
      const dataPoint = { context: ctx };
      for (const [name, values] of Object.entries(contextData[ctx])) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        dataPoint[name] = parseFloat(avg.toFixed(2));
      }
      return dataPoint;
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching global analytics:", error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
// ==========================================
// RAZORPAY PAYMENT ROUTES
// ==========================================

// Initialize the Razorpay engine
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new payment order
app.post('/api/razorpay/order', authMiddleware, async (req, res) => {
  try {
    // NEW: Grab the dynamic amount from the frontend request!
    const { amount } = req.body; 
    
    // Razorpay needs the amount in paise (cents), so multiply by 100
    const amountInPaise = amount * 100; 

    const options = {
      amount: amountInPaise, 
      currency: 'INR',
      receipt: `receipt_${Date.now()}`, 
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});
// Verify the payment signature
app.post('/api/razorpay/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create the expected signature using our secret key
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Compare what Razorpay sent us with what we mathematically expect
    if (razorpay_signature === expectedSign) {
      // It's a match! The payment is 100% legit.
      // (If we had a Premium User database, we would update their status here)
      return res.status(200).json({ message: "Payment verified successfully!" });
    } else {
      // Someone is trying to hack the payment system!
      return res.status(400).json({ error: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Start the engine
app.listen(PORT, () => {
  console.log(`🚀 Server is sprinting on port ${PORT}`);
});