const express = require('express');
const router = express.Router();
const AboutController = require('../../../controllers/app/about/about');

router.get('/all', AboutController.getAll);

module.exports = router;