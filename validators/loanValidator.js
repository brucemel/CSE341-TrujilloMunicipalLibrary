const { body, param } = require('express-validator');

const loanValidationRules = {
  create: [
    body('bookId')
      .notEmpty()
      .withMessage('Book ID is required')
      .isMongoId()
      .withMessage('Invalid Book ID format'),
    
    body('userId')
      .notEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid User ID format'),
    
    body('loanDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid loan date format'),
    
    body('dueDate')
      .notEmpty()
      .withMessage('Due date is required')
      .isISO8601()
      .withMessage('Invalid due date format')
      .custom((value, { req }) => {
        const dueDate = new Date(value);
        const loanDate = req.body.loanDate ? new Date(req.body.loanDate) : new Date();
        if (dueDate <= loanDate) {
          throw new Error('Due date must be after loan date');
        }
        return true;
      }),
    
    body('returnDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid return date format'),
    
    body('status')
      .optional()
      .isIn(['active', 'returned', 'overdue'])
      .withMessage('Status must be active, returned, or overdue'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],

  update: [
    param('id')
      .notEmpty()
      .withMessage('Loan ID is required'),
    
    body('bookId')
      .optional()
      .isMongoId()
      .withMessage('Invalid Book ID format'),
    
    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid User ID format'),
    
    body('loanDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid loan date format'),
    
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid due date format'),
    
    body('returnDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid return date format'),
    
    body('status')
      .optional()
      .isIn(['active', 'returned', 'overdue'])
      .withMessage('Status must be active, returned, or overdue'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ],

  validateId: [
    param('id')
      .notEmpty()
      .withMessage('Loan ID is required')
  ],

  validateUserId: [
    param('userId')
      .notEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid user ID format')
  ]
};

module.exports = loanValidationRules;