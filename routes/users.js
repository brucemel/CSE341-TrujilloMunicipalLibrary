const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const {
  validateUserCreate,
  validateUserUpdate,
  validateUserId
} = require('../validators/userValidator');

// @route   GET /users
// @desc    Get all users
// @access  Private (admin only)
router.get('/', getAllUsers);

// @route   GET /users/:id
// @desc    Get single user by ID
// @access  Private
router.get('/:id', validateUserId, getUserById);

// @route   POST /users
// @desc    Create new user (register)
// @access  Public
router.post('/', validateUserCreate, createUser);

// @route   PUT /users/:id
// @desc    Update user
// @access  Private
router.put('/:id', validateUserId, validateUserUpdate, updateUser);

// @route   DELETE /users/:id
// @desc    Delete user
// @access  Private (admin only)
router.delete('/:id', validateUserId, deleteUser);

module.exports = router;