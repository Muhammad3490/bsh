const express = require("express");
const router = express.Router();
const {
  patchUser,
  deleteUser,
  getUser,
  getAllUsers,
  getByUserName,
  registerUser,
  loginUser
} = require("../Controllers/user");




router.post('/',registerUser);
router.post('/login',loginUser)
//patch req
router.patch("/", patchUser);
//delete req
router.delete("/", deleteUser);
//get by id
router.get("/", getUser);
//get all user
router.get("/all", getAllUsers);

router.get("/:userName", getByUserName);
module.exports = router;
