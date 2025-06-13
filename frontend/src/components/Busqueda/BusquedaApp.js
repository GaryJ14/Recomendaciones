import React from 'react';
import { usePlayer } from '../../context/PlayerContext'; // Importar el hook usePlayer
import Buscar from './buscar';  

const BusquedaApp = () => {
  const { currentSong, playSong } = usePlayer();  // Obtener currentSong y playSong del contexto global

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
        <Buscar onSelectSong={playSong} /> {/* Al seleccionar una canción, actualizar el estado global */}
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

export default BusquedaApp;
