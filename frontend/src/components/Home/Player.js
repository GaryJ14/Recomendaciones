import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaBackward, FaForward, FaRandom, FaRedoAlt, FaVolumeUp, FaHeart } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext'; // Asegúrate de que este hook esté importado correctamente
import axios from 'axios';

const Player = () => {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer(); // Acceder al contexto global
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Si la canción ha cambiado, cargamos el nuevo archivo
      audioRef.current.load();
      audioRef.current.play(); // Inicia la reproducción automáticamente
      // Validar si ya está en el historial antes de registrar
      validarYRegistrarEnHistorial(currentSong.id); // Registrar la canción en el historial solo si no está registrada
    }
  }, [currentSong]);

  // Función para alternar entre reproducción y pausa
  const togglePlay = () => {
    if (!currentSong) return; // No hacer nada si no hay canción

    if (audioRef.current.paused) {
      audioRef.current.play();
      playSong(currentSong); // Usamos la función playSong del contexto para manejar la reproducción globalmente
      // Validar si ya está en el historial antes de registrar
      validarYRegistrarEnHistorial(currentSong.id); // Función para registrar en el historial solo si no está registrada
    } else {
      audioRef.current.pause();
      pauseSong(); // Usamos la función pauseSong del contexto para manejar la pausa globalmente
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  if (!currentSong) {
    return (
      <div style={styles.container}>
        <div style={{ flex: 1, color: '#aaa' }}>Selecciona una canción para reproducir</div>
      </div>
    );
  }

  const mediaUrl = currentSong.url.startsWith('http')
    ? currentSong.url
    : `http://localhost:8000${currentSong.url}`;

  return (
    <div style={styles.container}>
      {/* Información de la canción */}
      <div style={styles.songInfo}>
        <div style={{ marginLeft: 10 }}>
          <div style={styles.songTitle}>{currentSong.titulo}</div>
          <div style={styles.artist}>Subido por: {currentSong.subido_por_nombre || 'Desconocido'}</div>
        </div>
        <FaHeart style={{ color: '#1DB954', marginLeft: 10, cursor: 'pointer' }} />
      </div>

      {/* Controles de reproducción */}
      <div style={styles.centerControls}>
        <div style={styles.buttons}>
          <FaRandom style={styles.icon} />
          <FaBackward style={styles.icon} />
          <div style={styles.playButton} onClick={togglePlay}>
            {isPlaying ? <FaPause color="#000" /> : <FaPlay color="#000" />}
          </div>
          <FaForward style={styles.icon} />
          <FaRedoAlt style={styles.icon} />
        </div>

        {/* Si la canción es de tipo 'audio', mostramos el reproductor de audio */}
        {currentSong.tipo === 'audio' ? (
          <audio ref={audioRef} style={{ width: '100%' }} controls>
            <source src={mediaUrl} type="audio/mpeg" />
            Tu navegador no soporta el audio.
          </audio>
        ) : currentSong.tipo === 'video' ? (
          <video ref={audioRef} style={styles.videoPlayer} controls>
            <source src={mediaUrl} type="video/mp4" />
            Tu navegador no soporta el video.
          </video>
        ) : null}
      </div>

      {/* Controles de volumen */}
      <div style={styles.volume}>
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          style={styles.volumeBar}
        />
      </div>
    </div>
  );
};

// Función para validar si el contenido ya está en el historial y registrar si no lo está
const validarYRegistrarEnHistorial = async (contenidoId) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('No autenticado');
    return;
  }

  try {
    // Obtener el historial de reproducciones
    const historialResponse = await axios.get('http://localhost:8000/api/historial/', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    // Verificar si el contenido ya está registrado en el historial
    const contenidoRegistrado = historialResponse.data.find(
      (item) => item.contenido_id === contenidoId
    );

    if (!contenidoRegistrado) {
      // Si no está registrado, registrar el contenido en el historial
      await axios.post('http://localhost:8000/api/historial/', 
        { contenido_id: contenidoId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      console.log('Contenido registrado en el historial');
    } else {
      console.log('El contenido ya está registrado en el historial');
    }
  } catch (err) {
    console.error('Error al validar y registrar en el historial:', err);
  }
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px',
    zIndex: 1,
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  songTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  artist: {
    fontSize: 12,
    color: '#aaa',
  },
  centerControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 2,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 5,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  icon: {
    fontSize: 14,
    cursor: 'pointer',
  },
  volume: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  volumeBar: {
    width: 100,
  },
  videoPlayer: {
    width: '300px',  // Controlamos el tamaño del video
    height: 'auto',
    borderRadius: 8,
    backgroundColor: 'black',
    position: 'fixed',
    right: 30,
    top: '80px',  // Colocamos el video debajo del header (asumiendo que el header tiene 80px de altura)
    zIndex: 1000,
  },
};

export default Player;
