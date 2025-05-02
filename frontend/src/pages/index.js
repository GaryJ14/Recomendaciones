// src/pages/Index.js
import React, { useState } from 'react';
import '../components/index.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';



const Index = ({ usuario }) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>Bienvenido, {usuario}!</h1>
          </div>
          <ul className="navbar-menu">
            <li><a href="/pagina_principal">INICIO</a></li>
            <li className="dropdown">
              <button className="dropbtn">{usuario.charAt(0).toUpperCase()}</button>
              <div className="dropdown-content">
                <a href="/mi_perfil"><FontAwesomeIcon icon={faUser} /> Mi Perfil</a>
                <a href="/logout"><FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión</a>
              </div>
            </li>
          </ul>
          <button className="hamburger" onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </nav>

        <div className={`mobile-menu ${mobileMenuVisible ? '' : 'hidden'}`}>
          <a href="/mi_perfil"><FontAwesomeIcon icon={faUser} /> Mi Perfil</a>
          <a href="/logout"><FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesión</a>
        </div>
      </header>

      <main className="main-container">
        <div className="welcome-text">
          <h2>¡Bienvenido a nuestra página web!</h2>
          <p>Nos alegra tenerte aquí. Explora nuestras últimas novedades y disfruta de la experiencia.</p>
        </div>

        <section className="novedades">
          <h3>Novedades</h3>
          <ul>
            <li>¡Nuevo sistema de recompensas disponible!</li>
            <li>Próxima actualización de funciones en 2 días.</li>
            <li>Nuevo diseño de perfil ya disponible.</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 TuPáginaWeb. Todos los derechos reservados.</p>
      </footer>
    </>
  );
};

export default Index;
