const mongoose = require("mongoose")

const connectionString = process.env.DB_URI || "mongodb://localhost/unicorn"

mongoose.connect(connectionString)
  .catch(e => console.log(e))

mongoose.Promise = global.Promise

module.exports = mongoose