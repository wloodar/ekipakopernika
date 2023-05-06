const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../../middleware/routes');
const ProfileController = require('../../../controllers/admin/profile/profile');

router.post('/change-password', checkAuth, ProfileController.changePassword);

module.exports = router;