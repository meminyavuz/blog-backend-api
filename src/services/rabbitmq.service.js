const amqp = require('amqplib');

let channel;

// RabbitMQ bağlantısını kur
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
  } catch (err) {
    console.error('RabbitMQ connection failed:', err);
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