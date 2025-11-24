import React from 'react';
import { X, Calendar, Zap, Trophy } from 'lucide-react';
import { DAILY_REWARDS } from '../hooks/useLoginStreak';

const LoginCalendar = ({ 
  isOpen, 
  onClose, 
  calendarData, 
  currentStreakDay, 
  daysInMonth 
}) => {
  if (!isOpen || !calendarData) return null;

  const getUpcomingRewards = () => {
    const upcoming = [];
    for (let i = currentStreakDay + 1; i <= Math.min(currentStreakDay + 3, 30); i++) {
      upcoming.push({ day: i, reward: DAILY_REWARDS[i] });
    }
    return upcoming;
  };

  const getBadgesThisMonth = () => {
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return calendarData.badgesEarned
      ?.filter(b => b.endsWith(monthYear))
      ?.map(badgeKey => {
        for (const day of Object.keys(DAILY_REWARDS)) {
          const reward = DAILY_REWARDS[day];
          if (reward.badge && reward.badge.id === badgeKey.split('_')[0]) {
            return reward.badge;
          }
        }
        return null;
      })
      ?.filter(Boolean) || [];
  };

  const getProgressToNextReward = () => {
    const nextRewardDay = [7, 14, 21, 30].find(d => d > currentStreakDay);
    if (!nextRewardDay) return { current: currentStreakDay, next: 30, percent: (currentStreakDay / 30) * 100 };
    return { current: currentStreakDay, next: nextRewardDay, percent: (currentStreakDay / nextRewardDay) * 100 };
  };

  const progress = getProgressToNextReward();
  const today = new Date().getDate();
  const upcoming = getUpcomingRewards();
  const badges = getBadgesThisMonth();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-cyan-500/50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-6 border-b border-white/10 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-black text-white">CALENDARIO DE RECOMPENSAS</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-slate-200 text-2xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* SECCIÓN 1: TU RACHA ACTUAL */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white">🔥 TU RACHA ACTUAL</h3>
              <div className="text-5xl font-black text-orange-400">{currentStreakDay}</div>
            </div>
            <p className="text-sm text-white/70 mb-4">Día{currentStreakDay !== 1 ? 's' : ''} consecutivo{currentStreakDay !== 1 ? 's' : ''} de login</p>
            
            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/60">
                <span>Próxima recompensa especial</span>
                <span>Día {progress.next}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{ width: `${Math.min(progress.percent, 100)}%` }}
                />
              </div>
            </div>
            
            <p className="text-sm text-white/80 mt-4 text-center">
              {currentStreakDay < 30 ? '🔥 ¡No pierdas tu racha!' : '🎉 ¡MAESTRÍA COMPLETA!'}
            </p>
          </div>

          {/* SECCIÓN 2: CALENDARIO DEL MES */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-black text-white mb-6">📅 CALENDARIO DEL MES</h3>
            
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dateStr = new Date(new Date().getFullYear(), new Date().getMonth(), day).toISOString().split('T')[0];
                const isCompleted = calendarData.loginDays.includes(dateStr);
                const isToday = day === today;
                
                const reward = DAILY_REWARDS[day];
                const hasSpecialReward = reward?.badge || reward?.powerUps > 0;
                
                return (
                  <div
                    key={day}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-lg font-black text-sm relative
                      transition-all group cursor-help
                      ${isToday ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900' : ''}
                      ${isCompleted ? 'bg-emerald-500/30 border border-emerald-500/50' : 'bg-slate-700/30 border border-white/10'}
                    `}
                    title={`Día ${day}: ${reward?.xp} XP${reward?.powerUps > 0 ? ` + ${reward.powerUps} Power-up${reward.powerUps > 1 ? 's' : ''}` : ''}${reward?.badge ? ` + ${reward.badge.emoji}` : ''}`}
                  >
                    <span className="text-white/70">{day}</span>
                    {isCompleted && <span className="text-lg">✅</span>}
                    {!isCompleted && hasSpecialReward && (
                      <span className="text-xs text-yellow-400">⭐</span>
                    )}
                    {isToday && !isCompleted && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-white/50 mt-6 text-center">
              ✅ = Completado | ⭐ = Recompensa especial | 💛 = Hoy
            </p>
          </div>

          {/* SECCIÓN 3: PRÓXIMAS RECOMPENSAS */}
          {upcoming.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">🎁 PRÓXIMAS RECOMPENSAS</h3>
              
              <div className="space-y-3">
                {upcoming.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-700/30 rounded-lg p-4">
                    <div>
                      <p className="font-black text-white">
                        Día {item.day} 
                        {item.reward.badge && ` ${item.reward.badge.emoji}`}
                      </p>
                      <p className="text-sm text-white/60">
                        {item.reward.xp} XP
                        {item.reward.powerUps > 0 && ` + ${item.reward.powerUps} Power-up${item.reward.powerUps > 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {item.reward.powerUps > 0 && (
                        <Zap className="w-5 h-5 text-yellow-400" />
                      )}
                      {item.reward.badge && (
                        <Trophy className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 4: BADGES GANADOS */}
          {badges.length > 0 && (
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-4">🏆 BADGES GANADOS</h3>
              
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600/40 to-orange-600/40 border border-amber-500/50 rounded-full px-4 py-2"
                  >
                    <span className="text-2xl">{badge.emoji}</span>
                    <span className="font-black text-white text-sm">{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {badges.length === 0 && (
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 border border-amber-500/20 rounded-2xl p-6 text-center">
              <p className="text-white/60">Mantén tu racha para ganar badges especiales en los días 7, 14, 21 y 30 🎯</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginCalendar;
