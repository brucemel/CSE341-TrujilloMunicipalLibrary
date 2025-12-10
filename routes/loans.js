const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const loanValidator = require('../validators/loanValidator');
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

router.get(
  '/',
  isAuthenticated,  
  loanController.getAllLoans
);

router.get(
  '/overdue',
  isAuthenticated, 
  loanController.getOverdueLoans
);

router.get(
  '/user/:userId',
  isAuthenticated,
  loanController.getLoansByUser
);

router.get(
  '/:id',
  isAuthenticated,
  loanController.getLoanById
);

router.post(
  '/',
  isAuthenticated,
  loanValidator.create,
  handleValidationErrors,
  loanController.createLoan
);

router.put(
  '/:id',
  isAuthenticated,
  loanValidator.update,
  handleValidationErrors,
  loanController.updateLoan
);

router.delete(
  '/:id',
  isAuthenticated,
  loanController.deleteLoan
);

module.exports = router;