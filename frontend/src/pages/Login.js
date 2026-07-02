import React, { useState } from 'react';
import { loginUser } from '../api/auth';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(credentials);

            // 1. Enterprise Storage Guard: Persist JWT and metadata safely 
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userRoles', JSON.stringify(data.roles)); // Assuming array format from backend

            // 2. Route redirection
            alert('Login successful! Welcome to the Document Workspace.');
            window.location.href = '/my-documents'; // Force context refresh to apply token globally

        } catch (err) {
            setError(err.response?.data || 'Invalid email credentials or password authentication failure.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Workspace Authentication</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email Address:</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default Login;