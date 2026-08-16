// productBids.js
const express = require('express');
const router = express.Router();
const ProductBid = require('../models/ProductBid');
const Product = require('../models/product');
const verifyToken = require('../middleware/authMiddleware'); // Correct middleware import

// Route to place a bid for a product
router.post('/place', verifyToken, async (req, res) => {
  try {
    const { productId, bidAmount } = req.body;
    const userId = req.user?._id; // Safely access user ID

    if (!productId || !bidAmount) {
      return res.status(400).json({ error: "Product ID and bid amount are required" });
    }

    if (isNaN(bidAmount)) {
      return res.status(400).json({ error: "Bid amount must be a valid number" });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get the current highest bid (either currentAmount or startingAmount)
    const currentAmount = product.currentAmount || product.startingAmount;

    // Check if the new bid is higher than the current bid
    if (parseFloat(bidAmount) <= parseFloat(currentAmount)) {
      return res.status(400).json({ error: "Bid must be higher than the current amount" });
    }

    // Create a new bid entry
    const bid = new ProductBid({
      productId: productId,
      userId: userId,
      bidAmount: parseFloat(bidAmount),
      timestamp: new Date(),
    });

    // Save the bid to the database
    await bid.save();

    // Update the product with the new highest bid
    product.currentAmount = parseFloat(bidAmount);
    await product.save();

    // Return a success message and the updated product
    return res.status(200).json({
      message: "Bid placed successfully",
      currentAmount: product.currentAmount,
      bidId: bid._id,
    });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ error: "Something went wrong while placing the bid" });
  }
});

module.exports = router;
