import React, { useEffect, useState } from 'react';

const Confetti = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    // Generar partículas de confetti
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1,
      color: ['bg-emerald-400', 'bg-green-400', 'bg-cyan-400', 'bg-blue-400', 'bg-yellow-300'][
        Math.floor(Math.random() * 5)
      ],
      size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-1 h-1',
    }));

    setParticles(newParticles);

    // Limpiar después de que termine la animación
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3500);

    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute ${particle.color} ${particle.size} rounded-full`}
          style={{
            left: `${particle.left}%`,
            top: '-10px',
            animation: `confetti-fall ${particle.duration}s ease-in forwards`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
