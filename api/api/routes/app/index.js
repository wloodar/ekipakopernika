const express = require('express');
const router = express.Router();
const CategoriesRoutes = require('./categories/categories');
const PostsRoutes = require('./posts/posts');
const AboutRoutes = require('./about/about');
const EventsRoutes = require('./events/events');

router.use('/categories', CategoriesRoutes);
router.use('/posts', PostsRoutes);
router.use('/about', AboutRoutes);
router.use('/events', EventsRoutes);

module.exports = router;