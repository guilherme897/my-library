// src/pages/HomePage.js

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Typography, Box } from '@mui/material';

function HomePage() {
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to My Online Library
          </Typography>
          <Typography variant="h5" gutterBottom>
            Discover a vast selection of books and resources at your fingertips.
          </Typography>
          {/* Additional content */}
        </Box>
      </Container>
      
    </>
  );
}

export default HomePage;
