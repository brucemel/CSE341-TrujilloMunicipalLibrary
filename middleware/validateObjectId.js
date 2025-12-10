const { ObjectId } = require('mongodb');

const validateObjectId = (req, res, next) => {
  if (req.params.id && !ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};

module.exports = validateObjectId;
