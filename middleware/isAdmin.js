// middleware/isAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'Forbidden: No token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user role from DB or decoded token
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Not an admin' });
    }

    req.user = user; // pass user to next middleware or controller
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

module.exports = isAdmin;
