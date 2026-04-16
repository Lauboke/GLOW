const express = require('express');
const router = express.Router();
const { chatWithGlowAI } = require('../controllers/aiController');

// Route: POST http://localhost:5001/api/ai/chat
router.post('/chat', chatWithGlowAI);

module.exports = router;