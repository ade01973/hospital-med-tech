import React, { useEffect, useState } from 'react';

/**
 * CoinNotification - Muestra notificación flotante de monedas ganadas
 * Aparece con animación y se desvanece automáticamente
 */
const CoinNotification = ({ amount, x, y, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[10000] animate-float-coin"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 py-3 rounded-full font-black text-lg shadow-lg drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
        <span className="text-2xl">💰</span>
        <span>+{amount}</span>
      </div>
    </div>
  );
};

export default CoinNotification;
