const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String }, // optional
  description: { type: String },
  startingAmount: { type: Number, required: true },
  
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  duration: { type: Number },
  
  // Add currentAmount to track the highest bid placed
  currentAmount: { type: Number, default: 0 },  // Initially 0, to be updated with bids
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;