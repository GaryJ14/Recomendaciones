import React from 'react';
import { FaHome, FaSearch, FaBook, FaPlus, FaHeart, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Importamos Link para redirigir

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h1 style={styles.logo}>SoundMusicUTC</h1>
      <ul style={styles.navList}>
        <SidebarItem icon={<FaHome />} text="Home" to="/Home" />
        <SidebarItem icon={<FaSearch />} text="Search" to="/BusquedaPage" />  {/* Redirige a /busqueda */}
        <SidebarItem icon={<FaBook />} text="Tu Historial" to="/HistorialPage" />
        <SidebarItem icon={<FaPlus />} text="Create Playlist" />
        <SidebarItem icon={<FaHeart />} text="Liked Songs" to="/FavoritosPage" />
        <SidebarItem icon={<FaDownload />} text="Downloaded" />
      </ul>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, to }) => (
  <li style={{ ...styles.item, ...(active ? styles.active : {}) }}>
    <Link to={to || '#'} style={styles.link}>  {/* Link para la redirección */}
      <span style={styles.icon}>{icon}</span>
      <span>{text}</span>
    </Link>
  </li>
);

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    padding: '20px 0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))', // Fondo actualizado
    color: '#b3b3b3',
  },
  logo: {
    color: '#1DB954',
    fontSize: '24px',
    marginBottom: '30px',
    paddingLeft: '10px',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 10px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  active: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '12px',
    fontSize: '18px',
  },
  link: {
    color: '#b3b3b3',  // Mantener el color de los enlaces
    textDecoration: 'none',  // Eliminar el subrayado
  },
};

export default Sidebar;
