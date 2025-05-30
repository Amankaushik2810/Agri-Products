const Bid = require("../models/Bid");
const ProductBid = require("../models/ProductBid");
const Land = require("../models/Land");
const Product = require("../models/product");

// Get only the highest land & product bids by the current user
const getAllMyBids = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get highest land bid per land for this user
    const landBidsRaw = await Bid.aggregate([
      { $match: { userId } },
      { $sort: { bidAmount: -1, timestamp: -1 } },
      {
        $group: {
          _id: "$landId",
          bidAmount: { $first: "$bidAmount" },
          timestamp: { $first: "$timestamp" },
          bidId: { $first: "$_id" },
          landId: { $first: "$landId" },
        },
      },
    ]);

    const populatedLandBids = await Promise.all(
      landBidsRaw.map(async (bid) => {
        const land = await Land.findById(bid.landId);
        return {
          _id: bid.bidId,
          bidAmount: bid.bidAmount,
          timestamp: bid.timestamp,
          landId: land,
        };
      })
    );

    // Get highest product bid per product for this user
    const productBidsRaw = await ProductBid.aggregate([
      { $match: { userId } },
      { $sort: { bidAmount: -1, timestamp: -1 } },
      {
        $group: {
          _id: "$productId",
          bidAmount: { $first: "$bidAmount" },
          timestamp: { $first: "$timestamp" },
          bidId: { $first: "$_id" },
          productId: { $first: "$productId" },
        },
      },
    ]);

    const populatedProductBids = await Promise.all(
      productBidsRaw.map(async (bid) => {
        const product = await Product.findById(bid.productId);
        return {
          _id: bid.bidId,
          bidAmount: bid.bidAmount,
          timestamp: bid.timestamp,
          productId: product,
        };
      })
    );

    res.status(200).json({
      landBids: populatedLandBids,
      productBids: populatedProductBids,
    });

  } catch (err) {
    console.error("Error fetching highest bids:", err);
    res.status(500).json({ message: "Server error while fetching highest bids." });
  }
};

// Place a new bid
const placeBid = async (req, res) => {
  const { landId, bidAmount } = req.body;

  try {
    if (!landId || !bidAmount) {
      return res.status(400).json({ error: 'Land ID and bid amount are required' });
    }

    const land = await Land.findById(landId);
    if (!land) return res.status(404).json({ error: 'Land not found' });

    if (land.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot place a bid on your own land' });
    }

    const bid = new Bid({
      landId,
      userId: req.user._id,
      bidAmount,
    });

    await bid.save();

    if (!land.currentAmount || bidAmount > land.currentAmount) {
      land.currentAmount = bidAmount;
      await land.save();
    }

    res.status(200).json({ message: 'Bid placed successfully', bid });
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get won land bids (completed auctions)
const getWonLandBids = async (req, res) => {
  try {
    const userId = req.user._id;

    const lands = await Land.find({ winnerId: userId, status: 'completed' });

    res.status(200).json(lands);
  } catch (err) {
    console.error("Error fetching won lands:", err);
    res.status(500).json({ error: 'Failed to fetch won lands' });
  }
};

module.exports = {
  getAllMyBids,
  placeBid,
  getWonLandBids,
};
