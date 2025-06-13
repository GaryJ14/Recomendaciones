import axios from 'axios';

const API_URL = 'http://localhost:8000/api/contenidos/';

// Función para obtener el token almacenado en localStorage
const obtenerToken = () => localStorage.getItem('access_token');

// Obtener todos los contenidos
export const obtenerContenidos = async () => {
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Obtener contenidos filtrados por etiquetas favoritas
export const obtenerContenidosPorEtiquetasFavoritas = async () => {
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get(`${API_URL}por-etiquetas-favoritas/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Buscar contenidos por etiqueta
export const buscarContenidoPorEtiqueta = async (etiqueta) => {
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get(`${API_URL}buscar-etiqueta/${etiqueta}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};



// Buscar contenidos por nombre o etiqueta
export const buscarContenido = async (query) => {
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get(`${API_URL}buscar/${query}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Eliminar contenido
export const eliminarContenido = async (id, motivo = '') => {
  const ELIMINAR_API_URL = `http://localhost:8000/api/contenidos/eliminar/${id}/`;
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.post(
    ELIMINAR_API_URL,
    { motivo },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error al eliminar contenido: ${response.statusText}`);
  }

  return true;
};

// Actualizar contenido
export const actualizarContenido = async (id, datos) => {
  const ACTUALIZAR_API_URL = `http://localhost:8000/api/contenidos/actualizar/${id}/`;
  const token = obtenerToken();
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.put(ACTUALIZAR_API_URL, datos, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Función para obtener los contenidos favoritos del usuario
export const obtenerFavoritos = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get('http://localhost:8000/api/favoritos/', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Función para agregar o eliminar un contenido de los favoritos
export const toggleFavorito = async (contenidoId) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No estás autenticado.');

  try {
    const response = await axios.post(
      `http://localhost:8000/api/favoritos/${contenidoId}/toggle/`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    console.log("Respuesta de toggleFavorito:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en toggleFavorito:", error);
    throw new Error('Error al modificar el favorito');
  }
};
// Función para obtener el historial de reproducciones del usuarioimport axios from 'axios';

// Función para obtener el historial de reproducciones
export const obtenerHistorial = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get('http://localhost:8000/api/historial/', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Función para obtener los detalles del contenido (por id)
export const obtenerContenidoPorId = async (contenidoId) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No estás autenticado.');

  const response = await axios.get(`http://localhost:8000/api/contenidos/${contenidoId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return response.data;
};

// Función para obtener las recomendaciones basadas en las etiquetas favoritas
export const obtenerRecomendaciones = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión.');

  try {
    const response = await axios.get('http://localhost:8000/api/recomendaciones/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las recomendaciones', error);
    throw new Error('No se pudieron obtener las recomendaciones');
  }
};


