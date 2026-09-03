const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { PORT } = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const chatRoutes = require('./routes/chatRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const alertRoutes = require('./routes/alertRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(generalLimiter);

app.use('/api/chat', chatRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/alerts', alertRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 WeatherGPT Server is running on port ${PORT}`);
});
