const Link = require("../Models/Link");
const User = require("../Models/User");

const postLink = async (req, res) => {
  try {
    const { name, url, ownerId, icon } = req.body;
    const checkUser = User.findById(ownerId);
    if ((name, url, checkUser, icon)) {
      try {
        const result = await Link.create({
          name,
          url,
          ownerId,
          icon,
        });
        if (result) {
          return res.json({
            status: "success",
            message: "successfully created link",
            link: result,
          });
        }
      } catch (error) {
        return res.json({
          status: "failed",
          message: "Unable to created link (DB error).",
          error: error,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: "Unable to created link missing fields",
      error: error,
    });
  }
};

const patchLink = async (req, res) => {
  const { updates, userId, linkId } = req.body;

  if (!updates || !userId || !linkId) {
    return res.status(400).json({ status: "error", message: "Invalid request" });
  }

  try {
    const checkOwner = await User.findById(userId);
    if (!checkOwner) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const filter = { ownerId: userId, _id: linkId };
    const update = { $set: updates };
    const result = await Link.updateOne(filter, update);

    if (result.modifiedCount > 0) {
      return res.json({ status: "success", link: result });
    } else {
      return res.json({ status: "error", message: "Link update failed" });
    }
  } catch (error) {
    console.error("Error updating link:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};



const deleteLink = async (req, res) => {
  try {
    console.log("Working 1");
    const { linkId } = req.body;
    if (linkId) {
      const filter = { _id: linkId };
      try {
        const result = await Link.deleteOne(filter);
        if (result.deletedCount > 0) {
          return res.json({
            status: "Success",
            message: "Deleted link successful",
          });
        }

      } catch (error) {
        console.log("Working 2")
        return res.json({
          status: "failed",
          message: "Unable to delete the link",
          error: error,
        });
      }
    }
  } catch (error) {
    console.log("Working 2")

    return res.json({
      status: "failed",
      message: "Unable to delete the link",
      error: error,
    });
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
  try {
    const { userId } = req.params;

    // Ensure checkOwner is awaited
    const checkOwner = await User.findById(userId);

    if (checkOwner) {
      try {
        const filter = { ownerId: userId };
        const result = await Link.find(filter);

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
    res.render('Links/index', { title: 'All Links', links });
  } catch (error) {
    res.status(500).send("Error rendering links page: " + error.message);
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
  viewLinks
};
