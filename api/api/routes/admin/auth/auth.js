const express = require('express');
const router = express.Router();
const AuthController = require('../../../controllers/admin/auth/auth');
const { isAuthenticated } = require('../../../middleware/routes');

router.post('/login', isAuthenticated, AuthController.login);

module.exports = router;