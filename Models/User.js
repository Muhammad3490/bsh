const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName:{
      type:String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
    },
    picture: {
      type: String,
    },
    plan: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      default: "User",
    },
    bio: {
      type: String,
    },
    Profession: {
      type: String,
    },
    new:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
