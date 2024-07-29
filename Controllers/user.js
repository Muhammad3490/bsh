const { data } = require("autoprefixer");
const User = require("../Models/User");

const postUser = async (req, res) => {
  const { email, name, emailVerified, picture } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      // Validate required fields for creating a new user
      if (name && email && picture && emailVerified) {
        const newUser = await User.create({
          name,
          email,
          emailVerified,
          picture,
          userName: email,
        });
        console.log("New user", newUser);
        return res.json({
          message: "Added user successfully",
          user: newUser,
        });
      } else {
        return res
          .status(400)
          .json({ error: "Unable to add user (invalid fields)." });
      }
    } else {
      return res.json({
        status: "success",
        message: "User already exists",
        user: checkUser,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to add user", details: error.message });
  }
};

const patchUser = async (req, res) => {
  try {
    const { updates, userId } = req.body;
    if (updates != null && userId != null) {
      const filter = { _id: userId };
      const values = { $set: updates };
      try {
        const result = await User.updateOne(filter, values);
        if (result.modifiedCount > 0) {
          const editedUser = await User.findById(userId);
          return res.json({
            status: "success",
            message: "User updated successfully",
            user: editedUser,
          });
        } else {
          return res.json({
            status: "Failed",
            message: "Unable to update user (DB error)",
          });
        }
      } catch (error) {
        return res.json({
          status: "Failed",
          message: "Unable to update user (DB error)",
        });
      }
    } else {
      return res.json({
        status: "Failed",
        message: "Unable to update user (Missing fields)",
      });
    }
  } catch (error) {
    return res.json({
      status: "Failed",
      message: "Unable to update user (Missing fields)",
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

const getByUserName = async (req, res) => {
  const { userName } = req.params;

  if (!userName) {
    return res.json({ status: "failed", message: "UserName is empty" });
  }
  try {
    const result = await User.findOne({ userName: userName });
    if (result) {
      return res.json({ status: "success", data: result });
    } else {
      return res.json({ status: "failed", messsage: "User not exist" });
    }
  } catch (error) {
    return res.json({ status: "failed", error: error });
  }
};

module.exports = { postUser, patchUser, deleteUser, getUser, getAllUsers,getByUserName};
