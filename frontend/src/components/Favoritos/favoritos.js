import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext'; // Importar el hook usePlayer
import { obtenerFavoritos, toggleFavorito } from '../../services/ContenidoApi'; // Asegúrate de que toggleFavorito esté importado correctamente

const Favoritos = () => {
  const { playSong } = usePlayer();  // Acceder a la función playSong desde el contexto global
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch de los contenidos favoritos desde la API
  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await obtenerFavoritos();
        setFavoritos(response);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los favoritos', error);
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  // Seleccionar canción y reproducirla
  const handleSongSelect = (song) => {
    playSong(song);  // Usamos playSong para actualizar la canción en el contexto global
  };

  // Manejo de favoritos
  const toggleFavoritoHandler = async (contenidoId) => {
    try {
      const response = await toggleFavorito(contenidoId);
      if (response.status === 'agregado') {
        // Agregar el contenido a la lista de favoritos
        const contenido = await obtenerFavoritos();
        setFavoritos(contenido);
      } else if (response.status === 'eliminado') {
        // Eliminar el contenido de la lista de favoritos
        const contenido = await obtenerFavoritos();
        setFavoritos(contenido);
      }
    } catch (error) {
      console.error('Error al modificar el favorito', error);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <span style={{ width: 50 }}>#</span>
        <span style={{ flex: 3 }}>TÍTULO</span>
        <span style={{ flex: 2 }}>TIPO</span>
        <span style={{ width: 60, textAlign: 'center' }}>❤️</span>
      </div>
      {favoritos.map((contenido, index) => (
        <div
          key={contenido.id}
          style={{
            display: 'flex',
            padding: '15px',
            cursor: 'pointer',
            backgroundColor: index % 2 === 0 ? '#222' : 'transparent',
            alignItems: 'center',
            borderBottom: '1px solid #444',
          }}
          onClick={() => handleSongSelect(contenido)}  // Al seleccionar una canción, la pasamos al reproductor global
        >
          <span style={{ width: 50 }}>{index + 1}</span>
          <div style={{ flex: 3 }}>
            <div>{contenido.titulo}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>
              Subido por: {contenido.subido_por_nombre || 'Desconocido'}
            </div>
          </div>
          <span style={{ flex: 2 }}>{contenido.tipo}</span>
          
          <span style={{ width: 60, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            {favoritos.some(fav => fav.id === contenido.id) ? (
              <FaHeart color="#1DB954" onClick={() => toggleFavoritoHandler(contenido.id)} />
            ) : (
              <FaRegHeart color="gray" onClick={() => toggleFavoritoHandler(contenido.id)} />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

const styles = {
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

export default Favoritos;
