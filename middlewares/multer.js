let multer = require("multer");
const fs = require("fs");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    var sanitizedFilename = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + sanitizedFilename);
  },
});

var upload = multer({ storage: storage });

function deleteImage(imageName) {
  const imagePath = path.join(__dirname,"..", "public", "uploads", imageName);

  // Delete the image file
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
      return;
    }
    console.log("Image deleted successfully");
  });
}

module.exports = {deleteImage,upload};
