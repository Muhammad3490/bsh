const express = require("express");
const router = express.Router();
const {
  patchLink,
  postLink,
  deleteLink,
  getLink,
  getLinks,
  getUserLinks,
  getUserLinksLimit,
  viewLinks,
  incrementClicks,
  getByUserName
} = require("../Controllers/link");
//post req
router.post("/", postLink);
//patch req
router.patch("/", patchLink);
//delete req
router.delete("/", deleteLink);
//get by id
// router.get("/", getLink);
//get all
router.get("/all", getLinks);
//get user links
router.get("/", getUserLinks);
router.get('/get-by-username',getByUserName)
//router limit
router.get("/:userId/:limit", getUserLinksLimit);
router.post("/click", incrementClicks);
//view
router.get("/view", viewLinks);
module.exports = router;
