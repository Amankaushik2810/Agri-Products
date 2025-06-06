const mongoose = require("mongoose");

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" }
});

module.exports = mongoose.model("TokenBlacklist", TokenBlacklistSchema);
