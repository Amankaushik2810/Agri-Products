const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String, required: true },
  startingAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 }, // ✅ ADD THIS LINE
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  finalBidAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  completedAt: {
    type: Date,
    default: null
  },
  pdfFile: {
    type: String,
    default: ''
  }
  
});

module.exports = mongoose.model('Land', landSchema);
