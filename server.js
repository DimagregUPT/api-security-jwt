const express = require('express');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

// Import database to initialize it
require('./database/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'This is a test endpoint' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));