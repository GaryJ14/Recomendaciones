import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';  // Importa el SearchProvider
import { PlayerProvider } from './context/PlayerContext';  // Importa el PlayerProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInSide from "./pages/SignInSide";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Clientes from './pages/Clientes';
import Musica from './pages/Musica';
import MusicaEliminada from './pages/MusicaEliminada';
import Contenido from './pages/Contenido';
import PrivateRoute from './components/PrivateRoute';
import GustosPage from './pages/Gustos';
import BusquedaPage from './pages/Busqueda';
import FavoritosPage from './pages/Favoritos';
import HistorialPage from './pages/Historial';
import PerfilPage from './pages/Perfil';
import Player from './components/Home/Player';  // Asegúrate de importar el Player

function App() {
  return (
    <PlayerProvider> {/* Proveemos el contexto de reproducción a toda la app */}
      <SearchProvider> {/* Proveemos el contexto de búsqueda a toda la app */}
        <BrowserRouter>
          <ConditionalPlayer /> {/* Aquí determinamos si mostrar o no el Player */}

          <Routes>
            <Route path="/" element={<SignInSide />} />
            <Route path="/SignUp" element={<SignUp />} />

            {/* Rutas privadas */}
            <Route
              path="/Dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/clientes"
              element={<PrivateRoute element={<Clientes />} />}
            />
            <Route
              path="/musica"
              element={<PrivateRoute element={<Musica />} />}
            />
            <Route
              path="/Contenido"
              element={<PrivateRoute element={<Contenido />} />}
            />
            <Route
              path="/MusicaEliminada"
              element={<PrivateRoute element={<MusicaEliminada />} />}
            />
            <Route
              path="/GustosPage"
              element={<PrivateRoute element={<GustosPage />} />}
            />
            <Route
              path="/Home"
              element={<PrivateRoute element={<Home />} />}
            />
            <Route
              path="/BusquedaPage"
              element={<PrivateRoute element={<BusquedaPage />} />}
            />
            <Route
              path="/FavoritosPage"
              element={<PrivateRoute element={<FavoritosPage />} />}
            />
            <Route
              path="/HistorialPage"
              element={<PrivateRoute element={<HistorialPage />} />}
            />
            <Route
              path="/PerfilPage"
              element={<PrivateRoute element={<PerfilPage />} />}
            />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </PlayerProvider>
  );
}

const ConditionalPlayer = () => {
  const location = useLocation();
  // Lista de rutas donde el reproductor debe ser visible
  const playerRoutes = ['/Home', '/BusquedaPage', '/FavoritosPage', '/HistorialPage', '/PerfilPage'];

  if (playerRoutes.includes(location.pathname)) {
    return <Player />;
  }

  return null; 
};

export default App;
