import React, { useState, useEffect } from 'react';
import { Zap, Gift } from 'lucide-react';
import { STREAK_MILESTONES } from '../data/constants';
import { useGestCoins } from '../hooks/useGestCoins';

/**
 * StreakTracker - Daily Streak System Component
 * Tracks consecutive days of playing, with milestones, warning, and freeze recovery
 */
const StreakTracker = () => {
  const { balance, buyConsumable } = useGestCoins();
  const [streakData, setStreakData] = useState({
    count: 0,
    lastPlayDate: null,
    frozenUntil: null,
    frozeThisMonth: false,
    milestonesBadges: []
  });
  const [hoursUntilReset, setHoursUntilReset] = useState(24);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showStreakLossModal, setShowStreakLossModal] = useState(false);
  const [unlockedMilestone, setUnlockedMilestone] = useState(null);
  const [streakLostAnimation, setStreakLostAnimation] = useState(false);

  // Load streak data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('streakData');
    if (saved) {
      const data = JSON.parse(saved);
      setStreakData(data);
    }

    // Check if streak should be reset
    checkStreakReset();

    // Update hours until reset
    const timer = setInterval(() => {
      updateHoursUntilReset();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Check if 24+ hours have passed since last play
  const checkStreakReset = () => {
    const saved = localStorage.getItem('streakData');
    if (!saved) return;

    const data = JSON.parse(saved);
    const lastPlay = new Date(data.lastPlayDate);
    const now = new Date();
    const hoursDiff = (now - lastPlay) / (1000 * 60 * 60);

    if (hoursDiff >= 24 && data.count > 0) {
      // Streak lost - trigger animation
      setStreakLostAnimation(true);
      setTimeout(() => setShowStreakLossModal(true), 300);
      
      const newData = {
        ...data,
        count: 0,
        lastPlayDate: null,
        frozeThisMonth: false
      };
      setStreakData(newData);
      localStorage.setItem('streakData', JSON.stringify(newData));
    }

    updateHoursUntilReset();
  };

  const updateHoursUntilReset = () => {
    const saved = localStorage.getItem('streakData');
    if (!saved || streakData.count === 0) {
      setHoursUntilReset(24);
      return;
    }

    const data = JSON.parse(saved);
    const lastPlay = new Date(data.lastPlayDate);
    const now = new Date();
    const hoursDiff = (now - lastPlay) / (1000 * 60 * 60);
    const hoursLeft = Math.max(0, Math.ceil(24 - hoursDiff));
    setHoursUntilReset(hoursLeft);
  };

  // Increment streak after completing a quiz
  const incrementStreak = () => {
    const now = new Date();
    const today = now.toDateString();

    let data = { ...streakData };
    if (!data.lastPlayDate) {
      data.count = 1;
    } else {
      const lastPlay = new Date(data.lastPlayDate);
      const lastPlayDate = lastPlay.toDateString();

      if (lastPlayDate !== today) {
        // Different day - increment
        data.count += 1;
      }
    }

    data.lastPlayDate = now;

    // Check milestones
    STREAK_MILESTONES.forEach(milestone => {
      if (data.count === milestone.days && !data.milestonesBadges.includes(milestone.days)) {
        data.milestonesBadges.push(milestone.days);
        setUnlockedMilestone(milestone);
      }
    });

    setStreakData(data);
    localStorage.setItem('streakData', JSON.stringify(data));
    updateHoursUntilReset();
  };

  // Use freeze to recover streak
  const handleFreezeStreak = () => {
    if (balance < 50 || streakData.frozeThisMonth) {
      return;
    }

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const newData = {
      ...streakData,
      count: streakData.count, // Keep current streak
      lastPlayDate: now, // Reset timer
      frozenUntil: nextMonth,
      frozeThisMonth: true
    };

    setStreakData(newData);
    localStorage.setItem('streakData', JSON.stringify(newData));
    buyConsumable('freeze_token', 1); // Deduct 50 coins
    setShowFreezeModal(false);
    updateHoursUntilReset();
  };

  // Check if freeze is still active
  const isFrozenActive = streakData.frozenUntil && new Date(streakData.frozenUntil) > new Date();

  return (
    <div className="space-y-4">
      {/* Main Streak Card */}
      <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-emerald-500 p-1 rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 rounded-3xl p-6 backdrop-blur-xl">
          
          {/* Streak Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-5xl animate-bounce-streak">🔥</div>
              <div>
                <p className="text-xs text-slate-400 font-bold">RACHA ACTUAL</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400">
                  {streakData.count}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-300 font-bold">Días</p>
              <p className={`text-2xl font-black ${hoursUntilReset <= 6 ? 'text-red-400 animate-pulse-glow' : 'text-emerald-400'}`}>
                {hoursUntilReset}h
              </p>
            </div>
          </div>

          {/* Warning if close to reset */}
          {hoursUntilReset <= 6 && streakData.count > 0 && (
            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-3 mb-4 animate-pulse">
              <p className="text-xs text-red-300 font-bold">⚠️ ¡Racha en peligro! Juega hoy para recuperar</p>
            </div>
          )}

          {/* Frozen Status */}
          {isFrozenActive && (
            <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-300 font-bold">🧊 Racha congelada hasta: {new Date(streakData.frozenUntil).toLocaleDateString()}</p>
            </div>
          )}

          {/* Freeze Button */}
          {hoursUntilReset <= 6 && streakData.count > 0 && !isFrozenActive && !streakData.frozeThisMonth && (
            <button
              onClick={() => setShowFreezeModal(true)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105 mb-4 flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              Congelar Racha - 50 GestCoins
            </button>
          )}
        </div>
      </div>

      {/* Milestones Badges */}
      {streakData.milestonesBadges.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400">HITOS DESBLOQUEADOS</p>
          <div className="flex flex-wrap gap-2">
            {streakData.milestonesBadges.map(days => {
              const milestone = STREAK_MILESTONES.find(m => m.days === days);
              return (
                <div
                  key={days}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-milestone-unlock"
                >
                  <Gift size={16} className="text-white" />
                  <span className="text-white font-black text-sm">{milestone.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Milestone Unlock Notification */}
      {unlockedMilestone && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-2xl border-2 border-yellow-300 shadow-2xl animate-celebration-popup">
          <p className="text-white font-black text-center mb-2">✨ ¡HITO DESBLOQUEADO! ✨</p>
          <p className="text-white text-center font-bold">{unlockedMilestone.name}</p>
          <p className="text-white text-center text-sm mt-2">+{unlockedMilestone.coinBonus} GestCoins</p>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-slate-500 text-center">
        Juega cada día para mantener tu racha. Piérdela si faltan 24+ horas.
      </p>

      {/* Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-2xl font-black text-white mb-3">🧊 Congelar Racha</h3>
            <p className="text-slate-300 mb-4">
              Usa 50 GestCoins para congelar tu racha y recuperar 24 horas para jugar.
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Saldo: {balance} GestCoins {balance < 50 && '❌'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFreezeModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleFreezeStreak}
                disabled={balance < 50 || streakData.frozeThisMonth}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition transform hover:scale-105"
              >
                Congelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Loss Modal */}
      {showStreakLossModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`bg-gradient-to-b from-red-900 to-slate-800 border-2 border-red-500/50 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-fadeInUp ${streakLostAnimation ? 'animate-streak-loss' : ''}`}>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-streak-loss">🖤</div>
              <h3 className="text-2xl font-black text-red-300 mb-3">¡Perdiste tu Racha!</h3>
              <p className="text-slate-300 mb-6">
                No jugaste en las últimas 24 horas. ¡Pero no te desanimes, comienza una nueva racha hoy!
              </p>
              <button
                onClick={() => setShowStreakLossModal(false)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition transform hover:scale-105"
              >
                Comenzar Nueva Racha 🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export function to increment streak from GameLevel
export const useStreakIncrement = () => {
  const increment = () => {
    const tracker = new StreakTracker();
    // This will be called from GameLevel after completing a quiz
  };
  return increment;
};

export default StreakTracker;
