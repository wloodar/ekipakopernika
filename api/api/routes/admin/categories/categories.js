const express = require('express');
const router = express.Router();
const CategoriesController = require('../../../controllers/admin/categories/categories');
const uploadController = require('../../../components/Files/upload');
const { checkCache, checkAuth, isSuperAdmin } = require('../../../middleware/routes');

router.get('/all', checkAuth, isSuperAdmin, CategoriesController.categoriesAll);

router.post('/new', checkAuth, isSuperAdmin, uploadController.uploadFiles, CategoriesController.categoriesNew);

router.post('/modify', checkAuth, isSuperAdmin, CategoriesController.modifyCategory);

module.exports = router;