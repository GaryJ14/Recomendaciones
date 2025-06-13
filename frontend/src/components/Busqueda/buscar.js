import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';  // Para los íconos de favoritos
import { useSearch } from '../../context/SearchContext';  // Usamos el hook del contexto
import axios from 'axios';  // Asegúrate de importar axios
import Swal from 'sweetalert2';  // Importamos SweetAlert2 para las alertas

const Buscar = ({ onSelectSong }) => {  
  const { searchResults } = useSearch();  // Consumimos los resultados desde el contexto
  const [favoritos, setFavoritos] = useState([]);  // Estado para gestionar los contenidos favoritos
  const [contenidosRecomendados, setContenidosRecomendados] = useState([]);  // Estado para las recomendaciones
  const [loading, setLoading] = useState(false);  // Para el estado de carga
  const [error, setError] = useState(null);  // Para manejar los errores

  // Función para agregar o eliminar un contenido de favoritos
  const toggleFavoritoHandler = async (contenidoId) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      // Verificar si el contenido ya está en favoritos
      const isAlreadyFavorito = favoritos.some(fav => fav.id === contenidoId);

      // Actualizar el estado de favoritos antes de la llamada a la API
      if (isAlreadyFavorito) {
        setFavoritos(favoritos.filter(item => item.id !== contenidoId));  // Eliminar del estado
      } else {
        const contenido = await axios.get(`http://localhost:8000/api/contenidos/${contenidoId}/`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        setFavoritos([...favoritos, contenido.data]);  // Agregar al estado
      }

      // Llamada a la API para agregar o eliminar el favorito
      const response = await axios.post(`http://localhost:8000/api/favoritos/${contenidoId}/toggle/`, null, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (response.status === 200) {
        if (response.data.status === 'agregado') {
          Swal.fire('¡Favorito Agregado!', 'El contenido ha sido agregado a tus favoritos.', 'success');
        } else if (response.data.status === 'eliminado') {
          Swal.fire('¡Favorito Eliminado!', 'El contenido ha sido eliminado de tus favoritos.', 'success');
        }
      } else {
        throw new Error('Error al modificar el favorito.');
      }

    } catch (error) {
      setError(error.message);
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Verifica si un contenido ya está en los favoritos
  const isFavorito = (contenidoId) => favoritos.some(fav => fav.id === contenidoId);

  // Usamos useEffect para obtener los contenidos recomendados al inicio
  useEffect(() => {
    const fetchContenidosRecomendados = async () => {
      setLoading(true);  // Activar estado de carga
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No autenticado. Por favor inicia sesión.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/recomendaciones/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mezclar los contenidos recomendados de manera aleatoria
        const contenidosAleatorios = response.data.sort(() => Math.random() - 0.5);
        setContenidosRecomendados(contenidosAleatorios);  // Actualizamos el estado con las recomendaciones
        setLoading(false);
      } catch (err) {
        setError('Error al cargar contenidos recomendados: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };

    fetchContenidosRecomendados();
  }, []);

  if (loading) return <p style={{ color: 'white' }}>Cargando contenidos...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      {/* Tabla de resultados de búsqueda */}
      {searchResults.length > 0 ? (
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <span style={{ width: 40 }}>#</span>
            <span style={{ flex: 3 }}>TÍTULO</span>
            <span style={{ flex: 2 }}>TIPO</span>
            <span style={{ width: 40, textAlign: 'center' }}>❤️</span>
          </div>

          {searchResults.map((resultado, index) => (
            <div
              key={resultado.id}
              style={{
                display: 'flex',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: index % 2 === 0 ? '#222' : 'transparent',
                alignItems: 'center',
              }}
              onClick={() => onSelectSong(resultado)}  // Ejecuta la acción al seleccionar una canción
            >
              <span style={{ width: 40 }}>{index + 1}</span>
              <div style={{ flex: 3 }}>
                <div>{resultado.titulo}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>
                  Subido por: {resultado.subido_por_nombre || 'Desconocido'}
                </div>
              </div>
              <span style={{ flex: 2 }}>{resultado.tipo}</span>

              <span
                style={{ width: 40, textAlign: 'center' }}
                onClick={(e) => {
                  e.stopPropagation();  // Prevenir que el clic sobre el corazón se propague
                  toggleFavoritoHandler(resultado.id);  // Cambiar estado de favorito
                }}
              >
                {isFavorito(resultado.id) ? (
                  <FaHeart color="#1DB954" />
                ) : (
                  <FaRegHeart color="gray" />
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'white' }}>No hay resultados para la búsqueda.</p>
      )}

      {/* Recomendaciones aleatorias */}
      <div style={{ marginTop: '20px' }}>
        <h2>También te podría interesar</h2>
        <div style={{ display: 'flex', fontWeight: 'bold', padding: '10px' }}>
          <span style={{ width: 40 }}>#</span>
          <span style={{ flex: 3 }}>TÍTULO</span>
          <span style={{ flex: 2 }}>TIPO</span>
          <span style={{ width: 40, textAlign: 'center' }}>❤️</span>
        </div>

        {contenidosRecomendados.map((contenido, index) => (
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
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: '#fff',
  },
  tableContainer: {
    marginTop: '20px',
  },
  tableHeader: {
    display: 'flex',
    fontWeight: 'bold',
    padding: '10px',
    backgroundColor: '#333',
    borderRadius: '5px',
  },
};

export default Buscar;
