import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MusicApp from './MusicApp';

const SpotifyApp = () => {
  return (
    <div style={styles.appContainer}>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenido principal */}
      <div style={styles.mainContent}>
        <Header />

        {/* Contenido del body */}
        <div style={styles.bodyContent}>
          <h1>Para Tí</h1>
          <MusicApp />
        </div>

      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#121212',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#b3b3b3',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#b3b3b3',
  },
  bodyContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#b3b3b3',
  },
};

export default SpotifyApp;
