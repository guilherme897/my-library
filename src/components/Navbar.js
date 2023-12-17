import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Navbar = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Cookies: ", document.cookie);
  }, []);
  const isUserLoggedIn = () => {
    console.log(document.cookie);
    return !!document.cookie.split('; ').find(row => row.startsWith('session_token='));
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToBooks = () => {
    navigate('/books');
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/');
      window.location.reload(); // To refresh the page and update the authentication state
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          color="inherit" 
          noWrap 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={navigateToHome}
        >
          My Online Library
        </Typography>
        <Box>
          <Button color="primary" onClick={navigateToBooks}>
            Livros
          </Button>
          {isUserLoggedIn() ? (
            <Button color="primary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="primary" onClick={navigateToLogin}>
              Log In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
