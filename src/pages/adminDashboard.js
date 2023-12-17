// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // If you have a custom Axios config

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/admin-dashboard')
            .then(response => {
                // Handle the response data
                setAdminData(response.data);
                setIsLoading(false);
                console.log(response.data);
            })
            .catch(error => {
                // Handle the error
                setError(error.response ? error.response.data.message : 'Error occurred');
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* Render your admin data here */}
            <p>{JSON.stringify(adminData)}</p>
        </div>
    );
};

export default AdminDashboard;
