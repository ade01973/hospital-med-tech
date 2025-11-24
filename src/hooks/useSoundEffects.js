import { useState, useCallback, useRef } from 'react';

/**
 * Hook personalizado para efectos de sonido en el juego
 * Usa Web Audio API para generar sonidos procedurales (sin archivos externos)
 */
const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('soundEnabled') !== 'false';
    }
    return true;
  });

  const audioContextRef = useRef(null);

  // Obtener o crear el contexto de audio
  const getAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    try {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
          return audioContextRef.current;
        }
      }
    } catch (error) {
      console.warn('⚠️ Web Audio API no disponible:', error.message);
    }
    return null;
  }, []);

  // Guardar preferencia en localStorage cuando cambia
  const handleToggleSound = useCallback((newValue) => {
    setSoundEnabled(newValue);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('soundEnabled', newValue ? 'true' : 'false');
    }
  }, []);

  /**
   * Reproduce un sonido procedural usando Web Audio API
   * @param {number} frequency - Frecuencia en Hz
   * @param {number} duration - Duración en ms
   * @param {number} volume - Volumen 0-1
   * @param {string} type - Tipo de onda: 'sine', 'square', 'triangle', 'sawtooth'
   */
  const playTone = useCallback((frequency, duration, volume = 0.3, type = 'sine') => {
    if (!soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.debug('🔇 Error al reproducir sonido:', error.message);
    }
  }, [soundEnabled, getAudioContext]);

  /**
   * 🟢 Sonido de éxito - 3 notas ascendentes
   */
  const playSuccess = useCallback(() => {
    if (!soundEnabled) return;

    // Do, Mi, Sol (escala de Do mayor)
    setTimeout(() => playTone(523, 100, 0.3), 0);
    setTimeout(() => playTone(659, 100, 0.3), 120);
    setTimeout(() => playTone(784, 150, 0.3), 240);
  }, [playTone, soundEnabled]);

  /**
   * 🔴 Sonido de error - nota grave descendente
   */
  const playError = useCallback(() => {
    if (!soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
      oscillator.type = 'triangle';

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.debug('🔇 Error al reproducir sonido de error:', error.message);
    }
  }, [soundEnabled, getAudioContext]);

  /**
   * 🎉 Sonido de celebración/victoria - fanfarria épica
   */
  const playVictory = useCallback(() => {
    if (!soundEnabled) return;

    // Secuencia de notas para la fanfarria
    const notes = [
      { freq: 523, duration: 150, delay: 0 },      // Do
      { freq: 659, duration: 150, delay: 170 },    // Mi
      { freq: 784, duration: 150, delay: 340 },    // Sol
      { freq: 1047, duration: 200, delay: 510 },   // Do alto
      { freq: 784, duration: 100, delay: 730 },    // Sol
      { freq: 1047, duration: 300, delay: 850 },   // Do alto (prolongado)
    ];

    notes.forEach(({ freq, duration, delay }) => {
      setTimeout(() => playTone(freq, duration, 0.35, 'sine'), delay);
    });
  }, [playTone, soundEnabled]);

  /**
   * 📍 Sonido de notificación corta
   */
  const playNotification = useCallback(() => {
    if (!soundEnabled) return;
    playTone(880, 80, 0.25);
  }, [playTone, soundEnabled]);

  return {
    playSuccess,      // ✅ Para respuestas correctas
    playError,        // ❌ Para respuestas incorrectas
    playVictory,      // 🎉 Para completar nivel
    playNotification, // 📍 Para notificaciones
    soundEnabled,     // Estado actual
    setSoundEnabled: handleToggleSound, // Para toggle
  };
};

export default useSoundEffects;
