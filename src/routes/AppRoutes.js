import React from 'react';
import { Routes, Route } from 'react-router-dom';import HomePage from '../pages/HomePage';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../components/Register';
//import PrivateRoute from '../components/PrivateRoute';
import BookCatalog from '../pages/BookCatalog'; 
import BookDetail from '../pages/BookDetail';
import AdminDashboard from '../pages/adminDashboard';
import Cart from '../pages/Cart';
const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books" element={<BookCatalog />} />
        <Route path="/book/:bookId" element={<BookDetail />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
  );
};

export default AppRoutes;
