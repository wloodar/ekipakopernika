const multer = require('multer');
const sharp = require('sharp');
const mkdirp = require('mkdirp');
const { v4: uuidv4 } = require('uuid');
const multerStorage = multer.memoryStorage();

const resolutions = [{name: '_cropped-small', width: 96, height: 96}, {name: '_cropped-large', width: 192, height: 192}, {name: '_small', width: 320, height: 240}, {name: '_medium', width: 640, height: 480}, {name: '_large', width: 1024, height: 768}];

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
const uploadFiles = upload.array("images", 10);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
        res.status(200).json({ status: 0, images: err });
    }

    resizeImages(req, res, next);
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async file => {
      const fileId = uuidv4();
      const parentFolder = fileId.substr(0,2);
      const newFilename = `${fileId}`;

      const made = mkdirp.sync(`uploads/${parentFolder}/${fileId}`);
      await manipulateFiles(file.buffer, parentFolder, fileId, newFilename);

      req.body.images.push(newFilename);
    })
  );

  next();
};

async function manipulateFiles(file, parentFolder, fileId, newFilename) {
  await Promise.all(resolutions.map(async (el) => {
      await sharp(file)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .resize(el.width, null)
        .toFile(`uploads/${parentFolder}/${fileId}/${newFilename}${el.name}.jpeg`);
  }));
}

module.exports = {
  uploadImages: uploadImages,
};