const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');
const { isAuthenticated } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

router.get(
  '/',
  isAuthenticated,
  userController.getAllUsers
);

router.get(
  '/:id',
  validateObjectId,
  isAuthenticated,
  userController.getUserById
);

router.post(
  '/',
  isAuthenticated,
  userValidator.create,
  handleValidationErrors,
  userController.createUser
);

router.put(
  '/:id',
  validateObjectId,
  isAuthenticated,
  userValidator.update,
  handleValidationErrors,
  userController.updateUser
);

router.delete(
  '/:id',
  validateObjectId,
  isAuthenticated,
  userController.deleteUser
);

module.exports = router;
