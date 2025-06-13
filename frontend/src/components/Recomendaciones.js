import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recomendaciones = () => {
  const [contenidosRecomendados, setContenidosRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener recomendaciones personalizadas al cargar el componente
    const fetchRecomendaciones = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No estás autenticado.');
        }

        const response = await axios.get('http://localhost:8000/api/recomendaciones/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setContenidosRecomendados(response.data);  // Guardar los contenidos recomendados
        setLoading(false);
      } catch (error) {
        setError(error.message);  // Manejo de error
        setLoading(false);
      }
    };

    fetchRecomendaciones();
  }, []);  // Ejecutar una vez cuando el componente se monte

  if (loading) return <p>Cargando recomendaciones...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Recomendado para ti</h2>
      <div>
        {contenidosRecomendados.length === 0 ? (
          <p>No hay recomendaciones disponibles.</p>
        ) : (
          <ul>
            {contenidosRecomendados.map((contenido, index) => (
              <li key={contenido.id}>
                <h3>{contenido.titulo}</h3>
                <p>{contenido.tipo}</p>
                <a href={contenido.url} target="_blank" rel="noopener noreferrer">Escuchar</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Recomendaciones;
