const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  userId:{
    type:String
  },
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
  backgroundImageUrl: String,
  previewImageUrl: String, 
  buttonColor:String,
  buttonBg:String,
  background:String,
  buttonBorder:String,
  buttonRadius:String
});

module.exports = mongoose.model("Theme", themeSchema);
