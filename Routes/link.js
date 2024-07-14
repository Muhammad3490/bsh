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
  viewLinks
} = require("../Controllers/link");
//post req
router.post("/", postLink);
//patch req
router.patch("/", patchLink);
//delete req
router.delete("/", deleteLink);
//get by id
router.get("/", getLink);
//get all
router.get("/all", getLinks);
//get user links
router.get("/:userId", getUserLinks);
//router limit
router.get("/:userId/:limit",getUserLinksLimit);
//view 
router.get('/view',viewLinks);
module.exports = router;
