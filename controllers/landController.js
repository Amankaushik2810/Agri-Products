const Land = require('../models/Land');

const getMyListings = async (req, res) => {
  try {
    const lands = await Land.find({ createdBy: req.user._id }); // ✅ Corrected field name
    res.status(200).json(lands);
  } catch (err) {
    console.error("Error fetching user's listings:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMyListings,
};
