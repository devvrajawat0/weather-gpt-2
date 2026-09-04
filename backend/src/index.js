import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import weatherRoutes from './routes/weatherRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate Limiting: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

app.use('/api/', apiLimiter);

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'WeatherGPT API', time: new Date().toISOString() });
});

// Root API information endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'WeatherGPT API Server',
    version: '1.0.0',
    endpoints: [
      'GET /api/weather/forecast?lat=...&lon=...',
      'GET /api/weather/alerts?state=...&country=...',
      'GET /api/locations/search?q=...',
      'GET /api/locations/districts',
      'GET /api/locations/capitals',
      'POST /api/chat'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ WeatherGPT Backend Server running on port ${PORT}`);
  console.log(`📡 Open-Meteo & IMD Severe Alert Engine Active`);
  console.log(`====================================================`);
});
