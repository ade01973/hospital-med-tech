import React, { useEffect, useState, useRef } from 'react';
import { Gift, Zap, Trophy, Heart } from 'lucide-react';
import Confetti from 'react-confetti';

// Mensajes aleatorios que saldrán flotando
const PRAISE_MESSAGES = [
  { text: "¡INCREÍBLE! 💥", color: "text-yellow-300" },
  { text: "¡SIGUE ASÍ! 🚀", color: "text-blue-300" },
  { text: "¡IMPARABLE! 🔥", color: "text-orange-400" },
  { text: "¡BUEN TRABAJO! 👏", color: "text-green-300" },
  { text: "¡GENIO! 🧠", color: "text-purple-300" },
  { text: "¡A POR TODAS! 💪", color: "text-pink-300" },
  { text: "¡TOP! 🏆", color: "text-yellow-400" },
];

const LoginRewardNotification = ({ isOpen, onClose, rewardData }) => {
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Estado para los mensajes flotantes
  const [floatingMessages, setFloatingMessages] = useState([]);
  const messageIdCounter = useRef(0);

  // Detectar tamaño y reproducir efectos
  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', detectSize);
    
    if (isOpen && rewardData) {
      const isStreakReset = rewardData.message.includes('reinició');
      
      if (!isStreakReset) {
        setShowConfetti(true);
        
        // 🔊 Audio
        try {
          const audio = new Audio('/audio/aplausos.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.warn("Audio bloqueado:", e));
        } catch (error) { console.error(error); }

        // 💬 Iniciar generador de mensajes flotantes (cada 600ms sale uno nuevo)
        const interval = setInterval(() => {
          const id = messageIdCounter.current++;
          const randomMsg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
          const randomLeft = Math.random() * 80 + 10; // Posición horizontal aleatoria entre 10% y 90%
          
          const newMessage = {
            id,
            ...randomMsg,
            left: `${randomLeft}%`,
            animationDuration: Math.random() * 2 + 3 + 's' // Entre 3 y 5 segundos
          };

          setFloatingMessages(prev => [...prev, newMessage]);

          // Limpiar mensaje después de que termine la animación para no saturar memoria
          setTimeout(() => {
            setFloatingMessages(prev => prev.filter(msg => msg.id !== id));
          }, 4000); 

        }, 600); // Frecuencia de aparición

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', detectSize);
        };
      }
    }
  }, [isOpen, rewardData]);

  if (!isOpen || !rewardData) return null;

  const { day, reward, message } = rewardData;
  const isStreakReset = message.includes('reinició');

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Estilos para la animación de flotación */}
      <style>{`
        @keyframes floatUpFade {
          0% { opacity: 0; transform: translateY(50px) scale(0.5); }
          10% { opacity: 1; transform: translateY(0px) scale(1); }
          80% { opacity: 1; transform: translateY(-100px); }
          100% { opacity: 0; transform: translateY(-150px) scale(1.2); }
        }
      `}</style>

      {/* 🏥 FONDO DE PANTALLA */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/hospital-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-0 animate-fade-in" />

      {/* 💬 MENSAJES FLOTANTES (Detrás de la tarjeta, pero delante del fondo) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {floatingMessages.map((msg) => (
          <div
            key={msg.id}
            className={`absolute bottom-10 ${msg.color} font-black text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}
            style={{
              left: msg.left,
              animation: `floatUpFade 4s ease-out forwards`
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* 🎊 CONFETI */}
      {showConfetti && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Confetti
            width={windowDimension.width}
            height={windowDimension.height}
            recycle={false} 
            numberOfPieces={600}
            gravity={0.25}
          />
        </div>
      )}

      {/* 🃏 TARJETA PRINCIPAL */}
      <div className={`
        relative z-20 w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden
        transform transition-all duration-500 scale-100 
        border-4 ${isStreakReset ? 'border-red-500' : 'border-yellow-400'}
        ${isStreakReset 
          ? 'bg-gradient-to-br from-red-900 to-orange-900' 
          : 'bg-gradient-to-br from-green-600 to-emerald-600'
        }
      `}>
        
        {/* Header */}
        <div className="px-8 py-8 text-center border-b border-white/20">
          <div className="text-7xl mb-4 animate-pulse filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-default">
            {isStreakReset ? '💔' : '🎉'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-md tracking-wide uppercase">
            {isStreakReset ? 'RACHA REINICIADA' : `¡DÍA ${day} COMPLETADO!`}
          </h2>
          <p className="text-white/90 text-lg font-medium">{message}</p>
        </div>

        {/* Rewards Display */}
        <div className="px-8 py-6 space-y-4">
          {/* XP */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-colors group">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-yellow-300 fill-yellow-300 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-lg">Experiencia</span>
            </div>
            <span className="text-3xl font-black text-yellow-300 drop-shadow-sm">+{reward.xp} XP</span>
          </div>

          {/* Power-ups */}
          {reward.powerUps > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10 hover:bg-white/20 transition-colors group">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-300 fill-blue-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-white text-lg">Power-ups</span>
              </div>
              <span className="text-3xl font-black text-blue-300 drop-shadow-sm">+{reward.powerUps}</span>
            </div>
          )}

          {/* Badge */}
          {reward.badge && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-purple-400/30 bg-purple-500/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-purple-300 animate-bounce-slow" />
                <div className="flex flex-col text-left">
                  <span className="text-xs text-purple-200 uppercase font-bold tracking-wider">Nueva Insignia</span>
                  <span className="font-black text-white text-lg">{reward.badge.emoji} {reward.badge.title}</span>
                </div>
              </div>
              <span className="text-2xl animate-spin-slow">✨</span>
            </div>
          )}
        </div>

        {/* Mensaje fijo motivacional */}
        <div className="bg-black/20 px-8 py-4 text-center mx-4 rounded-xl">
          <p className="text-white text-sm font-bold italic">
            {isStreakReset 
              ? '"El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el valor para continuar." 💪' 
              : day >= 30 ? '¡ESTÁS HACIENDO HISTORIA EN EL HOSPITAL! 🏥👑' 
              : day >= 7 ? '¡Tu constancia salva vidas virtuales! Sigue así 💎' 
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
