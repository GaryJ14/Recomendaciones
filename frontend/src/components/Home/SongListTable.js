import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';  // Para los íconos de favoritos
import axios from 'axios';  // Asegúrate de importar axios
import { toggleFavorito, obtenerFavoritos } from '../../services/ContenidoApi'; 
import Swal from 'sweetalert2';  

const SongListTable = ({ onSelectSong }) => {  
  const [contenidos, setContenidos] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [favoritos, setFavoritos] = useState([]);  

  // Función para manejar el toggle de favoritos
  const toggleFavoritoHandler = async (contenidoId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      // Verificar si el contenido ya está en favoritos
      const isAlreadyFavorito = favoritos.some(fav => fav.id === contenidoId);

      if (isAlreadyFavorito) {
        setFavoritos(favoritos.filter(item => item.id !== contenidoId)); 
      } else {
        const contenido = await axios.get(`http://localhost:8000/api/contenidos/${contenidoId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,  
            Accept: 'application/json',
          },
        });
        setFavoritos([...favoritos, contenido.data]); 
      }

      // Llamada a la API para agregar o eliminar el favorito
      const response = await toggleFavorito(contenidoId); 

      if (response.status === 'agregado') {
        Swal.fire('Agregado!', 'El contenido ha sido agregado a tus favoritos.', 'success');
      } else if (response && response.status === 'eliminado') {
        Swal.fire('Eliminado!', 'El contenido ha sido eliminado de tus favoritos.', 'success');
      } else {
        Swal.fire('Error', 'Hubo un problema al modificar el favorito. Intenta nuevamente.', 'error');
      }
    } catch (error) {
      console.error('Error al modificar el favorito', error);
      Swal.fire('Error', `Ocurrió un error al modificar el favorito: ${error.message}`, 'error');
    }
  };

  // Verifica si un contenido ya está en los favoritos
  const isFavorito = (contenidoId) => favoritos.some(fav => fav.id === contenidoId);

  // Usamos useEffect para obtener los favoritos y contenidos al inicio
  useEffect(() => {
    const fetchFavoritosYContenidos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No autenticado. Por favor inicia sesión.');
          setLoading(false);
          return;
        }

        // Obtener los favoritos
        const favoritosResponse = await obtenerFavoritos();
        setFavoritos(favoritosResponse);

        // Obtener los contenidos recomendados
        const contenidosResponse = await axios.get('http://localhost:8000/api/contenidos/por-etiquetas-favoritas/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifica si los datos son un array antes de asignarlos
        if (Array.isArray(contenidosResponse.data)) {
          setContenidos(contenidosResponse.data);
        } else {
          setContenidos([]); // Si la respuesta no es un array, vacíalo
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar contenidos: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };

    fetchFavoritosYContenidos();
  }, []);

  if (loading) return <p style={{ color: 'white' }}>Cargando contenidos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (contenidos.length === 0) return <p style={{ color: 'white' }}>No hay contenidos recomendados.</p>;

  return (
    <div style={{ paddingBottom: '100px', color: 'white' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', fontWeight: 'bold', padding: '10px' }}>
        <span style={{ width: 40 }}>#</span>
        <span style={{ flex: 3 }}>TÍTULO</span>
        <span style={{ flex: 2 }}>TIPO</span>
        <span style={{ flex: 2 }}>ARTISTA</span> {/* Añadido artista */}
        <span style={{ width: 40, textAlign: 'center' }}>❤️</span>
      </div>

      {/* Mostrar los contenidos */}
      {contenidos.map((contenido, index) => (
        <div
          key={contenido.id}
          style={{
            display: 'flex',
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: index % 2 === 0 ? '#222' : 'transparent',
            alignItems: 'center',
          }}
          onClick={() => onSelectSong(contenido)}  // Ejecuta la acción al seleccionar una canción
        >
          <span style={{ width: 40 }}>{index + 1}</span>
          <div style={{ flex: 3 }}>
            <div>{contenido.titulo}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>
              Subido por: {contenido.subido_por_nombre || 'Desconocido'}
            </div>
          </div>
          <span style={{ flex: 2 }}>{contenido.tipo}</span>
          <span style={{ flex: 2 }}>{contenido.artista || 'Desconocido'}</span> {/* Mostrar artista */}

          <span
            style={{ width: 40, textAlign: 'center' }}
            onClick={(e) => {
              e.stopPropagation();  // Prevenir que el clic sobre el corazón se propague
              toggleFavoritoHandler(contenido.id);  // Cambiar estado de favorito
            }}
          >
            {isFavorito(contenido.id) ? (
              <FaHeart style={{ cursor: 'pointer', color: '#1DB954' }} />
            ) : (
              <FaRegHeart style={{ cursor: 'pointer' }} />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SongListTable;
