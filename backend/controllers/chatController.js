const Chat = require('../models/chat');

// In chatController.js
exports.getConversationsForUser = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const conversations = await Chat.aggregate([
      {
        $match: { receiverId: ownerId }
      },
      {
        $group: {
          _id: "$senderId"
        }
      },
      {
        $project: {
          senderId: "$_id",
          _id: 0
        }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChatsBetweenUsers = async (req, res) => {
    const { userId, otherUserId } = req.params;
  
    try {
      const chats = await Chat.find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      }).sort({ timestamp: 1 });
  
      res.json(chats);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ message: 'Failed to get chat messages' });
    }
  };
  