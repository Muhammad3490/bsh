// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema(
//   {
//     userName: {
//       type: String,
//       unique:true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type:String,
//       required: true,
//     },
//     emailVerified: {
//       type: Boolean,
//     },
//     picture: {
//       type: String,
//     },
//     plan: {
//       type: String,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now(),
//     },
//     role: {
//       type: String,
//       default: "User",
//     },
//     bio: {
//       type: String,
//     },
//     Profession: {
//       type: String,
//     },
//     new: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", UserSchema);

// module.exports = User;

const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");
const { validateToken, createTokenForUser } = require("../Services/auth");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name:String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
    },
    profileImgUrl: {
      type: String,
      default:
        "https://i.postimg.cc/Rh5NfR8V/145857007-307ce493-b254-4b2d-8ba4-d12c080d6651.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio:{
      type:String,
    },
    localImg:String
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

//creating a virtual function to check the password of the user
userSchema.static("matchPasswords", async function (email, password) {
  const user = await this.findOne({email})
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const preHashedPassword = user.password;

  //hashing the new password
  const userProvidedPasword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (!(userProvidedPasword === preHashedPassword))
    throw new Error("Incorrect password");

  const token = createTokenForUser(user);
  return token;
});

const User = model("Users", userSchema);

module.exports = User;
