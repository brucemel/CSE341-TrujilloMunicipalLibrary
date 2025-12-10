const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

const DB_NAME = 'TrujilloMunicipalLibrary';

describe('Books API Endpoints', () => {
  let connection;
  let db;

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    connection = await MongoClient.connect(process.env.MONGODB_URI);
    db = connection.db(DB_NAME);
  });

  afterAll(async () => {
    if (connection) {
      await connection.close();
    }
  });

  beforeEach(async () => {
    await db.collection('books').deleteMany({});
    await db.collection('books').insertMany([
      {
        _id: new ObjectId(),
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        genre: 'Fiction',
        publicationYear: 1949,
        totalCopies: 5,
        availableCopies: 5,
        description: 'A dystopian novel',
        addedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        genre: 'Technology',
        publicationYear: 2008,
        totalCopies: 3,
        availableCopies: 3,
        description: 'Agile software craftsmanship',
        addedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  });

  afterEach(async () => {
    await db.collection('books').deleteMany({});
  });

  test('GET /books should return all books', async () => {
    const response = await request(app).get('/books');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /books/:id should return a single book', async () => {
    const books = await db.collection('books').find().toArray();
    const bookId = books[0]._id.toString();
    
    const response = await request(app).get(`/books/${bookId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('1984');
  });

  test('GET /books/:id with invalid ID should return 400', async () => {
    const response = await request(app).get('/books/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('GET /books/:id with non-existent ID should return 404', async () => {
    const fakeId = new ObjectId().toString();
    const response = await request(app).get(`/books/${fakeId}`);
    
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('GET /books with empty database should return empty array', async () => {
    await db.collection('books').deleteMany({});
    
    const response = await request(app).get('/books');
    
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
    expect(response.body.data).toEqual([]);
  });

  test('GET /books should return correct data structure', async () => {
    const response = await request(app).get('/books');
    
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('data');
    
    const book = response.body.data[0];
    expect(book).toHaveProperty('_id');
    expect(book).toHaveProperty('title');
    expect(book).toHaveProperty('author');
  });

  test('GET /books should return books sorted by title', async () => {
    const response = await request(app).get('/books');
    
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe('1984');
  });

  test('GET /books/:id should return complete book data', async () => {
    const books = await db.collection('books').find().toArray();
    const bookId = books[0]._id.toString();
    
    const response = await request(app).get(`/books/${bookId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.isbn).toBe('9780451524935');
  });
});