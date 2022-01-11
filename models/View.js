const mongoose = require("mongoose")

// View Schema
const viewSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
  }
})

// Export View Model
module.exports = mongoose.model("View", viewSchema)