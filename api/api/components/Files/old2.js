const multer = require('multer');
const sharp = require('sharp');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const resolutions = [{name: '_cropped-small', width: 96, height: 96}, {name: '_cropped-large', width: 192, height: 192}, {name: '_small', width: 320, height: 240}, {name: '_medium', width: 640, height: 480}, {name: '_large', width: 1024, height: 768}];

// const multerStorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads');
//     }
// });

// const multerFilter = (req, file, cb) => {
//     console.log(req);
    
//     const ext = path.extname(file.originalname);
//     if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.pdf') {
//         cb("Wybrano niedozwolony plik. Dostępne rozszerzenia: .png, .jpg, .jpeg, .pdf", false);
//     } else {
//         cb(null, true);
//     }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: {
//       fileSize: 1024 * 1024 * 5
//   }
// });
// const tryUpload = upload.array("images", 10);


const uploadFnct = function(dest){
    const storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/img/'+dest+'/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    const upload = multer({ //multer settings
        storage: storage
    }).single('file');

    return upload;
};



// const uploadFiles = (req, res, next) => {
//   tryUpload(req, res, err => {
//     if (err instanceof multer.MulterError) {
//       if (err.code === "LIMIT_UNEXPECTED_FILE") {
//           return res.status(200).json({ status: 0, images: "Przekroczono limit plików, który wynosi 10" });
//       }
//       if (err.code === "LIMIT_FILE_SIZE") {
//           return res.status(200).json({ status: 0, images: "Wielkość pliku jest zbyt duża. Maksymalnie 5mb" });
//       }
//     } else if (err) {
//         return res.status(200).json({ status: 0, images: err });
//     }

//     manipulateFiles(req, res, next);
//   });
// };

// const manipulateFiles = async (req, res, next) => {
//   if (!req.files) return next();

//   try {
//       req.body.saved_files = [];
//       await Promise.all(
//         req.files.map(async file => {
//           const fileId = uuidv4();
//           const parentFolder = fileId.substr(0,2);
//           const newFilename = `${fileId}`;
    
//           const made = mkdirp.sync(`uploads/${parentFolder}/${fileId}`);
//           if (path.extname(file.originalname) === ".pdf") {
            
//           } else {
//             await sharp(file)
//               .toFormat("jpeg")
//               .jpeg({ quality: 90 })
//               .resize(el.width, null)
//               .toFile(`uploads/${parentFolder}/${fileId}/${newFilename}${el.name}.jpeg`);
//           }

//           // req.body.saved_files.push(newFilename);
//         })
//       );
    
//   } catch (err) {
//       console.log(err);
//   }
// };


module.exports = {
  uploadFiles: uploadFiles,
};