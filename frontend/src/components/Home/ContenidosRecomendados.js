import React, { useEffect, useState } from 'react';
import { obtenerContenidosPorEtiquetasFavoritas } from '../../services/ContenidoApi';

export default function ContenidosRecomendados() {
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerContenidosPorEtiquetasFavoritas()
      .then(data => {
        setContenidos(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando contenidos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Recomendaciones para ti</h2>
      {contenidos.length === 0 && <p>No hay contenidos recomendados.</p>}
      <ul>
        {contenidos.map(c => (
          <li key={c.id}>
            <strong>{c.titulo}</strong> - Tipo: {c.tipo}
          </li>
        ))}
      </ul>
    </div>
  );
}
