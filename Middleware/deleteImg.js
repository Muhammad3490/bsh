const fs = require("fs");
const path = require("path");

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
};

// Example usage
const imagePath = path.join(__dirname, "ThemeUploads", "example-image.jpg");
deleteImage(imagePath);