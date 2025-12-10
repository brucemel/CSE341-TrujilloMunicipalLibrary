require('dotenv').config();
const { MongoClient } = require('mongodb');

let client;

const initDb = (callback) => {
  if (client) {
    console.log('Database is already initialized!');
    return callback(null, client);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  
  MongoClient.connect(uri)
    .then((clientInstance) => {
      client = clientInstance;
      if (process.env.NODE_ENV !== 'test') {
        console.log('MongoDB connected successfully');
        console.log(`Database: ${client.db().databaseName}`);
      }
      callback(null, client);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      callback(err);
    });
};

const getDatabase = () => {
  if (!client) {
    throw Error('Database not initialized');
  }
  return client;
};

const setClient = (testClient) => {
  client = testClient;
};

module.exports = {
  initDb,
  getDatabase,
  setClient
};