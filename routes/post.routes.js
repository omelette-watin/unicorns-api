const express = require("express")
const postController = require("../controllers/post.controller")
const auth = require("../middlewares/post.auth")

const router = express.Router()
router.get("/favs", postController.getFavPosts)

// Counting
router.get("/count", postController.countAllPublishedPosts)

// Retrieving
router.get("/", postController.getAllPublishedPosts)
router.get("/ids", postController.getAllPublishedPostsIds)
router.get("/random", postController.getRandomPost)
router.get("/:id", postController.getPublishedPostById)
router.get("/saved/:id", auth.canUpdateThisPost, postController.getSavedPostById)
router.get("/user/:id", postController.getPublishedPostsByUserId)
router.get("/user/saved/:id", auth.canSeeTheirSavedPosts, postController.getSavedPostsByUserId)
router.get("/favs", auth.canFav, postController.getFavPosts)

// Creating
router.post("/", auth.canCreatePost, postController.createPost)
router.post("/publish", auth.canCreatePost, postController.createAndPublishPost)

// Updating
router.put("/publish/:id", auth.canUpdateThisPost, postController.publishPost)
router.put("/:id", auth.canUpdateThisPost, postController.updatePost)
router.put("/favs/:id", auth.canFav, postController.addPostToFavs)

// Deleting
router.delete("/:id", auth.canDeleteThisPost, postController.deletePost)
router.delete("/favs/:id", auth.canFav, postController.removePostFromFavs)

module.exports = router
