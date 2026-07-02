import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainDashboard from './components/mainDashboard'; // Points to your existing component file
import './App.css';

function App() {

  // Helper function to dynamically check auth status on each route change
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token; // Returns true if a token exists, false otherwise
  };

  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Route: 
          If authenticated, it mounts your MainDashboard workspace component.
          If unauthenticated, it drops traffic directly back to /login.
        */}
        <Route
          path="/dashboard"
          element={
            checkAuth() ? (
              <div className="App" style={{ margin: 0, padding: 0, overflow: 'hidden', height: '100vh', width: '100vw' }}>
                <MainDashboard />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all global fallback: Redirects root or broken routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;