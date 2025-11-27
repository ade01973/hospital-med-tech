import React, { useEffect, useRef, useState } from "react";

const ElevatorDoors = ({ onComplete }) => {
  const audioContextRef = useRef(null);
  const [randomBg, setRandomBg] = useState("");

  useEffect(() => {
    // 🖼️ Seleccionar fondo aleatorio del hospital
    const backgrounds = [
      "/images/hospital-1.png",
      "/images/hospital-2.png",
      "/images/hospital-3.png"
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setRandomBg(backgrounds[randomIndex]);
    // Sonido futurista más suave tipo “pshhh”
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(600, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.7);

      gain.gain.setValueAtTime(0.25, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.7);
    } catch (e) {}

    const timer = setTimeout(() => onComplete(), 2400);
    return () => {
      clearTimeout(timer);
      if (audioContextRef.current?.state === "running") audioContextRef.current.close();
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        backgroundImage: `url(${randomBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Fondo difuminado estilo hospital futurista con overlay oscuro */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/60"></div>

      {/* Puertas */}
      <div className="absolute inset-0 flex">

        {/* Puerta izquierda */}
        <div
          className="
            w-1/2 h-full 
            bg-gradient-to-r from-cyan-900/40 via-cyan-700/30 to-cyan-500/20 
            border-r border-cyan-300/40
            shadow-[inset_-20px_0_40px_rgba(0,255,255,0.15)]
            backdrop-blur-2xl
          "
          style={{ animation: "doorLeft 2s ease-out forwards" }}
        >
          {/* Bordes luminosos */}
          <div className="absolute inset-y-0 right-0 w-1 bg-cyan-300/80 blur-sm"></div>
          <div className="absolute inset-y-0 right-0 w-1 bg-white/40"></div>
        </div>

        {/* Puerta derecha */}
        <div
          className="
            w-1/2 h-full 
            bg-gradient-to-l from-cyan-900/40 via-cyan-700/30 to-cyan-500/20  
            border-l border-cyan-300/40
            shadow-[inset_20px_0_40px_rgba(0,255,255,0.15)]
            backdrop-blur-2xl
          "
          style={{ animation: "doorRight 2s ease-out forwards" }}
        >
          {/* Bordes luminosos */}
          <div className="absolute inset-y-0 left-0 w-1 bg-cyan-300/80 blur-sm"></div>
          <div className="absolute inset-y-0 left-0 w-1 bg-white/40"></div>
        </div>
      </div>

      {/* Barra de luz tipo escáner */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ animation: "scanLight 1.2s ease-out 0.4s forwards" }}
      >
        <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan-300/40 blur-md"></div>
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/40"></div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes doorLeft {
          0% { transform: translateX(0); }
          90% { transform: translateX(-100%); }
          100% { transform: translateX(-98%); } /* leve overshoot futurista */
        }

        @keyframes doorRight {
          0% { transform: translateX(0); }
          90% { transform: translateX(100%); }
          100% { transform: translateX(98%); }
        }

        @keyframes scanLight {
          0% { opacity: 0; transform: scaleY(0.2); }
          20% { opacity: 1; transform: scaleY(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scaleY(0.2); }
        }
      `}</style>
    </div>
  );
};

export default ElevatorDoors;
