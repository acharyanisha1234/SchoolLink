const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeRole = (role = '') => String(role).trim().toUpperCase();

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please login again.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    const allowed = roles.map(normalizeRole);
    const userRole = normalizeRole(req.user && req.user.role);

    if (!userRole || !allowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`
      });
    }
    next();
  };
};

exports.auth = exports.protect;