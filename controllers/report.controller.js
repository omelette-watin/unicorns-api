const Report = require("../models/Report")
const { now } = require("mongoose")

exports.getAllReports = async (req, res) => {

  try {

    const reports = await Report.find()
      .sort({ createdAt: -1 })

    return res.status(200).json(reports)

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}

exports.createReport = async (req, res) => {
  const { grade, message } = req.body

  try {

    const newReport = message
      ? new Report({
        grade,
        message,
        createdAt: now()
      })
      : new Report({
        grade,
        createdAt: now()
      })

    await newReport.save()

    return res.status(200).json({
      message: "Merci pour votre retour !"
    })

  } catch (e) {

    return res.status(500).json({
      message: e.message || "Oups il y a eu une erreur veuillez réessayer plus tard",
    })

  }
}