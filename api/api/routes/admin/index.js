const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth/auth');
const ProfileRoutes = require('./profile/profile');
const UsersRoutes = require('./users/users');
const CategoriesRoutes = require('./categories/categories');
const InboxRoutes = require('./inbox/inbox');
const PostsRoutes = require('./posts/posts');
const AboutRoutes = require('./about/about');
const EventsRoutes = require('./events/events');

router.use('/auth', AuthRoutes);
router.use('/profile', ProfileRoutes);
router.use('/users', UsersRoutes);
router.use('/inbox', InboxRoutes);
router.use('/categories', CategoriesRoutes);
router.use('/posts', PostsRoutes);
router.use('/about', AboutRoutes);
router.use('/events', EventsRoutes);

module.exports = router;