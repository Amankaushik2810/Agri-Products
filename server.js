const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cron = require('node-cron');
const handleEndedAuctions = require('./utils/auctionWinnerHandler');

// Load env
dotenv.config();

// Models
const Chat = require("./models/chat");

// Routes
const authRoutes = require("./routes/authRoutes");
const landRoutes = require("./routes/landRoutes");
const productRoutes = require("./routes/productRoutes");
const bidRoutes = require("./routes/bidRoutes");
const productBidRoutes = require("./routes/productBids");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
<<<<<<< HEAD
  'https://agri-productss.netlify.app',
=======
  'https://agriproductss.netlify.app',
>>>>>>> 1e11b69 (updated Code)
];

// ✅ CORS middleware for Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());

// Static folders
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use('/uploads', express.static(uploadsPath));
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/land", landRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/product-bids", productBidRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use('/api/pdf', pdfRoutes);

// Root
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Cron: check for ended auctions
cron.schedule('* * * * *', async () => {
  await handleEndedAuctions();
});

// ✅ SOCKET.IO AUTH
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Socket authentication failed:", err.message);
    next(new Error("Authentication error"));
  }
});

// ✅ SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  const userId = socket.user.id || socket.user._id;
  console.log(`✅ User connected: ${userId}`);
  socket.join(userId.toString());

  socket.on("send_message", async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = new Chat({ senderId, receiverId, message, timestamp: new Date() });
      await newMessage.save();

      io.to(receiverId.toString()).emit("receive_message", newMessage);
      io.to(senderId.toString()).emit("message_sent", newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`⚠️ User disconnected: ${userId}`);
  });
});

// ✅ DB CONNECTION
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/agri-product", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
});
