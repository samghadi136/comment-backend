const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Comment = require("./models/Comment");
require("dotenv").config();   // <-- LOAD ENV

const app = express();
app.use(cors());
app.use(express.json());

// CONNECT MONGO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ADD COMMENT
app.post("/comment", async (req, res) => {
  const { text, city, userId } = req.body;

  // allow any language, but block dangerous symbols only
  const regex = /^[^<>$%{}]+$/;

  if (!regex.test(text)) {
    return res.status(400).json({
      error: "Comment contains invalid or unsafe characters"
    });
  }

  const comment = new Comment({ text, city, userId });
  await comment.save();

  res.json(comment);
});

// GET COMMENTS
app.get("/comments", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

// LIKE
app.post("/comment/like/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.likes++;
  await comment.save();
  res.json(comment);
});

// DISLIKE (auto delete after 2)
app.post("/comment/dislike/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.dislikes++;

  if (comment.dislikes >= 2) {
    await Comment.findByIdAndDelete(comment._id);
    return res.json({ deleted: true });
  }

  await comment.save();
  res.json(comment);
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
