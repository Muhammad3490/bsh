const Theme = require("../Models/Theme");
const multer = require("multer");
const upload = multer({ dest: "Themeuploads/" });
const User = require("../Models/User");
const SelectedTheme = require("../Models/SelectedTheme");
const mongoose = require("mongoose");
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
const viewForm = async (req, res) => {
  try {
    return res.render("Themes/Form", { title: "Add Theme" });
  } catch (error) {
    return res.json({ status: "failed", error: error });
  }
};
const postTheme = async (req, res) => {
  const {
    type,
    name,
    backgroundColor,
    textColor,
    font,
    buttonStyle,
    userId,
    buttonColor,
    alignment,
  } = req.body;

  if (!type || !name) {
    return res.status(400).json({ error: "Type and name are required" });
  }

  if (!["predefined", "custom"].includes(type)) {
    return res.status(400).json({ error: "Invalid theme type" });
  }

  const newTheme = new Theme({
    type,
    name,
    backgroundColor,
    textColor,
    font,
    buttonStyle,
    backgroundImageUrl: req.files.backgroundImage
      ? `/themeUploads/${req.files.backgroundImage[0].filename}`
      : null,
    previewImageUrl: req.files.previewImage
      ? `/themeUploads/${req.files.previewImage[0].filename}`
      : null,
    buttonColor,
    alignment,
  });

  if (type === "custom") {
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is required for custom themes" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    newTheme.createdBy = userId;
  }

  try {
    const savedTheme = await newTheme.save();
    res.status(201).json(savedTheme);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the theme" });
  }
};

const createTheme = async (req,res) => {
  const { name, userId } = req.body;
  console.log(req.body)
  if (!name || !userId) {
    return res.json({ status: "failed", error: "Missing fields" });
  }
  try {
    const newTheme = await Theme.create({
      ownerId: userId,
      name: name,
      type: "custom",
    });
    if (newTheme) {
      const select = await SelectedTheme.create({
        themeId: newTheme._id,
        userId: userId,
        selected:true
      });
      if (select) {
        return res.json({
          status: "success",
          message: "Theme created successfully",
          data:newTheme
        });
      } else {
        return res.json({ status: "failed", error: "Unable to select theme" });
      }
    } else {
      return res.json({ status: "failed", error: "Unable to create theme" });
    }
  } catch (error) {
    return res.json({ status: "failed", error: error });
  }
};
const patchTheme = async (req, res) => {
  const { _id: themeId, ...updates } = req.body;
  console.log(req.body);

  if (updates && themeId) {
    try {
      const filter = { _id: themeId };
      const values = { $set: updates };
      const result = await Theme.updateOne(filter, values);

      if (result.modifiedCount > 0) {
        return res.json({ status: "success", data: result });
      } else {
        return res.json({ status: "failed", message: "No theme was updated." });
      }
    } catch (error) {
      return res.json({
        status: "failed",
        error: error.message,
        message: "Unable to patch.",
      });
    }
  }

  return res.json({ status: "failed", error: "Missing fields" });
};
const postSelectedTheme = async (req, res) => {
  const { userId, themeId } = req.body;

  if (!userId || !themeId) {
    return res.status(400).json({
      status: "failed",
      error: "Missing userId or themeId in request body",
    });
  }

  try {
    const newSelectedTheme = await SelectedTheme.create({
      userId,
      themeId,
      selected: true,
    });

    if (newSelectedTheme) {
      return res.json({
        status: "success",
        message: "Selected theme added",
      });
    } else {
      return res.json({
        status: "failed",
        error: "Failed to add selected theme",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

const patchSelectedTheme = async (req, res) => {
  const { userId, themeId, _id } = req.body;

  if (!userId || !themeId || !_id) {
    return res.status(400).json({
      status: "failed",
      error: "Missing userId, themeId, or _id in request body",
    });
  }

  try {
    const previousSelected = await SelectedTheme.findById(_id);
    console.log("Previous Selected Theme", previousSelected);

    if (!previousSelected) {
      return res.json({
        status: "failed",
        error: "No selected theme found for the provided _id",
      });
    }
    const values = { themeId: themeId };
    const updateResult = await SelectedTheme.findByIdAndUpdate(_id, values);
    console.log("Update Result", updateResult);
    if (updateResult) {
      return res.json({
        status: "success",
        message: "Selected theme updated successfully",
        selectedId: _id,
      });
    } else {
      return res.json({
        status: "failed",
        error: "Unable to update selected theme",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

const getSelectedTheme = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.json({ status: "failed", message: "User ID is empty" });
  }

  try {
    const selectedTheme = await SelectedTheme.findOne({ userId });
    if (!selectedTheme) {
      return res.json({
        status: "failed",
        message: "Error in finding selected theme",
      });
    }

    const themeId = selectedTheme.themeId.trim();

    if (!mongoose.Types.ObjectId.isValid(themeId)) {
      return res.json({ status: "failed", message: "Invalid theme ID format" });
    }

    const response = await Theme.findById(themeId);
    if (response) {
      return res.json({
        status: "success",
        theme: response,
        selectedId: response._id,
        _id: selectedTheme._id,
      });
    } else {
      return res.json({
        status: "failed",
        message: "Unable to get selected theme",
      });
    }
  } catch (error) {
    console.error("Error fetching selected theme:", error);
    return res.json({
      status: "failed",
      message: "Unable to get selected theme",
      error,
    });
  }
};

const getuserTheme = async (req, res) => {
  const { userId } = req.params;
  if (userId) {
    try {
      const filter = { userId: userId };
      const selectedtheme = await Theme.findOne(filter);
      if (selectedtheme) {
        return res.json({ status: "success", data: selectedtheme });
      } else {
        return res.json({
          status: "failed",
          message: "No theme found for this user.",
        });
      }
    } catch (error) {
      return res.json({ status: "failed", error: error.message });
    }
  } else {
    return res.json({ status: "failed", error: "User ID is not provided" });
  }
};

const getSelectedThemeByUsername = async (req, res) => {
  const { userName } = req.params;

  if (!userName) {
    return res.json({ status: "failed", error: "User name is not provided" });
  }

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({ status: "failed", message: "User not found" });
    }

    const userId = user._id;
    const filter = { userId };
    const selectedTheme = await Theme.findOne(filter);

    if (selectedTheme) {
      return res.json({ status: "success", theme: selectedTheme });
    } else {
      return res.json({
        status: "failed",
        message: "No theme found for this user.",
      });
    }
  } catch (error) {
    return res.json({ status: "failed", error: error.message });
  }
};

module.exports = {
  getThemes,
  viewForm,
  postTheme,
  postSelectedTheme,
  patchSelectedTheme,
  getSelectedTheme,
  patchTheme,
  getuserTheme,
  getSelectedThemeByUsername,
  createTheme
};
