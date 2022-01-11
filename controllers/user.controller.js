const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

const userExistByEmail = async (email) => {
  return User.findOne({ email: email })
}

const userExistByUsername = async (username) => {
  return User.findOne({ username: username })
}


exports.countAllUsers = async (req, res) => {
  try {

    const count = await User.countDocuments({})

    return res.status(200).json({
      count
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.countAuthors = async (req, res) => {
  try {

    const count = await User.countDocuments({ role: "author" })

    return res.status(200).json({
      count
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.countAdmins = async (req, res) => {
  try {

    const count = await User.countDocuments({ role: "admin" })

    return res.status(200).json({
      count
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const users = await User.find()
      .select({ password : 0, email: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await User.countDocuments()

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: users
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getReaders = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const users = await User.find({ role: "reader" })
      .select({ password : 0, email: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await User.countDocuments()

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: users
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getAuthors = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const users = await User.find({ role: "author" })
      .select({ password : 0, email: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await User.countDocuments()

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: users
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getAdmins = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skipIndex = (page - 1) * limit

  try {

    const users = await User.find({ role: "admins" })
      .select({ password : 0, email: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)

    const totalCount = await User.countDocuments()

    return res.status(200).json({
      meta: {
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit
      },
      result: users
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.getUserById = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findById(id)
      .select({ password: 0, email: 0})

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json(
      user
    )

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.searchUser = async (req, res) => {
  const { username } = req.query

  try {

    const usernameRegExp = new RegExp("^" + username)

    const users = await User.find({ "username" : { $regex: usernameRegExp, $options: "i" } })
      .select({ password: 0, email: 0 })
      .sort({ createdAt: -1})
      .limit(10)

    const totalCount = await User.countDocuments({ "username" : { $regex: usernameRegExp, $options: "i" } })

    return res.status(200).json({
      meta: {
        totalCount
      },
      result: users
    })


  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.updateUser = async (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body
  const validEmailRegex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)


  try {
    const userToBeUpdated = await User.findById(id)

    if (!userToBeUpdated) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    if (!validEmailRegex.test(email)) return res.status(400).json({
      message: "Cette adresse e-mail est invalide",
    })

    if (await userExistByEmail(email) && userToBeUpdated.email !== email) return res.status(401).json({
      message: "Cette adresse e-mail est déjà utilisée"
    })

    if (await userExistByUsername(username) && userToBeUpdated.username !== username) return res.status(401).json({
      message: "Ce nom d'utilisateur est déjà utilisé"
    })

    const user = await User.findByIdAndUpdate(id, {
      username: username,
      email: email,
      password: await User.hashPassword(password),
    })

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json({
      message: `Le compte de ${username} a bien été modifié`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.promoteUserToAuthor = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findByIdAndUpdate(id, { role: "author" })

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json({
      message: `${user.username} a bien été promu auteur`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.promoteUserToAdmin = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findByIdAndUpdate(id, { role: "admin" })

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json({
      message: `${user.username} a bien été promu administrateur`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}


exports.deactivateUser = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findByIdAndUpdate(id, { isActive: false })

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json({
      message: `Le compte de ${user.username} a bien été désactivé`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.activateUser = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findByIdAndUpdate(id, { isActive: true })

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    return res.status(200).json({
      message: `Le compte de ${user.username} a bien été ré-activé`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params

  try {

    const user = await User.findOneAndDelete(id)

    if (!user) return res.status(404).json({
      message: "Cet id ne correspond à aucun utilisateur",
    })

    await Comment.deleteMany({ authorId: id })
    await Post.deleteMany({ authorId: id })

    return res.status(200).json({
      message: `Le compte de ${user.username} a bien été supprimé`,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}
