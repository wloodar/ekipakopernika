const express = require('express');
const router = express.Router();
const CategoriesController = require('../../../controllers/app/categories/categories');
const { isCached } = require('../../../middleware/routes');

router.get('/all', isCached, CategoriesController.getAll);

router.get('/feed', CategoriesController.feed);

router.get('/exact/:url', CategoriesController.getExact);

module.exports = router;