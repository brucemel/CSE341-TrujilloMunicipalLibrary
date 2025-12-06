const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// @route   GET /books
// @desc    Get all books
// @access  Public
router.get('/', getAllBooks);

// @route   GET /books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST /books
// @desc    Create new book
// @access  Private (admin only)
router.post('/', createBook);

// @route   PUT /books/:id
// @desc    Update book
// @access  Private (admin only)
router.put('/:id', updateBook);

// @route   DELETE /books/:id
// @desc    Delete book
// @access  Private (admin only)
router.delete('/:id', deleteBook);

module.exports = router;