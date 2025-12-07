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
  ],
  definitions: {
    BookUpdate: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'UPDATED: To Kill a Mockingbird'
        },
        author: {
          type: 'string',
          example: 'Harper Lee'
        },
        isbn: {
          type: 'string',
          example: '9780061120084'
        },
        genre: {
          type: 'string',
          example: 'Fiction'
        },
        publicationYear: {
          type: 'integer',
          example: 1961
        },
        publisher: {
          type: 'string',
          example: 'J.B. Lippincott & Co.'
        },
        totalCopies: {
          type: 'integer',
          example: 10
        },
        availableCopies: {
          type: 'integer',
          example: 8
        },
        description: {
          type: 'string',
          example: 'Updated description'
        },
        coverImage: {
          type: 'string',
          example: 'https://via.placeholder.com/200x300'
        }
      }
    },
    Book: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'To Kill a Mockingbird'
        },
        author: {
          type: 'string',
          example: 'Harper Lee'
        },
        isbn: {
          type: 'string',
          example: '9780061120084'
        },
        genre: {
          type: 'string',
          example: 'Fiction'
        },
        publicationYear: {
          type: 'integer',
          example: 1960
        },
        publisher: {
          type: 'string',
          example: 'J.B. Lippincott & Co.'
        },
        totalCopies: {
          type: 'integer',
          example: 5
        },
        availableCopies: {
          type: 'integer',
          example: 5
        },
        description: {
          type: 'string',
          example: 'A gripping tale'
        },
        coverImage: {
          type: 'string',
          example: 'https://via.placeholder.com/200x300'
        }
      }
    },
    UserUpdate: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'jsmith'
        },
        email: {
          type: 'string',
          example: 'john@example.com'
        },
        password: {
          type: 'string',
          example: 'NewPassword123'
        },
        firstName: {
          type: 'string',
          example: 'John'
        },
        lastName: {
          type: 'string',
          example: 'Smith'
        },
        role: {
          type: 'string',
          example: 'member'
        },
        phone: {
          type: 'string',
          example: '+51987654321'
        },
        address: {
          type: 'string',
          example: 'Av. América 123'
        },
        city: {
          type: 'string',
          example: 'Trujillo'
        },
        isActive: {
          type: 'boolean',
          example: true
        }
      }
    },
    User: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'jsmith'
        },
        email: {
          type: 'string',
          example: 'john@example.com'
        },
        password: {
          type: 'string',
          example: 'Password123'
        },
        firstName: {
          type: 'string',
          example: 'John'
        },
        lastName: {
          type: 'string',
          example: 'Smith'
        },
        role: {
          type: 'string',
          example: 'member'
        },
        phone: {
          type: 'string',
          example: '+51987654321'
        },
        address: {
          type: 'string',
          example: 'Av. América 123'
        },
        city: {
          type: 'string',
          example: 'Trujillo'
        },
        isActive: {
          type: 'boolean',
          example: true
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully');
  console.log('File: swagger-output.json');
}).catch(err => {
  console.error('Error generating swagger:', err);
});