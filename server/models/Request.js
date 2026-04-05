const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },   // receiver userId
  status: {
    type: String,
    default: "pending", // pending | accepted | declined
  },
});

module.exports = mongoose.model("Request", requestSchema);
