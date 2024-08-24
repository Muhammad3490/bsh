const express = require("express");
const router = express.Router();

const {
  postMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  userMedia,
  getByUsername,
} = require("../Controllers/media");
router.post("/", postMedia);
router.get("/:id", getMediaById);
router.get("/", userMedia);
router.get('/get-by-username',getByUsername)
router.put("/:id", updateMedia);
router.delete("/:id", deleteMedia);

module.exports = router;
