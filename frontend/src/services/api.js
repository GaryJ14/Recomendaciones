import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Registro
export const register = async (payload) => {
  try {
    const response = await api.post('/registro/', payload);
    if (response.data && response.data.access_token) {
      return response.data; // retorna token + user data
    } else {
      throw new Error('Error desconocido');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Error al registrar usuario');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post('/login/', { email, password });
    if (response.data && response.data.access_token) {
      return response.data;
    } else {
      throw new Error('Error desconocido');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Email o contraseña incorrectos');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Petición protegida con token
export const makeProtectedRequest = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No autenticado. Por favor, inicie sesión.');

  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (data) config.data = data;

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Error en la solicitud protegida');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error desconocido');
    }
  }
};
