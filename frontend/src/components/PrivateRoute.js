import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente de ruta privada
const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('access_token');  // Verifica si hay token en el localStorage

  return token ? Component : <Navigate to="/" />;  // Redirige si no hay token
};

export default PrivateRoute;
