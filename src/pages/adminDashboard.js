// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // If you have a custom Axios config
import { Container, Paper, Table, TableBody, TableCell, TableContainer, Grid, TableHead, TableRow, Button, TextField, Snackbar } from '@mui/material';
const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);
    /*
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    // State for adding a new book
    const [newBook, setNewBook] = useState({ title: '', author: '' });
*/
    const [newBook, setNewBook] = useState({
        title: '',
        authorName: '',
        summary: '',
        isbn: '',
        publishedDate: '',
        coverImage: ''
    });
    const [searchUserEmail, setSearchUserEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [userLoanSearchEmail, setUserLoanSearchEmail] = useState('');
    const [userLoans, setUserLoans] = useState([]);

    
    
    useEffect(() => {
        const fetchData = async () => {
        await axios.get('http://localhost:5000/api/admin-dashboard')
            .then(response => {
                // Handle the response data
                setAdminData(response.data);
                setIsLoading(false);
                console.log(response.data);
                })
            .catch(error => {
                // Handle the error
                setError(error.response ? error.response.data.message : 'Error occurred');
                setIsLoading(false);
            });
        }
        fetchData();
    }, []);
    const handleAddBook = async () => {
        // Send data to the server
        try {
            const response = await axios.post('http://localhost:5000/api/books', newBook);
            console.log(response.data);
            // Clear form or give feedback
            setNewBook({ title: '', authorName: '', summary: '', isbn: '', publishedDate: '', coverImage: '' });
        } catch (error) {
            console.error('Error adding book:', error);
            // Handle error
        }
    };

    const handleInputChange = (e) => {
        setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };
    
    const handleSearchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?email=${searchUserEmail}`);
            setSelectedUser(response.data); // Assuming the backend returns the user object
            console.log(response.data);
        } catch (error) {
            console.error('Error searching user:', error);
            setSnackbarMessage('Utilizador não encontrado ');
            setOpenSnackbar(true);        }
    };

    const handleChangeUserRole = async (newRole) => {
        if (!selectedUser) return;
    
        try {
            await axios.put(`http://localhost:5000/api/users/${selectedUser.UserID}/role`, { newRole });
            // Handle success (maybe show a confirmation message)
            setSelectedUser(null); // Reset selected user
            setSearchUserEmail(''); // Reset search field
        } catch (error) {
            console.error('Error updating user role:', error);
            setError(error.response ? error.response.data.message : 'Error occurred');
        }
    };
    
    // Delete book
    const handleDeleteBook = async (bookId) => {
        //await axios.delete(`/api/books/${bookId}`);
        // Update state or re-fetch books
    };

    const handleUserLoanSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/loans/${userLoanSearchEmail}`);
            setUserLoans(response.data);
        } catch (error) {
            console.error('Error fetching user loans:', error);
            // Handle errors (e.g., user not found, server error)
        }
    };
    

    const handleMarkAsReturned = async (loanId) => {
        try {
            await axios.delete(`http://localhost:5000/api/loans/${loanId}`);
            setUserLoans(prevLoans => prevLoans.filter(loan => loan.LoanID !== loanId));
            // Show a success message
        } catch (error) {
            console.error('Error marking loan as returned:', error);
            // Handle errors
        }
    };
    
        

    const handleCloseSnackbar = (event, reason) => {
        setOpenSnackbar(false);
    };

    if (isLoading) {
        return <div>A carregar...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
    {/* ... Book Management Section ... */}
    <Paper sx={{ my: 2, p: 2 }}>
                <h2>Gestão de Livros</h2>
                <form onSubmit={(e) => {e.preventDefault(); handleAddBook();}}>
                    <Grid container spacing={2}>
                        {/* Input fields for book details */}
                        {/* Repeat the pattern below for each attribute of newBook */}
                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Titulo"
                                name="title"
                                value={newBook.title}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* Author Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nome do Autor"
                                name="authorName"
                                value={newBook.authorName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* Summary */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descrição"
                                name="summary"
                                value={newBook.summary}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        {/* ISBN */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="ISBN"
                                name="isbn"
                                value={newBook.isbn}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* Published Date */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Data publicação"
                                name="publishedDate"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={newBook.publishedDate}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        {/* Cover Image URL */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Link Imagem da capa"
                                name="coverImage"
                                value={newBook.coverImage}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Add Book
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
    {/* User Management Section */}
    <Paper sx={{ my: 2, p: 2 }}>
        <h2>Gestão de utilizadores</h2>
        <TextField
            label="Procurar utilizador através de Email"
            value={searchUserEmail}
            onChange={(e) => setSearchUserEmail(e.target.value)}
        />
        <Button onClick={handleSearchUser}>Procurar</Button>

        {selectedUser && (
            <div>
                <p>Email: {selectedUser.Email}</p>
                <p>Cargo: {selectedUser.IsAdmin ? 'Admin' : 'Cliente'}</p>
                <Button onClick={() => handleChangeUserRole(!selectedUser.IsAdmin)}>
                    {selectedUser.IsAdmin ? 'Promover a cliente' : 'Promover a Admin'}
                </Button>
            </div>
        )}
    </Paper>
    <Paper sx={{ my: 2, p: 2 }}>
    <h2>Return User Book Loans</h2>
    <TextField
        label="User Email"
        value={userLoanSearchEmail}
        onChange={(e) => setUserLoanSearchEmail(e.target.value)}
    />
    <Button onClick={handleUserLoanSearch}>Search Loans</Button>

    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID da requisição</TableCell>
                    <TableCell>Livro</TableCell>
                    <TableCell>Data da requisição</TableCell>
                    <TableCell>Data Limite para entrega</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {userLoans.map((loan) => (
                    <TableRow key={loan.LoanID}>
                        <TableCell>{loan.LoanID}</TableCell>
                        <TableCell>{loan.BookTitle}</TableCell>
                        <TableCell>{loan.LoanDate}</TableCell>
                        <TableCell>{loan.ReturnDate}</TableCell>
                        <TableCell>
                            <Button 
                                color="primary" 
                                variant="contained"
                                onClick={() => handleMarkAsReturned(loan.LoanID)}
                            >
                                Marcar como Devolvido
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
</Paper>

    <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
</Container>
    );
};

export default AdminDashboard;
