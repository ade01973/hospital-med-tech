import React, { useRef } from 'react';
import { Lock, Trophy, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';

const Dashboard = ({ user, userData, setView, setLevel }) => {
  const currentRank = NURSING_RANKS.slice().reverse().find(r => (userData?.totalScore || 0) >= r.minScore) || NURSING_RANKS[0];
  const nextRank = NURSING_RANKS.find(r => r.minScore > (userData?.totalScore || 0));
  
  const progressPercent = nextRank 
    ? (((userData?.totalScore || 0) - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100 
    : 100;

  const scrollRef = useRef(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      {/* Top Bar - Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-lg shadow-lg`}>
              {currentRank.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rango Actual</span>
              <span className="text-sm font-black text-white">{currentRank.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Experiencia</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-black leading-none">{userData?.totalScore || 0}</span>
              </div>
            </div>
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-white/10 transition-colors"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content - Vertical "Battle Pass" Timeline */}
      <div className="pt-24 pb-24 px-4 max-w-xl mx-auto relative" ref={scrollRef}>
        
        {/* Central Line */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 bg-slate-800 transform sm:-translate-x-1/2"></div>

        <div className="space-y-12">
          {TOPICS.map((topic, index) => {
            const isUnlocked = index === 0 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
            const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
            const isCurrent = isUnlocked && !isCompleted;

            return (
              <div key={topic.id} className={`relative flex items-center sm:justify-center ${isCurrent ? 'z-10' : 'z-0'}`}>
                
                {/* Connector Dot on Line */}
                <div className={`absolute left-8 sm:left-1/2 w-4 h-4 rounded-full border-4 transform -translate-x-1/2 
                  ${isCompleted ? 'bg-emerald-500 border-emerald-900' : 
                    isCurrent ? 'bg-cyan-400 border-cyan-900 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 
                    'bg-slate-800 border-slate-950'}`}
                ></div>

                {/* Card Container */}
                <div className={`w-full pl-16 sm:pl-0 flex ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} sm:items-center sm:gap-12 sm:w-full`}>
                  
                  {/* Spacer for alignment */}
                  <div className="hidden sm:block sm:w-1/2"></div>

                  {/* The Card */}
                  <button
                    disabled={!isUnlocked || isCompleted}
                    onClick={() => {
                       setLevel(topic);
                       setView('game');
                    }}
                    className={`relative w-full sm:w-[calc(50%-3rem)] group text-left transition-all duration-300`}
                  >
                    {/* Glowing Backdrop for Current Level */}
                    {isCurrent && (
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                    )}

                    <div className={`relative rounded-2xl p-5 border transition-all duration-300
                      ${isCompleted 
                        ? 'bg-slate-900/50 border-emerald-500/30 hover:bg-slate-800/50' 
                        : isCurrent 
                          ? 'bg-slate-900 border-cyan-500 shadow-xl' 
                          : 'bg-slate-900/30 border-slate-800 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-slate-800/50 hover:border-slate-600 cursor-not-allowed'
                      }
                    `}>
                    
                      {/* Level Number Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border
                          ${isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isCurrent 
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                          Nivel {String(topic.id).padStart(2, '0')}
                         </span>
                        
                        {/* Status Icon */}
                        {isCompleted ? <ShieldCheck className="text-emerald-400 w-5 h-5" /> : 
                         isCurrent ? <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div> : 
                         <Lock className="text-slate-600 w-4 h-4" />}
                      </div>

                      <h3 className={`text-lg font-bold mb-1 leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 font-medium">{topic.subtitle}</p>

                      {/* Action Button / Indicator */}
                      <div className="flex items-center justify-between mt-2">
                        <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                          <topic.icon size={18} className={isUnlocked ? 'text-cyan-400' : 'text-slate-600'} />
                        </div>
                        
                        {isCurrent && (
                           <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider animate-pulse">
                            Jugar <ChevronRight size={14} strokeWidth={3} />
                          </div>
                        )}
                         {isCompleted && (
                           <span className="text-emerald-500 text-xs font-bold uppercase">Completado</span>
                        )}
                      </div>
                   </div>
                  </button>

                </div>
              </div>
            );
          })}
          
          {/* End of Line */}
          <div className="flex flex-col items-center justify-center pt-8 pb-8 opacity-50">
            <div className="w-1 h-12 bg-gradient-to-b from-slate-800 to-transparent"></div>
            <p className="text-xs text-slate-600 uppercase tracking-[0.2em] font-bold mt-4">Más niveles pronto</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
