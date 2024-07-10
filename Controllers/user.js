const User = require("../Models/User");

const postUser = async (req, res) => {
  try {
    const { name, email, emailVerified, picture } = req.body;
    if (name && email && picture && emailVerified) {
      const newUser = await User.create({
        name,
        email,
        emailVerified,
        picture,
      });
      console.log("New user", newUser);
      return res.json({
        message: "Added user successfully",
        userId: newUser._id,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Unable to add user (invalid fields)." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to add user", details: error.message });
  }
};

const patchUser = async (req, res) => {
  try {
    const { fieldName, fieldValue, userId } = req.body;
    if (fieldName != null && fieldValue != null && userId != null) {
      const filter = { _id: userId };
      const values = { $set: { [fieldName]: fieldValue } };
      try {
        const result = await User.updateOne(filter, values);
        if (result.modifiedCount > 0) {
          return res.json({
            status: "Success",
            message: `${fieldName} updated successfully `,
          });
        } else {
          return res.json({
            status: "Failed",
            message: `Unable to updated ${fieldName} (DB error)`,
          });
        }
      } catch (error) {
        return res.json({
          status: "Failed",
          message: `Unable to updated ${fieldName} (DB error)`,
        });
      }
    } else {
      return res.json({
        status: "Failed",
        message: `Unable to updated ${fieldName} (Missing fields)`,
      });
    }
  } catch (error) {
    return res.json({
      status: "Failed",
      message: `Unable to updated ${fieldName} (Missing fields)`,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      try {
        const filter = { _id: userId };
        const result = await User.deleteOne(filter);
        if (result.deletedCount > 0) {
          return res.json({
            status: "Success",
            message: "Deleted user successful",
          });
        }
      } catch (error) {
        return res.json({ status: "failed", message: "Unable to delete user" });
      }
    }
  } catch (error) {
    returnres.json({
      status: "failed",
      message: "Missing fields unable to delete user",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId != null) {
      const filter = { _id: userId };
      try {
        const result = await User.findOne(filter);
        if (result) {
          return res.json({
            status: "success",
            message: "User fetched successfully",
            user: result,
          });
        }
      } catch (error) {
        return res.json({
          status: "failed",
          message: "error in fetching user.",
          error: error,
        });
      }
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: "error in fetching user (invalid fields).",
      error: error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await User.find({});
    if (result) {
      return res.json({ status: "Success", users: result });
    }
  } catch (error) {
    return res.json({ status: "success", message: "Unable to fetch users" });
  }
};



module.exports = { postUser, patchUser, deleteUser, getUser, getAllUsers };
