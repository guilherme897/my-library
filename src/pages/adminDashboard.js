// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // If you have a custom Axios config
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';
const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);

    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    // State for adding a new book
    const [newBook, setNewBook] = useState({ title: '', author: '' });

    const [searchUserEmail, setSearchUserEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
   

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin-dashboard')
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
    }, []);
    const handleAddBook = async (bookData) => {
        await axios.post('http://localhost:5000/api/books', bookData);
        // Update state or re-fetch books
    };

    const handleSearchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?email=${searchUserEmail}`);
            setSelectedUser(response.data); // Assuming the backend returns the user object
            console.log(response.data);
        } catch (error) {
            console.error('Error searching user:', error);
            setError(error.response ? error.response.data.message : 'Error occurred');
        }
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

   
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
    {/* ... Book Management Section ... */}

    {/* User Management Section */}
    <Paper sx={{ my: 2, p: 2 }}>
        <h2>User Management</h2>
        <TextField
            label="Search User by Email"
            value={searchUserEmail}
            onChange={(e) => setSearchUserEmail(e.target.value)}
        />
        <Button onClick={handleSearchUser}>Search</Button>

        {selectedUser && (
            <div>
                <p>Email: {selectedUser.Email}</p>
                <p>Current Role: {selectedUser.IsAdmin ? 'Admin' : 'User'}</p>
                <Button onClick={() => handleChangeUserRole(!selectedUser.IsAdmin)}>
                    {selectedUser.IsAdmin ? 'Demote to User' : 'Promote to Admin'}
                </Button>
            </div>
        )}
    </Paper>
</Container>
    );
};

export default AdminDashboard;
