const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    default: "reader",
  },
  isActive: {
    type: Boolean,
    required: true,
    trim: true,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  favs: [String],
})

// Hash password
userSchema.statics.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Compare password and hashed password
userSchema.statics.comparePassword = async (receivedPassword, hashedPassword) => {
  return await bcrypt.compare(receivedPassword, hashedPassword)
}

// Export User Model
module.exports = mongoose.model("User", userSchema)