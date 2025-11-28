import { useEffect, useRef } from 'react';
import avatarBackgroundMusic from '../assets/avatar-background-music.mp3';

/**
 * Hook para reproducir música de fondo ambiental médica
 * Usa archivo de audio MP3 con volumen bajo
 * Solo activa en pantallas de edición de avatar
 */
const useBackgroundMusic = (enabled = true) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    try {
      // Crear elemento de audio si no existe
      if (!audioRef.current) {
        audioRef.current = new Audio(avatarBackgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.15; // Volumen bajo (15%)
      }

      // Reproducir música
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.debug('🔇 Música no pudo reproducirse:', error.message);
        });
      }
    } catch (error) {
      console.debug('🔇 Música de fondo no disponible:', error.message);
    }

    return () => {
      // Detener música completamente al desmontar
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [enabled]);

  return {
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
  };
};

export default useBackgroundMusic;
