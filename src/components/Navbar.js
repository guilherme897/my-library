import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const IsLog = JSON.parse(localStorage.getItem('IsLog'));
    setIsLoggedIn(IsLog);
  }, []);

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToBooks = () => {
    navigate('/books');
  };
  const navigateToCar = () => {
    navigate('/cart');
  };

  const navigateToDashboard = () => {
    axios.get('http://localhost:5000/api/user/role')
    .then(response => {
      console.log(response.data);
      if(response.data.isAdmin){
        navigate('/admin-dashboard');
      }else{
        navigate('/dashboard');
      }
    })
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
      navigate('/');
      localStorage.removeItem('IsLog'); // Assume token is stored in local storage
      setIsLoggedIn(false);
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
          Biblioteca
        </Typography>
        <Box>
        
            <Button color="primary" onClick={navigateToBooks}>
              Livros
            </Button>
            <Button color="primary" onClick={navigateToCar}>
              Carrinho
            </Button>
            {isLoggedIn && (
  <Button color="primary" onClick={navigateToDashboard}>
    Perfil
  </Button>
)}
          {isLoggedIn ? (
            
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
