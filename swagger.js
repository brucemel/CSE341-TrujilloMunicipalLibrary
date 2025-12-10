const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Municipal Library of Trujillo API',
    description: 'Library Management System API - CSE 341 Final Project',
    version: '1.0.0',
    contact: {
      name: 'Bruce Melendez',
      email: 'bruce@example.com'
    }
  },
  host: 'localhost:3000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Books',
      description: 'Endpoints for managing library books'
    },
    {
      name: 'Users',
      description: 'Endpoints for managing library members and staff'
    },
    {
      name: 'Categories',
      description: 'Endpoints for managing book categories'
    },
    {
      name: 'Loans',
      description: 'Endpoints for managing book loans'
    },
    {
      name: 'Authentication',
      description: 'Endpoints for user authentication'
    }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT token'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully');
  require('./server.js');
});