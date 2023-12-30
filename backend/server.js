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

        const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin }, JWT_SECRET, { expiresIn: '5m' });
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

app.get('/api/user/role', verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    if (req.user) {
        // Send back whether the user is an admin
        console.log(req.user);
        res.json({ isAdmin: req.user.isAdmin });
    } else {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.get('/api/books', (req, res) => {
  const query = `
  SELECT Books.*, Authors.Name as AuthorName
  FROM Books
  JOIN Authors ON Books.AuthorID = Authors.AuthorID;
`;

app.get('/api/books/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  const query = `
      SELECT Books.*, Authors.Name AS AuthorName 
      FROM Books 
      JOIN Authors ON Books.AuthorID = Authors.AuthorID 
      WHERE Books.BookID = ?`;

  pool.query(query, [bookId], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error fetching book details', error: error.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Book not found' });
      }

      const book = results[0];
      res.json(book);
  });
});


pool.query(query, (error, results) => {
  if (error) {
    return res.status(500).json({ error });
  }
  res.json(results);
});
});

app.post('/api/books', verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
  const { title, summary, isbn, publishedDate, coverImage, authorName } = req.body;

  // First, check if the author exists
  pool.query('SELECT AuthorID FROM Authors WHERE Name = ?', [authorName], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error checking author', error: error.message });
      }

      let authorId;

      if (results.length > 0) {
          // Author exists
          authorId = results[0].AuthorID;
          insertBook();
      } else {
          // Author doesn't exist, insert new author
          pool.query('INSERT INTO Authors (Name) VALUES (?)', [authorName], (error, results) => {
              if (error) {
                  return res.status(500).json({ message: 'Error adding author', error: error.message });
              }

              authorId = results.insertId;
              insertBook();
          });
      }

      function insertBook() {
          // Now insert the book with the authorId
          const query = 'INSERT INTO Books (Title, Summary, ISBN, PublishedDate, CoverImage, AuthorID) VALUES (?, ?, ?, ?, ?, ?)';
          pool.query(query, [title, summary, isbn, publishedDate, coverImage, authorId], (error, results) => {
              if (error) {
                  return res.status(500).json({ message: 'Error adding book', error: error.message });
              }
              res.status(201).json({ message: 'Book added successfully', bookId: results.insertId });
          });
      }
  });
});


app.delete('/api/books/:id', verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
  const bookId = req.params.id;
  // Add SQL query to delete a book
  pool.query('DELETE FROM Books WHERE id = ?', [bookId], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error deleting book', error: error.message });
      }
      res.status(200).json({ message: 'Book deleted successfully' });
  });
});

app.get('/api/user/bookloans', verifyToken, (req, res) => {
    
    const userId = req.user.userId; // Assuming userId is set by the verifyToken middleware

    pool.query(
        'SELECT * FROM BookLoans WHERE UserID = ?',
        [userId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching book loans', error: error.message });
            }

            res.json(results); // Send the book loans data to the client
            console.log(results);
        }
    );
});

app.get('/api/user/loans/:email', verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    const userEmail = req.params.email;
    console.log(userEmail);
    pool.query(
        'SELECT bl.LoanID, b.Title AS BookTitle, bl.LoanDate, bl.ReturnDate FROM BookLoans AS bl INNER JOIN Users AS u ON bl.UserID = u.UserID INNER JOIN Books AS b ON bl.BookID = b.BookID WHERE u.Email = ?',
        [userEmail],
        (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching book loans', error: error.message });
            }
            res.json(results);
            console.log(results);
        }
    );
});
app.delete('/api/loans/:loanId', verifyToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    const loanId = req.params.loanId;

    try {
        await pool.query('DELETE FROM BookLoans WHERE LoanID = ?', [loanId]);
        res.json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting loan', error: error.message });
    }
});


app.post('/api/bookloans', verifyToken, (req, res) => {
    // Assuming the request body contains a user ID and an array of book IDs
    const userId = req.user.userId;
    const bookIds = req.body.bookIds;

    if (!bookIds || bookIds.length === 0) {
        return res.status(400).json({ message: 'No books provided for loan' });
    }

    const loanDate = new Date();
    const returnDate = new Date(loanDate);
    returnDate.setMonth(loanDate.getMonth() + 1); // Set return date to one month later
    console.log(userId, bookIds, loanDate, returnDate);
    bookIds.forEach(bookId => {
        pool.query(
            'INSERT INTO BookLoans (BookID, UserID, LoanDate, ReturnDate) VALUES (?, ?, ?, ?)',
            [bookId, userId, loanDate, returnDate],
            (error) => {
                if (error) {
                    // Handle error properly (note: this simple loop does not handle partial failures well)
                    console.error('Error creating book loan:', error);
                }
            }
        );
    });

    res.json({ message: 'Loan created successfully' });
});

app.get('/api/users/search', verifyToken,async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
  const { email } = req.query;

  pool.query('SELECT UserID, Email, IsAdmin FROM Users WHERE Email = ?', [email], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error searching for user', error: error.message });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      console.log(results[0]);
      res.json(results[0]);
  });
});


app.put('/api/users/:id/role',verifyToken, (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
  const userId = req.params.id;
  const { newRole } = req.body;
  const isAdmin = newRole ? '1' : '0';
console.log(isAdmin);
console.log(userId);
  // Add SQL query to update user's role
  pool.query('UPDATE Users SET IsAdmin = ? WHERE UserID = ?', [isAdmin, userId], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Error updating user role', error: error.message });
      }
      res.status(200).json({ message: 'User role updated successfully' });
  });
});

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