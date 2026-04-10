const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database Configuration
const useSQLite = process.env.DB_TYPE === 'sqlite';
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'appdb',
};

let db;
let dbType = 'mysql';

function initDatabase() {
  if (useSQLite) {
    setupSQLite();
  } else {
    setupMySQL();
  }
}

function setupSQLite() {
  console.log('Using SQLite database...');
  dbType = 'sqlite';
  const dbPath = path.join(__dirname, 'database.sqlite');
  const sqliteDb = new sqlite3.Database(dbPath);
  
  sqliteDb.serialize(() => {
    sqliteDb.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
  });

  // Mock a query method similar to mysql2
  db = {
    query: (sql, params, callback) => {
      if (typeof params === 'function') {
        callback = params;
        params = [];
      }
      
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        sqliteDb.all(sql, params, callback);
      } else {
        sqliteDb.run(sql, params, function(err) {
          if (err) return callback(err);
          callback(null, { insertId: this.lastID });
        });
      }
    }
  };
  console.log('SQLite database initialized!');
}

function setupMySQL() {
  console.log('Attempting to connect to MySQL...');
  const pool = mysql.createPool(dbConfig);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Failed to connect to MySQL:', err.message);
      console.log('Falling back to SQLite...');
      setupSQLite();
    } else {
      console.log('Connected to MySQL database!');
      connection.release();
      db = pool;
      dbType = 'mysql';
    }
  });
}

initDatabase();

// GET all data
app.get('/data', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database not initialized' });
  
  db.query('SELECT * FROM messages ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// POST new data
app.post('/data', (req, res) => {
  if (!db) return res.status(503).json({ error: 'Database not initialized' });
  
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  db.query('INSERT INTO messages (content) VALUES (?)', [content], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ id: result.insertId, message: 'Success' });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
