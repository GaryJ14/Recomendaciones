import React, { useState } from 'react';
import Sidebar from '../components/Home/Sidebar';  
import Header from '../components/Home/Header'; 
import PerfilApp from '../components/Perfil/PerfilApp';

const PerfilPage = () => {
  const [searchResults, setSearchResults] = useState([]);  // Para almacenar los resultados de búsqueda

  // Esta función maneja los resultados y actualiza el estado de búsqueda
  const setSearchResultsHandler = (results) => {
    setSearchResults(results);  // Establece los resultados de la búsqueda
  };

  return (
    <div style={styles.appContainer}>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenido principal */}
      <div style={styles.mainContent}>
        <Header setSearchResults={setSearchResultsHandler} />

        {/* Contenido de la búsqueda */}
        <div style={styles.bodyContent}>
          <h1>Tú Perfil</h1>
          <PerfilApp searchResults={searchResults} />  {/* Pasa los resultados de la búsqueda */}
        </div>
      </div>

    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#121212', // Fondo oscuro para la aplicación
    color: '#fff',  // Color blanco para el texto
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#fff',
  },
  bodyContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
};

export default PerfilPage;
