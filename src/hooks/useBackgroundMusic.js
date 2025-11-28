import { useEffect, useRef } from 'react';

/**
 * Hook para reproducir música de fondo ambiental médica
 * Usa Web Audio API para generar música procedural alusiva al tema sanitario
 */
const useBackgroundMusic = (enabled = true) => {
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainsRef = useRef([]);

  useEffect(() => {
    if (!enabled) return;

    const startBackgroundMusic = () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        audioContextRef.current = new AudioContextClass();
        const audioContext = audioContextRef.current;
        oscillatorsRef.current = [];
        gainsRef.current = [];

        // Notas médicas: C4 (261.63) - E4 (329.63) - G4 (392.00) - C5 (523.25)
        // Arpegio ambiental tranquilo
        const notes = [261.63, 329.63, 392.00, 523.25];
        const startTime = audioContext.currentTime;
        const cycleDuration = 4; // 4 segundos por ciclo
        let noteIndex = 0;

        const playNoteSequence = () => {
          if (!audioContext) return;

          const now = audioContext.currentTime;
          const noteTime = startTime + noteIndex * (cycleDuration / notes.length);

          // Solo reproducir si estamos dentro de un ciclo razonable
          if (now < noteTime + 10) {
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

            oscillatorsRef.current.push(osc);
            gainsRef.current.push(gain);

            noteIndex++;

            // Siguiente nota en 1 segundo
            setTimeout(() => {
              if (audioContextRef.current) {
                playNoteSequence();
              }
            }, 1000);
          }
        };

        playNoteSequence();

        return () => {
          // Cleanup al desmontar
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
            } catch (e) {
              // Ya puede estar detenido
            }
          });
          oscillatorsRef.current = [];
          gainsRef.current = [];
        };
      } catch (error) {
        console.debug('🔇 Música de fondo no disponible:', error.message);
      }
    };

    const cleanup = startBackgroundMusic();
    return cleanup;
  }, [enabled]);

  return {
    stop: () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Ya puede estar detenido
        }
      });
      oscillatorsRef.current = [];
      gainsRef.current = [];
    },
  };
};

export default useBackgroundMusic;
