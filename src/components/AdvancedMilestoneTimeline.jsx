import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { NURSING_RANKS } from '../data/constants';

/**
 * AdvancedMilestoneTimeline - Línea de tiempo interactiva de carrera profesional
 * Muestra progresión: 8 escalones profesionales de enfermería
 */
const AdvancedMilestoneTimeline = ({ currentRank = 'Estudiante', currentScore = 0 }) => {
  const [animateIndex, setAnimateIndex] = useState(-1);

  useEffect(() => {
    const currentIndex = NURSING_RANKS.findIndex(r => r.title === currentRank);
    if (currentIndex !== -1) {
      setAnimateIndex(currentIndex);
    }
  }, [currentRank]);

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

  return (
    <div className="w-full bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-cyan-500/20">
      <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-cyan-400" />
        Progresión de Carrera Profesional
      </h3>

      {/* Scrollable timeline for 8 tiers */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {/* Connection line */}
          <div className="absolute top-24 left-6 right-6 h-1 bg-gradient-to-r from-slate-700 via-cyan-600/40 to-slate-700 -z-10"></div>

          {NURSING_RANKS.map((rank, idx) => {
            const isUnlocked = currentScore >= rank.minScore;
            const isCurrent = idx === currentRankIndex;
            const requiresPerfection = idx >= 5; // Last 3 tiers

            return (
              <div key={idx} className="flex flex-col items-center relative">
                {/* Icono del rango */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-500 border-2 ${
                    isCurrent
                      ? `bg-gradient-to-br ${rank.color} border-cyan-300 shadow-lg shadow-cyan-400/50 ring-2 ring-cyan-400 animate-pulse`
                      : isUnlocked
                      ? `bg-gradient-to-br ${rank.color}/60 border-emerald-500/50`
                      : 'bg-slate-700/40 border-slate-600/50 opacity-60'
                  } ${idx === animateIndex ? 'animate-bounce' : ''}`}
                >
                  <span className="text-3xl">{rank.icon}</span>
                </div>

                {/* Etiqueta del rango */}
                <div className="text-center whitespace-nowrap">
                  <h4 className={`font-black text-xs ${
                    isCurrent 
                      ? 'text-cyan-300' 
                      : isUnlocked 
                      ? 'text-white' 
                      : 'text-slate-500'
                  }`}>
                    {rank.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    isCurrent 
                      ? 'text-cyan-200' 
                      : isUnlocked 
                      ? 'text-emerald-400' 
                      : 'text-slate-600'
                  }`}>
                    {rank.minScore.toLocaleString()} XP
                  </p>
                  {requiresPerfection && isUnlocked && (
                    <p className="text-xs text-yellow-300 font-bold mt-1">⚡ Casi Perfecto</p>
                  )}
                </div>

                {/* Indicador de "ACTUAL" */}
                {isCurrent && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-black whitespace-nowrap animate-pulse">
                    AQUÍ
                  </div>
                )}

                {/* Indicador de "COMPLETADO" */}
                {isUnlocked && !isCurrent && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-black whitespace-nowrap">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress info */}
      <div className="mt-12 pt-6 border-t border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-cyan-300">TU PROGRESO ACTUAL</span>
          <span className="font-black text-white">
            {currentScore.toLocaleString()} XP
          </span>
        </div>
        
        {currentRankIndex < NURSING_RANKS.length - 1 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              Siguiente: <span className="font-bold text-cyan-300">{NURSING_RANKS[currentRankIndex + 1].title}</span>
            </p>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${NURSING_RANKS[currentRankIndex].color} transition-all duration-300`}
                style={{
                  width: `${Math.min(100, ((currentScore - NURSING_RANKS[currentRankIndex].minScore) / (NURSING_RANKS[currentRankIndex + 1].minScore - NURSING_RANKS[currentRankIndex].minScore)) * 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-cyan-300 font-bold">
              Faltan: {Math.max(0, NURSING_RANKS[currentRankIndex + 1].minScore - currentScore).toLocaleString()} XP
            </p>
          </div>
        )}

        {currentRankIndex === NURSING_RANKS.length - 1 && (
          <div className="text-center py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-300 font-black text-sm">👑 ¡RANGO MÁXIMO ALCANZADO!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedMilestoneTimeline;
