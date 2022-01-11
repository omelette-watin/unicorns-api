const jwt = require("jsonwebtoken")
const User = require("../models/User")

const SECRET_KEY = process.env.SECRET_KEY || "mySecretKey"

exports.canChangeRights = async (req, res, next) => {
  const token = req.headers["x-access-token"]
  const { id } = req.params

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const userId = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(userId)

    const toBeModifiedUser = await User.findById(id)

    if (user.role !== "admin" && toBeModifiedUser.role === "admin") return res.status(401).json({
      message: "Vous n'êtes pas autorisé à effectuer cette modification",
    })

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.canUpdateThisUser = async (req, res, next) => {
  const token = req.headers["x-access-token"]
  const { id } = req.params

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const userId = jwt.verify(token, SECRET_KEY).id

    if (id !== userId) return res.status(401).json({
      message: "Vous n'êtes pas autorisé à effectuer cette modification"
    })

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.canDeleteThisUser = async (req, res, next) => {
  const token = req.headers["x-access-token"]
  const { id } = req.params

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const userId = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(userId)

    const toBeDeletedUser = await User.findById(id)

    if (!(id === userId || (user.role === "admin" && toBeDeletedUser.role !== "adming"))) return res.status(401).json({
      message: "Vous n'êtes pas autorisé à effectuer cette modification"
    })

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}