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
router.delete("/:linkId", deleteLink);

//get all
router.get("/all", getLinks);
//get user links
router.get("/", getUserLinks);
router.get('/get-by-username',getByUserName)
router.post("/click", incrementClicks);
//view
module.exports = router;
