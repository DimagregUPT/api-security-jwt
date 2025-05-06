const express = require('express');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const { requestLogger, bodyLogger } = require('./middleware/logger');
const { errorHandler, notFoundMiddleware } = require('./middleware/errorHandler');

// Initialize database
require('./database/db');

// Load .env
dotenv.config();

const app = express();

// Log requests
app.use(requestLogger);

// Middleware
app.use(express.json());

// Apply body logger middleware (must come after express.json())
app.use(bodyLogger);

// API routes
app.use('/api', apiRoutes);

// Handle 404
app.use(notFoundMiddleware);

// Global error handler middleware
app.use(errorHandler);

// Server setup
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Environment: ${NODE_ENV}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));