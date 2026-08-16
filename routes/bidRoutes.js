const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getAllMyBids,
  placeBid,
  getWonLandBids
} = require('../controllers/bidController');

// Get all my land and product bids
router.get('/my-bids', protect, getAllMyBids);

// Place a land bid
router.post('/place', protect, placeBid);

// Get completed lands where current user is the winner
router.get('/won-lands', protect, getWonLandBids);

module.exports = router;
