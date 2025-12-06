const { body, param } = require('express-validator');

// ALLOWED ROLES
const ALLOWED_ROLES = ['admin', 'member'];

// CREATE USER VALIDATOR
const validateUserCreate = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 1, max: 50 }).withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be between 1 and 50 characters'),
  
  body('role')
    .optional()
    .trim()
    .isIn(ALLOWED_ROLES).withMessage(`Invalid role. Allowed: ${ALLOWED_ROLES.join(', ')}`),
  
  body('phone')
    .optional()
    .trim(),
  
  body('address')
    .optional()
    .trim(),
  
  body('city')
    .optional()
    .trim(),
  
  body('isActive')
    .optional()
];

// UPDATE USER VALIDATOR - MÁS FLEXIBLE
const validateUserUpdate = [
  body('username')
    .optional()
    .trim(),
  
  body('email')
    .optional()
    .trim(),
  
  body('password')
    .optional(),
  
  body('firstName')
    .optional()
    .trim(),
  
  body('lastName')
    .optional()
    .trim(),
  
  body('role')
    .optional()
    .trim(),
  
  body('phone')
    .optional()
    .trim(),
  
  body('address')
    .optional()
    .trim(),
  
  body('city')
    .optional()
    .trim(),
  
  body('isActive')
    .optional()
];

// USER ID VALIDATOR
const validateUserId = [
  param('id')
    .isLength({ min: 24, max: 24 }).withMessage('Invalid user ID format')
];

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateUserId,
  ALLOWED_ROLES
};