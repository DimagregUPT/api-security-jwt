/**
 * JWT Authentication Middleware
 */
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('./errorHandler');

// Load environment variables
require('dotenv').config();

// JWT secret key should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object (exclude sensitive data like password)
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return next(new UnauthorizedError('Access denied. No token provided.'));
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    // Let the error handler middleware deal with specific JWT errors
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of roles allowed to access the resource
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // verifyToken should be called before this middleware
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      next(new ForbiddenError('Insufficient permissions'));
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authorize
};