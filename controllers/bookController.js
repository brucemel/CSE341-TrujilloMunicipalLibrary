const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /books
// @access  Public
const getAllBooks = async (req, res) => {
    //swagger.description = 'Retrieve all books from the library'
  try {
    const books = await Book.find();
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books',
      error: error.message
    });
  }
};

// @desc    Get single book by ID
// @route   GET /books/:id
// @access  Public
const getBookById = async (req, res) => {
    //swagger.description = 'Retrieve a single book by its ID'
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error in getBookById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book',
      error: error.message
    });
  }
};

// @desc    Create new book
// @route   POST /books
// @access  Private (admin only)
const createBook = async (req, res) => {

    //swagger.description = 'Add a new book to the library catalog'

  try {
    const { title, author, isbn, genre, publicationYear, publisher } = req.body;
    
    if (!title || !author || !isbn || !genre || !publicationYear || !publisher) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, author, isbn, genre, publicationYear, publisher'
      });
    }
    
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `Book with ISBN ${isbn} already exists`
      });
    }
    
    const bookData = {
      ...req.body,
      availableCopies: req.body.totalCopies || 1
    };
    
    const book = await Book.create(bookData);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Error in createBook:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating book',
      error: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /books/:id
// @access  Private (admin only)
const updateBook = async (req, res) => {
    //swagger.description = 'Update any field of an existing book'
  try {
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }
    
    const finalTotalCopies = req.body.totalCopies !== undefined 
      ? req.body.totalCopies 
      : book.totalCopies;
      
    const finalAvailableCopies = req.body.availableCopies !== undefined 
      ? req.body.availableCopies 
      : book.availableCopies;
    
    if (finalAvailableCopies > finalTotalCopies) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Available copies (${finalAvailableCopies}) cannot exceed total copies (${finalTotalCopies})`
      });
    }
    
    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Error in updateBook:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating book',
      error: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /books/:id
// @access  Private (admin only)
const deleteBook = async (req, res) => {
    //swagger.description = 'Remove a book from the library'
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }
    
    await book.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book',
      error: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};