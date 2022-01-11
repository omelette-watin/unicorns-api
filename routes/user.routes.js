const express = require("express")
const userController = require("../controllers/user.controller")

const router = express.Router()


// Counting
router.get("/count", userController.countAllUsers)
router.get("/authors/count", userController.countAuthors)
router.get("/admins/count", userController.countAdmins)

// Retrieving
router.get("/", userController.getAllUsers)
router.get("/readers", userController.getReaders)
router.get("/authors", userController.getAuthors)
router.get("/admins", userController.getAdmins)
router.get("/search", userController.searchUser)
router.get("/:id", userController.getUserById)

// Updating
router.put("/:id", userController.updateUser) // needs to be modified
router.put("/author/:id", userController.promoteUserToAuthor)
router.put("/admin/:id", userController.promoteUserToAdmin)
router.put("/deactivate/:id", userController.deactivateUser)
router.put("/activate/:id", userController.activateUser)

// Deleting
router.delete("/:id", userController.deleteUser)

module.exports = router