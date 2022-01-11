const express = require("express")
const postController = require("../controllers/post.controller")

const router = express.Router()

// Counting
router.get("/count", postController.countAllPublishedPosts)

// Retrieving
router.get("/", postController.getAllPublishedPosts)
router.get("/ids", postController.getAllPublishedPostsIds)
router.get("/:id", postController.getPublishedPostById)
router.get("/user/:id", postController.getPublishedPostsByUserId)
router.get("/user/saved/:id", postController.getSavedPostsByUserId)

// Creating
router.post("/", postController.createPost)
router.post("/publish", postController.createAndPublishPost)

// Updating
router.put("/publish/:id", postController.publishPost)
router.put("/:id", postController.updatePost)
router.put("/view/:id", postController.addView)

// Deleting
router.delete("/:id", postController.deletePost)

module.exports = router