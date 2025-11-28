import React from 'react';

/**
 * CurrencyDisplay - Badge que muestra el balance de GestCoins
 * Se integra en el Dashboard para mostrar las monedas del usuario
 */
const CurrencyDisplay = ({ balance = 0 }) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border-2 border-yellow-400/50 hover:border-yellow-400 transition-all">
      <span className="text-2xl">💰</span>
      <div className="flex flex-col">
        <span className="text-xs text-yellow-200 uppercase font-black tracking-wider">GestCoins</span>
        <span className="text-lg font-black text-yellow-300">{balance}</span>
      </div>
    </div>
  );
};

export default CurrencyDisplay;
