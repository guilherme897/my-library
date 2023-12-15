// src/App.js

import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { CssBaseline, Box } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Box component="main" flexGrow={1}>
          <AppRoutes />
        </Box>
        <Footer />
      </Box>
    </>
  );
}

export default App;
