import React, { useState } from 'react';
import Sidebar from '../components/Home/Sidebar';
import Header from '../components/Home/Header';
import HistorialApp from '../components/Historial/HistorialApp';

const HistorialPage = () => {
    const [searchResults, setSearchResults] = useState([]);  // Para almacenar los resultados de búsqueda
  
    const setSearchResultsHandler = (results) => {
        setSearchResults(results);  // Establece los resultados de la búsqueda
    };
  
  return (
    <div style={styles.appContainer}>
      <Sidebar /> {/* Sidebar a la izquierda */}

      <div style={styles.mainContent}>
        <Header setSearchResults={setSearchResultsHandler} /> {/* Contenido principal */}

        <div style={styles.bodyContent}>
          <h1>Tu Historial</h1>
          <HistorialApp searchResults={searchResults} />  
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

export default HistorialPage;
