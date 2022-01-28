const express = require("express")
const commentController = require("../controllers/comment.controller")
const auth = require("../middlewares/comment.auth")

const router = express.Router()

// Counting
router.get("/count", commentController.countAllComments)

// Retrieving
router.get("/", commentController.getAllComments)
router.get("/ids", commentController.getAllCommentsIds)
router.get("/post/:id", commentController.getCommentsByPostId)
router.get("/user/:id", commentController.getCommentsByUserId)
router.get("/:id", commentController.getCommentById)

// Creating
router.post("/:id", auth.canCreateComment, commentController.createComment)

// Updating
router.put("/:id", auth.canUpdateThisComment, commentController.updateComment)

// Deleting
router.delete("/:id", auth.canDeleteThisComment, commentController.deleteComment)

module.exports = router