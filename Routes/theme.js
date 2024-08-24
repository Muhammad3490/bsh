const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Theme = require("../Models/Theme");
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "ThemeUploads/bgImages");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    req.localImg = fileName; // Add file name to req.localImg
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};
// Function to upload file to Cloudinary
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
      req.cloudinaryUrl = cloudinaryUrl;
      console.log("File upload");
      next();
    } catch (error) {
      res.status(500).send("Error uploading file to Cloudinary");
    }
  } else {
    next();
  }
};

const {
  getThemes,
  postTheme,
  patchTheme,
  getSelectedTheme,
  getThemeUser,
  selectTheme,
  deleteTheme,
  getByUserName
} = require("../Controllers/theme");

router.patch(
  "/",
  upload.single("backgroundImage"),
  handleFileUpload,
  patchTheme
);
router.get("/", getThemes);
router.get("/user", getThemeUser);
router.post("/", upload.single("backgroundImage"), handleFileUpload, postTheme);
router.get("/");
router.get("/selected", getSelectedTheme);
router.get('/get-by-username',getByUserName)
router.post("/selected",selectTheme)
router.delete("/",deleteTheme)
module.exports = router;
