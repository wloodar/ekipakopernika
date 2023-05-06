const express = require('express');
const router = express.Router();
const EventsController = require('../../../controllers/app/events/events');

router.get('/fetch/all', EventsController.fetchAll);

module.exports = router;