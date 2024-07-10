const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ownerId: {
    type: String,
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
    type: String,
    require: true,
  },
});

const Link = mongoose.model("Link", LinkSchema);

module.exports = Link;
