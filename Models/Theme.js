const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  type: {
    type: String,
    enum: ["predefined", "custom"],
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  localImg:String,
  backgroundColor: String,
  textColor: String,
  font: String,
  buttonStyle: String,
  backgroundImageUrl: String,
  previewImageUrl: String,
  buttonColor: String,
  buttonBg: String,
  background: String,
  buttonBorder: String,
  buttonRadius: String,
});

// Pre-save middleware to update other themes
themeSchema.pre("save", async function (next) {
  if (this.selected) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { selected: false }
    );
  }
  next();
});
module.exports = mongoose.model("Theme", themeSchema);
