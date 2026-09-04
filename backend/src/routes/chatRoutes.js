import express from 'express';
import { processChatQuery } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Body: { messages: [{ role: 'user', content: '...' }], currentLocation: { lat, lon, name } }
 */
router.post('/', async (req, res) => {
  try {
    const { messages, currentLocation } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or missing messages array' });
    }

    // Input sanitization / length truncation
    const sanitizedMessages = messages.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.content || '').slice(0, 1000).trim()
    }));

    const result = await processChatQuery(sanitizedMessages, currentLocation);

    res.json({
      success: true,
      reply: result.reply,
      locations: result.locations,
      weatherData: result.weatherData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ success: false, error: 'Internal server error processing chat query' });
  }
});

export default router;
