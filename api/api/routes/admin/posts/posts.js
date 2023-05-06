const express = require('express');
const router = express.Router();
const PostsController = require('../../../controllers/admin/posts/posts');
const { checkAuth, isSuperAdmin } = require('../../../middleware/routes');

router.get('/all', checkAuth, PostsController.getAll);

router.get('/user/new/approve-waiting', checkAuth, PostsController.userWaitingToApprove);

router.get('/exact/:shortid', checkAuth, PostsController.getExactPost);

router.post('/update/new/accept', checkAuth, isSuperAdmin, PostsController.newAcceptPost);

router.post('/delete', checkAuth, isSuperAdmin, PostsController.deletePost);

module.exports = router;