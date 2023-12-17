import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios'; // Make sure Axios is configured to send credentials

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/verify-token')  // Endpoint to verify token
            .then(response => {
                setUser(response.data.user);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return user && user.isAdmin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
