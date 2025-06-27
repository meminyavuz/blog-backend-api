const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, updateProfile, verifyEmail, assignRole } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { forgotPasswordLimiter, emailVerificationLimiter } = require('../middlewares/rateLimit.middleware');
const { isAdmin } = require('../middlewares/authorization.middleware');


router.post('/register', register); 
router.post('/login', login);
router.post('/forgot-password', forgotPassword, forgotPasswordLimiter);
router.post('/reset-password/:token', resetPassword);
router.put('/profile', authenticate, updateProfile);
router.get('/verify/:token', verifyEmail, emailVerificationLimiter); 

// Admin işlemleri
router.put('/assign-role', authenticate, isAdmin, assignRole);


module.exports = router;
