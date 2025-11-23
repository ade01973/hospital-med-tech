import React, { useState } from 'react';
import { Lock, Trophy, Zap, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';
import elevatorBg from '../assets/elevator-bg.png';

const Dashboard = ({ user, userData, setView, setLevel }) => {
  const [selectedFloor, setSelectedFloor] = useState(1); // Track current selected floor
  
  const currentRank = NURSING_RANKS.slice().reverse().find(r => (userData?.totalScore || 0) >= r.minScore) || NURSING_RANKS[0];
  const nextRank = NURSING_RANKS.find(r => r.minScore > (userData?.totalScore || 0));
  
  const progressPercent = nextRank 
    ? (((userData?.totalScore || 0) - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100 
    : 100;

  // Get current topic
  const currentTopic = TOPICS.find(t => t.id === selectedFloor);
  const isCurrentUnlocked = selectedFloor === 1 || (userData?.completedLevels && userData.completedLevels[selectedFloor - 1]);
  const isCurrentCompleted = userData?.completedLevels && userData.completedLevels[selectedFloor];
  
  // Prevent clicking on already completed levels
  const handleFloorClick = (topic) => {
    const isUnlocked = topic.id === 1 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
    const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
    
    if (isUnlocked && !isCompleted) {
      setLevel(topic);
      setView('game');
    }
  };

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

      {/* Main Content - Elevator Panel */}
      <div className="pt-28 pb-12 px-4 min-h-screen flex items-center justify-center relative z-10">
        <div className="flex gap-8 items-center max-w-5xl w-full">
          
          {/* Elevator Panel - Left Side */}
          <div className="flex flex-col gap-6 items-center flex-shrink-0">
            {/* Elevator Banner */}
            <div className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm px-6 py-1 rounded-full border-2 border-red-500 shadow-lg shadow-red-500/50 uppercase tracking-wider">
                  Ascensor
                </div>
              </div>

              {/* Floor Display */}
              <div className="bg-slate-900/80 backdrop-blur-xl border-3 border-cyan-400/50 rounded-2xl p-6 w-64 shadow-2xl shadow-cyan-500/30 pt-8">
                {/* Display Screen */}
                <div className="bg-black rounded-lg p-4 mb-6 border border-cyan-400/30 text-center">
                  <div className="text-cyan-400 text-xs uppercase tracking-widest font-bold mb-2">Planta Actual</div>
                  <div className="text-6xl font-black text-cyan-400 font-mono mb-2">{String(selectedFloor).padStart(2, '0')}</div>
                  <div className="text-cyan-300 text-xs uppercase tracking-wider font-semibold line-clamp-2">
                    {currentTopic?.title}
                  </div>
                </div>

                {/* Floor Buttons Grid - 3 columns x 7 rows */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {TOPICS.map((topic, index) => {
                    const isUnlocked = index === 0 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
                    const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
                    const isSelected = selectedFloor === topic.id;

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        disabled={!isUnlocked || isCompleted}
                        onClick={() => {
                          console.log(`🔘 Click en planta ${topic.id}. Desbloqueada: ${isUnlocked}, Completada: ${isCompleted}`);
                          // Always show the right panel first
                          setSelectedFloor(topic.id);
                        }}
                        className={`
                          w-12 h-12 rounded-lg font-black text-sm transition-all duration-200 transform border-2
                          flex items-center justify-center relative
                          ${isSelected
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-lg shadow-yellow-500/50 text-black scale-105'
                            : isCompleted 
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 hover:scale-105'
                              : isUnlocked
                                ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 text-slate-200 hover:border-cyan-400 hover:shadow-cyan-500/30 hover:scale-105'
                                : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed opacity-40'
                          }
                        `}
                        title={topic.title}
                      >
                        {isCompleted ? <ShieldCheck className="w-4 h-4" /> : String(topic.id).padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>

                {/* Up/Down Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const prev = TOPICS[selectedFloor - 2];
                      if (prev && (selectedFloor - 1 === 1 || (userData?.completedLevels && userData.completedLevels[selectedFloor - 2]))) {
                        setSelectedFloor(prev.id);
                      }
                    }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg uppercase text-xs tracking-wider border border-slate-600 hover:border-slate-500 transition-all flex items-center justify-center gap-1"
                  >
                    <ChevronUp size={16} /> Bajar
                  </button>
                  <button
                    onClick={() => {
                      const next = TOPICS[selectedFloor];
                      if (next && (selectedFloor === 0 || (userData?.completedLevels && userData.completedLevels[selectedFloor]))) {
                        setSelectedFloor(next.id);
                      }
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg uppercase text-xs tracking-wider border border-blue-500 hover:border-blue-400 transition-all flex items-center justify-center gap-1"
                  >
                    <ChevronUp size={16} /> Subir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Module Information - Right Side */}
          {currentTopic && isCurrentUnlocked && (
            <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/20">
              {/* Module Card */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    isCurrentCompleted 
                      ? 'from-emerald-500 to-teal-600' 
                      : 'from-cyan-500 to-blue-600'
                  } flex items-center justify-center shadow-lg`}>
                    <currentTopic.icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{currentTopic.title}</h2>
                    <p className="text-sm text-slate-300">{currentTopic.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Progress Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Progreso</span>
                  <span className={`text-sm font-black ${isCurrentCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {isCurrentCompleted ? '100%' : '0%'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isCurrentCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                    style={{ width: isCurrentCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              {/* Next Rank Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Siguiente Rango</p>
                <p className="text-sm font-black text-cyan-300">
                  {nextRank ? `${nextRank.title} (${nextRank.minScore} pts)` : 'Ya eres Líder Global'}
                </p>
              </div>

              {/* Start Button */}
              {!isCurrentCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    console.log('🎮 BOTÓN Entrar en la Unidad - Topic:', currentTopic?.id, currentTopic?.title);
                    console.log('📊 Llamando setLevel con:', currentTopic);
                    console.log('📊 Llamando setView con: game');
                    if (!currentTopic) {
                      console.error('❌ ERROR: currentTopic es undefined!');
                      return;
                    }
                    setLevel(currentTopic);
                    setView('game');
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                >
                  ⏬ Entrar en la Unidad ({currentTopic?.questions?.length || 0} preguntas)
                </button>
              )}
              {isCurrentCompleted && (
                <button
                  disabled
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-500/30"
                >
                  ✓ Completado
                </button>
              )}
            </div>
          )}

          {!isCurrentUnlocked && (
            <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h2 className="text-2xl font-black text-slate-400 mb-2">Planta Bloqueada</h2>
              <p className="text-sm text-slate-500">Completa los módulos anteriores para desbloquear esta planta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
