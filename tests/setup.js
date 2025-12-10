const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const database = require('../data/database');

let mongoServer;
let connection;

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.SESSION_SECRET = 'test_secret';
process.env.GITHUB_CLIENT_ID = 'test_client_id';
process.env.GITHUB_CLIENT_SECRET = 'test_client_secret';

beforeAll(async () => {

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGODB_URI = mongoUri;
  
  connection = await MongoClient.connect(mongoUri);
  
  database.setClient(connection);
  
  console.log('Test database initialized');
});

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('Test database closed');
});

afterEach(async () => {
  if (connection) {
    const db = connection.db('TrujilloMunicipalLibrary');
    const collections = await db.listCollections().toArray();
    
    for (let collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
});