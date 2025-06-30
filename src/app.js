// Core Modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Configurations
const userRoutes = require('./routes/user.routes.js');
const articleRoutes = require('./routes/article.routes.js');
const commentRoutes = require('./routes/comment.routes.js');
const requestLogger = require('./middlewares/requestLogger.middleware.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

// Load Environment Variables
dotenv.config();

// Initialize Express App
const app = express();

// Validate Required Environment Variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'PORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is missing!`);
    process.exit(1);
  }
});

// Middleware
app.use(requestLogger); 
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

module.exports = app; 