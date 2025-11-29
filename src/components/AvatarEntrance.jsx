import React, { useEffect, useState } from 'react';

/**
 * AvatarEntrance - Animación de entrada del avatar al hospital
 * Se muestra después de seleccionar el avatar
 * El avatar entra caminando con efectos visuales
 */
const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntrance(false);
      if (onComplete) onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showEntrance) return null;

  // Seleccionar SVG del avatar basado en género y skin tone
  const getSvgPath = () => {
    if (!avatar) return null;
    
    const genders = {
      male: 'M',
      female: 'F'
    };
    const gender = genders[avatar.gender] || 'M';
    const silhouette = avatar.silhouette || '1';
    const skin = avatar.skinTone || 'light';
    
    // Retornar emoji representativo en lugar de SVG
    return avatar.gender === 'female' ? '👩‍⚕️' : '👨‍⚕️';
  };

  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-b from-slate-900 via-cyan-900/20 to-slate-900 overflow-hidden">
      {/* Background Hospital */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-slate-900/30" />
        {/* Hospital building silhouette */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Building outline */}
            <rect x="20" y="80" width="260" height="200" fill="none" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="3" />
            {/* Windows */}
            {[...Array(5)].map((_, row) => 
              [...Array(6)].map((_, col) => (
                <rect 
                  key={`window-${row}-${col}`}
                  x={40 + col * 40} 
                  y={100 + row * 30} 
                  width="20" 
                  height="15" 
                  fill="rgba(34, 197, 94, 0.3)" 
                  stroke="rgba(6, 182, 212, 0.4)" 
                  strokeWidth="1"
                />
              ))
            )}
            {/* Cross symbol */}
            <g transform="translate(150, 40)">
              <rect x="-8" y="-20" width="16" height="40" fill="rgba(239, 68, 68, 0.4)" />
              <rect x="-20" y="-8" width="40" height="16" fill="rgba(239, 68, 68, 0.4)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800/60 to-transparent" />
      
      {/* Ground line */}
      <div className="absolute bottom-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Avatar entrance animation */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        {/* Avatar container */}
        <div className="relative mb-16 animate-avatar-entrance">
          {/* Shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-transparent via-black/40 to-transparent rounded-full blur-xl" />
          
          {/* Avatar figure */}
          <div className="text-9xl drop-shadow-2xl">
            {getSvgPath()}
          </div>

          {/* Aura effect */}
          <div className="absolute inset-0 -m-8 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Welcome text */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-5xl font-black text-white mb-2 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            ¡Bienvenido al Hospital!
          </h1>
          <p className="text-xl text-cyan-300 font-bold animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Tu aventura comienza ahora...
          </p>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float-particle"
              style={{
                left: `${20 + i * 10}%`,
                top: '60%',
                animationDelay: `${i * 0.1}s`,
                '--duration': `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>

        {/* Floor shine effect */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-lg animate-pulse" />
      </div>

      {/* Hospital entrance door frame */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="relative w-40 h-64 border-4 border-cyan-500/30 rounded-t-3xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm">
          {/* Door shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {/* Cross symbol on door */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl text-red-500/50">+</div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2 items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <p className="text-xs text-slate-400 font-bold">Entrando al sistema...</p>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export default AvatarEntrance;
