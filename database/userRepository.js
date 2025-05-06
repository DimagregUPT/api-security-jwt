const db = require('./db');

/**
 * User Repository - provides CRUD operations for users
 */
const userRepository = {
  /**
   * Create a new user
   * @param {Object} user - User object with username, email, and password
   * @returns {Promise<Object>} - Created user object with ID
   */
  create: (user) => {
    return new Promise((resolve, reject) => {
      const { username, email, password, role } = user;
      const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
      
      db.run(sql, [username, email, password, role], function(err) {
        if (err) {
          return reject(err);
        }
        
        // Return the created user with ID
        resolve({
          id: this.lastID,
          username,
          email,
          role
        });
      });
    });
  },
  
  /**
   * Get a user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} - User object
   */
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
      
      db.get(sql, [id], (err, user) => {
        if (err) {
          return reject(err);
        }
        
        if (!user) {
          return resolve(null);
        }
        
        resolve(user);
      });
    });
  },
  
  /**
   * Get a user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} - User object including password for auth
   */
  getByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, role, password, created_at FROM users WHERE username = ?';
      
      db.get(sql, [username], (err, user) => {
        if (err) {
          return reject(err);
        }
        
        if (!user) {
          return resolve(null);
        }
        
        resolve(user);
      });
    });
  },
  
  /**
   * Get all users
   * @returns {Promise<Array>} - Array of user objects
   */
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, username, email, role, created_at FROM users';
      
      db.all(sql, [], (err, users) => {
        if (err) {
          return reject(err);
        }
        
        resolve(users);
      });
    });
  },
  
  /**
   * Update a user
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<boolean>} - Success flag
   */
  update: (id, userData) => {
    return new Promise((resolve, reject) => {
      // Prepare update fields and values
      const fields = [];
      const values = [];
      
      // Build dynamic SQL based on provided fields
      Object.keys(userData).forEach(key => {
        if (['username', 'email', 'password', 'role'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(userData[key]);
        }
      });
      
      if (fields.length === 0) {
        return resolve(false);
      }
      
      // Add id to values array
      values.push(id);
      
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      db.run(sql, values, function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve(this.changes > 0);
      });
    });
  },
  
  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} - Success flag
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE id = ?';
      
      db.run(sql, [id], function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve(this.changes > 0);
      });
    });
  }
};

module.exports = userRepository; 