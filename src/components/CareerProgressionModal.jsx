import React from 'react';
import { TrendingUp, Target, Zap } from 'lucide-react';
import { NURSING_RANKS } from '../data/constants';

const CareerProgressionModal = ({ isOpen, onClose, currentScore, playerName }) => {
  if (!isOpen) return null;

  const getCurrentRankIndex = () => {
    let index = 0;
    for (let i = NURSING_RANKS.length - 1; i >= 0; i--) {
      if (currentScore >= NURSING_RANKS[i].minScore) {
        index = i;
        break;
      }
    }
    return index;
  };

  const currentRankIndex = getCurrentRankIndex();
  const currentRank = NURSING_RANKS[currentRankIndex];
  const nextRank = currentRankIndex < NURSING_RANKS.length - 1 ? NURSING_RANKS[currentRankIndex + 1] : null;
  const xpNeeded = nextRank ? nextRank.minScore - currentScore : 0;
  const xpTotal = nextRank ? nextRank.minScore - currentRank.minScore : 0;
  const progressPercent = xpTotal ? ((currentScore - currentRank.minScore) / xpTotal) * 100 : 100;

  const isTopTier = currentRankIndex >= 5; // Last 3 tiers (5, 6, 7)
  const needsPerfection = currentRankIndex >= 5;

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between border-b border-cyan-400/30">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <TrendingUp size={28} /> CARRERA PROFESIONAL
            </h2>
            <p className="text-cyan-100 text-sm mt-1">Gestor/a Enfermero/a</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Current Position */}
          <div className="bg-slate-800/50 border-2 border-cyan-400/50 rounded-2xl p-6">
            <p className="text-sm font-bold text-cyan-300 mb-2">TU POSICIÓN ACTUAL</p>
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentRank.icon}</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white">{currentRank.title}</h3>
                <p className="text-cyan-300 font-bold">{currentScore.toLocaleString()} XP</p>
                {isTopTier && (
                  <p className="text-xs text-yellow-300 mt-1 font-bold">⚡ Requiere casi perfecto</p>
                )}
              </div>
            </div>
            
            {nextRank && (
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-300">Progreso hacia siguiente rango</span>
                  <span className="text-xs font-bold text-cyan-300">{Math.round(progressPercent)}%</span>
                </div>
                <div className="bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${currentRank.color} transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Faltan: <span className="font-bold text-cyan-300">{xpNeeded.toLocaleString()} XP</span></p>
              </div>
            )}
          </div>

          {/* Career Path Timeline */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Target size={20} /> RUTA PROFESIONAL
            </h3>
            <div className="space-y-3">
              {NURSING_RANKS.map((rank, idx) => {
                const isReached = currentScore >= rank.minScore;
                const isCurrent = idx === currentRankIndex;
                const isFuture = idx > currentRankIndex;
                const requiresPerfection = idx >= 5;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? 'bg-cyan-600/20 border-cyan-400 ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20'
                        : isReached
                        ? 'bg-slate-800/40 border-emerald-500/50'
                        : 'bg-slate-800/20 border-slate-700/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{rank.icon}</span>
                        <div className="flex-1">
                          <p className={`font-black ${isCurrent ? 'text-cyan-300' : isReached ? 'text-emerald-300' : 'text-slate-400'}`}>
                            {rank.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {rank.minScore.toLocaleString()} XP {requiresPerfection && '(Casi Perfecto ⚡)'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isCurrent && (
                          <div className="inline-block bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse">
                            AQUÍ
                          </div>
                        )}
                        {isReached && !isCurrent && (
                          <div className="text-emerald-400 font-black text-sm">✓ COMPLETADO</div>
                        )}
                        {isFuture && (
                          <div className="text-slate-500 font-bold text-sm">Bloqueado</div>
                        )}
                      </div>
                    </div>

                    {/* Next Tier Info */}
                    {isCurrent && nextRank && (
                      <div className="mt-3 pt-3 border-t border-cyan-400/30">
                        <p className="text-xs text-slate-300 mb-2">
                          Siguiente: <span className="font-bold text-cyan-300">{nextRank.title}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Zap size={14} className="text-yellow-400" />
                          {xpNeeded.toLocaleString()} XP restantes
                          {nextRank && currentRankIndex >= 4 && ' (Requiere casi perfecto)'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4">
            <p className="text-sm font-bold text-purple-300 mb-2">💡 CONSEJO PARA LOS ÚLTIMOS 3 ESCALONES</p>
            <p className="text-xs text-slate-300">
              Los tres últimos rangos requieren respuestas <span className="font-bold text-yellow-300">casi perfectas</span>. 
              Debes obtener puntuaciones máximas en los cuestionarios para acumular suficientes XP y alcanzar la cúspide de la carrera profesional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerProgressionModal;
