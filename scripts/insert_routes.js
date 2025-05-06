// Node.js script to insert CFR routes from CSV file into SQLite database
// File: insert_routes.js

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const dbPath = '../data/database.sqlite';
const csvPath = './train_routes.csv';

if (!fs.existsSync(dbPath)) {
  console.error('Database file not found at:', dbPath);
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found at:', csvPath);
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database');
});

const trainRoutes = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (data) => {
    trainRoutes.push(data);
  })
  .on('end', () => {
    console.log(`Loaded ${trainRoutes.length} train routes from CSV file`);
    deleteExistingRoutes();
  })
  .on('error', (error) => {
    console.error('Error reading CSV file:', error);
    process.exit(1);
  });

function deleteExistingRoutes() {
  console.log('Deleting existing train routes...');
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.run('DELETE FROM train_routes', function(err) {
      if (err) {
        console.error('Error deleting existing routes:', err.message);
        db.run('ROLLBACK');
        process.exit(1);
      }
      
      console.log(`Deleted ${this.changes} existing train routes`);
      
      db.run("DELETE FROM sqlite_sequence WHERE name='train_routes'", function(err) {
        if (err) {
          console.error('Warning: Could not reset ID sequence:', err.message);
          // Continue anyway
        } else {
          console.log('Successfully reset train_routes ID counter');
        }
        
        db.run('COMMIT', function(err) {
          if (err) {
            console.error('Error committing transaction:', err.message);
            process.exit(1);
          }
          
          insertRoutes();
        });
      });
    });
  });
}

function insertRoutes() {
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    const stmt = db.prepare('INSERT INTO train_routes (train_id, departure_time, arrival_time, station_from, station_to) VALUES (?, ?, ?, ?, ?)');
    
    let insertCount = 0;
    
    trainRoutes.forEach(route => {
      stmt.run(
        route.train_id,
        route.departure_time,
        route.arrival_time,
        route.station_from,
        route.station_to,
        function(err) {
          if (err) {
            console.error('Error inserting record:', err.message, route);
          } else {
            insertCount++;
          }
        }
      );
    });
    
    stmt.finalize();
    
    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Error committing transaction:', err.message);
      } else {
        console.log(`Successfully inserted ${insertCount} train routes into the database.`);
      }
    
      db.close();
    });
  });
}

console.log('Reading train routes from CSV file...');