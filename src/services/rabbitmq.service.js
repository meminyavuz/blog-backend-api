const amqp = require('amqplib');

let channel;

// RabbitMQ bağlantısını kur ve kanalı başlat
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST || 'rabbitmq',
      port: process.env.RABBITMQ_PORT || 5672,
      username: process.env.RABBITMQ_USER || 'guest',
      password: process.env.RABBITMQ_PASS || 'guest',
    });

    channel = await connection.createChannel(); // Kanalı oluştur
    console.log('RabbitMQ channel initialized!');
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
  }
};

// Mesajı RabbitMQ kuyruğuna gönder
const sendToQueue = async (queue, message) => {
  if (!channel) {
    console.error('RabbitMQ channel is not initialized.');
    return;
  }
  try {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue "${queue}":`, message);
  } catch (err) {
    console.error('Failed to send message to queue:', err);
  }
};

module.exports = { connectRabbitMQ, sendToQueue };