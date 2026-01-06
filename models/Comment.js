const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: String,
  text: String,
  city: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
