import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Trophy, Heart } from 'lucide-react';
import useSoundEffects from '../hooks/useSoundEffects';

const VISUAL_EFFECTS = ['confetti', 'sparkles', 'fireworks', 'aurora', 'claps'];

const CelebrationLayer = ({ type }) => {
  const confettiPieces = useMemo(
    () => Array.from({ length: 18 }).map((_, index) => ({
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: ['#facc15', '#22d3ee', '#a855f7', '#34d399', '#fb7185'][index % 5],
      sway: Math.random() * 30 - 15,
      duration: 2 + Math.random() * 1.2,
    })),
    []
  );

  const fireworkBursts = useMemo(
    () => [
      { top: '20%', left: '15%', delay: '0s' },
      { top: '30%', right: '10%', delay: '0.2s' },
      { bottom: '25%', left: '25%', delay: '0.4s' },
      { bottom: '15%', right: '20%', delay: '0.6s' },
    ],
    []
  );

  const clapEmojis = useMemo(
    () => Array.from({ length: 6 }).map((_, index) => ({
      left: 10 + Math.random() * 80,
      bottom: 10 + Math.random() * 60,
      delay: index * 0.2,
    })),
    []
  );

  if (type === 'confetti') {
    
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confettiPieces.map((piece, idx) => (
          <span
            key={`confetti-${idx}`}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              backgroundColor: piece.color,
              animationDuration: `${piece.duration}s`,
              '--confetti-sway': `${piece.sway}px`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'sparkles') {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="sparkle size-24 bg-white/30" />
        <div className="sparkle size-32 bg-cyan-200/25" />
        <div className="sparkle size-40 bg-emerald-200/20" />
      </div>
    );
  }

  if (type === 'fireworks') {
    return (
      <div className="pointer-events-none absolute inset-0">
        {fireworkBursts.map((burst, idx) => (
          <div
            key={`firework-${idx}`}
            className="firework"
            style={{ ...burst, animationDelay: burst.delay }}
          />
        ))}
      </div>
    );
  }

  if (type === 'aurora') {
    return (
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-12 h-44 w-44 rounded-full bg-cyan-400/40 blur-3xl animate-pulse" />
        <div className="absolute -right-6 top-10 h-52 w-52 rounded-full bg-emerald-300/35 blur-3xl animate-pulse" />
        <div className="absolute left-10 bottom-8 h-40 w-40 rounded-full bg-purple-400/30 blur-3xl animate-pulse" />
      </div>
    );
  }

  if (type === 'claps') {
    return (
      <div className="pointer-events-none absolute inset-0">
        {clapEmojis.map((emoji, idx) => (
          <span
            key={`clap-${idx}`}
            className="absolute text-3xl animate-pop"
            style={{
              left: `${emoji.left}%`,
              bottom: `${emoji.bottom}%`,
              animationDelay: `${emoji.delay}s`,
            }}
          >
            👏
          </span>
        ))}
      </div>
    );
  }

  return null;
};

const LoginRewardNotification = ({ isOpen, onClose, rewardData }) => {
  const [activeEffects, setActiveEffects] = useState([]);
  const { playVictory } = useSoundEffects();

  useEffect(() => {
    if (!isOpen || !rewardData) return;

    const shuffled = [...VISUAL_EFFECTS].sort(() => 0.5 - Math.random());
    const count = 2 + Math.floor(Math.random() * 2);
    setActiveEffects(shuffled.slice(0, count));
    playVictory();
  }, [isOpen, rewardData, playVictory]);

  useEffect(() => {
    if (!isOpen) {
      setActiveEffects([]);
    }
  }, [isOpen]);

  if (!isOpen || !rewardData) return null;

  const { day, reward, message } = rewardData;
  const isStreakReset = message.includes('reinició');

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div
          className={`${
            isStreakReset
              ? 'bg-gradient-to-br from-red-900 to-orange-900'
              : 'bg-gradient-to-br from-green-600 to-emerald-600'
          } relative`}
        >
          <div className="pointer-events-none absolute inset-0 z-10">
            {activeEffects.map((effect) => (
              <CelebrationLayer key={effect} type={effect} />
            ))}
          </div>

          <div className="relative z-20">
            {/* Header */}
            <div className="px-8 py-8 text-center border-b border-white/20">
              <div className="text-6xl mb-4 drop-shadow-md">
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
                  text-white text-lg shadow-xl shadow-black/30
                `}
              >
                {isStreakReset ? 'REINTENTAR' : 'GENIAL'} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRewardNotification;
