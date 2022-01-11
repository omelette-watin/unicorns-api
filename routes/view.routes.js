const express = require("express")
const viewController = require("../controllers/view.controller")

const router = express.Router()

// Retrieving
router.get("/", viewController.getSiteViews)
router.get("/:id", viewController.getViewsByAuthorId)

// Creating
router.post("/", viewController.addViewToSite)
router.post("/:id", viewController.addViewToPost)

module.exports = router
