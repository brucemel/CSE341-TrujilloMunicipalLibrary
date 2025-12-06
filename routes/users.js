const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// @route   GET /users
// @desc    Get all users
// @access  Private (admin only)
router.get('/', getAllUsers);

// @route   GET /users/:id
// @desc    Get single user by ID
// @access  Private
router.get('/:id', getUserById);

// @route   POST /users
// @desc    Create new user (register)
// @access  Public
router.post('/', createUser);

// @route   PUT /users/:id
// @desc    Update user
// @access  Private
router.put('/:id', updateUser);

// @route   DELETE /users/:id
// @desc    Delete user
// @access  Private (admin only)
router.delete('/:id', deleteUser);

module.exports = router;