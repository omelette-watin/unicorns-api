const Post = require("../models/Post")
const View = require("../models/View")
const { now } = require("mongoose")

const SECRET_ORIGIN_KEY = process.env.SECRET_ORIGIN_KEY || "originSecretKey"

exports.getSiteViews = async (req, res) => {
  const { month, year } = req.query

  try {
    const sort = (month && year) ? {
      createdAt: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      }
    } : null

    const views = await View.countDocuments(sort)

    return res.status(200).json({
      views,
    })

  } catch (e) {

    return res.status(500).json({
      message:
        e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getViewsByAuthorId = async (req, res) => {
  const { id } = req.params
  const { month, year } = req.query

  try {
    const sort = (month && year) ? {
      postAuthorId: id,
      createdAt: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      }
    } : { postAuthorId: id }

    const views = await View.countDocuments(sort)

    return res.status(200).json({
      views,
    })

  } catch (e) {

    return res.status(500).json({
      message:
        e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.addViewToSite = async (req, res) => {
  const origin = req.headers["origin-secret-validator"]

  try {

    if (origin !== SECRET_ORIGIN_KEY)
      return res.status(401).json({
        message: "Vous ne pouvez pas ajouter de vues manuellement",
      })

    const view = await new View({
      createdAt: now(),
    })

    await view.save()

    return res.status(200).json({
      message: "La vue a bien été prise en compte",
    })

  } catch (e) {

    return res.status(500).json({
      message:
        e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.addViewToPost = async (req, res) => {
  const origin = req.headers["origin-secret-validator"]
  const { id } = req.params

  try {

    if (origin !== SECRET_ORIGIN_KEY)
      return res.status(401).json({
        message: "Vous ne pouvez pas ajouter de vues manuellement",
      })

    const post = await Post.findOneAndUpdate(
      { _id: id, isPublished: true },
      { $inc: { views: 1 } }
    )

    if (!post)
      return res.status(404).json({
        message: "Cet article n'existe pas",
      })

    const view = await new View({
      postId: id,
      postAuthorId: post.authorId,
      createdAt: now(),
    })

    await view.save()

    return res.status(200).json({
      message: "La vue a bien été prise en compte",
    })

  } catch (e) {

    return res.status(500).json({
      message:
        e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}
