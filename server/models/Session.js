const mongoose = require('mongoose');

// We define the structure of a single "Choice"
const choiceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  qValue: { type: Number, default: 0 },
  probability: { type: Number, default: 0 }
});

// We define the structure of the entire "Session"
const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  learningRate: { type: Number, required: true, default: 0.5 },
  choices: [choiceSchema], // Array of the choices defined above
  
  // PREPPING FOR PHASE 3 (Analytics Dashboard): 
  // We will eventually store every single rating event here to draw the Learning Curve chart
  historyLog: [{
    choiceId: Number,
    ratingGiven: Number,
    oldQValue: Number,
    newQValue: Number,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Session', sessionSchema);