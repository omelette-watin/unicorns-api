const mongoose = require("mongoose")
const { now } = require("mongoose")

// Report schema for development
const reportSchema  = new mongoose.Schema({
  grade: {
    type: Number,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: false,
    trim: true,
  },
  publicationDate: {
    type: Date,
    required: true,
    default: now(),
  }
})

// Export Report model
module.exports = mongoose.model("Report", reportSchema)