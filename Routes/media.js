const express = require("express");
const router = express.Router();

const {
  postMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  userMedia,
  mediaUsername,
  getByUserName,
} = require("../Controllers/media");
router.post("/", postMedia);
router.get("/:id", getMediaById);
router.get("/", userMedia);
router.get('/get-by-username',getByUserName)
router.patch("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
