const express = require('express');
const router = express.Router();

// Information API
router.get('/', (req, res) => {
  //#swagger.tags=['Municipal Library of TrujillomAPI']
  res.send('Trujillo Municipal Library - Library Management System API');
});

router.use('/books', require('./books'));
router.use('/users', require('./users'));

module.exports = router;