import axios from "axios";

const API_BASE = "http://localhost:8000/api";

// Función para obtener el token de localStorage
const getAuthToken = () => {
  return localStorage.getItem('access_token');  // Devuelve el token almacenado en localStorage
};

// Configuración de los headers con el token de autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,  // Incluye el token en los headers
    };
  }
  return {};
};

export const obtenerUsuarios = () => {
  return axios.get(`${API_BASE}/usuarios/`, {
    headers: getAuthHeaders(),  // Incluir los headers en la solicitud
  });
};
export const obtenerUsuario = async (token) => {
  try {
    const response = await axios.get("http://localhost:8000/api/perfil/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("No se pudo obtener los datos del usuario");
  }
};
export const crearUsuario = (usuario) => {
  return axios.post(`${API_BASE}/registro/`, usuario, {
    headers: getAuthHeaders(),  // Incluir los headers en la solicitud
  });
};

export const actualizarUsuario = (id, usuario) => {
  return axios.put(`${API_BASE}/actualizar/${id}/`, usuario, {
    headers: getAuthHeaders(),  // Incluir los headers en la solicitud
  });
};

export const eliminarUsuario = (id) => {
  return axios.delete(`${API_BASE}/eliminar/${id}/`, {
    headers: getAuthHeaders(),  // Incluir los headers en la solicitud
  });
};
