import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Zap, Target, Trophy } from 'lucide-react';

const Missions = ({ isOpen, onClose, dailyMissions, weeklyMission, onClaimReward }) => {
  if (!isOpen) return null;
  
  // Asegurar que weeklyMission tiene estructura correcta
  const safeWeeklyMission = weeklyMission?.perfect_levels ? weeklyMission : {
    perfect_levels: { progress: 0, target: 3, completed: false, claimed: false, reward: 1500, badge: 'Estudiante Dedicado' }
  };

  const getMissionIcon = (type) => {
    const icons = {
      questions_answered: '📝',
      streak_active: '🔥',
      fast_answers: '⚡',
      perfect_levels: '🏆'
    };
    return icons[type] || '🎯';
  };

  const handleClaimDaily = (key) => {
    onClaimReward('daily', key);
  };

  const handleClaimWeekly = (key) => {
    onClaimReward('weekly', key);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-cyan-500/50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 px-8 py-6 border-b border-cyan-500/20 sticky top-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-lg">
              🎯
            </div>
            <h2 className="text-2xl font-black text-white">MISIONES</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold transition-colors">
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* MISIONES DIARIAS */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-lg">
                ☀️
              </div>
              <h3 className="text-xl font-black text-white">Misiones Diarias</h3>
              <div className="text-xs text-slate-400 font-bold ml-auto">
                {Object.values(dailyMissions).filter(m => m.completed && !m.claimed).length} listas para reclamar
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(dailyMissions).map(([key, mission]) => (
                <div
                  key={key}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mission.completed
                      ? 'bg-emerald-900/30 border-emerald-500/50'
                      : 'bg-slate-800/30 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-3xl pt-1">{getMissionIcon(key)}</div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white text-sm uppercase tracking-wide">
                          {key === 'questions_answered' && 'Responde 10 preguntas'}
                          {key === 'streak_active' && 'Mantén tu racha activa'}
                          {key === 'fast_answers' && 'Consigue 5 respuestas rápidas'}
                        </h4>
                        {mission.completed && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className={`h-full transition-all duration-300 ${
                              mission.completed
                                ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (mission.progress / mission.target) * 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-slate-400">
                            {mission.progress} / {mission.target}
                          </span>
                          <span className="text-xs font-bold text-cyan-300">
                            {mission.reward === 'powerup' ? '1 Power-up' : `+${mission.reward} XP`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {mission.completed && !mission.claimed ? (
                      <button
                        onClick={() => handleClaimDaily(key)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black text-sm rounded-lg transition-all transform hover:scale-105 whitespace-nowrap"
                      >
                        RECLAMAR
                      </button>
                    ) : mission.claimed ? (
                      <div className="px-4 py-2 bg-slate-700/50 text-slate-300 font-black text-xs rounded-lg whitespace-nowrap">
                        ✓ RECLAMADA
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-slate-800/50 text-slate-500 font-bold text-xs rounded-lg whitespace-nowrap">
                        En progreso
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-gradient-to-r from-slate-700 via-cyan-500/30 to-slate-700"></div>

          {/* MISIÓN SEMANAL */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-lg">
                🌟
              </div>
              <h3 className="text-xl font-black text-white">Misión Semanal</h3>
              <div className="text-xs text-slate-400 font-bold ml-auto">
                {safeWeeklyMission.perfect_levels.completed && !safeWeeklyMission.perfect_levels.claimed ? 'Lista para reclamar' : ''}
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border-2 transition-all ${
                safeWeeklyMission.perfect_levels.completed
                  ? 'bg-purple-900/30 border-purple-500/50'
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl pt-1">🏆</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-black text-white text-sm uppercase tracking-wide">
                      Completa 3 niveles con 3 estrellas
                    </h4>
                    {safeWeeklyMission.perfect_levels.completed && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    Badge exclusivo: <span className="text-purple-300 font-bold">Estudiante Dedicado</span>
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full transition-all duration-300 ${
                          safeWeeklyMission.perfect_levels.completed
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-purple-500 to-violet-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (safeWeeklyMission.perfect_levels.progress / safeWeeklyMission.perfect_levels.target) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {safeWeeklyMission.perfect_levels.progress} / {safeWeeklyMission.perfect_levels.target}
                      </span>
                      <span className="text-xs font-bold text-purple-300">
                        +{safeWeeklyMission.perfect_levels.reward} XP
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-3">
                    {safeWeeklyMission.perfect_levels.completed && !safeWeeklyMission.perfect_levels.claimed ? (
                      <button
                        onClick={() => handleClaimWeekly('perfect_levels')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-sm rounded-lg transition-all transform hover:scale-105"
                      >
                        RECLAMAR RECOMPENSA
                      </button>
                    ) : safeWeeklyMission.perfect_levels.claimed ? (
                      <div className="px-6 py-2 bg-slate-700/50 text-slate-300 font-black text-sm rounded-lg">
                        ✓ RECOMPENSA RECLAMADA
                      </div>
                    ) : (
                      <div className="px-6 py-2 bg-slate-800/50 text-slate-500 font-bold text-sm rounded-lg">
                        En progreso
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-400">
              Las misiones diarias se reinician cada 24h | Las misiones semanales se reinician cada lunes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;
