const mongoose = require('mongoose');

const choiceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  qValues: { type: mongoose.Schema.Types.Mixed, default: {} } 
});

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  learningRate: { type: Number, required: true, default: 0.5 },
  choices: [choiceSchema], 
  
  // THE ULTIMATE FIX: This explicitly tells MongoDB to accept ANY data structure inside the array
  historyLog: [mongoose.Schema.Types.Mixed]

}, { timestamps: true }); 

module.exports = mongoose.model('Session', sessionSchema);