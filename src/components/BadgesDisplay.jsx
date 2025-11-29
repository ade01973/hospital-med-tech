import React, { useState } from 'react';
import { BADGES, getUnlockedBadges } from '../data/BADGES';
import { Lock } from 'lucide-react';

/**
 * BadgesDisplay - Grid 3x5 de Achievement Badges
 * Muestra badges desbloqueados (color) e inactivos (grises)
 */
const BadgesDisplay = ({ compact = false }) => {
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const unlockedBadges = getUnlockedBadges();

  if (compact) {
    // Vista compacta: top 3 badges
    const topBadges = BADGES.slice(0, 3);
    return (
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400">MIS BADGES</p>
        <div className="flex gap-2">
          {topBadges.map(badge => {
            const isUnlocked = unlockedBadges[badge.id];
            return (
              <div
                key={badge.id}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 transition ${
                  isUnlocked
                    ? `bg-gradient-to-br ${badge.color} border-white/20 shadow-lg`
                    : 'bg-slate-700 border-slate-600 opacity-40 grayscale'
                }`}
                title={badge.name}
              >
                {badge.emoji}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista completa: Grid 3x5
  return (
    <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-emerald-500 p-1 rounded-3xl shadow-2xl">
      <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 rounded-3xl p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-1">🏆 LOGROS DESBLOQUEADOS</h3>
          <p className="text-xs text-slate-400">
            {Object.keys(unlockedBadges).length} / {BADGES.length} badges
          </p>
        </div>

        {/* Grid de Badges */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {BADGES.map(badge => {
            const isUnlocked = unlockedBadges[badge.id];

            return (
              <div
                key={badge.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                {/* Badge Circle */}
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl border-3 transition transform group-hover:scale-110 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${badge.color} border-white/30 shadow-lg`
                      : 'bg-slate-700/50 border-slate-600/50 opacity-50 grayscale'
                  }`}
                >
                  {isUnlocked ? badge.emoji : <Lock size={40} className="text-slate-500" />}
                </div>

                {/* Rarity Indicator */}
                {isUnlocked && (
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-white ${
                    badge.rarity === 'legendary' ? 'bg-amber-500' :
                    badge.rarity === 'epic' ? 'bg-purple-600' :
                    'bg-cyan-500'
                  }`}>
                    {badge.rarity === 'legendary' ? '★' : badge.rarity === 'epic' ? '◆' : '●'}
                  </div>
                )}

                {/* Tooltip */}
                {hoveredBadge === badge.id && (
                  <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 z-10 bg-slate-900 border-2 border-cyan-500 rounded-xl p-3 w-40 text-center shadow-2xl">
                    <p className="font-black text-white text-sm">{badge.name}</p>
                    <p className="text-xs text-slate-300 mt-1">{badge.description}</p>
                    <p className="text-xs text-cyan-300 font-bold mt-2">+{badge.xpReward} XP</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">Total XP por Badges</p>
              <p className="text-2xl font-black text-cyan-300">
                {Object.keys(unlockedBadges).reduce((sum, badgeId) => {
                  const badge = BADGES.find(b => b.id === badgeId);
                  return sum + (badge?.xpReward || 0);
                }, 0)} XP
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Progreso</p>
              <p className="text-2xl font-black text-cyan-300">
                {Math.round((Object.keys(unlockedBadges).length / BADGES.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgesDisplay;
