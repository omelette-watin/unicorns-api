const express = require("express")
const cors = require("cors")
const mongoose = require("./config/database")
const pkg = require("./package.json")

const authRoutes = require("./routes/auth.routes")

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