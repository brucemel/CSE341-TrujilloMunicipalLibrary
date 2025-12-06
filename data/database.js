const mongoose = require('mongoose');

let database;

/**
 * Initialize MongoDB connection using Mongoose
 * @param {Function} callback - Callback function (err, db)
 */
const initDb = (callback) => {
  if (database) {
    console.log('Database already initialized');
    return callback(null, database);
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    const error = new Error('MONGODB_URI not configured in .env');
    console.error(error.message);
    return callback(error);
  }

  mongoose.connect(mongoUri)
    .then(() => {
      database = mongoose.connection;
      console.log('Connected to MongoDB Atlas');
      console.log(`Database: ${database.name}`);
      callback(null, database);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      callback(err);
    });
};

/**
 * Get the initialized database connection
 * @returns {Object} Mongoose connection object
 */
const getDatabase = () => {
  if (!database) {
    throw new Error('❌ Database not initialized. Call initDb first.');
  }
  return database;
};

module.exports = { 
  initDb, 
  getDatabase 
};