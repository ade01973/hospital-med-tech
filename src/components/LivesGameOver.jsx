import React, { useState, useEffect } from 'react';
import { Video, Zap } from 'lucide-react';

const LivesGameOver = ({ topic, onContinue, onWatchVideo, onUsePowerUp, hasPowerUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isRecoveryReady, setIsRecoveryReady] = useState(false);

  useEffect(() => {
    const recoveryKey = `livesRecoveryTime_${topic?.id}`;
    const savedTime = localStorage.getItem(recoveryKey);

    if (savedTime) {
      const checkRecovery = setInterval(() => {
        const now = Date.now();
        const recoveryTime = parseInt(savedTime);
        const timeLeft = recoveryTime - now;

        if (timeLeft <= 0) {
          setIsRecoveryReady(true);
          setTimeRemaining(null);
          clearInterval(checkRecovery);
          localStorage.removeItem(recoveryKey);
        } else {
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(checkRecovery);
    }
  }, [topic?.id]);

  const handleWait30Minutes = () => {
    const recoveryKey = `livesRecoveryTime_${topic?.id}`;
    const recoveryTime = Date.now() + 30 * 60 * 1000;
    localStorage.setItem(recoveryKey, recoveryTime.toString());
    setTimeRemaining('30:00');
  };

  const handleContinueAfterRecovery = () => {
    onContinue(5);
    const recoveryKey = `livesRecoveryTime_${topic?.id}`;
    localStorage.removeItem(recoveryKey);
  };

  if (isRecoveryReady) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-emerald-500/60 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                <span className="text-3xl">❤️</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">¡ENERGÍA RECUPERADA!</h2>
              <p className="text-emerald-300 text-sm">Tus 5 corazones están listos</p>
            </div>

            <button
              onClick={handleContinueAfterRecovery}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg mb-3"
            >
              CONTINUAR JUGANDO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-red-500/60 w-full max-w-sm rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse">
              <span className="text-3xl">💔</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">SIN ENERGÍA</h2>
            <p className="text-slate-400 text-sm">Se acabaron tus 5 corazones</p>
          </div>

          {!timeRemaining ? (
            <button
              onClick={handleWait30Minutes}
              className="w-full mb-3 bg-slate-800/50 hover:bg-slate-700/50 border-2 border-amber-500/30 hover:border-amber-500/60 text-white p-4 rounded-xl transition-all"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={18} className="text-amber-400" />
                <span className="font-black text-sm">⏱️ ESPERAR 30 MINUTOS</span>
              </div>
              <p className="text-xs text-amber-300">Recarga automática de 5 ❤️</p>
            </button>
          ) : (
            <div className="w-full mb-3 bg-slate-800/50 border-2 border-amber-500/30 text-white p-4 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={18} className="text-amber-400" />
                <span className="font-black text-sm">RECARGANDO...</span>
              </div>
              <p className="text-2xl font-black text-amber-300 font-mono">{timeRemaining}</p>
            </div>
          )}

          <button
            onClick={() => {
              console.log(`🎬 Botón "VER VIDEO" clickeado`);
              onWatchVideo();
            }}
            className="w-full mb-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 p-4 rounded-xl transition-all"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Video size={18} />
              <span className="font-black text-sm">📺 VER VIDEO DE REPASO</span>
            </div>
            <p className="text-xs text-cyan-300/80">Recupera 2 ❤️ al terminar</p>
          </button>

          {hasPowerUp ? (
            <button
              onClick={onUsePowerUp}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-black py-3 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={18} />
                <span className="text-sm">⚡ USAR POWER-UP</span>
              </div>
              <p className="text-xs text-purple-200">Recupera 5 ❤️ instantáneamente</p>
            </button>
          ) : (
            <div className="w-full bg-slate-800/30 border-2 border-slate-700/50 text-slate-400 p-3 rounded-xl text-center cursor-not-allowed opacity-50">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap size={18} />
                <span className="font-black text-xs">⚡ POWER-UP NO DISPONIBLE</span>
              </div>
              <p className="text-xs text-slate-500">Completa módulos para desbloquear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivesGameOver;
