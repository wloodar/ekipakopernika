const express = require('express');
const router = express.Router();
const { checkAuth } = require('../../../middleware/routes');
const InboxController = require('../../../controllers/admin/inbox/inbox');

router.get('/messages', checkAuth, InboxController.inboxMessages);

module.exports = router;