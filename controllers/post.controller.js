const Post = require("../models/Post")
const Comment = require("../models/Comment")
const User = require("../models/User")
const { now } = require("mongoose")


exports.countAllPublishedPosts = async (req, res) => {
  try {

    const count = await Post.countDocuments({ isPublished: true })

    return res.status(200).json({
      count
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getAllPublishedPostsIds = async (req, res) => {
  try {

    const ids = await Post.find({ isPublished: true }).select({ _id: 1 })

    return res.status(200).json({
      ids
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getAllPublishedPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const skipIndex = (page - 1) * limit
  const order = req.query.order || "latest"
  const search = req.query.q || ""
  const category = req.query.category || ""
  const views = req.query.views || ""
  const comments = req.query.comments || ""

  try {

    let sort = { createdAt: (order === "latest") ?  - 1 : 1}

    if (views && comments) {
      sort = {
        views: - 1,
        comments: - 1,
        createdAt: (order === "latest") ?  - 1 : 1
      }
    } else if (views && !comments) {
      sort = {
        views: - 1,
        createdAt: (order === "latest") ?  - 1 : 1
      }
    } else if (!views && comments) {
      sort = {
        comments: - 1,
        createdAt: (order === "latest") ?  - 1 : 1
      }
    }
    const posts = await Post.find(
      {
        isPublished: true,
        title: { "$regex": `${search}`, "$options": "i" },
        category: { "$regex": `${category}`, "$options": "i" }
      })
      .sort(sort)
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Post.countDocuments({
      isPublished: true,
      title: { "$regex": `${search}`, "$options" : "i" },
      category: { "$regex": `${category}`, "$options": "i" }
    })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: posts
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getRandomPost = async (req, res) => {
  try {
    const ids = await Post.find({ isPublished: true }).select({ _id: 1 })

    const randomIndex = Math.floor(Math.random() * (ids.length))
    
    const randomId = ids[randomIndex]._id

    const randomPost = await Post.findOne({ _id: randomId, isPublished: true })

    if (!randomPost) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    return res.status(200).json({
      randomPost
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getPublishedPostsByUserId = async (req, res) => {
  const { id } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const posts = await Post.find({ authorId: id, isPublished: true})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Post.countDocuments({ authorId: id, isPublished: true })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: posts
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getSavedPostsByUserId = async (req, res) => {
  const { id } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit
  const order = req.query.order || "latest"

  try {

    const posts = await Post.find({ authorId: id, isPublished: false })
      .sort({ createdAt: (order === "latest") ? -1 : 1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Post.countDocuments({ authorId: id, isPublished: false })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: posts
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getPublishedPostById = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    return res.status(200).json({
      post
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getFavPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const skipIndex = (page - 1) * limit
  const order = req.query.order || "latest"
  const search = req.query.q || ""
  const category = req.query.category || ""

  try {

    const userId = req.userId || "61dd5821f1997a2f9042ccce"

    const user = await User.findById(userId)

    const userFavs = user.favs

    const posts = await Post.find(
      {
        isPublished: true,
        title: { "$regex": `${search}`, "$options": "i" },
        category: { "$regex": `${category}`, "$options": "i" },
        _id: userFavs
      })
      .sort({ createdAt: (order === "latest") ? -1 : 1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await Post.countDocuments({
      isPublished: true,
      title: { "$regex": `${search}`, "$options" : "i" },
      category: { "$regex": `${category}`, "$options": "i" },
      _id: userFavs
    })

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: posts
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.addPostToFavs = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    const userId = req.userId || "61eafecd3e9376a79e562f02"

    const user = await User.findById(userId)

    const userFavs = user.favs.slice()

    userFavs.push(id)

    await User.updateOne({ _id: userId }, { favs: userFavs })

    return res.status(200).json({
      message: "L'article a bien été ajouté aux favoris",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.addPostToFavs = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    const userId = req.userId || "61eafecd3e9376a79e562f02"

    const user = await User.findById(userId)

    const userFavs = user.favs.slice()

    userFavs.push(id)

    await User.updateOne({ _id: userId }, { favs: userFavs })

    return res.status(200).json({
      message: "L'article a bien été ajouté aux favoris",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.removePostFromFavs = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    const userId = req.userId

    const user = await User.findById(userId)

    const userFavs = user.favs.filter(fav => fav !== id)

    await User.updateOne({ _id: userId }, { favs: userFavs })

    return res.status(200).json({
      message: "L'article a bien été enlevé des favoris",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getSavedPostById = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: false })

    if (!post) return res.status(404).json({
      message: "Ce brouillon n'existe pas"
    })

    return res.status(200).json({
      post
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.addPostToFavs = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({message: "Cet article n'existe pas"})

    const userId = req.userId || "61dd5821f1997a2f9042ccce"

    const user = await User.findById(userId)

    const userFavs = user.favs.slice()

    userFavs.push(id)

    await User.updateOne({ _id: userId }, { favs: userFavs })

    return res.status(200).json({
      message: "L'article a bien été ajouté aux favoris",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }

}

exports.removePostFromFavs = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findOne({ _id: id, isPublished: true })

    if (!post) return res.status(404).json({message: "Cet article n'existe pas"})

    const userId = req.userId || "61dd5821f1997a2f9042ccce"

    const user = await User.findById(userId)

    const userFavs = user.favs.filter( fav => fav !== id )

    await User.updateOne({ _id: userId }, { favs: userFavs })

    return res.status(200).json({
      message: "L'article a bien été enlevé des favoris",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }

}

exports.createPost = async (req, res) => {
  const { title, content, category } = req.body

  try {

    const post = new Post({
      title,
      content,
      category: category,
      createdAt: now(),
      authorId: req.userId,
      authorName: req.username
    })

    const savedPost = await post.save()

    return res.status(200).json({
      message: "L'article a bien été créé",
      id: savedPost._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.createAndPublishPost = async (req, res) => {
  const { title, content, category } = req.body

  try {

    const post = new Post({
      title,
      content,
      category: category,
      createdAt: now(),
      authorId: req.userId,
      authorName: req.username,
      isPublished: true,
      publishedAt: now()
    })

    const savedPost = await post.save()

    return res.status(200).json({
      message: "L'article a bien été créé et publié",
      id: savedPost._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.publishPost = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findByIdAndUpdate(id, { isPublished: true, publishedAt: now()} )

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    return res.status(200).json({
      message: "L'article a bien été publié",
      id: post._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.updatePost = async (req, res) => {
  const { id } = req.params
  const { title, content, category } = req.body

  try {

    const post = await Post.findByIdAndUpdate(id, { title, content, category, modificationDate: now() })

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    return res.status(200).json({
      message: "L'article a bien été modifié",
      id: post._id,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.deletePost = async (req, res) => {
  const { id } = req.params

  try {

    const post = await Post.findByIdAndDelete(id)

    if (!post) return res.status(404).json({
      message: "Cet article n'existe pas"
    })

    await Comment.deleteMany({ postId: id })

    return res.status(200).json({
      message: "Cet article a bien été supprimé",
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


