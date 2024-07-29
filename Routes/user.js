const express = require("express");
const router = express.Router();
const {
  postUser,
  patchUser,
  deleteUser,
  getUser,
  getAllUsers,
  getByUserName,
} = require("../Controllers/user");
//post req
router.post("/", postUser);
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
