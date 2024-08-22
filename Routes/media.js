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
router.post("/media", postMedia);
router.get("/media", getAllMedia);
router.get("/media/:id", getMediaById);
router.get("/media/user", userMedia);
router.put("/media/:id", updateMedia);
router.delete("/media/:id", deleteMedia);

module.exports = router;
