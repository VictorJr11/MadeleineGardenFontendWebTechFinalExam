import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Vérifiez si l'utilisateur est authentifié 
  // Vous pouvez utiliser localStorage, un context, ou un state global
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirige vers la page de connexion si non authentifié
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;