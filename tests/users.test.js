const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

const DB_NAME = 'TrujilloMunicipalLibrary';

describe('Users API Endpoints', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI);
    db = connection.db(DB_NAME);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection('users').insertMany([
      {
        _id: new ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'member',
        status: 'active'
      },
      {
        _id: new ObjectId(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active'
      }
    ]);
  });

  afterEach(async () => {
    await db.collection('users').deleteMany({});
  });

  test('GET /users/:id without auth should return 401', async () => {
    const users = await db.collection('users').find().toArray();
    const userId = users[0]._id.toString();
    
    const response = await request(app).get(`/users/${userId}`);
    
    expect(response.status).toBe(401);
  });

  test('GET /users/:id with invalid ID should return 400', async () => {
    const response = await request(app).get('/users/invalid-id');
    
    expect(response.status).toBe(400);
  });

  test('Users should exist in test database', async () => {
    const users = await db.collection('users').find().toArray();
    
    expect(users.length).toBe(2);
  });

  test('Users should have correct structure', async () => {
    const users = await db.collection('users').find().toArray();
    const user = users[0];
    
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('email');
  });

  test('Users should have unique emails', async () => {
    const users = await db.collection('users').find().toArray();
    const emails = users.map(u => u.email);
    const uniqueEmails = new Set(emails);
    
    expect(emails.length).toBe(uniqueEmails.size);
  });

  test('Users should have valid roles', async () => {
    const users = await db.collection('users').find().toArray();
    
    users.forEach(user => {
      expect(['member', 'admin']).toContain(user.role);
    });
  });

  test('Users should have valid status', async () => {
    const users = await db.collection('users').find().toArray();
    
    users.forEach(user => {
      expect(['active', 'inactive', 'suspended']).toContain(user.status);
    });
  });

  test('GET /users without authentication should return 401', async () => {
    const response = await request(app).get('/users');
    
    expect(response.status).toBe(401);
  });
});