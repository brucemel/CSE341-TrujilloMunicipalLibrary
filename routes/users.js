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

// GET /users
/* 
  #swagger.tags = ['Users']
  #swagger.summary = 'Get all users'
  #swagger.description = 'Retrieve all users from the system'
*/
router.get('/', getAllUsers);

// GET /users/:id
/* 
  #swagger.tags = ['Users']
  #swagger.summary = 'Get user by ID'
  #swagger.description = 'Retrieve a single user by their ID'
*/
router.get('/:id', validateUserId, getUserById);

// POST /users
/* 
  #swagger.tags = ['Users']
  #swagger.summary = 'Create a new user'
  #swagger.description = 'Register a new user in the system'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'User information',
    required: true,
    schema: {
      username: 'jsmith',
      email: 'john@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Smith',
      role: 'member',
      phone: '+51987654321',
      address: 'Av. América 123',
      city: 'Trujillo',
      isActive: true
    }
  }
*/
router.post('/', validateUserCreate, createUser);

// PUT /users/:id
/* 
  #swagger.tags = ['Users']
  #swagger.summary = 'Update a user'
  #swagger.description = 'Update user information'
  #swagger.parameters['body'] = {
    in: 'body',
    description: 'Fields to update (all optional)',
    required: true,
    schema: {
      firstName: 'Updated Name',
      lastName: 'Updated Lastname',
      phone: '+51999888777',
      address: 'New Address 456',
      city: 'Trujillo'
    }
  }
*/
router.put('/:id', validateUserId, validateUserUpdate, updateUser);

// DELETE /users/:id
/* 
  #swagger.tags = ['Users']
  #swagger.summary = 'Delete a user'
  #swagger.description = 'Remove a user from the system'
*/
router.delete('/:id', validateUserId, deleteUser);

module.exports = router;