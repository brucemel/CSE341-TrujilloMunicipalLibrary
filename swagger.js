const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Biblioteca Municipal de Trujillo API',
    description: 'Library Management System API - CSE 341 Final Project Week 05',
    version: '1.0.0',
    contact: {
      name: 'Bruce Melendez',
      email: 'mel21048@byui.edu'
    }
  },
  host: process.env.HOST || 'localhost:3000',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
  tags: [
    {
      name: 'Books',
      description: 'Endpoints for managing library books'
    },
    {
      name: 'Users',
      description: 'Endpoints for managing library members and staff'
    }
  ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully');
  console.log('File: swagger-output.json');
}).catch(err => {
  console.error('Error generating swagger:', err);
});