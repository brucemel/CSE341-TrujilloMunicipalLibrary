const { body, param } = require('express-validator');

const categoryValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
    
    body('bookCount')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Book count must be a positive number'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],

  update: [
    param('id')
      .notEmpty()
      .withMessage('Category ID is required'),
    
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Category name cannot be empty')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category name must be between 2 and 50 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
    
    body('bookCount')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Book count must be a positive number'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean')
  ],

  validateId: [
    param('id')
      .notEmpty()
      .withMessage('Category ID is required')
  ]
};

module.exports = categoryValidationRules;