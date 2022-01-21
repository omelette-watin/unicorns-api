const Comment = require("../models/Comment")
const Post = require("../models/Post")
const { now } = require("mongoose")


exports.countAllComments = async (req, res) => {
  try {

    const count = await Comment.countDocuments()

    return res.status(200).json({
      count
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.getAllCommentsIds = async (req, res) => {
  try {

    const ids = await Comment.find().select({ _id: 1 })

    return res.status(200).json({
      ids
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getAllComments = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Comment.countDocuments()

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: comments
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getCommentsByPostId = async (req, res) => {
  const { id } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skipIndex = (page - 1) * limit

  try {

    const comments = await Comment.find({ postId: id})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Comment.countDocuments({ postId: id })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: comments
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getCommentsByUserId = async (req, res) => {
  const { id } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skipIndex = (page - 1) * limit

  try {

    const comments = await Comment.find({ authorId: id})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Comment.countDocuments({ authorId: id })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: comments
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getCommentById = async (req, res) => {
  const { id } = req.params

  try {

    const comment = await Comment.findById(id)

    if (!comment) return res.status(404).json({
      message: "Ce commentaire n'existe pas"
    })

    return res.status(200).json({
      comment
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.createComment = async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {
    const post = await Post.findOneAndUpdate({ _id: id, isPublished: true }, { $inc: { comments: 1 } })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    const comment = new Comment({
      content,
      createdAt: now(),
      authorId: req.userId,
      authorName: req.username,
      postId: id,
    })

    const savedComment = await comment.save()

    return res.status(200).json({
      message: "Le commentaire a bien été créé",
      id: savedComment._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.updateComment = async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  try {

    const comment = await Comment.findByIdAndUpdate(id, { content, modificationDate: now() })

    if (!comment) return res.status(404).json({
      message: "Ce commentaire n'existe pas"
    })

    return res.status(200).json({
      message: "Le commentaire a bien été modifié",
      id: comment._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.deleteComment = async (req, res) => {
  const { id } = req.params

  try {

    const comment = await Comment.findByIdAndDelete(id)

    if (!comment) return res.status(404).json({
      message: "Ce commentaire n'existe pas"
    })

    await Post.findOneAndUpdate({ _id: comment.postId, isPublished: true}, { $inc: { comments: -1 }})

    return res.status(200).json({
      message: "Ce commentaire a bien été supprimé",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}