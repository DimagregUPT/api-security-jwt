const express = require('express');
const { userRepository, taskRepository } = require('../database');
const router = express.Router();

// User routes
router.get('/users', async (req, res) => {
  try {
    const users = await userRepository.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userRepository.getById(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    const user = await userRepository.create({ username, email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // SQLite unique constraint error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;
    
    const updated = await userRepository.update(userId, userData);
    if (!updated) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }
    
    const user = await userRepository.getById(userId);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // First delete all tasks belonging to this user
    await taskRepository.deleteByUserId(userId);
    
    // Then delete the user
    const deleted = await userRepository.delete(userId);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router; 