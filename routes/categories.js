const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const categoryValidator = require('../validators/categoryValidator');
const { isAuthenticated } = require('../middleware/auth');
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

router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.post(
  '/',
  isAuthenticated,
  categoryValidator.create,
  handleValidationErrors,
  categoryController.createCategory
);

router.put(
  '/:id',
  isAuthenticated,  
  categoryValidator.update,
  handleValidationErrors,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  isAuthenticated,
  categoryController.deleteCategory
);

module.exports = router;