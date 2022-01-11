const express = require("express")
const cors = require("cors")
const mongoose = require("./config/database")
const pkg = require("./package.json")

const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const postRoutes = require("./routes/post.routes")
const commentRoutes = require("./routes/comment.routes")
const viewRoutes = require("./routes/view.routes")

const port = process.env.PORT || 8080

const server = express()

// DB Settings
mongoose.connection.on("error", e => {
  console.log(e)
})

// Settings
server.set("pkg", pkg)


// Middlewares
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors({
  origin: "*",
}))

// Routes
server.use("/auth", authRoutes)
server.use("/users", userRoutes)
server.use("/posts", postRoutes)
server.use("/comments", commentRoutes)
server.use("/views", viewRoutes)

server.get("/", (req, res) => {

  return res.status(200).json({
    name: server.get("pkg").name,
    version: server.get("pkg").version,
    authors: server.get("pkg").author,
    description: server.get("pkg").description,
  })

})


server.listen(port, (err) => {
  if (err) throw err
  console.log(`Listening on port : ${port}...`)
})