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
  
  // Referencia para controlar el audio
  const audioRef = useRef(null);

  // Manejar el cierre y parar el audio
  const handleClaimAndClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

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
        
        // 🔊 Audio en BUCLE
        try {
          audioRef.current = new Audio('/audio/aplausos.mp3');
          audioRef.current.loop = true; // <--- SE REPITE INFINITAMENTE
          audioRef.current.volume = 0.5;
          audioRef.current.play().catch(e => console.warn("Audio bloqueado:", e));
        } catch (error) { console.error(error); }

        // 💬 Iniciar generador de mensajes flotantes
        const interval = setInterval(() => {
          const id = messageIdCounter.current++;
          const randomMsg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
          const randomLeft = Math.random() * 80 + 10; 
          
          const newMessage = {
            id,
            ...randomMsg,
            left: `${randomLeft}%`,
            animationDuration: Math.random() * 2 + 3 + 's' 
          };

          setFloatingMessages(prev => [...prev, newMessage]);

          setTimeout(() => {
            setFloatingMessages(prev => prev.filter(msg => msg.id !== id));
          }, 4000); 

        }, 600); 

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', detectSize);
            // Parar audio si se desmonta el componente
            if (audioRef.current) {
              audioRef.current.pause();
            }
        };
      }
    }
  }, [isOpen, rewardData]);

  if (!isOpen || !rewardData) return null;

  const { day, reward, message } = rewardData;
  const isStreakReset = message.includes('reinició');

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center overflow-hidden font-sans">
      
      {/* Estilos CSS Dinámicos para animaciones avanzadas */}
      <style>{`
        @keyframes floatUpFade {
          0% { opacity: 0; transform: translateY(50px) scale(0.5); }
          10% { opacity: 1; transform: translateY(0px) scale(1); }
          80% { opacity: 1; transform: translateY(-100px); }
          100% { opacity: 0; transform: translateY(-150px) scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 223, 0, 0.5), 0 0 40px rgba(255, 223, 0, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 223, 0, 0.8), 0 0 80px rgba(255, 223, 0, 0.4); }
        }
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 🏥 FONDO DE PANTALLA */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/hospital-bg.png')" }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-0 animate-fade-in" />

      {/* 💬 MENSAJES FLOTANTES */}
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
            recycle={true} // Ahora recicla confeti mientras dure la pantalla
            numberOfPieces={400}
            gravity={0.20}
          />
        </div>
      )}

      {/* 🃏 TARJETA PRINCIPAL */}
      <div 
        className={`
          relative z-20 w-full max-w-md mx-4 rounded-3xl overflow-hidden
          transform transition-all duration-500 scale-100 
          border-[3px] 
          ${isStreakReset 
            ? 'border-red-500 bg-gradient-to-br from-red-900 via-red-800 to-orange-900' 
            : 'border-yellow-300 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600'
          }
        `}
        style={{
          // Animación de resplandor en el borde si es premio positivo
          animation: !isStreakReset ? 'borderGlow 2s infinite ease-in-out' : 'none',
          backgroundSize: '200% 200%',
          // Movimiento sutil del gradiente de fondo
          animationName: 'bgShift',
          animationDuration: '5s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease'
        }}
      >
        
        {/* ✨ DESTELLO HOLOGRÁFICO (SHIMMER) */}
        {!isStreakReset && (
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent z-30"
            style={{
              animation: 'shimmer 3s infinite', // Pasa el destello cada 3 segundos
            }}
          />
        )}

        {/* Header */}
        <div className="relative z-40 px-8 py-8 text-center border-b border-white/20">
          <div className="text-7xl mb-4 animate-pulse filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transform hover:scale-110 transition-transform cursor-default">
            {isStreakReset ? '💔' : '🎉'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2 drop-shadow-md tracking-wide uppercase">
            {isStreakReset ? 'RACHA REINICIADA' : `¡DÍA ${day} COMPLETADO!`}
          </h2>
          <p className="text-white/90 text-lg font-medium">{message}</p>
        </div>

        {/* Rewards Display */}
        <div className="relative z-40 px-8 py-6 space-y-4">
          {/* XP */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/20 shadow-inner hover:bg-white/20 transition-colors group">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-yellow-300 fill-yellow-300 group-hover:scale-110 transition-transform drop-shadow" />
              <span className="font-bold text-white text-lg">Experiencia</span>
            </div>
            <span className="text-3xl font-black text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">+{reward.xp} XP</span>
          </div>

          {/* Power-ups */}
          {reward.powerUps > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/20 shadow-inner hover:bg-white/20 transition-colors group">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-300 fill-blue-300 group-hover:scale-110 transition-transform drop-shadow" />
                <span className="font-bold text-white text-lg">Power-ups</span>
              </div>
              <span className="text-3xl font-black text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">+{reward.powerUps}</span>
            </div>
          )}

          {/* Badge */}
          {reward.badge && (
            <div className="bg-purple-900/40 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
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

        {/* Mensaje motivacional */}
        <div className="relative z-40 bg-black/30 px-8 py-4 text-center mx-4 rounded-xl border border-white/5">
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
        <div className="relative z-40 px-6 py-6">
          <button
            onClick={handleClaimAndClose}
            className={`
              w-full font-black py-4 px-2 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl
              ${isStreakReset
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-orange-900/50'
                : 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-500 hover:from-yellow-200 hover:to-orange-400 text-black shadow-orange-500/50'
              }
              text-lg uppercase tracking-tight flex items-center justify-center gap-2 border-b-4 
              ${isStreakReset ? 'border-red-800' : 'border-orange-600'}
            `}
          >
            {isStreakReset 
              ? 'VOLVER A INTENTARLO 😤' 
              : (
                <span className="drop-shadow-sm text-center leading-tight">
                  RECLAMAR PREMIOS Y ENTRAR<br/>AL HOSPITAL GEST-TECH 🏥
                </span>
              )
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRewardNotification;
