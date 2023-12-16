// src/components/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography, Link } from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (event) => {
    event.preventDefault();
    // Add registration logic here
    console.log('Register with:', email, password, confirmPassword);
    
    // After successful registration, you might want to navigate somewhere
    // navigate('/dashboard');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Registar
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleRegister}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registar
          </Button>
          <Typography variant="body2" align="center">
            Já tens uma conta?{' '}
            <Link component="button" variant="body2" onClick={navigateToLogin}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
