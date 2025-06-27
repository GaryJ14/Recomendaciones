import React, { useState } from 'react';
import { FaHome, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext'; // Consumir el contexto
import { buscarContenido } from '../../services/ContenidoApi'; // Asegúrate de que la ruta de ContenidoApi es correcta
import { buscarContenidoPorEtiqueta } from '../../services/ContenidoApi'; // Importa la función para buscar por etiqueta
import { buscarContenidoPorArtista } from '../../services/ContenidoApi'; // Importa la función para buscar por artista

const Header = () => {
  const { updateSearchResults, updateQuery, query } = useSearch(); // Consumimos el contexto
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate para redirigir

  // Función para manejar el clic en "Cerrar sesión"
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Eliminar el token del localStorage
    navigate('/'); // Redirige al home
  };

  // Función para manejar el clic en "Perfil"
  const handlePerfilClick = () => {
    navigate('/PerfilPage'); // Redirige a la página de Perfil
  };

  // Función para realizar la búsqueda y mostrar los resultados
  const handleSearchClick = async () => {
    console.log('Búsqueda iniciada con:', query); // Verifica el valor de query
    if (!query) {
      console.error('No se ha ingresado un término de búsqueda.');
      return;
    }

    try {
      // Primero intentamos buscar por artista
      const dataPorArtista = await buscarContenidoPorArtista(query); // Llamamos a la nueva función de búsqueda por artista
      if (dataPorArtista && dataPorArtista.length > 0) {
        console.log('Resultados de búsqueda por artista obtenidos:', dataPorArtista);
        updateSearchResults(dataPorArtista); // Actualizamos los resultados en el contexto
        navigate('/BusquedaPage'); // Redirige a la página de búsqueda
        return; // Detiene el flujo para no hacer la búsqueda por nombre
      } else {
        console.log('No se encontraron resultados por artista');
      }

      // Luego intentamos buscar por título
      const dataPorNombre = await buscarContenido(query); // Llamamos al servicio de búsqueda por nombre
      if (dataPorNombre && dataPorNombre.length > 0) {
        console.log('Resultados de búsqueda por título obtenidos:', dataPorNombre);
        updateSearchResults(dataPorNombre); // Actualizamos los resultados en el contexto
        navigate('/BusquedaPage'); // Redirige a la página de búsqueda
      } else {
        console.log('No se encontraron resultados por título');
      }

      // Finalmente, buscamos por etiqueta si no se encontró por artista ni por título
      const dataPorEtiqueta = await buscarContenidoPorEtiqueta(query); // Llamamos a la función de búsqueda por etiqueta
      if (dataPorEtiqueta && dataPorEtiqueta.length > 0) {
        console.log('Resultados de búsqueda por etiqueta obtenidos:', dataPorEtiqueta);
        updateSearchResults(dataPorEtiqueta); // Actualizamos los resultados en el contexto
        navigate('/BusquedaPage'); // Redirige a la página de búsqueda
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  // Función para manejar el evento cuando el usuario presiona Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick(); // Realiza la búsqueda al presionar Enter
    }
  };

  const handleInputChange = (e) => {
    updateQuery(e.target.value); // Actualiza la consulta en el contexto
  };

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <button style={styles.iconBtn}>
          <FaHome size={20} />
        </button>
        <div style={styles.searchBar}>
          <FaSearch style={styles.searchIcon} onClick={handleSearchClick} />
          <input
            type="text"
            placeholder="¿Qué quieres reproducir?"
            style={styles.input}
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Asegúrate de que handleKeyDown esté manejando el evento de Enter
          />
        </div>
      </div>

      {/* Botones de la derecha */}
      <div style={styles.right}>
        <div style={styles.profileContainer}>
          <div style={styles.profile} onClick={() => setShowMenu(!showMenu)}>
            <span style={styles.profileInitial}>D</span>
            <FaChevronDown style={{ marginLeft: 5 }} />
          </div>
          {showMenu && (
            <div style={styles.dropdown}>
              <div style={styles.menuItem}>Cuenta</div>
              <div style={styles.menuItem} onClick={handlePerfilClick}>Perfil</div>
              <div style={styles.menuItem} onClick={handleLogout}>Cerrar sesión</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#b3b3b3',
    zIndex: 100,
    position: 'relative',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  searchBar: {
    backgroundColor: '#242424',
    display: 'flex',
    alignItems: 'center',
    padding: '5px 10px',
    borderRadius: '50px',
    color: '#b3b3b3',
  },
  searchIcon: {
    marginRight: 8,
    cursor: 'pointer',
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  profileContainer: {
    position: 'relative',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1db954',
    borderRadius: '50px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  profileInitial: {
    backgroundColor: '#222',
    borderRadius: '50%',
    width: 25,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#282828',
    color: '#fff',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 9999,
  },
  menuItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #333',
  },
};

export default Header;
