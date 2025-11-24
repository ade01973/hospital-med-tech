import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { BADGE_CATEGORIES } from '../data/BADGES_CONFIG';

const BadgesTab = ({ badges, obtainedBadges, lockedBadges }) => {
  const totalBadges = Object.keys(badges || {}).length;
  const obtainedCount = obtainedBadges?.length || 0;
  const progressPercent = Math.round((obtainedCount / totalBadges) * 100);

  const getRecentBadge = () => {
    if (obtainedBadges && obtainedBadges.length > 0) {
      return obtainedBadges[0];
    }
    return null;
  };

  const recentBadge = getRecentBadge();

  return (
    <div className="space-y-6">
      {/* RESUMEN */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-purple-400" />
          Resumen
        </h3>

        <div className="space-y-4">
          {/* Contador */}
          <div className="flex justify-between items-center">
            <span className="text-white/70 font-bold">Badges Obtenidos</span>
            <span className="text-3xl font-black text-purple-300">
              {obtainedCount} <span className="text-lg text-white/50">/ {totalBadges}</span>
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-purple-500/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{progressPercent}% completado</span>
              <span>{totalBadges - obtainedCount} por conseguir</span>
            </div>
          </div>
        </div>
      </div>

      {/* BADGE MÁS RECIENTE */}
      {recentBadge && (
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-2 border-amber-500/50 rounded-2xl p-6">
          <h3 className="text-lg font-black text-white mb-4">✨ Logro Más Reciente</h3>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{recentBadge.icon}</div>
            <div>
              <p className="text-sm text-white/60 font-bold uppercase">Desbloqueado</p>
              <p className="text-2xl font-black text-yellow-300">{recentBadge.name}</p>
              <p className="text-sm text-white/70 mt-1">{recentBadge.description}</p>
              {recentBadge.obtainedDate && (
                <p className="text-xs text-white/50 mt-2">📅 {new Date(recentBadge.obtainedDate).toLocaleDateString('es-ES')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BADGES OBTENIDOS */}
      {obtainedBadges && obtainedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            Badges Obtenidos ({obtainedCount})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {obtainedBadges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-gradient-to-br ${badge.color} rounded-xl p-4 border-2 border-white/20 hover:shadow-lg hover:shadow-yellow-500/30 transition-all group cursor-pointer`}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{badge.icon}</div>
                  <p className="font-black text-white text-sm leading-tight">{badge.name}</p>
                  {badge.obtainedDate && (
                    <p className="text-xs text-white/60">
                      {new Date(badge.obtainedDate).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BADGES BLOQUEADOS */}
      {lockedBadges && lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-slate-400" />
            Por Desbloquear ({lockedBadges.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {lockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-slate-700/30 rounded-xl p-4 border-2 border-slate-600/50 opacity-60 hover:opacity-75 transition-opacity"
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl filter grayscale opacity-50">{badge.icon}</div>
                  <p className="font-black text-slate-300 text-sm leading-tight">{badge.name}</p>
                  <p className="text-xs text-slate-400 leading-tight">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje si no hay badges */}
      {(!obtainedBadges || obtainedBadges.length === 0) && (
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-2xl p-8 text-center">
          <p className="text-white/60 font-bold text-lg">
            🎯 ¡Comienza tu viaje para desbloquear badges!
          </p>
          <p className="text-white/40 text-sm mt-2">
            Completa niveles, mantén rachas y participa en competencias para ganar insignias
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgesTab;
