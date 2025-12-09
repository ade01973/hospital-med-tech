import React, { useEffect, useState } from 'react';
import { Gift, Zap, Trophy, Heart } from 'lucide-react';
import Confetti from 'react-confetti'; // Asegúrate de instalarla: npm install react-confetti
// Si tienes un archivo de sonido, impórtalo así (ajusta la ruta):
// import applauseSound from '../assets/sounds/applause.mp3'; 

const LoginRewardNotification = ({ isOpen, onClose, rewardData }) => {
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(false);

  // Detectar tamaño de ventana para el confeti
  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', detectSize);
    
    // Configuración inicial al abrir
    if (isOpen && rewardData) {
      const isStreakReset = rewardData.message.includes('reinició');
      
      // Solo mostrar confeti y sonido si NO es un reseteo de racha
      if (!isStreakReset) {
        setShowConfetti(true);
        // Descomenta esto si tienes el archivo de audio:
        // const audio = new Audio('/sounds/applause.mp3'); // O usa el import
        // audio.volume = 0.5;
        // audio.play().catch(e => console.log("Audio play failed", e));
      }
    }

    return () => window.removeEventListener('resize', detectSize);
  }, [isOpen, rewardData]);

  if (!isOpen || !rewardData) return null;

  const { day, reward, message } = rewardData;
  const isStreakReset = message.includes('reinició');

  return (
    // z-[500] asegura que esté por encima de todo
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      {/* 🎊 CONFETI: Solo si hay premio y no es reset */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false} // Para que pare después de un rato
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      {/* 🃏 TARJETA: Ya NO bota (eliminado animate-bounce). 
          Ahora tiene una entrada suave (scale-100) y es estática. */}
      <div className={`
        relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden
        transform transition-all duration-500 scale-100 
        border-4 ${isStreakReset ? 'border-red-500' : 'border-yellow-400'}
        ${isStreakReset 
          ? 'bg-gradient-to-br from-red-900 to-orange-900' 
          : 'bg-gradient-to-br from-green-600 to-emerald-600'
        }
      `}>
        
        {/* Header */}
        <div className="px-8 py-8 text-center border-b border-white/20">
          {/* Cambiado animate-bounce por animate-pulse para que lata como un corazón pero no salte */}
          <div className="text-7xl mb-4 animate-pulse filter drop-shadow-lg">
            {isStreakReset ? '💔' : '🎉'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-md tracking-wide">
            {isStreakReset ? 'RACHA REINICIADA' : `¡DÍA ${day} COMPLETADO!`}
          </h2>
          <p className="text-white/90 text-lg font-medium">{message}</p>
        </div>

        {/* Rewards Display */}
        <div className="px-8 py-6 space-y-4">
          {/* XP */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-colors">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              <span className="font-bold text-white text-lg">Experiencia</span>
            </div>
            <span className="text-3xl font-black text-yellow-300 drop-shadow-sm">+{reward.xp} XP</span>
          </div>

          {/* Power-ups */}
          {reward.powerUps > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-300 fill-blue-300" />
                <span className="font-bold text-white text-lg">Power-ups</span>
              </div>
              <span className="text-3xl font-black text-blue-300 drop-shadow-sm">+{reward.powerUps}</span>
            </div>
          )}

          {/* Badge */}
          {reward.badge && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-purple-400/30 bg-purple-500/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-purple-300" />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-purple-200 uppercase font-bold tracking-wider">Nueva Insignia</span>
                  <span className="font-black text-white text-lg">{reward.badge.emoji} {reward.badge.title}</span>
                </div>
              </div>
              <span className="text-2xl animate-spin-slow">✨</span>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="bg-black/20 px-8 py-4 text-center mx-4 rounded-xl">
          <p className="text-white text-sm font-bold italic">
            {isStreakReset 
              ? '"El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar." 💪' 
              : day >= 30 
                ? '¡ESTÁS HACIENDO HISTORIA EN EL HOSPITAL! 🏥👑' 
                : day >= 7 
                  ? '¡Tu constancia salva vidas virtuales! Sigue así 💎' 
                  : '¡Cada día cuenta para ser el mejor gestor! 🚀'
            }
          </p>
        </div>

        {/* Button */}
        <div className="px-8 py-6">
          <button
            onClick={onClose}
            className={`
              w-full font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg
              ${isStreakReset
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-orange-900/50'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black shadow-orange-500/50'
              }
              text-xl tracking-wide flex items-center justify-center gap-2
            `}
          >
            {isStreakReset ? 'VOLVER A INTENTARLO 😤' : '¡RECLAMAR PREMIOS! 🎁'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRewardNotification;
