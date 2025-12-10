const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const DB_NAME = 'TrujilloMunicipalLibrary';
const COLLECTION_NAME = 'books';

// GET ALL BOOKS
const getAllBooks = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .find()
      .sort({ title: 1 })
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
    if (req.body.isbn) {
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
    }

    // Verify category exists if categoryId is provided
    if (req.body.categoryId) {
      const categoryExists = await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection('categories')
        .findOne({ _id: new ObjectId(req.body.categoryId) });

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn || '',
      genre: req.body.genre || '',
      categoryId: req.body.categoryId ? new ObjectId(req.body.categoryId) : null,
      publicationYear: req.body.publicationYear ? parseInt(req.body.publicationYear) : null,
      publisher: req.body.publisher || '',
      totalCopies: parseInt(req.body.totalCopies) || 1,
      availableCopies: req.body.availableCopies !== undefined
        ? parseInt(req.body.availableCopies)
        : parseInt(req.body.totalCopies) || 1,
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

    // Update category bookCount if categoryId was provided
    if (req.body.categoryId) {
      await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection('categories')
        .updateOne(
          { _id: new ObjectId(req.body.categoryId) },
          { $inc: { bookCount: 1 } }
        );
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

    // Get current book
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

    // Verify new category exists if changing categoryId
    if (req.body.categoryId && req.body.categoryId !== currentBook.categoryId?.toString()) {
      const categoryExists = await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection('categories')
        .findOne({ _id: new ObjectId(req.body.categoryId) });

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Decrement old category bookCount
      if (currentBook.categoryId) {
        await mongodb
          .getDatabase()
          .db(DB_NAME)
          .collection('categories')
          .updateOne(
            { _id: currentBook.categoryId },
            { $inc: { bookCount: -1 } }
          );
      }

      // Increment new category bookCount
      await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection('categories')
        .updateOne(
          { _id: new ObjectId(req.body.categoryId) },
          { $inc: { bookCount: 1 } }
        );
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.author) updateData.author = req.body.author;
    if (req.body.isbn) updateData.isbn = req.body.isbn;
    if (req.body.genre) updateData.genre = req.body.genre;
    if (req.body.categoryId) updateData.categoryId = new ObjectId(req.body.categoryId);
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
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const bookId = new ObjectId(req.params.id);
    
    // Get book to check if it has a category
    const book = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id: ${req.params.id}`
      });
    }

    // Delete the book
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: bookId });

    // Decrement category bookCount if book had a category
    if (book.categoryId) {
      await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection('categories')
        .updateOne(
          { _id: book.categoryId },
          { $inc: { bookCount: -1 } }
        );
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

// GET BOOKS BY CATEGORY
const getBooksByCategory = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    const categoryId = new ObjectId(req.params.categoryId);
    
    const books = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .find({ categoryId: categoryId })
      .sort({ title: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
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
  deleteBook,
  getBooksByCategory
};