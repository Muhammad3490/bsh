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
  try {
    const { fieldName, fieldValue, linkId } = req.body;
    if ((fieldName, fieldValue, linkId)) {
      const filter = { _id: linkId };
      const values = { $set: { [fieldName]: fieldValue } };
      try {
        const result = await Link.updateOne(filter, values);
        if (result.modifiedCount > 0) {
          return res.json({
            status: "success",
            message: "Updated the link sucessfully ",
          });
        }
      } catch (error) {
        return res.json({
          status: "failed",
          message: `Unable to update ${fieldName}`,
          error: error,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: `Unable to update ${fieldName}`,
      error: error,
    });
  }
};

const deleteLink = async (req, res) => {
  try {
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
        return res.json({
          status: "failed",
          message: "Unable to delete the link",
          error: error,
        });
      }
    }
  } catch (error) {
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

const getUserLinks = async (req, res) => {
  try {
    const { ownerId } = req.body;

    // Ensure checkOwner is awaited
    const checkOwner = await User.findById(ownerId);

    if (checkOwner) {
      try {
        const filter = { ownerId: ownerId };

        // Use Link.find instead of findMany
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

module.exports = {
  postLink,
  patchLink,
  deleteLink,
  getLink,
  getLinks,
  getUserLinks,
};
