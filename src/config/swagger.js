const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Blog API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000', // API Base URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/swaggerRoutes/*.js'], // Scan route files for Swagger documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;