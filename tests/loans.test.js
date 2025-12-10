const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

const DB_NAME = 'TrujilloMunicipalLibrary';

describe('Loans API Endpoints', () => {
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
    const bookId = new ObjectId();
    const userId = new ObjectId();

    await db.collection('loans').insertMany([
      {
        _id: new ObjectId(),
        bookId: bookId,
        userId: userId,
        loanDate: new Date(),
        dueDate: new Date(),
        status: 'active'
      },
      {
        _id: new ObjectId(),
        bookId: bookId,
        userId: userId,
        loanDate: new Date(),
        dueDate: new Date(),
        returnDate: new Date(),
        status: 'returned'
      }
    ]);
  });

  afterEach(async () => {
    await db.collection('loans').deleteMany({});
  });

  test('GET /loans without authentication should return 401', async () => {
    const response = await request(app).get('/loans');
    
    expect(response.status).toBe(401);
  });

  test('GET /loans/:id without authentication should return 401', async () => {
    const loans = await db.collection('loans').find().toArray();
    const loanId = loans[0]._id.toString();
    
    const response = await request(app).get(`/loans/${loanId}`);
    
    expect(response.status).toBe(401);
  });

  test('Loans should exist in test database', async () => {
    const loans = await db.collection('loans').find().toArray();
    
    expect(loans.length).toBe(2);
  });

  test('Loans should have correct structure', async () => {
    const loans = await db.collection('loans').find().toArray();
    const loan = loans[0];
    
    expect(loan).toHaveProperty('bookId');
    expect(loan).toHaveProperty('userId');
  });

  test('Loans should have valid status', async () => {
    const loans = await db.collection('loans').find().toArray();
    
    loans.forEach(loan => {
      expect(['active', 'returned', 'overdue']).toContain(loan.status);
    });
  });

  test('Should be able to filter active loans', async () => {
    const loans = await db.collection('loans').find({ status: 'active' }).toArray();
    
    expect(loans.length).toBe(1);
  });

  test('Should be able to filter returned loans', async () => {
    const loans = await db.collection('loans').find({ status: 'returned' }).toArray();
    
    expect(loans.length).toBe(1);
  });

  test('GET /loans/overdue without authentication should return 401', async () => {
    const response = await request(app).get('/loans/overdue');
    
    expect(response.status).toBe(401);
  });
});