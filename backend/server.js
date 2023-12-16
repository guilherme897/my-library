const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = process.env.PORT || 5000;

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // The maximum number of connections to create at once.
  host: 'localhost',   // Database host
  user: 'admin1',        // Database user
  password: '/Teste123/',        // Database password
  database: 'biblioteca' // Database name
});

// Middleware to parse JSON bodies
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Adjust the origin according to your frontend
app.use(express.json());

// Test endpoint to fetch data from Books table
app.get('/api/books', (req, res) => {
    const query = `
    SELECT Books.*, Authors.Name as AuthorName
    FROM Books
    JOIN Authors ON Books.AuthorID = Authors.AuthorID;
  `;

  pool.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }
    res.json(results);
  });
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const query = 'INSERT INTO Users (Email, Password) VALUES (?, ?)';
    pool.query(query, [email, hashedPassword], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'User created successfully', userId: results.insertId });
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM Users WHERE Email = ?', [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0 || !(await bcrypt.compare(password, results[0].Password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin }, "teste", { expiresIn: '1h' });

        res.json({ token, isAdmin: user.IsAdmin });
        });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    pool.end((err) => {
      if (err) {
        console.error('Failed to close MySQL pool connections', err);
      } else {
        console.log('MySQL pool closed');
        process.exit(0);
      }
    });
  });
  