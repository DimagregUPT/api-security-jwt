const express = require('express');
const { userRepository, trainRouteRepository } = require('../database');
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
    
    // Delete the user
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

// Train routes endpoints
router.get('/train-routes', async (req, res) => {
  try {
    const routes = await trainRouteRepository.getAll();
    res.json(routes);
  } catch (error) {
    console.error('Error fetching train routes:', error);
    res.status(500).json({ error: 'Failed to fetch train routes' });
  }
});

router.get('/train-routes/:id', async (req, res) => {
  try {
    const route = await trainRouteRepository.getById(parseInt(req.params.id));
    if (!route) {
      return res.status(404).json({ error: 'Train route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error('Error fetching train route:', error);
    res.status(500).json({ error: 'Failed to fetch train route' });
  }
});

router.get('/train-routes/train/:trainId', async (req, res) => {
  try {
    const routes = await trainRouteRepository.getByTrainId(req.params.trainId);
    if (routes.length === 0) {
      return res.status(404).json({ error: 'No routes found for this train' });
    }
    res.json(routes);
  } catch (error) {
    console.error('Error fetching train routes:', error);
    res.status(500).json({ error: 'Failed to fetch train routes' });
  }
});

router.get('/train-routes/search', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Both from and to stations are required' });
    }
    
    const routes = await trainRouteRepository.searchByStations(from, to);
    res.json(routes);
  } catch (error) {
    console.error('Error searching train routes:', error);
    res.status(500).json({ error: 'Failed to search train routes' });
  }
});

router.post('/train-routes', async (req, res) => {
  try {
    const { train_id, departure_time, arrival_time, station_from, station_to } = req.body;
    
    if (!train_id || !departure_time || !arrival_time || !station_from || !station_to) {
      return res.status(400).json({ 
        error: 'All fields are required: train_id, departure_time, arrival_time, station_from, station_to' 
      });
    }
    
    const route = await trainRouteRepository.create({ 
      train_id, 
      departure_time, 
      arrival_time, 
      station_from, 
      station_to 
    });
    
    res.status(201).json(route);
  } catch (error) {
    console.error('Error creating train route:', error);
    res.status(500).json({ error: 'Failed to create train route' });
  }
});

router.put('/train-routes/:id', async (req, res) => {
  try {
    const routeId = parseInt(req.params.id);
    const routeData = req.body;
    
    const updated = await trainRouteRepository.update(routeId, routeData);
    if (!updated) {
      return res.status(404).json({ error: 'Train route not found or no changes made' });
    }
    
    const route = await trainRouteRepository.getById(routeId);
    res.json(route);
  } catch (error) {
    console.error('Error updating train route:', error);
    res.status(500).json({ error: 'Failed to update train route' });
  }
});

router.delete('/train-routes/:id', async (req, res) => {
  try {
    const routeId = parseInt(req.params.id);
    
    const deleted = await trainRouteRepository.delete(routeId);
    if (!deleted) {
      return res.status(404).json({ error: 'Train route not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting train route:', error);
    res.status(500).json({ error: 'Failed to delete train route' });
  }
});

module.exports = router;