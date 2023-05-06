const express = require('express');
const router = express.Router();
const uploadController = require('../../../components/Files/upload');
const { checkAuth, isSuperAdmin } = require('../../../middleware/routes');
const EventsController = require('../../../controllers/admin/events/events');

router.post('/create', checkAuth, isSuperAdmin, uploadController.uploadFiles, EventsController.createNew);

router.post('/edit', checkAuth, isSuperAdmin, EventsController.edit);

router.post('/delete', checkAuth, isSuperAdmin, EventsController.delete);

router.get('/fetch/all', checkAuth, isSuperAdmin, EventsController.fetchAll);

router.get('/fetch/:seourl', checkAuth, isSuperAdmin, EventsController.fetchExact);

module.exports = router;