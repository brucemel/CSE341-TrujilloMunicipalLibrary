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

// GET /books
router.get('/',
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Get all books'
    #swagger.description = 'Retrieve all books from the library'
  */
  getAllBooks
);

// GET /books/:id
router.get('/:id',
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Get book by ID'
    #swagger.description = 'Retrieve a single book by its ID'
  */
  validateBookId,
  getBookById
);

// POST /books
router.post('/',
  validateBookCreate,
  createBook
);

// PUT /books/:id
router.put('/:id',
  validateBookId,
  validateBookUpdate,
  updateBook
);

// DELETE /books/:id
router.delete('/:id',
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Delete a book'
    #swagger.description = 'Remove a book from the library'
  */
  validateBookId,
  deleteBook
);

module.exports = router;