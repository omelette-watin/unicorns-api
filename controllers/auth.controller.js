const User = require("../models/User")
const jwt = require("jsonwebtoken")
const {now} = require("mongoose")

const SECRET_KEY = process.env.SECRET_KEY || "mySecretKey"

const userExistByEmail = async (email) => {
  return User.findOne({ email: email })
}

const userExistByUsername = async (username) => {
  return User.findOne({ username: username })
}

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body
  const validEmailRegex = new RegExp(/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/)

  try {

    if (!email || !username || !password) return res.status(400).json({
      message: "Veuillez remplir tous les champs",
    })

    if (!validEmailRegex.test(email)) return res.status(400).json({
      message: "L'adresse e-mail est invalide",
    })

    if (await userExistByEmail(email)) return res.status(401).json({
      message: "L'adresse e-mail est déjà utilisée",
    })

    if (await userExistByUsername(username)) return res.status(401).json({
      message: "Le nom d'utilisateur est déjà utilisé",
    })

    const newUser = new User({
      username,
      email,
      role: "reader",
      password: await User.hashPassword(password),
      createdAt: now(),
    })

    const savedUser = await newUser.save()

    const token = jwt.sign({ id: savedUser._id }, SECRET_KEY, { expiresIn: 604800 })

    return res.status(200).json({
      message: `${savedUser.username} a bien été créé`,
      token,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.signIn = async (req, res) => {
  const { username, password } = req.body

  try {

    if (!username || !password) return res.status(400).json({
      message: "Veuillez remplir tous les champs"
    })

    const user = await userExistByUsername(username) || await userExistByEmail(username)

    if (!user) return res.status(401).json({
      message: "Identifiants invalides",
    })

    const passwordIsCorrect = await User.comparePassword(password, user.password)

    if (!passwordIsCorrect) return res.status(401).json({
      message: "Identifiants invalides",
    })

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: 604800 })

    return res.status(200).json({
      message: `${user.username} connecté`,
      token,
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard"
    })

  }
}

exports.me = async (req, res) => {
  const token = req.headers["x-access-token"]

  try {

    if (!token) return res.status(401).json({
      message: "Veuillez fournir un token d'identification"
    })

    const id = jwt.verify(token, SECRET_KEY).id

    const user = await User.findById(id).select({ password: 0})

    if (!user) return res.status(404).json({
      message: "Le token n'est plus valide veuillez vous reconnecter",
    })

    return res.status(200).json({
      user
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard"
    })

  }
}