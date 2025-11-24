import React, { useState } from 'react';
import { X, Gift, Star, Trophy } from 'lucide-react';
import BadgesTab from './BadgesTab';
import { useBadges } from '../hooks/useBadges';

const Rewards = ({ isOpen, onClose, userData }) => {
  const [activeTab, setActiveTab] = useState('rewards');
  const { badges, getObtainedBadges, getLockedBadges } = useBadges(userData);
  const obtainedBadges = getObtainedBadges();
  const lockedBadges = getLockedBadges();
  const totalScore = userData?.totalScore || 0;
  const rewardsUnlocked = Math.floor(totalScore / 2000);
  const pointsToNextReward = 2000 - (totalScore % 2000);
  
  // Define reward milestones
  const rewardMilestones = [
    { level: 1, points: 2000, title: "Primer Paso", description: "Iniciaste tu camino profesional", icon: "🎓", color: "from-blue-500 to-cyan-500" },
    { level: 2, points: 4000, title: "En Ascenso", description: "Avanzando en tu carrera", icon: "📈", color: "from-cyan-500 to-teal-500" },
    { level: 3, points: 6000, title: "Profesional Destacado", description: "Demostrando competencia", icon: "⭐", color: "from-teal-500 to-emerald-500" },
    { level: 4, points: 8000, title: "Líder Emergente", description: "Liderando el aprendizaje", icon: "👑", color: "from-emerald-500 to-lime-500" },
    { level: 5, points: 10000, title: "Experto Reconocido", description: "Dominio demostrado", icon: "🏆", color: "from-lime-500 to-yellow-500" },
    { level: 6, points: 12000, title: "Maestría Avanzada", description: "Excelencia en gestión", icon: "💎", color: "from-yellow-500 to-orange-500" },
    { level: 7, points: 14000, title: "Visionario", description: "Inspirando cambios", icon: "🚀", color: "from-orange-500 to-red-500" },
    { level: 8, points: 16000, title: "Leyenda en Construcción", description: "Casi perfección", icon: "✨", color: "from-red-500 to-pink-500" },
    { level: 9, points: 18000, title: "Campeón de Enfermería", description: "Máximo nivel alcanzado", icon: "🌟", color: "from-pink-500 to-purple-500" },
    { level: 10, points: 20000, title: "Ícono Global", description: "Trascendiendo límites", icon: "🌍", color: "from-purple-500 to-violet-500" },
    { level: 11, points: 22000, title: "Gestor Supremo", description: "Dominio total del sistema", icon: "🎯", color: "from-violet-500 to-indigo-500" },
    { level: 12, points: 23000, title: "Líder Infinito", description: "Perfección absoluta", icon: "∞", color: "from-indigo-500 to-slate-500" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-yellow-500/50 rounded-3xl p-8 shadow-2xl shadow-yellow-500/30 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/50 border-2 border-white/30">
                  🏅
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Logros</h2>
                  <p className="text-yellow-300 text-sm font-bold">Desbloquea insignias y recompensas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white text-2xl font-bold transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-slate-700">
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-4 py-3 font-black text-sm transition-all ${
                  activeTab === 'rewards'
                    ? 'border-b-2 border-yellow-500 text-yellow-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎁 Recompensas
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`px-4 py-3 font-black text-sm transition-all flex items-center gap-2 ${
                  activeTab === 'badges'
                    ? 'border-b-2 border-purple-500 text-purple-300'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Badges ({obtainedBadges?.length || 0}/25)
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'badges' ? (
              <BadgesTab badges={badges} obtainedBadges={obtainedBadges} lockedBadges={lockedBadges} />
            ) : (
              <>
                {/* Progress Summary */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-sm font-bold mb-1">RECOMPENSAS DESBLOQUEADAS</p>
                      <p className="text-4xl font-black text-yellow-300">{rewardsUnlocked}</p>
                    </div>
                    <div className="text-center border-l border-r border-slate-700">
                      <p className="text-slate-400 text-sm font-bold mb-1">PUNTOS TOTALES</p>
                      <p className="text-3xl font-black text-white">{totalScore.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">/ 23.000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-sm font-bold mb-1">PRÓXIMA RECOMPENSA</p>
                      <p className="text-2xl font-black text-orange-300">{pointsToNextReward} pts</p>
                    </div>
                  </div>
                </div>

                {/* Rewards Grid */}
                <div className="space-y-3">
                  {rewardMilestones.map((reward, idx) => {
                    const isUnlocked = totalScore >= reward.points;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-2xl p-4 border-2 transition-all ${
                          isUnlocked
                            ? `bg-gradient-to-r ${reward.color} border-white/40 shadow-lg shadow-yellow-500/20`
                            : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon/Badge */}
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                            isUnlocked 
                              ? 'bg-white/20 shadow-lg' 
                              : 'bg-slate-700/50'
                          }`}>
                            {isUnlocked ? reward.icon : '🔒'}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <h3 className={`text-lg font-black ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                {reward.title}
                              </h3>
                              <span className="text-xs text-slate-300 font-bold">
                                {reward.points.toLocaleString()} pts
                              </span>
                            </div>
                            <p className={`text-sm ${isUnlocked ? 'text-white/80' : 'text-slate-500'}`}>
                              {reward.description}
                            </p>
                          </div>

                          {/* Status */}
                          {isUnlocked && (
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
                                <Star className="w-6 h-6 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-black py-3 rounded-xl uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Rewards;
