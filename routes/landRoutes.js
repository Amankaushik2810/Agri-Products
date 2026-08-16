const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const { getMyListings } = require('../controllers/landController');
const Land = require('../models/Land');
const Bid = require('../models/Bid'); // ⬅️ Make sure this is at the top with other requires


// ✅ POST: List a new land
router.post('/', verifyToken, upload.array('images'), async (req, res) => {
  try {
    const { location, type, startingAmount, startTime, endTime } = req.body;

    const imagePaths = req.files ? req.files.map(file => file.filename) : [];

    const newLand = new Land({
      location,
      type,
      startingAmount,
      startTime: new Date(startTime), // Converts to UTC
      endTime: new Date(endTime),     // Converts to UTC
      images: imagePaths,
      createdBy: req.user._id,
    });

    await newLand.save();
    res.status(201).json({ message: 'Land listed successfully' });
  } catch (error) {
    console.error("Error listing land:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: Fetch ongoing and upcoming auctions
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const lands = await Land.find();

    const ongoing = lands.filter(
      land => new Date(land.startTime) <= now && new Date(land.endTime) >= now
    );

    const upcoming = lands.filter(
      land => new Date(land.startTime) > now
    );

    res.status(200).json({ ongoing, upcoming });
  } catch (err) {
    console.error('Error fetching lands:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: Search lands
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const lands = await Land.find({
      $or: [
        { location: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
      ],
    });

    res.json(lands);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server Error during search" });
  }
});




// ✅ GET: Get listings created by current user
// ✅ Specific routes first
router.get('/my-listings', verifyToken, getMyListings);

router.get('/:id', async (req, res) => {
  try {
    const landId = req.params.id;

    // Check for valid MongoDB ObjectId
    if (!landId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid Land ID format' });
    }

    const land = await Land.findById(landId).populate('createdBy', 'name email');
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    res.status(200).json(land);
  } catch (err) {
    console.error('Error fetching land by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT: Edit a land listing by ID
router.put('/:id', verifyToken, upload.array('images'), async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ message: 'Land not found' });

    if (!land.createdBy || land.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedFields = {
      location: req.body.location,
      type: req.body.type,
      startingAmount: req.body.startingAmount,
      startTime: new Date(req.body.startTime),
      endTime: new Date(req.body.endTime),
    };
    

    if (req.files && req.files.length > 0) {
      updatedFields.images = req.files.map(file => file.filename);
    }

    Object.assign(land, updatedFields);
    await land.save();

    res.status(200).json({ message: 'Land updated successfully' });
  } catch (error) {
    console.error('Error updating land:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// ✅ DELETE: Delete a land by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ message: 'Land not found' });

    if (!land.createdBy || land.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await land.deleteOne();
    res.status(200).json({ message: 'Land deleted successfully' });
  } catch (error) {
    console.error('Error deleting land:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/highest-bid', async (req, res) => {
  try {
    const landId = req.params.id;
    const highestBid = await Bid.findOne({ land: landId }).sort({ amount: -1 });

    if (!highestBid) {
      return res.status(200).json({ highestBid: null });
    }

    res.status(200).json({ highestBid: highestBid.amount });
  } catch (err) {
    console.error('Error fetching highest bid:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-wins', verifyToken, async (req, res) => {
  try {
    const wonLands = await Land.find({ winnerId: req.user._id })  // Use _id for consistency
      .populate('winnerId', 'name email')
      .sort({ completedAt: -1 });

    res.json(wonLands);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching wins' });
  }
});


module.exports = router;
