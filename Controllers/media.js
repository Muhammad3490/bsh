const Media = require("../Models/Media");
const postMedia = async (req, res) => {
  const user = req.user;
  const { title, src } = req.body;
  if (!user || !title || !src)
    return res.status(400).json({ error: "missing fields" });

  try {
    const newMedia = await Media.create({
      ...req.body,
      userId: user._id,
    });

    return res.status(200).json({ message: "create success", data: newMedia });
  } catch (error) {
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

    return res.status(200).json({ data: userMedia, message: "get success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  postMedia,
  updateMedia,
  deleteMedia,
  getAllMedia,
  getMediaById,
  userMedia,
};