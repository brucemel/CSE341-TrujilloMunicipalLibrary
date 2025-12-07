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
router.get('/',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get all users'
    #swagger.description = 'Retrieve all users from the system'
  */
  getAllUsers
);

// GET /users/:id
router.get('/:id',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Get user by ID'
    #swagger.description = 'Retrieve a single user by their ID'
  */
  validateUserId,
  getUserById
);

// POST /users
router.post('/',
  validateUserCreate,
  createUser
);

// PUT /users/:id
router.put('/:id',
  validateUserId,
  validateUserUpdate,
  updateUser
);

// DELETE /users/:id
router.delete('/:id',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete a user'
    #swagger.description = 'Remove a user from the system'
  */
  validateUserId,
  deleteUser
);

module.exports = router;