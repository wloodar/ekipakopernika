// const multer = require('multer');
// const jimp = require('jimp');

// const categoriesStorage =  multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/categories/');
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// });

// exports.uploadCategoryCover = multer({
//     storage: categoriesStorage, 
//     limits: { 
//         fileSize: 1024 * 1024 * 5 
//     }, 
//     fileFilter: function (req, file, cb){ 
//         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//             cb(null, true);
//         } else {
//             cb(null, false);
//         }
//     }  
// }).single("categoryCover");
