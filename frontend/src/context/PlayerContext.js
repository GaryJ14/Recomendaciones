import React, { createContext, useState, useContext } from 'react';

// Crear el contexto para el reproductor
const PlayerContext = createContext();

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, pauseSong }}>
      {children}
    </PlayerContext.Provider>
  );
};
