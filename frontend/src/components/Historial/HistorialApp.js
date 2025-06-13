import React, { useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';  // Obtener currentSong y playSong del contexto global
import { obtenerHistorial } from '../../services/ContenidoApi';  // Función para obtener el historial
import Historial from './historial';  // Componente que mostrará el historial

const HistorialApp = () => {
  const { currentSong, playSong } = usePlayer();  // Obtener currentSong y playSong desde el contexto global
  const [historial, setHistorial] = useState([]);  // Para almacenar los datos del historial
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga

  // Fetch del historial de reproducciones desde la API
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await obtenerHistorial();
        console.log('Historial obtenido:', response); // Agregar este log para depuración
        setHistorial(response); // Guardar los contenidos del historial
        setLoading(false); // Cambiar el estado de carga
      } catch (error) {
        console.error('Error al obtener el historial', error);
        setLoading(false);
      }
    };

    fetchHistorial(); // Llamada para obtener el historial
  }, []);

  const videoUrl =
    currentSong && currentSong.tipo === 'video'
      ? currentSong.url.startsWith('http')
        ? currentSong.url
        : `http://localhost:8000${currentSong.url}`
      : null;

  return (
    <div style={styles.appContainer}>
      <div
        style={{
          ...styles.listContainer,
          marginRight: videoUrl ? '320px' : '0', // Desplaza la lista a la izquierda cuando haya un video
        }}
      >
        {loading ? (
          <p>Cargando historial...</p>
        ) : (
          <Historial historial={historial} onSelectSong={playSong} />  // Pasar el historial y la función playSong
        )}
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    minHeight: '100vh',
    paddingBottom: '80px',
    overflow: 'visible',
  },
  listContainer: {
    flex: 1,
    transition: 'margin-right 0.3s ease',
  },
};

export default HistorialApp;
