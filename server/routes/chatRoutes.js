const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { chatLimiter } = require('../middleware/rateLimiter');

router.post('/', chatLimiter, chatController.chat);
router.get('/history/:sessionId', chatController.getHistory);

module.exports = router;
