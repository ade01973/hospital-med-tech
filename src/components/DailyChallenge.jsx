import React, { useState, useEffect } from 'react';
import { Zap, Target, Gift, Calendar } from 'lucide-react';

/**
 * DailyChallenge - Widget de desafíos diarios
 * Muestra desafíos diarios con progreso y recompensas
 */
const DailyChallenge = () => {
  const challenges = [
    {
      id: 1,
      title: 'Estudiante Dedicado',
      description: 'Completa 3 módulos hoy',
      icon: Target,
      progress: 1,
      total: 3,
      reward: 100,
      rewardIcon: '💰',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      title: 'Racha Perfecta',
      description: '5 respuestas correctas seguidas',
      icon: Zap,
      progress: 3,
      total: 5,
      reward: 50,
      rewardIcon: '⚡',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 3,
      title: 'Acumulador de Monedas',
      description: 'Gana 500 GestCoins hoy',
      icon: Gift,
      progress: 340,
      total: 500,
      reward: 200,
      rewardIcon: '💎',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const [animatedProgress, setAnimatedProgress] = useState({});

  useEffect(() => {
    // Animar barras de progreso
    const newProgress = {};
    challenges.forEach(c => {
      newProgress[c.id] = (c.progress / c.total) * 100;
    });
    setAnimatedProgress(newProgress);
  }, []);

  const getProgressColor = (progress, total) => {
    const percentage = (progress / total) * 100;
    if (percentage === 100) return 'from-emerald-500 to-green-500';
    if (percentage >= 75) return 'from-cyan-500 to-blue-500';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-slate-600 to-slate-700';
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-cyan-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Calendar size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-black text-white">Desafíos Diarios</h3>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const progressPercent = (challenge.progress / challenge.total) * 100;
          const isCompleted = progressPercent === 100;
          const progressColor = getProgressColor(challenge.progress, challenge.total);

          return (
            <div
              key={challenge.id}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-900/20 border-emerald-500/50'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/30'
              }`}
            >
              {/* Header del desafío */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-black text-sm ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-slate-400">{challenge.description}</p>
                  </div>
                </div>

                {/* Recompensa */}
                {isCompleted && (
                  <div className="flex items-center gap-1 bg-emerald-500/30 px-2 py-1 rounded-lg">
                    <span className="text-sm">{challenge.rewardIcon}</span>
                    <span className="text-xs font-black text-emerald-300">+{challenge.reward}</span>
                  </div>
                )}
              </div>

              {/* Barra de progreso */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                  <div
                    className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-500 ease-out shadow-lg`}
                    style={{ width: `${animatedProgress[challenge.id] || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-slate-400 w-12 text-right">
                  {challenge.progress}/{challenge.total}
                </span>
              </div>

              {/* Indicador de completado */}
              {isCompleted && (
                <div className="mt-2 text-center text-xs font-black text-emerald-400 animate-pulse">
                  ✓ COMPLETADO
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Completa desafíos para obtener recompensas bonus
        </p>
        <div className="text-right">
          <p className="text-xs font-black text-cyan-300">+350 GestCoins hoy</p>
          <p className="text-xs text-slate-500">Potencial máximo</p>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
