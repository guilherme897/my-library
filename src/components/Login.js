import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import axios from 'axios'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });

        // Assuming the backend sends some sort of success message
        console.log(response.data.message);
        localStorage.setItem('IsLog', 'true');
        // Redirect based on user role (admin or not)
        // This requires that the backend sends isAdmin status. Adjust as needed.
        const redirectTo = response.data.isAdmin ? '/admin-dashboard' : '/dashboard';
        navigate(redirectTo);
        window.location.reload(); // To refresh the page and update the authentication state

    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error);
        // Handle login error (show message to user, etc.)
    }
};


  const navigateToRegister = () => {
    navigate('/register'); // Adjust the route as necessary
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <Link component="button" variant="body2" onClick={navigateToRegister}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
