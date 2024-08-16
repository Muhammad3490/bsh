const Theme = require("../Models/Theme");
const multer = require("multer");
const upload = multer({ dest: "Themeuploads/" });
const User = require("../Models/User");
const SelectedTheme = require("../Models/SelectedTheme");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};
const getThemes = async (req, res) => {
  try {
    const themes = await Theme.find({});
    if (themes.length > 0) {
      return res.json({ status: "success", themes: themes });
    } else {
      return res.json({ status: "success", message: "No themes available" });
    }
  } catch (error) {
    return res.json({ status: "failed", error: error });
  }
};

const postTheme = async (req, res) => {
  const user = req.user;
  const { type, name } = req.body;
  const backgroundImageUrl = req.cloudinaryUrl;
  const localImg = req.localImg;
  console.log("bg image", backgroundImageUrl);
  if (!user || !name) return res.status(500).json({ error: "Missing fields" });
  try {
    const newTheme = await Theme.create({
      ...req.body,
      userId: user._id,
      backgroundImageUrl: backgroundImageUrl,
      localImg: localImg,
      selected: true,
    });
    if (!newTheme)
      return res.status(400).json({ error: "Unable to create theme" });
    return res.status(200).json({ message: "Post success", data: newTheme });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const patchTheme = async (req, res) => {
  const user = req.user;
  let { updates, themeId } = req.body;

  if (!user || !themeId) {
    return res.status(500).json({ error: "Missing fields" });
  }

  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    // Check if the background image has changed
    if (req.cloudinaryUrl && theme.backgroundImageUrl !== req.cloudinaryUrl) {
      deleteImage(`ThemeUploads/bgImages/${theme.localImg}`);
      console.log("local Image", req.localImg);
      updates = {
        ...updates,
        backgroundImageUrl: req.cloudinaryUrl,
        local: req.localImg,
      };
    }

    const updatedTheme = await Theme.findOneAndUpdate(
      { _id: themeId },
      { $set: updates },
      { new: true }
    );

    if (updatedTheme) {
      return res
        .status(200)
        .json({ message: "Update success", data: updatedTheme });
    } else {
      return res.status(400).json({ error: "Unable to update theme" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

// const patchTheme = async (req, res) => {
//   const user = req.user;
//   const { updates, themeId } = req.body;

//   if (!user || !themeId) {
//     return res.status(500).json({ error: "Missing fields" });
//   }

//   try {
//     const theme = await Theme.findById(themeId);
//     if (!theme) {
//       return res.status(404).json({ error: "Theme not found" });
//     }

//     // Check if the background image has changed
//     if (req.cloudinaryUrl && theme.backgroundImageUrl !== req.cloudinaryUrl) {
//       deleteImage(`ThemeUploads/bgImages/${theme.localImg}`);
//       console.log("local Image", req.localImg);
//       updates.localImg = req.localImg;
//       updates.backgroundImageUrl = req.cloudinaryUrl;
//     }

//     const updatedTheme = await Theme.findOneAndUpdate(
//       { _id: themeId },
//       { $set: updates },
//       { new: true }
//     );

//     if (updatedTheme) {
//       return res.status(200).json({ message: "Update success", data: updatedTheme });
//     } else {
//       return res.status(400).json({ error: "Unable to update theme" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error });
//   }
// };

module.exports = {
  getThemes,
  postTheme,
  patchTheme,
};
