const express = require("express")

const router = express.Router()

router.post("/sign-up")

router.post("/sign-in")

router.get("/token")

module.exports = router