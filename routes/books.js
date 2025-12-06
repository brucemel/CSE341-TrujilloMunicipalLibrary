const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const {
  validateBookCreate,
  validateBookUpdate,
  validateBookId
} = require('../validators/bookValidator');

// @route   GET /books
// @desc    Get all books
// @access  Public
router.get('/', getAllBooks);

// @route   GET /books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', validateBookId, getBookById);

// @route   POST /books
// @desc    Create new book
// @access  Private (admin only)
router.post('/', validateBookCreate, createBook);

// @route   PUT /books/:id
// @desc    Update book
// @access  Private (admin only)
router.put('/:id', validateBookId, validateBookUpdate, updateBook);

// @route   DELETE /books/:id
// @desc    Delete book
// @access  Private (admin only)
router.delete('/:id', validateBookId, deleteBook);

module.exports = router;