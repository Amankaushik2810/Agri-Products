const Land = require('../models/Land');
const Bid = require('../models/Bid');
const User = require('../models/User');
const generateWinnerPDF = require('./pdfGenerator'); // Keep the name as per your file
const path = require('path');

const handleEndedAuctions = async () => {
  try {
    const endedAuctions = await Land.find({
      endTime: { $lte: new Date() },
      status: 'ongoing'
    });

    for (let auction of endedAuctions) {
      const highestBid = await Bid.find({ landId: auction._id })
        .sort({ bidAmount: -1 })
        .limit(1)
        .populate('userId');

      if (highestBid.length > 0) {
        const winner = highestBid[0];

        // ✅ Await the PDF generation
        const fileName = await generateWinnerPDF(winner.userId, {
          _id: auction._id,
          landId: auction.landId || auction._id,
          title: auction.title,
          finalBidAmount: winner.bidAmount
        });

        // ✅ Update land status & save PDF file name
        await Land.findByIdAndUpdate(auction._id, {
          status: 'completed',
          winnerId: winner.userId._id,
          finalBidAmount: winner.bidAmount,
          completedAt: new Date(),
          pdfFile: fileName
        });

        console.log(`✅ Auction ${auction._id} completed. Winner: ${winner.userId.name}`);
      } else {
        // ❌ No bids, just complete the auction
        await Land.findByIdAndUpdate(auction._id, {
          status: 'completed',
          finalBidAmount: 0,
          completedAt: new Date()
        });

        console.log(`⚠️ Auction ${auction._id} completed with no bids.`);
      }
    }
  } catch (err) {
    console.error('❌ Error handling ended auctions:', err.message);
  }
};

module.exports = handleEndedAuctions;
