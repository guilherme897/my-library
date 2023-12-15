import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          My Online Library
        </Typography>
        <Box>
          <Button color="primary" onClick={navigateToLogin}>
            Search
          </Button>
          <Button color="primary" onClick={navigateToLogin}>
            Quem Somos
          </Button>
          <Button color="primary" onClick={navigateToLogin}>
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
