const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { initDb } = require('./data/database');
require('dotenv').config();

const app = express();

// Import routes
const routes = require('./routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/', routes);

// Swagger Documentation (con validación desactivada)
const swaggerDocument = require('./swagger-output.json');
const swaggerOptions = {
  swaggerOptions: {
    validatorUrl: null  // Desactiva validación del frontend
  }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = () => {
  initDb((err) => {
    if (err) {
      console.error('Database connection error:', err);
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });
};

startServer();

module.exports = app;