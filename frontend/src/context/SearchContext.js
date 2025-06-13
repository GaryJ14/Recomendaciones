import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const SearchContext = createContext();

// Proveedor del contexto
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  // Función para actualizar los resultados de búsqueda
  const updateSearchResults = (results) => {
    setSearchResults(results);
  };

  // Función para actualizar la consulta (query)
  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  return (
    <SearchContext.Provider value={{ searchResults, updateSearchResults, query, updateQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook para consumir el contexto
export const useSearch = () => {
  return useContext(SearchContext);
};
