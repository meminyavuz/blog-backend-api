const rateLimit = require('express-rate-limit');

// Şifre sıfırlama için rate limiting
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // 15 dakika içinde en fazla 5 istek
    message: 'Too many password reset requests from this IP, please try again after 15 minutes.',
});

// Email doğrulama için rate limiting
const emailVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // 15 dakika içinde en fazla 5 istek
    message: 'Too many email verification requests from this IP, please try again after 15 minutes.',
});

module.exports = { forgotPasswordLimiter, emailVerificationLimiter };