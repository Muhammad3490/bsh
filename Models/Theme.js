const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["predefined", "custom"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  backgroundColor: String,
  textColor: String,
  font: String,
  buttonStyle: String,
  createdBy: {
    type: String,
    ref: "User",
  }, // Only for custom themes
  backgroundImageUrl: String, // URL for the background image
  previewImageUrl: String, // URL for the preview image
});

module.exports = mongoose.model("Theme", themeSchema);
