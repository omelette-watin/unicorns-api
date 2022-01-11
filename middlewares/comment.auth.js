const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const SECRET_KEY = process.env.SECRET_KEY || "mySecretKey"

exports.canCreatePost = async (req, res, next) => {
  const token = req.headers["x-access-token"]

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    req.userId = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(req.userId)

    if (!(user.isActive === true)) return res.status(401).json({
      message: "Vous n'êtes pas autorisé à écrire un commentaire",
    })

    req.username = user.username

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.canUpdateThisComment = async (req, res, next) => {
  const token = req.headers["x-access-token"]
  const { id } = req.params

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const userId = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(userId)
    const comment = await Comment.findById(id)

    if (!(comment.authorId === userId && user.isActive === true)) return res.status(401).json({
      message: "Vous n'êtes pas autorisé à modifier cette article"
    })

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.canDeleteThisComment = async (req, res, next) => {
  const token = req.headers["x-access-token"]
  const { id } = req.params

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const userId = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(userId)
    const comment = await Comment.findById(id)
    const post = await Post.findById(comment.postId)

    if (!(comment.authorId === userId || user.role === "admin" || post.authorId === userId && user.isActive === true)) return res.status(401).json({
      message: "Vous n'êtes pas autorisé à supprimer cette article"
    })

    next()

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}
