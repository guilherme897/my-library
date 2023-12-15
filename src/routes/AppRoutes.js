import React from 'react';
import { Routes, Route } from 'react-router-dom';import HomePage from '../pages/HomePage';
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
  );
};

export default AppRoutes;
