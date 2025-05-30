// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const { getConversationsForUser } = require('../controllers/chatController');

// Get all conversations for a user (owner)
router.get('/conversations/:ownerId', getConversationsForUser);

// Get all messages between two users
router.get('/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Missing sender or receiver ID" });
  }

  try {
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

module.exports = router;
