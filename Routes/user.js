const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const path=require('path')
const fs=require('fs')
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "ProfileImgs");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    req.localImg = fileName; // Add file name to req.localImg
    cb(null, fileName);
  },
});



const uploadToCloudinary = async (filePath) => {
  console.log("Cloud working");
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
const handleFileUpload = async (req, res, next) => {
  if (req.file) {
    try {
      const cloudinaryUrl = await uploadToCloudinary(req.file.path);
      req.profileImg = cloudinaryUrl;
      console.log("File upload");
      next();
    } catch (error) {
      res.status(500).send("Error uploading file to Cloudinary");
    }
  } else {
    next();
  }
};
const upload = multer({ storage: storage });
const router = express.Router();
const {
  patchUser,
  deleteUser,
  getUser,
  getAllUsers,
  getByUserName,
  registerUser,
  loginUser,
  changeProfilePicture,
} = require("../Controllers/user");

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.patch("/", patchUser);

router.delete("/", deleteUser);

router.get("/", getUser);

router.get("/all", getAllUsers);

router.post('/picture',upload.single("profileImage"),handleFileUpload,changeProfilePicture)
router.patch('/picture',)
router.get("/get-by-username", getByUserName);
module.exports = router;
