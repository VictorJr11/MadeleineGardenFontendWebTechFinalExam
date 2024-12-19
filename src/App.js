import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importez vos composants
import AdminLogin from './madeleine/AdminLogin';
import Admin from './madeleine/admin';
import ProtectedRoute from './madeleine/ProtectedRoute';
import Login from './madeleine/login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route de connexion par défaut */}
        <Route path="/login" element={<Login />} />
        
        {/* Route admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Route admin protégée */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Redirection par défaut vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;