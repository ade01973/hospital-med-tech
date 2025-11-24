import React, { useEffect } from 'react';
import Confetti from './Confetti';

const BadgeNotification = ({ isOpen, onClose, badge }) => {
  const [triggerConfetti, setTriggerConfetti] = React.useState(false);

  useEffect(() => {
    if (isOpen && badge) {
      setTriggerConfetti(true);
      const timer = setTimeout(() => setTriggerConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge]);

  if (!isOpen || !badge) return null;

  return (
    <>
      {triggerConfetti && <Confetti />}
      
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md">
          {/* Badge Icon - Animated */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl animate-bounce" style={{ animationDuration: '0.6s' }}>
              {badge.icon}
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 rounded-3xl shadow-2xl overflow-hidden border-2 border-yellow-300 relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animate-pulse" />

            {/* Content */}
            <div className="relative p-8 text-center space-y-4">
              {/* Titulo */}
              <h1 className="text-3xl font-black text-white">
                🎉 ¡LOGRO DESBLOQUEADO!
              </h1>

              {/* Badge Name */}
              <div className="space-y-2">
                <p className="text-white/80 font-bold text-sm uppercase tracking-wider">NUEVO BADGE</p>
                <p className="text-4xl font-black text-yellow-100">
                  {badge.name}
                </p>
              </div>

              {/* Description */}
              <p className="text-white/90 text-base leading-relaxed">
                {badge.description}
              </p>

              {/* Category */}
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase">
                  {badge.category}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 mt-6 shadow-lg"
              >
                ¡GENIAL! →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeNotification;
