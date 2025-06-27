const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database.js');
const userRoutes = require('./routes/user.routes.js');
const articleRoutes = require('./routes/article.routes.js');
const { connectRabbitMQ } = require('./services/rabbitmq.service.js');

dotenv.config();

const app = express();

const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'PORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is missing!`);
    process.exit(1);
  }
});

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (err) {
    console.error('DB connection failed:', err);
  }

  try {
    await sequelize.sync({ alter: false });
    console.log('Database synchronized!');
  } catch (err) {
    console.error('Database synchronization failed:', err);
  }

  try {
    await connectRabbitMQ();
    console.log('RabbitMQ connected!');
  } catch (err) {
    console.error('RabbitMQ connection failed:', err);
    process.exit(1);
  }
});