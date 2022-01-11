const mongoose = require("mongoose")

// Post Schema
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  category: [String],
  isPublished: {
    type: Boolean,
    required: true,
    default: false,
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
  createdAt: {
    type: Date,
    required: true,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: false,
  },
  modifiedAt: {
    type: Date,
    required: false,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  }
})

// Export Post Model
module.exports = mongoose.model("Post", postSchema)