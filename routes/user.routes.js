const express = require("express")
const userController = require("../controllers/user.controller")
const auth = require("../middlewares/user.auth")

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
router.put("/:id", auth.canUpdateThisUser, userController.updateUser) // needs to be modified
router.put("/author/:id", auth.canChangeRights, userController.promoteUserToAuthor)
router.put("/admin/:id", auth.canChangeRights, userController.promoteUserToAdmin)
router.put("/deactivate/:id", auth.canChangeRights, userController.deactivateUser)
router.put("/activate/:id", auth.canChangeRights, userController.activateUser)

// Deleting
router.delete("/:id", auth.canDeleteThisUser, userController.deleteUser)

module.exports = router