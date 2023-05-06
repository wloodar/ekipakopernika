const express = require('express');
const router = express.Router();
const AboutController = require('../../../controllers/admin/about/about');
const uploadController = require('../../../components/Files/upload');
const { checkAuth, isSuperAdmin } = require('../../../middleware/routes');

router.post('/create', checkAuth, isSuperAdmin, uploadController.uploadFiles, AboutController.createNewPerson);

router.post('/delete', checkAuth, isSuperAdmin, AboutController.deletePerson);

module.exports = router;