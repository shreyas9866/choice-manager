const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  qValues: { type: Map, of: Number, default: {} } 
});

const sessionSchema = new mongoose.Schema({
  // NEW: This is the critical line to link a session to a logged-in user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  title: { type: String, required: true },
  learningRate: { type: Number, required: true, default: 0.5 },
  choices: [choiceSchema], 
  
  historyLog: [{
    choiceId: Number,
    ratingGiven: Number,
    oldQValue: Number,
    newQValue: Number,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true }); 

module.exports = mongoose.model('Session', sessionSchema);