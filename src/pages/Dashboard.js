import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Adjust the import path as necessary
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';

function Dashboard() {
    const [bookLoans, setBookLoans] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/user/bookloans', { withCredentials: true })
            .then(response => {
                setBookLoans(response.data);
                console.log(response);
            })
            .catch(error => {
                console.error('Error fetching book loans:', error);
                // Handle errors here, such as showing a notification to the user
            });
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Requisições
            </Typography>
            <Typography paragraph>
                Bem-vindo, aqui pode consultar os livros requisitados.
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Livros requesitados
                    </Typography>
                    {bookLoans.length > 0 ? (
                        <List>
                            {bookLoans.map((loan, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText
                                        primary={`Book ID: ${loan.BookID}`}
                                        secondary={`Loan Date: ${loan.LoanDate}, Return Date: ${loan.ReturnDate}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="textSecondary">Sem livros requesitados.</Typography>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

export default Dashboard;
