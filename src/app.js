import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

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
});

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database synchronized!');
  })
  .catch((err) => {
    console.error('Database synchronization failed:', err);
  });