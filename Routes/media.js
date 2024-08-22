const express = require("express");
const router = express.Router();

const {
  postMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  userMedia,
} = require("../Controllers/media");
router.post("/", postMedia);
router.get("/", getAllMedia);
router.get("/:id", getMediaById);
router.get("/user", userMedia);
router.put("/:id", updateMedia);
router.delete("//:id", deleteMedia);

module.exports = router;
