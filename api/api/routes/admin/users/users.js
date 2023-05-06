const express = require('express');
const router = express.Router();
const UsersController = require('../../../controllers/admin/users/users');
const { checkAuth, isSuperAdmin } = require('../../../middleware/routes');

router.get('/all', checkAuth, isSuperAdmin, UsersController.getAll);

router.post('/create', checkAuth, isSuperAdmin, UsersController.createUser);

router.post('/block/:uuid/:status', checkAuth, isSuperAdmin, UsersController.blockUser);

router.post('/delete/:uuid', checkAuth, isSuperAdmin, UsersController.deleteAccount);

router.get('/details/:id', checkAuth, isSuperAdmin, UsersController.getSpecificUser);

module.exports = router;