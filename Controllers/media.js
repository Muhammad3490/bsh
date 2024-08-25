const Media = require("../Models/Media");
const User = require("../Models/User");
const postMedia = async (req, res) => {
  console.log("Working media");
  const user = req.user;
  const { title, src } = req.body;
  if (!user || !title || !src)
    return res.status(400).json({ error: "missing fields" });

  try {
    const newMedia = await Media.create({
      ...req.body,
      userId: user._id,
    });
    console.log("New Media");
    return res.status(200).json({ message: "create success", data: newMedia });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ error });
  }
};
const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find({ userId: req.user._id });
    return res.status(200).json({ data: media });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Get media by ID
const getMediaById = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findOne({ _id: id, userId: req.user._id });
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    return res.status(200).json({ data: media });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const updateMedia = async (req, res) => {
  const { id } = req.params;
  const { title, src } = req.body;

  if (!title || !src) return res.status(400).json({ error: "Missing fields" });

  try {
    const updatedMedia = await Media.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, src },
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ error: "Media not found" });
    }

    return res
      .status(200)
      .json({ message: "Update success", data: updatedMedia });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteMedia = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMedia = await Media.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedMedia) {
      return res.status(404).json({ error: "Media not found" });
    }

    return res.status(200).json({ message: "Delete success" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const userMedia = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).status({ error: "missing fields" });
  try {
    const userMedia = await Media.find({ userId: user._id });
    console.log(userMedia);
    return res.status(200).json({ data: userMedia, message: "get success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getByUserName = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find media associated with the user's ID
    const media = await Media.find({ userId: user._id });

    return res
      .status(200)
      .json({ data: media, message: "Media fetched successfully" });
  } catch (error) {
    console.error("Error fetching media by username:", error); // Log the error details
    return res
      .status(500)
      .json({ error: "Server error", details: error.message }); // Include error details in the response
  }
};

module.exports = {
  postMedia,
  updateMedia,
  deleteMedia,
  getAllMedia,
  getMediaById,
  userMedia,
  getByUserName,
};
