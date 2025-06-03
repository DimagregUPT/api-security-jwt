// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { BadRequestError, UnauthorizedError, ConflictError } = require('../middleware/errorHandler');
const userRepository = require('../database/userRepository');
const { generateToken } = require('../middleware/jwtAuth');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res, next) => {  try {
    const { username, email, password, admin } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      throw new BadRequestError('Please provide username, email and password');
    }

    // Check if admin
    const isAdmin = admin === (process.env.ADMIN_SECRET ?? 'admin');

    // Check if user already exists
    const existingUser = await userRepository.getByUsername(username);
    if (existingUser) {
      throw new ConflictError('Username already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user with default 'user' role
    const newUser = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: isAdmin ? 'admin' : 'user'
    });
    
    // Generate JWT
    const token = generateToken(newUser);
    
    // Return user info and token (exclude password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError('Please provide username and password');
    }

    const user = await userRepository.getByUsername(username);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;