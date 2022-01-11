const express = require("express")
const reportCtrl = require("../controllers/report.controller")

const router = express.Router()

// Retrieving
router.get("/reports", reportCtrl.getAllReports)

// Creating
router.post("/reports", reportCtrl.createReport)

module.exports = router