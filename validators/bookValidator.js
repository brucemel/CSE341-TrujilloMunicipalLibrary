const { body, param } = require('express-validator');

// ALLOWED GENRES
const ALLOWED_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'History',
  'Biography',
  'Children',
  'Romance',
  'Mystery',
  'Fantasy',
  'Other'
];

// CREATE BOOK VALIDATOR
const validateBookCreate = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  
  body('author')
    .trim()
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 1, max: 100 }).withMessage('Author name must be between 1 and 100 characters'),
  
  body('isbn')
    .trim()
    .notEmpty().withMessage('ISBN is required')
    .matches(/^(?:\d{10}|\d{13})$/).withMessage('ISBN must be 10 or 13 digits'),
  
  body('genre')
    .trim()
    .notEmpty().withMessage('Genre is required')
    .isIn(ALLOWED_GENRES).withMessage(`Invalid genre. Allowed: ${ALLOWED_GENRES.join(', ')}`),
  
  body('publicationYear')
    .notEmpty().withMessage('Publication year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Invalid publication year'),
  
  body('publisher')
    .trim()
    .notEmpty().withMessage('Publisher is required')
    .isLength({ min: 1, max: 100 }).withMessage('Publisher name must be between 1 and 100 characters'),
  
  body('totalCopies')
    .notEmpty().withMessage('Total copies is required')
    .isInt({ min: 1 }).withMessage('Total copies must be at least 1'),
  
  body('availableCopies')
    .optional()
    .isInt({ min: 0 }).withMessage('Available copies must be a positive integer'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('coverImage')
    .optional()
    .trim()
];

// UPDATE BOOK VALIDATOR - MÁS FLEXIBLE
const validateBookUpdate = [
  body('title')
    .optional()
    .trim(),
  
  body('author')
    .optional()
    .trim(),
  
  body('isbn')
    .optional()
    .trim(),
  
  body('genre')
    .optional()
    .trim(),
  
  body('publicationYear')
    .optional(),
  
  body('publisher')
    .optional()
    .trim(),
  
  body('totalCopies')
    .optional(),
  
  body('availableCopies')
    .optional(),
  
  body('description')
    .optional()
    .trim(),
  
  body('coverImage')
    .optional()
    .trim()
];

// BOOK ID VALIDATOR
const validateBookId = [
  param('id')
    .isLength({ min: 24, max: 24 }).withMessage('Invalid book ID format')
];

module.exports = {
  validateBookCreate,
  validateBookUpdate,
  validateBookId,
  ALLOWED_GENRES
};