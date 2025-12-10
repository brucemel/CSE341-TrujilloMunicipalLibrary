const { body, param } = require('express-validator');

const bookValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    
    body('isbn')
      .trim()
      .notEmpty()
      .withMessage('ISBN is required')
      .matches(/^(?:\d{10}|\d{13})$/)
      .withMessage('ISBN must be 10 or 13 digits'),
    
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Genre cannot exceed 50 characters'),
    
    body('categoryId')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID format'),
    
    body('publicationYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Invalid publication year'),
    
    body('publisher')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Publisher name cannot exceed 100 characters'),
    
    body('totalCopies')
      .notEmpty()
      .withMessage('Total copies is required')
      .isInt({ min: 0 })
      .withMessage('Total copies must be a positive number'),
    
    body('availableCopies')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Available copies must be a positive number')
      .custom((value, { req }) => {
        if (value > req.body.totalCopies) {
          throw new Error('Available copies cannot exceed total copies');
        }
        return true;
      }),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters')
  ],

  update: [
    param('id')
      .notEmpty()
      .withMessage('Book ID is required'),
    
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    
    body('author')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    
    body('isbn')
      .optional()
      .trim()
      .matches(/^(?:\d{10}|\d{13})$/)
      .withMessage('ISBN must be 10 or 13 digits'),
    
    body('genre')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Genre cannot exceed 50 characters'),
    
    body('categoryId')
      .optional()
      .isMongoId()
      .withMessage('Invalid category ID format'),
    
    body('publicationYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Invalid publication year'),
    
    body('publisher')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Publisher name cannot exceed 100 characters'),
    
    body('totalCopies')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total copies must be a positive number'),
    
    body('availableCopies')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Available copies must be a positive number'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters')
  ],

  validateId: [
    param('id')
      .notEmpty()
      .withMessage('Book ID is required')
  ]
};

module.exports = bookValidationRules;