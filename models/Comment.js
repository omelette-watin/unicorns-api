const mongoose = require("mongoose")

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  authorId: {
    type: String,
    required: true,
    trim: true,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  postId: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: false,
  }
})

// Export Comment Model
module.exports = mongoose.model("Comment", commentSchema)