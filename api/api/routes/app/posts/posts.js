const express = require('express');
const router = express.Router();
const PostsController = require('../../../controllers/app/posts/posts');
const uploadController = require('../../../components/Files/upload');
const isAdmin = require('./isAdmin');
const { isCached } = require('../../../middleware/routes');

router.post('/create', isAdmin, uploadController.uploadFiles, PostsController.create);

router.get('/feed/fetch', PostsController.fetchFeed);

router.get('/exact/:shortid', PostsController.fetchExact);

router.get('/category/posts/:id', PostsController.fetchCategory);

module.exports = router;