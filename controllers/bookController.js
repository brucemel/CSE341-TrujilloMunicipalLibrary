const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const DB_NAME = 'TrujilloMunicipalLibrary';
const COLLECTION_NAME = 'books';

// GET ALL BOOKS
const getAllBooks = async (req, res, next) => {
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Get all books'
    #swagger.description = 'Retrieve all books from the library'
  */
  try {
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    
    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE BOOK BY ID
const getBookById = async (req, res, next) => {
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Get book by ID'
    #swagger.description = 'Retrieve a single book by its ID'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const bookId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ _id: bookId });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// CREATE BOOK
const createBook = async (req, res, next) => {
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Create a new book'
    #swagger.description = 'Add a new book to the library catalog'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Book information',
      required: true,
      schema: {
        title: 'any',
        author: 'any',
        isbn: 'any',
        genre: 'any',
        publicationYear: 'any',
        publisher: 'any',
        totalCopies: 'any',
        availableCopies: 'any',
        description: 'any',
        coverImage: 'any'
      }
    }
  */
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if ISBN already exists
    const existingBook = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ isbn: req.body.isbn });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: `Book with ISBN ${req.body.isbn} already exists`
      });
    }

    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      publicationYear: parseInt(req.body.publicationYear),
      publisher: req.body.publisher,
      totalCopies: parseInt(req.body.totalCopies),
      availableCopies: req.body.availableCopies !== undefined 
        ? parseInt(req.body.availableCopies) 
        : parseInt(req.body.totalCopies),
      description: req.body.description || '',
      coverImage: req.body.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover',
      addedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .insertOne(book);
    
    if (!result.acknowledged) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create book'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: {
        _id: result.insertedId,
        ...book
      }
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE BOOK
const updateBook = async (req, res, next) => {
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Update a book'
    #swagger.description = 'Update any field of an existing book'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update (all fields are optional)',
      required: true,
      schema: {
        title: 'any',
        author: 'any',
        isbn: 'any',
        genre: 'any',
        publicationYear: 'any',
        publisher: 'any',
        totalCopies: 'any',
        availableCopies: 'any',
        description: 'any',
        coverImage: 'any'
      }
    }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookId = new ObjectId(req.params.id);
    
    // Get current book to validate availableCopies vs totalCopies
    const currentBook = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ _id: bookId });

    if (!currentBook) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }

    const updateData = {
      updatedAt: new Date()
    };
    
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.isbn) updateData.isbn = req.body.isbn;
    if (req.body.genre) updateData.genre = req.body.genre;
    if (req.body.publicationYear) updateData.publicationYear = parseInt(req.body.publicationYear);
    if (req.body.publisher) updateData.publisher = req.body.publisher;
    if (req.body.totalCopies !== undefined) updateData.totalCopies = parseInt(req.body.totalCopies);
    if (req.body.availableCopies !== undefined) updateData.availableCopies = parseInt(req.body.availableCopies);
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.coverImage !== undefined) updateData.coverImage = req.body.coverImage;

    // Validate availableCopies <= totalCopies
    const finalTotalCopies = updateData.totalCopies !== undefined 
      ? updateData.totalCopies 
      : currentBook.totalCopies;
    const finalAvailableCopies = updateData.availableCopies !== undefined 
      ? updateData.availableCopies 
      : currentBook.availableCopies;

    if (finalAvailableCopies > finalTotalCopies) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Available copies (${finalAvailableCopies}) cannot exceed total copies (${finalTotalCopies})`
      });
    }

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: bookId },
        { $set: updateData }
      );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// DELETE BOOK
const deleteBook = async (req, res, next) => {
  /* 
    #swagger.tags = ['Books']
    #swagger.summary = 'Delete a book'
    #swagger.description = 'Remove a book from the library'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const bookId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: bookId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};