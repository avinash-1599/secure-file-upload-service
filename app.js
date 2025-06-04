require('dotenv').config();
const express = require('express');
const { AppDataSource } = require('./src/config/database');
const authRoutes = require('./src/auth/auth.controller');
const uploadRoutes = require('./src/upload/upload.controller');
require('./src/upload/upload.processor'); // calling the BullMQ processor

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start the app
const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
