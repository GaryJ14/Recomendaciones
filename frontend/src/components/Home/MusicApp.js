import React from 'react';
import { usePlayer } from '../../context/PlayerContext'; // Importamos el hook para acceder al contexto global
import SongListTable from './SongListTable';

const MusicApp = () => {
  const { currentSong, playSong } = usePlayer(); // Accedemos al estado global de la canción y la función para reproducirla

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
        <SongListTable onSelectSong={playSong} /> {/* Usamos la función playSong del contexto */}
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

export default MusicApp;
