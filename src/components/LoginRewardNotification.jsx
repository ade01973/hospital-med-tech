import React from 'react';
import { Gift, Zap, Trophy, Heart } from 'lucide-react';

const LoginRewardNotification = ({ isOpen, onClose, rewardData }) => {
  if (!isOpen || !rewardData) return null;

  const { day, reward, message } = rewardData;
  const isStreakReset = message.includes('reinició');

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`
        w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-bounce
        ${isStreakReset 
          ? 'bg-gradient-to-br from-red-900 to-orange-900' 
          : 'bg-gradient-to-br from-green-600 to-emerald-600'
        }
      `}>
        
        {/* Header */}
        <div className="px-8 py-8 text-center border-b border-white/20">
          <div className="text-6xl mb-4 animate-bounce">
            {isStreakReset ? '🔄' : '🎉'}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {isStreakReset ? 'RACHA REINICIADA' : `¡DÍA ${day} COMPLETADO!`}
          </h2>
          <p className="text-white/90 text-sm">{message}</p>
        </div>

        {/* Rewards Display */}
        <div className="px-8 py-6 space-y-4">
          {/* XP */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-yellow-300" />
              <span className="font-black text-white">Experiencia</span>
            </div>
            <span className="text-2xl font-black text-yellow-300">+{reward.xp} XP</span>
          </div>

          {/* Power-ups */}
          {reward.powerUps > 0 && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-300" />
                <span className="font-black text-white">Power-ups</span>
              </div>
              <span className="text-2xl font-black text-blue-300">+{reward.powerUps}</span>
            </div>
          )}

          {/* Badge */}
          {reward.badge && (
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-purple-300" />
                <span className="font-black text-white">{reward.badge.emoji} {reward.badge.title}</span>
              </div>
              <span className="text-lg">✨</span>
            </div>
          )}
        </div>

        {/* Motivational Message */}
        <div className="bg-white/5 px-8 py-4 text-center">
          <p className="text-white/80 text-sm font-black">
            {isStreakReset 
              ? '¡Empieza de nuevo y reconstruye tu racha! 💪' 
              : day >= 30 
                ? '¡ERES UNA LEYENDA! 👑' 
                : day >= 21 
                  ? '¡Casi maestría completa! 🚀' 
                  : day >= 14 
                    ? '¡Consistencia increíble! 🔥' 
                    : day >= 7 
                      ? '¡Dedicación semanal lograda! 💎' 
                      : '¡Vuelve mañana por más! 😊'
            }
          </p>
        </div>

        {/* Button */}
        <div className="px-8 py-6">
          <button
            onClick={onClose}
            className={`
              w-full font-black py-4 rounded-xl transition-all transform hover:scale-105
              ${isStreakReset
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400'
              }
              text-white text-lg
            `}
          >
            {isStreakReset ? 'REINTENTAR' : 'GENIAL'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRewardNotification;
