const User = require("../Models/User");

const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  console.log("Working");
  if (!username || !password || !email)
    return res.status(500).json({ error: "Fields missing" });

  try {
    const newUser = await User.create({
      ...req.body,
    });
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(500).json({ error: "Fields missing" });

  try {
    const token = await User.matchPasswords(email, password);
    console.log(token);
    return res.status(200).cookie(token);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const patchUser = async (req, res) => {
  const user = req.user;
  const { updates } = req.body;
  console.log("User in function", user);

  if (!updates) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true } // This option returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const user = req.user;
  try {
    const deleteUser = await User.deleteOne({ _id: user._id });
    if (!deleteUser)
      return res.status(500).json({ error: "Unable to find user" });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(400).json({ error });
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

module.exports = {
  patchUser,
  deleteUser,
  getUser,
  getAllUsers,
  getByUserName,
  registerUser,
  loginUser,
};
