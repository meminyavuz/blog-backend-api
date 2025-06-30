const amqp = require('amqplib');
const nodemailer = require('nodemailer');
require('dotenv').config();

const consumeQueue = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('emailQueue', { durable: true });

    console.log('Waiting for messages in emailQueue...');
    channel.consume('emailQueue', async (msg) => {
      const { email, subject, body } = JSON.parse(msg.content.toString());

      // Email gönderimi
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: body,
      });

      console.log(`Email sent to ${email}`);
      channel.ack(msg);
    });
  } catch (err) {
    console.error('Error consuming email queue:', err);
  }
};

module.exports = { consumeQueue };