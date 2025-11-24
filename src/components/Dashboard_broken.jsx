import React from 'react';
import { X, Trophy, TrendingUp, Clock } from 'lucide-react';

const Leagues = ({ isOpen, onClose, currentLeague, leagueRanking, playerPosition, weeklyXP, nextLeague, daysLeft }) => {
  if (!isOpen || !currentLeague) return null;

  const getPositionColor = (pos) => {
    if (pos === 1) return 'from-yellow-500 to-orange-500 border-yellow-400';
    if (pos === 2) return 'from-slate-400 to-slate-500 border-slate-300';
    if (pos === 3) return 'from-orange-700 to-orange-800 border-orange-600';
    return 'from-slate-700 to-slate-800 border-slate-600';
  };

  const getPositionBg = (pos) => {
    if (pos === 1) return 'bg-yellow-500/10';
    if (pos === 2) return 'bg-slate-400/10';
    if (pos === 3) return 'bg-orange-700/10';
    return 'bg-slate-700/10';
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
           style={{borderColor: currentLeague.icon === '🥉' ? '#92400e' : currentLeague.icon === '🥈' ? '#64748b' : currentLeague.icon === '🥇' ? '#ca8a04' : currentLeague.icon === '💎' ? '#06b6d4' : '#a855f7'}}>
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentLeague.color} px-8 py-6 border-b border-white/10 sticky top-0 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentLeague.icon}</div>
            <div>
              <h2 className="text-2xl font-black text-white">{currentLeague.name}</h2>
              <p className="text-xs text-white/70">Top 10 de esta semana</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-slate-200 text-2xl font-bold transition-colors">
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Tu Posición */}
          {playerPosition && (
            <div className={`p-6 rounded-xl border-2 ${getPositionBg(playerPosition)} border-cyan-500/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/10`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Tu Posición</p>
                    <h3 className="text-2xl font-black text-cyan-300">#{playerPosition}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold">XP Esta Semana</p>
                  <p className="text-3xl font-black text-yellow-400">{weeklyXP}</p>
                </div>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Termina en {daysLeft} día(s)</span>
              </div>
            </div>
          )}

          {/* TOP 10 Ranking */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              TOP 10 RANKING
            </h3>

            <div className="space-y-3">
              {leagueRanking.map((player, index) => (
                <div
                  key={player.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    player.isPlayer
                      ? `border-cyan-500/50 bg-gradient-to-r from-cyan-900/30 to-blue-900/20 ring-2 ring-cyan-500/50`
                      : `border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40`
                  } ${getPositionBg(index + 1)}`}
                >
                  <div className="flex items-center justify-between">
                    {/* Position */}
                    <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-black text-lg ${
                      index === 0 ? `bg-gradient-to-br ${getPositionColor(1)}` :
                      index === 1 ? `bg-gradient-to-br ${getPositionColor(2)}` :
                      index === 2 ? `bg-gradient-to-br ${getPositionColor(3)}` :
                      'bg-slate-700/50 border-slate-600'
                    } text-white`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 ml-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-white text-sm">
                          {player.name}{player.isPlayer ? ' (TÚ)' : ''}
                        </h4>
                        {player.badge && <span className="text-lg">{player.badge}</span>}
                      </div>
                      <p className="text-xs text-slate-400">{player.rank}</p>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyan-300">{player.xp}</p>
                      <p className="text-xs text-slate-400 font-bold">XP</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next League Preview */}
          {nextLeague && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{nextLeague.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Siguiente Liga</p>
                  <h4 className="font-black text-white mb-2">{nextLeague.name}</h4>
                  <p className="text-xs text-slate-300">
                    Continúa subiendo de rango para acceder a ligas más desafiantes con mejores recompensas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Info */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <h4 className="text-sm font-black text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              RECOMPENSAS DE TEMPORADA
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl">🥇</p>
                <p className="text-xs font-black text-yellow-300 mt-1">+{currentLeague.rewards.first.xp} XP</p>
              </div>
              <div className="bg-slate-400/10 border border-slate-400/30 rounded-lg p-3 text-center">
                <p className="text-2xl">🥈</p>
                <p className="text-xs font-black text-slate-300 mt-1">+{currentLeague.rewards.second.xp} XP</p>
              </div>
              <div className="bg-orange-700/10 border border-orange-700/30 rounded-lg p-3 text-center">
                <p className="text-2xl">🥉</p>
                <p className="text-xs font-black text-orange-300 mt-1">+{currentLeague.rewards.third.xp} XP</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              Las recompensas se distribuyen cada lunes a los Top 3 de cada liga
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leagues;
