const mongoose = require("mongoose")

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
  }
})

// Export Report Model
module.exports = mongoose.model("Report", reportSchema)