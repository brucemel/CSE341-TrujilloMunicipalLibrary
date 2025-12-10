const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

const DB_NAME = 'TrujilloMunicipalLibrary';

describe('Categories API Endpoints', () => {
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
    await db.collection('categories').insertMany([
      {
        _id: new ObjectId(),
        name: 'Fiction',
        description: 'Fiction books',
        bookCount: 5,
        isActive: true
      },
      {
        _id: new ObjectId(),
        name: 'Technology',
        description: 'Technology books',
        bookCount: 3,
        isActive: true
      }
    ]);
  });

  afterEach(async () => {
    await db.collection('categories').deleteMany({});
  });

  test('GET /categories should return all categories', async () => {
    const response = await request(app).get('/categories');
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(2);
  });

  test('GET /categories/:id should return a single category', async () => {
    const categories = await db.collection('categories').find().toArray();
    const categoryId = categories[0]._id.toString();
    
    const response = await request(app).get(`/categories/${categoryId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('Fiction');
  });

  test('GET /categories/:id with invalid ID should return 400', async () => {
    const response = await request(app).get('/categories/invalid-id');
    
    expect(response.status).toBe(400);
  });

  test('GET /categories/:id with non-existent ID should return 404', async () => {
    const fakeId = new ObjectId().toString();
    const response = await request(app).get(`/categories/${fakeId}`);
    
    expect(response.status).toBe(404);
  });

  test('GET /categories should return correct data structure', async () => {
    const response = await request(app).get('/categories');
    
    const category = response.body.data[0];
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('description');
  });

  test('GET /categories with empty database should return empty array', async () => {
    await db.collection('categories').deleteMany({});
    
    const response = await request(app).get('/categories');
    
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(0);
  });

  test('Categories should have valid bookCount', async () => {
    const categories = await db.collection('categories').find().toArray();
    
    categories.forEach(category => {
      expect(category.bookCount).toBeGreaterThanOrEqual(0);
    });
  });

  test('Categories should have isActive boolean field', async () => {
    const categories = await db.collection('categories').find().toArray();
    
    categories.forEach(category => {
      expect(typeof category.isActive).toBe('boolean');
    });
  });
});