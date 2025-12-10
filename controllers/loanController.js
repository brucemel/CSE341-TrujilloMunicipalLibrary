const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const DB_NAME = 'TrujilloMunicipalLibrary';
const LOANS_COLLECTION = 'loans';
const BOOKS_COLLECTION = 'books';
const USERS_COLLECTION = 'users';

// GET ALL LOANS
const getAllLoans = async (req, res, next) => {
  try {
    const loans = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .aggregate([
        {
          $lookup: {
            from: BOOKS_COLLECTION,
            localField: 'bookId',
            foreignField: '_id',
            as: 'book'
          }
        },
        {
          $lookup: {
            from: USERS_COLLECTION,
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'book.title': 1,
            'book.author': 1,
            'book.isbn': 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.email': 1,
            loanDate: 1,
            dueDate: 1,
            returnDate: 1,
            status: 1,
            notes: 1
          }
        },
        { $sort: { loanDate: -1 } }
      ])
      .toArray();

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE LOAN BY ID
const getLoanById = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan ID format'
      });
    }

    const loanId = new ObjectId(req.params.id);
    
    const loan = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .aggregate([
        { $match: { _id: loanId } },
        {
          $lookup: {
            from: BOOKS_COLLECTION,
            localField: 'bookId',
            foreignField: '_id',
            as: 'book'
          }
        },
        {
          $lookup: {
            from: USERS_COLLECTION,
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
      ])
      .toArray();

    if (!loan || loan.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Loan not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: loan[0]
    });
  } catch (error) {
    next(error);
  }
};

// CREATE LOAN
const createLoan = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookId = new ObjectId(req.body.bookId);
    const userId = new ObjectId(req.body.userId);

    // Verify book exists and is available
    const book = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(BOOKS_COLLECTION)
      .findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No copies available for this book'
      });
    }

    // Verify user exists
    const user = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(USERS_COLLECTION)
      .findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'User account is not active'
      });
    }

    const loan = {
      bookId: bookId,
      userId: userId,
      loanDate: req.body.loanDate ? new Date(req.body.loanDate) : new Date(),
      dueDate: new Date(req.body.dueDate),
      returnDate: null,
      status: 'active',
      notes: req.body.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create loan
    const loanResult = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .insertOne(loan);

    // Update book available copies
    await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(BOOKS_COLLECTION)
      .updateOne(
        { _id: bookId },
        { $inc: { availableCopies: -1 } }
      );

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: {
        _id: loanResult.insertedId,
        ...loan
      }
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE LOAN
const updateLoan = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan ID format'
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

    const loanId = new ObjectId(req.params.id);

    const oldLoan = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .findOne({ _id: loanId });

    if (!oldLoan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    const updateData = { updatedAt: new Date() };

    if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate);
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;

    // If returning the book
    if (req.body.returnDate && !oldLoan.returnDate) {
      updateData.returnDate = new Date(req.body.returnDate);
      updateData.status = 'returned';

      // Increase available copies
      await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection(BOOKS_COLLECTION)
        .updateOne(
          { _id: oldLoan.bookId },
          { $inc: { availableCopies: 1 } }
        );
    }

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .updateOne({ _id: loanId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Loan updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// DELETE LOAN
const deleteLoan = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid loan ID format'
      });
    }

    const loanId = new ObjectId(req.params.id);

    const loan = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .findOne({ _id: loanId });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // If loan was active, return the book copy
    if (loan.status === 'active') {
      await mongodb
        .getDatabase()
        .db(DB_NAME)
        .collection(BOOKS_COLLECTION)
        .updateOne(
          { _id: loan.bookId },
          { $inc: { availableCopies: 1 } }
        );
    }

    await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .deleteOne({ _id: loanId });

    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// GET LOANS BY USER
const getLoansByUser = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const userId = new ObjectId(req.params.userId);

    const loans = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .find({ userId: userId })
      .sort({ loanDate: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

// GET OVERDUE LOANS
const getOverdueLoans = async (req, res, next) => {
  try {
    const today = new Date();

    const loans = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(LOANS_COLLECTION)
      .find({
        status: 'active',
        dueDate: { $lt: today }
      })
      .sort({ dueDate: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  getLoansByUser,
  getOverdueLoans
};