const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const registerDTO = require('../dtos/user.dtos/register.dto');
const loginDTO = require('../dtos/user.dtos/login.dto');
const forgotPasswordDTO = require('../dtos/user.dtos/forgotPassword.dto');
const resetPasswordDTO = require('../dtos/user.dtos/resetPassword.dto');
const updateProfileDTO = require('../dtos/user.dtos/updateProfile.dto');
const { sendToQueue } = require('../services/rabbitmq.service');

const register = async (req, res) => {
    try {
        const { error } = registerDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { fullName, email, password } = req.body;

        // Kullanıcı zaten var mı kontrol et
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: 'Email already used' });

        // Varsayılan olarak 'reader' rolünü al
        const readerRole = await Role.findOne({ where: { name: 'reader' } });
        if (!readerRole) {
            return res.status(500).json({ message: 'Default role not found. Please seed roles first.' });
        }

        // Kullanıcıyı oluştur ve reader rolünü ata
        const user = await User.create({ fullName, email, password, roleId: readerRole.id });
        
        // Kullanıcıyı kaydettikten sonra email doğrulama token'ı oluştur
        const verificationToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // RabbitMQ kuyruğuna mesaj gönder
        await sendToQueue('emailQueue', {
            email: user.email,
            subject: 'Email Verification',
            body: `Click the link to verify your email: ${process.env.FRONTEND_URL}/verify/${verificationToken}`
        });

        res.status(201).json({ message: 'User registered. Please verify email.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
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
            {
              id: user.id,
              roleId: user.roleId, 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { error } = forgotPasswordDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await sendToQueue('emailQueue', {
            email: user.email,
            subject: 'Password Reset',
            body: `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        });

        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { error } = resetPasswordDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { error } = updateProfileDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { fullName, email, photoUrl } = req.body;

        // Kullanıcıyı bul
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Eğer email güncelleniyorsa, başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Alanları güncelle
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.photoUrl = photoUrl || user.photoUrl;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Kullanıcıyı bul ve emailini doğrula
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.isVerified) {
        return res.status(400).json({ message: 'Email is already verified.' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Verification token has expired. Please request a new verification email.' });
      }
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
  

module.exports = { register, login, forgotPassword, resetPassword, updateProfile, verifyEmail };
