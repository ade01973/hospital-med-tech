import React, { useEffect, useRef } from 'react';

const ElevatorDoors = ({ onComplete }) => {
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Crear sonido de apertura de puertas usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Crear sonido de "whoosh" para apertura de puertas
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Sonido descendente (apertura)
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Segundo sonido de "ding" (opcional, suena después)
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);

        osc2.frequency.setValueAtTime(800, audioContext.currentTime);
        gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0, audioContext.currentTime + 0.3);

        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 500);
    } catch (err) {
      console.log('Audio context error:', err);
    }

    // Después de 2.5 segundos, completar la animación
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">{/* Sonido generado por Web Audio API */}

      {/* Puertas izquierda y derecha */}
      <div className="absolute inset-0 flex">
        {/* Puerta izquierda */}
        <div
          className="w-1/2 h-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border-r-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
          style={{
            animation: 'doorSlideLeft 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          {/* Líneas metálicas */}
          <div className="h-full flex flex-col justify-around py-8 px-4 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div
                key={`left-${i}`}
                className="h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              ></div>
            ))}
          </div>
        </div>

        {/* Puerta derecha */}
        <div
          className="w-1/2 h-full bg-gradient-to-l from-slate-900 via-slate-800 to-slate-700 border-l-4 border-cyan-400 shadow-2xl shadow-cyan-500/50"
          style={{
            animation: 'doorSlideRight 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          {/* Líneas metálicas */}
          <div className="h-full flex flex-col justify-around py-8 px-4 opacity-60">
            {[...Array(15)].map((_, i) => (
              <div
                key={`right-${i}`}
                className="h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Efecto de luz */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent pointer-events-none"
        style={{
          animation: 'lightFlash 2s ease-out forwards',
        }}
      ></div>

      {/* Estilos CSS con keyframes */}
      <style>{`
        @keyframes doorSlideLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @keyframes doorSlideRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes lightFlash {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ElevatorDoors;
