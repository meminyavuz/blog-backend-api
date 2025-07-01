const app = require('./app');
const { sequelize } = require('./config/database.js');
const { connectRabbitMQ } = require('./services/rabbitmq.service.js');
const { consumeQueue } = require('./services/email.consumer.js');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Database Connection
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }

  // Database Synchronization
  try {
    await sequelize.sync({ alter: false});
    console.log('Database synchronized!');
  } catch (err) {
    console.error('Database synchronization failed:', err);
    process.exit(1);
  }

  // RabbitMQ Connection
  try {
    await connectRabbitMQ();
    console.log('RabbitMQ connected!');
    await consumeQueue(); // Tüketiciyi başlat
  } catch (err) {
    console.error('RabbitMQ connection failed:', err);
    process.exit(1);
  }
});