const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary').v2;

// Ensure the directory exists
const uploadDir = path.join(__dirname, 'ThemeUploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dbdagw6yv',
  api_key: '293813444454576',
  api_secret: 'z992yhu3eUi5OY5G2wRAPk0DEbg',
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single('picture'), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded.");
    return res.json({ status: 'failed', error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  console.log("File details:", req.file);

  try {
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    console.log("Cloudinary upload result:", uploadResult);

    // Optionally remove the file from local storage
    fs.unlinkSync(filePath);

    res.json({ status: 'success', file: req.file, cloudinary_url: uploadResult.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.json({ status: 'failed', error: 'Error uploading to Cloudinary' });
  }
});

module.exports = router;
