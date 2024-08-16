const { data } = require("autoprefixer");
const Link = require("../Models/Link");
const User = require("../Models/User");

const postLink = async (req, res) => {
  const user = req.user;
  const { name, url } = req.body;
  if (!name || !url) return res.status(500).json({ error: "Missing fields" });

  try {
    const newLink = await Link.create({
      ...req.body,
      ownerId: user._id,
    });

    return res
      .status(200)
      .json({ message: "Link added successfully", data: newLink });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const patchLink = async (req, res) => {
  const { updates, linkId } = req.body;
  const user = req.user;

  if (!updates || !linkId || !user) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const update = { $set: updates };
    const result = await Link.findByIdAndUpdate(linkId, update, { new: true });

    if (!result) {
      return res.status(404).json({ error: "Link not found" });
    }
    return res.status(200).json({ message: "Edit success", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteLink = async (req, res) => {
  const user = req.user;
  const { linkId } = req.body;

  if (!user || !linkId) {
    return res.status(400).json({ error: "Missing field" });
  }

  try {
    const result = await Link.deleteOne({ _id: linkId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    console.log("Delete result:", result);
    return res.status(200).json({ message: "Delete success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getLink = async (req, res) => {
  try {
    const { linkId } = req.body;
    if (linkId) {
      try {
        const result = await Link.findById(linkId);
        if (result) {
          return res.json({ status: "success", link: result });
        }
      } catch (error) {
        return res.json({ status: "Failed", error: error });
      }
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: "Unable to get link",
      error: error,
    });
  }
};

const getLinks = async (req, res) => {
  try {
    const result = await Link.find({});
    if (result) {
      return res.json({ status: "success", links: result });
    }
  } catch (error) {
    return res.json({ status: "Failed", error: error });
  }
};

// Backend route to fetch user links
const getUserLinks = async (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(500).json({ error: "user is required to get links" });
  try {
    const links = await Link.find({ ownerId: user._id });
    console.log(links);
    return res.status(200).json({ data: links, message: "get success" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
const getUserLinksLimit = async (req, res) => {
  try {
    const { userId, limit } = req.params;

    // Ensure checkOwner is awaited
    const checkOwner = await User.findById(userId);

    if (checkOwner) {
      try {
        const filter = { ownerId: userId };
        const result = await Link.find(filter).limit(Number(limit));

        if (result && result.length > 0) {
          return res.json({ status: "success", links: result });
        } else {
          return res.json({ status: "success", message: "User has no links" });
        }
      } catch (error) {
        return res.json({
          status: "failed",
          message: "Unable to fetch links",
          error: error.message,
        });
      }
    } else {
      return res.json({ status: "failed", message: "Unable to find user" });
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: "An error occurred",
      error: error.message,
    });
  }
};

const viewLinks = async (req, res) => {
  try {
    const links = await Link.find({}); // Fetch all links, adjust as needed
    res.render("Links/index", { title: "All Links", links });
  } catch (error) {
    res.status(500).send("Error rendering links page: " + error.message);
  }
};

const incrementClicks = async (req, res) => {
  const { linkId } = req.body;

  if (!linkId) {
    return res.json({ status: "failed", error: "linkId is empty" });
  }

  try {
    const link = await Link.findById(linkId);

    if (!link) {
      return res.json({ status: "failed", error: "Unable to find link" });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      linkId,
      { $inc: { clicks: 1 } },
      { new: true } // Return the updated document
    );

    if (updatedLink) {
      return res.json({ status: "success", data: updatedLink });
    } else {
      return res.json({
        status: "failed",
        error: "Unable to update the value",
      });
    }
  } catch (error) {
    return res.json({ status: "failed", error: error.message });
  }
};

module.exports = {
  postLink,
  patchLink,
  deleteLink,
  getLink,
  getLinks,
  getUserLinks,
  getUserLinksLimit,
  viewLinks,
  incrementClicks,
};
