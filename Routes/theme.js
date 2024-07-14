const express = require("express");
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'themeUploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // corrected from file.filename to file.originalname
    }
});

const upload = multer({ storage: storage });

const { getThemes, viewForm, postTheme } = require('../Controllers/theme');

router.get('/', getThemes);
router.get('/view/add-theme', viewForm);
router.post('/', upload.fields([{ name: 'backgroundImage' }, { name: 'previewImage' }]), postTheme);

module.exports = router;
