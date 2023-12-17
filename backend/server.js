const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true // To allow cookies to be sent
}));

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // The maximum number of connections to create at once.
  host: 'localhost',   // Database host
  user: 'admin1',        // Database user
  password: '/Teste123/',        // Database password
  database: 'biblioteca' // Database name
});

const JWT_SECRET = 'YourJWTSecretKey'; // Replace with a secure key and consider using environment variables

// User Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query('INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashedPassword], (error) => {
        if (error) {
            return res.status(500).json({ message: 'Error registering new user', error: error.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// User Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    pool.query('SELECT * FROM Users WHERE Email = ?', [email], async (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const passwordValid = await bcrypt.compare(password, user.Password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin }, JWT_SECRET, { expiresIn: '30s' });
        res.cookie('session_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        res.status(200).json({ token, isAdmin: user.IsAdmin });
          });
});

// Protected Admin Route
const verifyToken = (req, res, next) => {
    const token = req.cookies.session_token;
    //console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

app.get('/api/admin-dashboard', verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Welcome to the admin dashboard' });
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
    res.clearCookie('session_token');
    res.json({ message: 'Logout successful' });
});

// Start the server
const PORT = 5000; // Replace with your desired port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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