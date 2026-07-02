import React, { useState } from 'react';
import { registerUser } from '../api/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'SIGNER'
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.praventDefault();
        setError('');
        setMessage('');

        try {
            const data = await registerUser(formData);
            setMessage('Registration seccusessful! You can now log in.');

            // optional : redirect to login page here after a brief timeout

        } catch (err) {
            setError(err.response?.data || 'An error occured during registering.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #0000', borderRadius: '8px' }}>
            <h2> Create Workplace Account</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Username:</label>
                    <input type='text' name='username' value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />

                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email Address:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Workspace Role:</label>
                    <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="SIGNER">Signer</option>
                        <option value="VALIDATOR">Validator</option>
                        <option value="WITNESS">Witness</option>
                    </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Register
                </button>
            </form>
        </div>



    );
};

export default Register;