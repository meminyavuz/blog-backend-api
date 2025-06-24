const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const registerDTO = require('../dtos/register.dto');
const loginDTO = require('../dtos/login.dto');


const register = async (req, res) => {
    try {
    const { error } = registerDTO.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { fullName, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already used' });

    const user = await User.create({ fullName, email, password });

    // RabbitMQ kullanarak email doğrulama isteği gönderilecek.

    res.status(201).json({ message: 'User registered. Please verify email.' });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try 
    {
        const { error } = loginDTO.validate(req.body);
        if (error) {
        return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.validatePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
        return res.status(403).json({ message: 'Email not verified' });
        }

        const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.status(200).json({ token });
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
};
module.exports = { register, login };
