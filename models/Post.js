const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  cloudinaryId: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    required: true,
    default: [],
  },
  location: {
    type: String,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
