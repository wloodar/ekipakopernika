const multer = require('multer');
const sharp = require('sharp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const { unexpectedError } = require('../Error/Error');
const { v4: uuidv4 } = require('uuid');
const resolutions = [{name: '_cropped-small', width: 96, height: 96}, {name: '_cropped-large', width: 192, height: 192}, {name: '_small', width: 320, height: 240}, {name: '_medium', width: 640, height: 480}, {name: '_large', width: 1024, height: 768}];
const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const currentPath = req.baseUrl;

    switch (currentPath) {
      case '/api/admin35428/categories':
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            cb("Wybrano niedozwolony plik. Dostępne rozszerzenia: .png, .jpg, .jpeg", false);
        } else {
            cb(null, true);
        }
        break;
      case '/api/app/posts':
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== ".JPG") {
            cb("Wybrano niedozwolony plik. Dostępne rozszerzenia: .png, .jpg, .jpeg, .JPG", false);
        } else {
            cb(null, true);
        }
        break;
      default:
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            cb("Wybrano niedozwolony plik. Dostępne rozszerzenia: .png, .jpg, .jpeg", false);
        } else {
            cb(null, true);
        }
        break;
    }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
      fileSize: 1024 * 1024 * 10
  }
});

const uploadFiles = (req, res, next) => {   
  // const tryUpload = req.baseUrl == '/api/admin35428/categories' ? upload.array("ufiles", 1) : (req.baseUrl == '/api/app/posts' ? upload.array("ufiles", 10) : null);
  const tryUpload = req.baseUrl == '/api/admin35428/categories' ? upload.array("ufiles", 1) : (req.baseUrl == '/api/app/posts' ? upload.array("ufiles", 10) : req.baseUrl == '/api/admin35428/about' ? upload.array("ufiles", 1) : upload.array("ufiles", 1));

  tryUpload(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(200).json({ status: 0, ufiles: "Przekroczono limit plików." });
      }
      if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(200).json({ status: 0, ufiles: "Wielkość pliku jest zbyt duża. Maksymalnie 10mb" });
      }
    } else if (err) {
        return res.status(200).json({ status: 0, ufiles: err });
    }

    manipulateFiles(req, res, next);
  });
};

const manipulateFiles = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
      req.body.processed_files = [];
      await Promise.all(
        req.files.map(async (file, i, arr) => {
          const fileId = uuidv4();
          const parentFolder = fileId.substr(0,2);
          const newFilename = `${fileId}`;
          const made = mkdirp.sync(`uploads/${parentFolder}/${fileId}`);

          if (path.extname(file.originalname) === ".pdf") {
              await savePDF(file, `./uploads/${parentFolder}/${fileId}/${newFilename}`);
          } else {
              await compressImages(file.buffer, parentFolder, fileId, newFilename);
          }

          req.body.processed_files.push({ file_path: `${parentFolder}/${fileId}/${newFilename}`, original_filename: file.originalname, new_filename: newFilename, ext: ".jpeg", size: file.size});
        })
      );

      next();
    
  } catch (err) {
      new unexpectedError();
  }
};

const deleteFiles = async (files) => {
    if (files !== undefined && files.length > 0) {
      await Promise.all(
          files.map(async (file, i, arr) => {
              rimraf.sync(`./${process.env.UPLOAD_DEST}${file.new_filename.substring(0,2)}/${file.new_filename}`)
          })
      );

      return true;
    } else {
      return true;
    }
}

const deletePostFiles = async (files) => {
    if (files !== undefined && files.length > 0) {
      await Promise.all(
          files.map(async (file, i, arr) => {
              rimraf.sync(`./${process.env.UPLOAD_DEST}${file.attachment_url.substring(0,2)}/${file.attachment_url.split('.')[0]}`)
          })
      );

      return true;
    } else {
      return true;
    }
}

const deleteImage = async (image) => {
    if (image !== undefined) {
      rimraf.sync(`./${process.env.UPLOAD_DEST}${image.substring(0,2)}/${image.split('.')[0]}`);
      
      return true;
    } else {
      return true;
    }
}

async function compressImages(file, parentFolder, fileId, newFilename) {
  try {
      await Promise.all(resolutions.map(async (el) => {
          await sharp(file)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .resize(el.width, null)
            .withMetadata()
            .toFile(`uploads/${parentFolder}/${fileId}/${newFilename}${el.name}.jpeg`);
      }));
  } catch (err) {
      new unexpectedError();
  }
}

async function savePDF(file, dest) {
    var b = new Buffer.alloc(file.buffer.length);
    for (var i = 0;i < file.buffer.length;i++) {
            b[i] = file.buffer[i];
    }
    fs.writeFile(`${dest}.pdf`, b,  "binary",function(err) {
        if(err) { new unexpectedError(); } 
        else {
            return true;
        }
    });
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  uploadFiles: uploadFiles,
  deleteFiles: deleteFiles,
  deletePostFiles: deletePostFiles,
  deleteImage: deleteImage
};