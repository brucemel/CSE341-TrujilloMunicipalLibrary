const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/login', 
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  authController.githubCallback
);

router.get('/logout', authController.logout);

router.get('/auth/logout', authController.logout);

router.get('/user', authController.getCurrentUser);

router.get('/status', authController.getAuthStatus);

module.exports = router;