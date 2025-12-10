const express = require('express');
const router = express.Router();

// Import route modules
const bookRoutes = require('./books');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const categoryRoutes = require('./categories');
const loanRoutes = require('./loans');

// Mount auth routes BOTH at root and /auth for flexibility
router.use('/', authRoutes);
router.use('/auth', authRoutes);

// Mount other routes
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/loans', loanRoutes);

module.exports = router;