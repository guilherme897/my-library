// src/pages/BookDetail.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; 
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, Button, CardContent, Snackbar } from '@mui/material';

const BookDetail = () => {
    const [book, setBook] = useState(null);
    const { bookId } = useParams(); // Get book ID from URL parameters
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/books/${bookId}`)
            .then(response => {
                setBook(response.data);
            })
            .catch(error => {
                console.error('Error fetching book:', error);
            });
    }, [bookId]);

    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let found = cart.find(item => item.BookID === book.BookID);
        
        if (!found) {
            cart.push(book);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        setSnackbarMessage('Livro adicionado');
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    
    if (!book) {
        return <div>A carregar...</div>;
    }

    return (
        <Container maxWidth="md">
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image={book.CoverImage}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {book.Title} 
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {book.AuthorName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {book.Summary}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={addToCart}>
                        Adicionar Livro para requisição
                    </Button>
                </CardContent>
            </Card>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default BookDetail;
