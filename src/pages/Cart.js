import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button, Grid, Snackbar } from '@mui/material';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
    }, []);

    const handleRemoveFromCart = (bookId) => {
        const updatedCart = cartItems.filter(item => item.BookID !== bookId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleConfirmCart = () => {
        // Check if user is logged in
        const userLog = localStorage.getItem('IsLog'); // Adjust based on your token storage
        if (!userLog) {
            // Redirect to login page
            setSnackbarMessage('Porfavor inicie sessão ou registe-se para poder comprar');
            setOpenSnackbar(true);
            setTimeout(() => {
            navigate('/login');
        }, 3000); // Adjust the delay as needed (2000 milliseconds = 2 seconds)

            return;
        }

        const bookIds = cartItems.map(item => item.BookID);

        axios.post('http://localhost:5000/api/bookloans', { bookIds })
            .then(response => {
                //setSnackbarMessage('Requesição criada com sucesso!');
                //setOpenSnackbar(true);
                // Optionally clear the cart after successful creation
                setCartItems([]);
                localStorage.setItem('cart', JSON.stringify([]));
            })
            .catch(error => {
                setSnackbarMessage('Erro ao processar requisição ' + error.message);
                setOpenSnackbar(true);
            });
        // Proceed with confirming the cart
        setSnackbarMessage('Requesiçao confirmada');
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Confirmar livros
            </Typography>
            <List>
                {cartItems.map((item, index) => (
                    <ListItem key={index} secondaryAction={
                        <Button color="secondary" onClick={() => handleRemoveFromCart(item.BookID)}>
                            Remover Livro
                        </Button>
                    }>
                        <ListItemText primary={item.Title} secondary={`Autor: ${item.AuthorName}`} />
                    </ListItem>
                ))}
            </List>
            {cartItems.length > 0 && (
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleConfirmCart}>
                            Confirmar
                        </Button>
                    </Grid>
                </Grid>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default Cart;
