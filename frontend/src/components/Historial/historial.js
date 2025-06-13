import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';  // Importamos el hook del contexto del reproductor
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';  // Para los iconos de basurero y corazón
import axios from 'axios';  // Asegúrate de importar axios
import Swal from 'sweetalert2';  // Importamos SweetAlert2 para las alertas

const Historial = ({ historial, onSelectSong }) => {
  const [loading, setLoading] = useState(true);  // Para manejar el estado de carga
  const [error, setError] = useState(null);  // Para manejar los errores
  const [contenidos, setContenidos] = useState([]);  // Para almacenar los contenidos completos
  const [favoritos, setFavoritos] = useState([]); // Para manejar los contenidos favoritos
  const { playSong } = usePlayer(); // Usamos el contexto global para controlar el reproductor

  // Eliminar un contenido específico del historial
  const eliminarContenido = async (contenidoId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    // Confirmación con SweetAlert antes de proceder
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Este contenido se eliminará permanentemente de tu historial.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/eliminarhistorial/${contenidoId}/`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });

        if (response.status === 200) {
          // Actualizar la lista del historial después de eliminar el contenido
          setContenidos(contenidos.filter((contenido) => contenido.id !== contenidoId));
          Swal.fire(
            'Eliminado!',
            'El contenido ha sido eliminado del historial.',
            'success'
          );
        }
      } catch (err) {
        setError('Error al eliminar el contenido del historial.');
        Swal.fire(
          'Error!',
          'Hubo un problema al eliminar el contenido.',
          'error'
        );
      }
    }
  };

  // Eliminar todo el historial
  const eliminarTodoHistorial = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    // Confirmación con SweetAlert antes de proceder
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Este historial se eliminará permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/eliminarTodohistorial/`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });

        if (response.status === 200) {
          // Limpiar el historial después de eliminar todo
          setContenidos([]);
          Swal.fire(
            'Todo Eliminado!',
            'Todo tu historial ha sido eliminado.',
            'success'
          );
        }
      } catch (err) {
        setError('Error al eliminar todo el historial.');
        Swal.fire(
          'Error!',
          'Hubo un problema al eliminar el historial.',
          'error'
        );
      }
    }
  };

  // Agregar a favoritos
  const agregarAFavoritos = async (contenidoId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/favoritos/${contenidoId}/toggle/`, null, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (response.status === 200) {
        // Actualizar el estado de favoritos
        setFavoritos((prevFavoritos) => {
          if (prevFavoritos.includes(contenidoId)) {
            return prevFavoritos.filter((id) => id !== contenidoId);
          } else {
            return [...prevFavoritos, contenidoId];
          }
        });

        Swal.fire(
          '¡Favorito Agregado!',
          'El contenido ha sido agregado a tus favoritos.',
          'success'
        );
      }
    } catch (err) {
      setError('Error al agregar a favoritos.');
      Swal.fire(
        'Error!',
        'Hubo un problema al agregar el contenido a favoritos.',
        'error'
      );
    }
  };

  useEffect(() => {
    const fetchContenidoDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No autenticado. Por favor inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        const contenidoDetails = await Promise.all(
          historial.map(async (item) => {
            const response = await axios.get(`http://localhost:8000/api/contenidos/${item.contenido_id}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
          })
        );
        setContenidos(contenidoDetails);  // Guardar los contenidos completos en el estado
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el historial: ' + (err.response?.data?.detail || err.message));
        setLoading(false);
      }
    };

    fetchContenidoDetails();  // Llamada para obtener el historial
  }, [historial]);

  const handleClick = (contenido) => {
    console.log('Contenido seleccionado:', contenido);  // Ver el contenido que se selecciona
    playSong(contenido);  // Reproducir la canción usando el contexto global
  };

  const isFavorito = (contenidoId) => {
    return favoritos.includes(contenidoId);
  };

  return (
    <div style={{ paddingBottom: '100px', color: 'white' }}>
      {/* Botón para eliminar todo el historial (parte superior derecha) */}
      <div style={styles.deleteAllButtonContainer}>
        <button style={styles.deleteAllButton} onClick={eliminarTodoHistorial}>Eliminar Todo el Historial</button>
      </div>

      {/* Encabezado de la tabla */}
      <div style={{ display: 'flex', fontWeight: 'bold', padding: '10px', borderBottom: '2px solid #333' }}>
        <span style={{ width: 50 }}>#</span>
        <span style={{ flex: 3 }}>TÍTULO</span>
        <span style={{ flex: 2 }}>TIPO</span>
       <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  
        <span style={{ width: 40, textAlign: 'center' }}>Acción</span>
      </div>

      {loading && <p style={{ color: 'white' }}>Cargando historial...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Contenidos del historial */}
      {contenidos.map((contenido, index) => (
        <div
          key={`${contenido.id}-${index}`}
          style={{
            display: 'flex',
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: index % 2 === 0 ? '#222' : 'transparent',
            alignItems: 'center',
            borderBottom: '1px solid #333',
          }}
          onClick={() => handleClick(contenido)}  // Reproducir el contenido al hacer clic
        >
          <span style={{ width: 50 }}>{index + 1}</span>
          <div style={{ flex: 3 }}>
            <div>{contenido.titulo}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>Subido por: {contenido.subido_por_nombre || 'Desconocido'}</div>
          </div>
          <span style={{ flex: 2 }}>{contenido.tipo}</span>
          
          <span style={{ width: 40, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            {/* Botón con el icono de basurero */}
            <button style={styles.deleteButton} onClick={() => eliminarContenido(contenido.id)}>
              <FaTrash style={{ fontSize: '16px', color: 'white' }} /> {/* Icono de basurero */}
            </button>
          </span>

          <span
            style={{ width: 40, textAlign: 'center' }}
            onClick={(e) => {
              e.stopPropagation();  // Prevenir que el clic sobre el corazón se propague
              agregarAFavoritos(contenido.id);  // Cambiar estado de favorito
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

const styles = {
  // Estilo para el botón de eliminar todo el historial (en la parte superior derecha)
  deleteAllButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',  // Alinea el botón a la derecha
    marginBottom: '10px',  // Espacio entre el botón y la lista
  },
  deleteAllButton: {
    backgroundColor: '#b9283d',  // Rojo brillante para el botón
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  // Estilo para el botón de eliminar contenido individual
  deleteButton: {
    backgroundColor: '#b9283d',  // Rojo brillante para el botón
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
 
};

export default Historial;
