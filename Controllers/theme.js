const Theme = require("../Models/Theme");
const multer = require("multer");
const upload = multer({ dest: "Themeuploads/" });
const User = require("../Models/User");
const SelectedTheme = require("../Models/SelectedTheme");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
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
const getThemeUser = async (req, res) => {
  const user = req.user;
  console.log("Working")
  if (!user) {
    return res.status(500).json({ error: "User is required." });
  }
  try {
    const themes = await Theme.find({ userId: user._id });
    console.log("Themes",themes)
    return res.status(200).json({ data: themes });
  } catch {
    return res.status(400).json({ error });
  }
};
const selectTheme = async (req, res) => {
  console.log("Working")
  const user = req.user;
  const { themeId } = req.body;

  // Check for required fields
  if (!themeId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Find the theme by themeId and set it to selected=true
    const selectedTheme = await Theme.findOneAndUpdate(
      { _id: themeId, userId: user._id },
      { selected: true },
      { new: true } // Return the updated theme
    );

    if (!selectedTheme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    // Set all other themes with the same userId to selected=false
    await Theme.updateMany(
      { userId: user._id, _id: { $ne: themeId } },
      { selected: false }
    );

    return res
      .status(200)
      .json({ message: "Theme selected successfully", theme: selectedTheme });
  } catch (error) {
    console.error("Error in selecting theme:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};
const getSelectedTheme = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(500).json({ error: "User is required." });
  }

  try {
    // Filter by user ID and selected flag
    const filter = { userId: user._id, selected: true };

    const theme = await Theme.findOne(filter);
    console.log("Theme selected ", theme);
    // Check if theme was found
    if (!theme) {
      return res
        .status(404)
        .json({ error: "No selected theme found for the user." });
    }

    // Return the found theme
    return res.status(200).json({ data: theme });
  } catch (error) {
    console.error("Error fetching selected theme:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the theme." });
  }
};

const postTheme = async (req, res) => {
  const user = req.user;
  const { type, name } = req.body;
  const backgroundImageUrl = req.cloudinaryUrl;
  const localImg = req.localImg;
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
    console.log(error)
    return res.status(400).json({ error });
  }
};

// const patchTheme = async (req, res) => {
//   const user = req.user;
//   let { updates, themeId } = req.body;

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
//       updates = {
//         ...updates,
//         backgroundImageUrl: req.cloudinaryUrl,
//         local: req.localImg,
//       };
//     }

//     const updatedTheme = await Theme.findOneAndUpdate(
//       { _id: themeId },
//       { $set: updates },
//       { new: true }
//     );

//     if (updatedTheme) {
//       return res
//         .status(200)
//         .json({ message: "Update success", data: updatedTheme });
//     } else {
//       return res.status(400).json({ error: "Unable to update theme" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error });
//   }
// };



const patchTheme = async (req, res) => {
  console.log("patch theme",req.body)
  const user = req.user;
  let { updates, themeId } = req.body;

  if (!user || !themeId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const theme = await Theme.findById(themeId);

    if (!theme) {
      return res.status(404).json({ error: "Theme not found" });
    }

    // Check if background image has changed
    if (req.cloudinaryUrl && theme.backgroundImageUrl !== req.cloudinaryUrl) {
      deleteImage(`ThemeUploads/bgImages/${theme.localImg}`);
      updates = {
        ...updates,
        backgroundImageUrl: req.cloudinaryUrl,
        localImg: req.localImg,
      };
    }

    // Update the theme
    const updatedTheme = await Theme.findOneAndUpdate(
      { _id: themeId, userId: user._id },
      { $set: updates },
      { new: true }
    );
    console.log("updated theme")

    if (updatedTheme) {
      return res.status(200).json({ status: "success", data: updatedTheme });
    } else {
      return res.status(400).json({ error: "Unable to update theme" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};



const deleteTheme = async (req, res) => {
  const { themeId } = req.body;
  const user = req.user;

  if (!user || !themeId)
    return res.status(500).json({ error: "missing fields" });

  try {
    const deleteTheme = await Theme.findByIdAndDelete(themeId);
    console.log("Delete theme",deleteTheme)
    return res.status(200).json({ message: "Delete successfull" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = {
  getThemes,
  postTheme,
  patchTheme,
  deleteTheme,
  getSelectedTheme,
  getThemeUser,
  selectTheme
};
