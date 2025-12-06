const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
  if (database) {
    console.log('✅ Database already initialized');
    return callback(null, database);
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    const error = new Error('MONGODB_URI not configured in .env');
    console.error(error.message);
    return callback(error);
  }

  MongoClient.connect(mongoUri)
    .then((client) => {
      database = client;
      console.log('Connected to MongoDB Atlas');
      callback(null, database);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return database;
};

module.exports = { 
  initDb, 
  getDatabase 
};