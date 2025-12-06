const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const DB_NAME = 'TrujilloMunicipalLibrary';
const COLLECTION_NAME = 'users';

// GET ALL USERS
const getAllUsers = async (req, res, next) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get all users'
    #swagger.description = 'Retrieve all users from the system'
  */
  try {
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .find()
      .project({ password: 0 }) // Exclude password from response
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

// GET SINGLE USER BY ID
const getUserById = async (req, res, next) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get user by ID'
    #swagger.description = 'Retrieve a single user by their ID'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne(
        { _id: userId },
        { projection: { password: 0 } } // Exclude password
      );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`
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

// CREATE USER
const createUser = async (req, res, next) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Create a new user'
    #swagger.description = 'Register a new user in the system'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User information',
      required: true,
      schema: {
        username: 'any',
        email: 'any',
        password: 'any',
        firstName: 'any',
        lastName: 'any',
        role: 'any',
        phone: 'any',
        address: 'any',
        city: 'any',
        isActive: 'any'
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

    // Check if email or username already exists
    const existingUser = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .findOne({
        $or: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      });

    if (existingUser) {
      const field = existingUser.email === req.body.email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role || 'member',
      phone: req.body.phone || '',
      address: req.body.address || '',
      city: req.body.city || 'Trujillo',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      membershipDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .insertOne(user);
    
    if (!result.acknowledged) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }

    // Remove password from response
    delete user.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: result.insertedId,
        ...user
      }
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE USER
const updateUser = async (req, res, next) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Update a user'
    #swagger.description = 'Update user information'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Fields to update',
      required: true,
      schema: {
        username: 'any',
        email: 'any',
        password: 'any',
        firstName: 'any',
        lastName: 'any',
        role: 'any',
        phone: 'any',
        address: 'any',
        city: 'any',
        isActive: 'any'
      }
    }
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
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

    const userId = new ObjectId(req.params.id);
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.firstName) updateData.firstName = req.body.firstName;
    if (req.body.lastName) updateData.lastName = req.body.lastName;
    if (req.body.role) updateData.role = req.body.role;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.address !== undefined) updateData.address = req.body.address;
    if (req.body.city !== undefined) updateData.city = req.body.city;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;
    
    // Hash password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: userId },
        { $set: updateData }
      );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// DELETE USER
const deleteUser = async (req, res, next) => {
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete a user'
    #swagger.description = 'Remove a user from the system'
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db(DB_NAME)
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: `User not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};