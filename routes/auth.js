const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Simple login route
router.get('/login', 
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth routes
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

// CRÍTICO: Esta ruta debe ser /auth/github/callback
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  authController.githubCallback
);

// Logout routes
router.get('/logout', authController.logout);
router.get('/auth/logout', authController.logout);

// User info routes
router.get('/user', authController.getCurrentUser);
router.get('/status', authController.getAuthStatus);

module.exports = router;