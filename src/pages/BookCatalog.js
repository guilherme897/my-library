// src/pages/BookCatalog.js

import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';


const BookCatalog = () => {
  // Example array of books
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/books') // Use your backend server's URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Book Catalog
      </Typography>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item key={book.BookID} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={book.CoverImage}
                alt={book.Title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {book.Title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {book.AuthorName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookCatalog;
