import { useEffect, useRef } from 'react';

/**
 * Hook para reproducir música de fondo ambiental médica
 * Usa Web Audio API para generar música procedural alusiva al tema sanitario
 * Se detiene completamente al desmontar el componente
 */
const useBackgroundMusic = (enabled = true) => {
  const audioContextRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const isActiveMusicRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    isActiveMusicRef.current = true;

    const startBackgroundMusic = () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        audioContextRef.current = new AudioContextClass();
        const audioContext = audioContextRef.current;

        // Notas médicas: C4 (261.63) - E4 (329.63) - G4 (392.00) - C5 (523.25)
        const notes = [261.63, 329.63, 392.00, 523.25];
        let noteIndex = 0;

        const playNoteSequence = () => {
          // Si el hook fue desmontado, no continuar
          if (!isActiveMusicRef.current || !audioContext) return;

          try {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.frequency.value = notes[noteIndex % notes.length];
            osc.type = 'sine';

            // Volumen suave (0.08-0.12 para no molestar)
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

            osc.start(now);
            osc.stop(now + 0.6);

            noteIndex++;

            // Siguiente nota en 1 segundo, pero solo si sigue activo
            if (isActiveMusicRef.current) {
              timeoutIdRef.current = setTimeout(() => {
                playNoteSequence();
              }, 1000);
            }
          } catch (e) {
            // Silencioso si hay error
          }
        };

        playNoteSequence();
      } catch (error) {
        console.debug('🔇 Música de fondo no disponible:', error.message);
      }
    };

    startBackgroundMusic();

    return () => {
      // Detener completamente la música al desmontar
      isActiveMusicRef.current = false;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Silencioso
        }
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  return {
    stop: () => {
      isActiveMusicRef.current = false;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    },
  };
};

export default useBackgroundMusic;
