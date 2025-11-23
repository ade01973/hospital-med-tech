import React from 'react';
import { Lock, Trophy, Zap, ShieldCheck } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';
import elevatorBg from '../assets/elevator-bg.png';

const Dashboard = ({ user, userData, setView, setLevel }) => {
  const currentRank = NURSING_RANKS.slice().reverse().find(r => (userData?.totalScore || 0) >= r.minScore) || NURSING_RANKS[0];
  const nextRank = NURSING_RANKS.find(r => r.minScore > (userData?.totalScore || 0));
  
  const progressPercent = nextRank 
    ? (((userData?.totalScore || 0) - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100 
    : 100;

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden"
      style={{
        backgroundImage: `url(${elevatorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30`}>
              {currentRank.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Rango</span>
              <span className="text-sm font-black text-white">{currentRank.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Experiencia</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-black">{userData?.totalScore || 0} XP</span>
              </div>
            </div>
            
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 hover:shadow-lg hover:shadow-orange-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
            >
              <Trophy className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Elevator Panel Content */}
      <div className="pt-28 pb-12 px-4 max-w-6xl mx-auto relative z-10">
        <h1 className="text-center text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Plantas del Hospital Med-Tech
        </h1>
        <p className="text-center text-slate-300 mb-12 text-sm uppercase tracking-wider font-semibold">Selecciona una planta para comenzar</p>

        {/* Elevator Button Grid - Modern & Futuristic */}
        <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {TOPICS.map((topic, index) => {
              const isUnlocked = index === 0 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
              const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
              const isCurrent = isUnlocked && !isCompleted;

              return (
                <button
                  key={topic.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked && !isCompleted) {
                      setLevel(topic);
                      setView('game');
                    }
                  }}
                  className={`
                    relative h-32 rounded-2xl font-black text-xl transition-all duration-300 transform
                    flex flex-col items-center justify-center gap-2 px-3 py-4 border-2
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border-emerald-400/50 text-emerald-300 shadow-lg shadow-emerald-500/20 cursor-default' 
                      : isCurrent 
                        ? 'bg-gradient-to-br from-cyan-500/40 to-blue-600/40 border-cyan-400 text-cyan-100 shadow-2xl shadow-cyan-500/50 cursor-pointer hover:shadow-cyan-500/70 hover:scale-105 animate-pulse' 
                        : isUnlocked
                          ? 'bg-gradient-to-br from-slate-700/40 to-slate-800/40 border-slate-500/40 text-slate-200 shadow-lg shadow-slate-500/10 cursor-pointer hover:border-cyan-400 hover:shadow-cyan-500/30 hover:scale-105 transition-all'
                          : 'bg-slate-800/20 border-slate-700/30 text-slate-500 cursor-not-allowed opacity-50 grayscale'
                    }
                  `}
                  title={topic.title}
                >
                  {/* Floor Number */}
                  <span className="text-2xl font-black">
                    {String(topic.id).padStart(2, '0')}
                  </span>

                  {/* Status Icon */}
                  <div className="text-lg">
                    {isCompleted 
                      ? <ShieldCheck className="w-5 h-5 text-emerald-300" /> 
                      : isUnlocked 
                        ? <topic.icon size={20} className={isCurrent ? 'animate-bounce' : ''} />
                        : <Lock className="w-5 h-5" />
                    }
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 border border-cyan-400 text-cyan-300 text-xs px-2 py-1 rounded whitespace-nowrap">
                    {topic.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-cyan-400/20 flex flex-wrap justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/40 to-blue-600/40 border border-cyan-400 shadow-lg shadow-cyan-500/30"></div>
              <span className="text-cyan-300">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-500/40"></div>
              <span className="text-slate-300">Próximamente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-400/50 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
              </div>
              <span className="text-emerald-300">Completada</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-8 text-center text-xs text-slate-400 uppercase tracking-wider">
          <p>Completa los módulos secuencialmente para desbloquear nuevas plantas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
