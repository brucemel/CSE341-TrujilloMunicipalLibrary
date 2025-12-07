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
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Create a new book'
    #swagger.description = 'Add a new book to the library catalog'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Book information',
      required: true,
      schema: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        genre: 'Fiction',
        publicationYear: 1960,
        publisher: 'J.B. Lippincott & Co.',
        totalCopies: 5,
        availableCopies: 5,
        description: 'A gripping tale',
        coverImage: 'https://via.placeholder.com/200x300'
      }
    }
  */
  validateBookCreate, 
  createBook
);

// PUT /books/:id
router.put('/:id', 
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Update a book'
    #swagger.description = 'Update any field of an existing book'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update (all fields are optional)',
      required: true,
      schema: {
        title: 'UPDATED: To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'Updated description',
        publicationYear: 1961,
        totalCopies: 10,
        availableCopies: 8
      }
    }
  */
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