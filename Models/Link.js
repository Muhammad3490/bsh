const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Users",
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  icon: {
    type: String,
  },
  clicks: {
    type: Number,
    default:0
  },
});

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link;
