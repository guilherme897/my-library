import React from 'react';
import { Routes, Route } from 'react-router-dom';import HomePage from '../pages/HomePage';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../components/Register';
import BookCatalog from '../pages/BookCatalog'; 

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BookCatalog />} />
      </Routes>
  );
};

export default AppRoutes;
