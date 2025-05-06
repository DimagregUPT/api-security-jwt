const db = require('./db');

/**
 * Train Route Repository - provides CRUD operations for train routes
 */
const trainRouteRepository = {
  /**
   * Create a new train route
   * @param {Object} route - Train route object with train_id, departure_time, arrival_time, station_from, station_to
   * @returns {Promise<Object>} - Created train route object with ID
   */
  create: (route) => {
    return new Promise((resolve, reject) => {
      const { train_id, departure_time, arrival_time, station_from, station_to } = route;
      const sql = 'INSERT INTO train_routes (train_id, departure_time, arrival_time, station_from, station_to) VALUES (?, ?, ?, ?, ?)';
      
      db.run(sql, [train_id, departure_time, arrival_time, station_from, station_to], function(err) {
        if (err) {
          return reject(err);
        }
        
        // Return the created train route with ID
        resolve({
          id: this.lastID,
          train_id,
          departure_time,
          arrival_time,
          station_from,
          station_to
        });
      });
    });
  },
  
  /**
   * Get a train route by ID
   * @param {number} id - Train route ID
   * @returns {Promise<Object>} - Train route object
   */
  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM train_routes WHERE id = ?';
      
      db.get(sql, [id], (err, route) => {
        if (err) {
          return reject(err);
        }
        
        if (!route) {
          return resolve(null);
        }
        
        resolve(route);
      });
    });
  },
  
  /**
   * Get a train route by train ID
   * @param {string} trainId - Train ID (like IR1234)
   * @returns {Promise<Array>} - Array of train route objects
   */
  getByTrainId: (trainId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM train_routes WHERE train_id = ?';
      
      db.all(sql, [trainId], (err, routes) => {
        if (err) {
          return reject(err);
        }
        
        resolve(routes);
      });
    });
  },
  
  /**
   * Get all train routes
   * @returns {Promise<Array>} - Array of train route objects
   */
  getAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM train_routes';
      
      db.all(sql, [], (err, routes) => {
        if (err) {
          return reject(err);
        }
        
        resolve(routes);
      });
    });
  },
  
  /**
   * Search train routes by stations
   * @param {string} from - Departure station
   * @param {string} to - Arrival station
   * @returns {Promise<Array>} - Array of matching train routes
   */
  searchByStations: (from, to) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM train_routes WHERE station_from = ? AND station_to = ?';
      
      db.all(sql, [from, to], (err, routes) => {
        if (err) {
          return reject(err);
        }
        
        resolve(routes);
      });
    });
  },
  
  /**
   * Update a train route
   * @param {number} id - Train route ID
   * @param {Object} routeData - Train route data to update
   * @returns {Promise<boolean>} - Success flag
   */
  update: (id, routeData) => {
    return new Promise((resolve, reject) => {
      // Prepare update fields and values
      const fields = [];
      const values = [];
      
      // Build dynamic SQL based on provided fields
      Object.keys(routeData).forEach(key => {
        if (['train_id', 'departure_time', 'arrival_time', 'station_from', 'station_to'].includes(key)) {
          fields.push(`${key} = ?`);
          values.push(routeData[key]);
        }
      });
      
      if (fields.length === 0) {
        return resolve(false);
      }
      
      // Add id to values array
      values.push(id);
      
      const sql = `UPDATE train_routes SET ${fields.join(', ')} WHERE id = ?`;
      
      db.run(sql, values, function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve(this.changes > 0);
      });
    });
  },
  
  /**
   * Delete a train route
   * @param {number} id - Train route ID
   * @returns {Promise<boolean>} - Success flag
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM train_routes WHERE id = ?';
      
      db.run(sql, [id], function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve(this.changes > 0);
      });
    });
  }
};

module.exports = trainRouteRepository;