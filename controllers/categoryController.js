const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const DB_NAME = 'TrujilloMunicipalLibrary';
const COLLECTION_NAME = 'categories';

// GET ALL CATEGORIES
const getAllCategories = async (req, res, next) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .find()
      .sort({ name: 1 })
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

// GET SINGLE CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    const categoryId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ _id: categoryId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
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

// CREATE CATEGORY
const createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if category name already exists
    const existingCategory = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({ name: req.body.name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category with name "${req.body.name}" already exists`
      });
    }

    const category = {
      name: req.body.name,
      description: req.body.description || '',
      bookCount: req.body.bookCount || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .insertOne(category);

    if (!result.acknowledged) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create category'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        _id: result.insertedId,
        ...category
      }
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
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

    const categoryId = new ObjectId(req.params.id);
    const updateData = { updatedAt: new Date() };

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.bookCount !== undefined) updateData.bookCount = parseInt(req.body.bookCount);
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: categoryId },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format'
      });
    }

    const categoryId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};