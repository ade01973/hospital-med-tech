import React, { useState, useEffect } from 'react';
import ConfettiCelebration from './ConfettiCelebration';

/**
 * CelebrationFX - Efectos visuales de celebración para quiz perfecto
 * Muestra popup de celebración + confetti + bonus de monedas
 */
const CelebrationFX = ({ show, bonusCoins, streak, onComplete }) => {
  const [displayCoins, setDisplayCoins] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (show) {
      setShowPopup(true);
      // Animación de conteo de monedas
      let current = 0;
      const target = bonusCoins || 50;
      const increment = Math.ceil(target / 20);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setDisplayCoins(target);
          clearInterval(timer);
        } else {
          setDisplayCoins(current);
        }
      }, 30);

      // Mostrar popup por 3 segundos
      const hideTimer = setTimeout(() => {
        setShowPopup(false);
        if (onComplete) onComplete();
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [show, bonusCoins, onComplete]);

  if (!show) return null;

  return (
    <>
      {/* Confetti */}
      {show && <ConfettiCelebration trigger={show} />}

      {/* Popup de celebración */}
      {showPopup && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
          <div className="animate-celebration-popup flex flex-col items-center gap-4">
            {/* Texto de celebración */}
            <div className="text-center">
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 mb-2 animate-pulse">
                ¡PERFECTO!
              </h2>
              <p className="text-2xl font-black text-white drop-shadow-lg">
                Quiz completado sin errores
              </p>
            </div>

            {/* Badge de celebración */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>
            </div>

            {/* Bonus de monedas */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl px-8 py-4 backdrop-blur-sm">
              <div className="text-center">
                <p className="text-sm font-black text-yellow-200 uppercase tracking-widest mb-2">
                  Bonus obtenido
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">💰</span>
                  <span className="text-5xl font-black text-yellow-300">{displayCoins}</span>
                  <span className="text-lg text-yellow-200 font-black">GestCoins</span>
                </div>
                {streak > 0 && (
                  <p className="text-xs text-cyan-300 mt-2 font-black">
                    +{Math.floor(streak * 5)} bonus por racha de {streak}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationFX;
