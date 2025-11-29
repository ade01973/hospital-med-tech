import React, { useEffect, useState } from 'react';
import ConfettiCelebration from './ConfettiCelebration';

/**
 * BadgeNotification - Celebración cuando se desbloquea un badge
 * Soporta tanto formato antiguo como el nuevo
 */
const BadgeNotification = ({ isOpen, onClose, badge, showConfetti = true }) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isOpen && badge && showConfetti) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, badge, onClose, showConfetti]);

  if (!isOpen || !badge) return null;

  const badgeEmoji = badge.emoji || badge.icon || '🏆';
  const badgeName = badge.name || 'Logro';
  const badgeDesc = badge.description || '';
  const rarityColor = badge.rarity === 'legendary' ? 'from-amber-600 to-yellow-600' : 
                     badge.rarity === 'epic' ? 'from-purple-600 to-pink-600' : 
                     'from-cyan-600 to-blue-600';

  return (
    <>
      {showCelebration && <ConfettiCelebration trigger={true} onComplete={() => {}} />}
      
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md animate-badge-pop">
          {/* Badge Icon - Animated */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl animate-bounce" style={{ animationDuration: '0.6s' }}>
              {badgeEmoji}
            </div>
          </div>

          {/* Main Card */}
          <div className={`bg-gradient-to-br ${rarityColor} rounded-3xl shadow-2xl overflow-hidden border-2 ${badge.rarity === 'legendary' ? 'border-yellow-300' : 'border-white/30'} relative`}>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />

            {/* Content */}
            <div className="relative p-8 text-center space-y-4">
              {/* Title */}
              <h1 className="text-3xl font-black text-white">
                🎉 ¡LOGRO DESBLOQUEADO!
              </h1>

              {/* Badge Name */}
              <div className="space-y-2">
                <p className="text-white/80 font-bold text-sm uppercase tracking-wider">NUEVO BADGE</p>
                <p className="text-4xl font-black text-yellow-100">
                  {badgeName}
                </p>
              </div>

              {/* Description */}
              <p className="text-white/90 text-base leading-relaxed">
                {badgeDesc}
              </p>

              {/* XP Reward */}
              {badge.xpReward && (
                <p className="text-2xl font-black text-yellow-200">
                  +{badge.xpReward} XP
                </p>
              )}

              {/* Rarity Tag */}
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase">
                  {badge.rarity || 'común'}
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
