const jwt = require('jsonwebtoken');
const User = require('../models/user.models/user.model'); // User modelini içe aktar

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      roleId: decoded.roleId 
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

  
module.exports = { authenticate };
