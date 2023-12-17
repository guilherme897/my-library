import React from 'react';
import { Routes, Route } from 'react-router-dom';import HomePage from '../pages/HomePage';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../components/Register';
//import PrivateRoute from '../components/PrivateRoute';
import BookCatalog from '../pages/BookCatalog'; 
import AdminDashboard from '../pages/adminDashboard';
const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BookCatalog />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
  );
};

export default AppRoutes;
