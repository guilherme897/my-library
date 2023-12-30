// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box } from '@mui/material';


function HomePage() {


    useEffect(() => {
        const sessionToken = Cookies.get('session_token');
        if (sessionToken) {
            localStorage.setItem('IsLog', 'true');
        } else {
            localStorage.setItem('IsLog', 'false');
        }
    }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Bem-vindo a Nossa Biblioteca Online
          </Typography>
          <Typography variant="h5" gutterBottom>
            Explore os nossos livros
          </Typography>
        </Box>
      </Container>
      
    </>
  );
}

export default HomePage;
