import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import Pagination from '@mui/lab/Pagination';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Livros</Typography>
      <Grid container spacing={4}>
        {currentBooks.map((book) => (
          <Grid item key={book.BookID} xs={12} sm={6} md={4}>
            <Card onClick={() => handleBookClick(book.BookID)} style={{ cursor: 'pointer' }}>
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

      <Pagination
        count={Math.ceil(books.length / booksPerPage)}
        page={currentPage}
        onChange={(event, value) => paginate(value)}
        color="primary"
      />
    </Container>
  );
};

export default BookCatalog;
