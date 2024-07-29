const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "ThemeUploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // corrected from file.filename to file.originalname
  },
});

const upload = multer({ storage: storage });

const {
  getThemes,
  viewForm,
  postTheme,
  postSelectedTheme,
  getSelectedTheme,
  patchSelectedTheme,
  patchTheme,
  getuserTheme,
  getSelectedThemeByUsername,
  createTheme
} = require("../Controllers/theme");
router.patch('/',patchTheme)
router.get("/", getThemes);
router.get("/view/add-theme", viewForm);
router.get('/:userId',getuserTheme)
router.post(
  "/",
  upload.fields([{ name: "backgroundImage" }, { name: "previewImage" }]),
  postTheme
);
router.get("/");
router.post("/selected", postSelectedTheme);
router.patch("/selected", patchSelectedTheme);
router.get("/selected/:userId", getSelectedTheme);
router.get("/selected/:userName", getSelectedThemeByUsername);
router.post('/new',createTheme);
module.exports = router;
