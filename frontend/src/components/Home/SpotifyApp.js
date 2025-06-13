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
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bodyContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
};

export default SpotifyApp;
