import React, { useState, useEffect } from 'react';
import { Lock, Trophy, Zap, ShieldCheck, ChevronUp, ChevronDown, LogOut, Map, Play, X, Star, Gift } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';
import Rewards from './Rewards.jsx';
import elevatorBg from '../assets/elevator-bg.png';

const Dashboard = ({ user, userData, setView, setLevel, setShowElevatorDoors }) => {
  const [selectedFloor, setSelectedFloor] = useState(1); // Track current selected floor
  const [showRoadmap, setShowRoadmap] = useState(false); // Show/hide career roadmap
  const [showVideo, setShowVideo] = useState(false); // Show/hide video modal
  const [showRewards, setShowRewards] = useState(false); // Show/hide rewards screen
  const [showRankAchievement, setShowRankAchievement] = useState(false); // Show rank achievement banner
  const [newRank, setNewRank] = useState(null); // Store the new rank achieved
  const [previousScore, setPreviousScore] = useState(0); // Track previous score for comparison
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('userStreak');
    return saved ? parseInt(saved, 10) : 0;
  }); // Track current streak - initialized from localStorage
  
  // Video links for each topic
  const videoLinks = {
    1: "bL0e705JuZQ",
    2: "eb1nlMUK3-c"
  };
  
  // Load streak from localStorage whenever dashboard mounts
  useEffect(() => {
    const savedStreak = localStorage.getItem('userStreak');
    const streakValue = savedStreak ? parseInt(savedStreak, 10) : 0;
    setCurrentStreak(streakValue);
    console.log('📊 Streak cargado del localStorage:', streakValue);
  }, []);
  
  const currentRank = NURSING_RANKS.slice().reverse().find(r => (userData?.totalScore || 0) >= r.minScore) || NURSING_RANKS[0];
  const nextRank = NURSING_RANKS.find(r => r.minScore > (userData?.totalScore || 0));
  
  // Detect rank changes and show achievement modal
  useEffect(() => {
    const currentScore = userData?.totalScore || 0;
    if (previousScore > 0 && currentScore > previousScore) {
      const currentRankObj = NURSING_RANKS.slice().reverse().find(r => currentScore >= r.minScore) || NURSING_RANKS[0];
      const previousRankObj = NURSING_RANKS.slice().reverse().find(r => previousScore >= r.minScore) || NURSING_RANKS[0];
      
      // Check if rank changed
      if (currentRankObj.title !== previousRankObj.title) {
        setNewRank(currentRankObj);
        setShowRankAchievement(true);
      }
    }
    setPreviousScore(currentScore);
  }, [userData?.totalScore]);
  
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

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-red-500/50 rounded-3xl p-6 shadow-2xl shadow-red-500/30 w-full max-w-4xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
                Video Introductorio - {currentTopic?.title}
              </h2>
              <button
                onClick={() => setShowVideo(false)}
                className="text-slate-400 hover:text-white text-3xl font-bold transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full bg-black rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoLinks[selectedFloor]}?autoplay=1&rel=0&modestbranding=1`}
                title={`Video Introductorio - ${currentTopic?.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Modal */}
      <Rewards isOpen={showRewards} onClose={() => setShowRewards(false)} userData={userData} />

      {/* Rank Achievement Banner */}
      {showRankAchievement && newRank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md mx-4">
            {/* Glow effect background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${newRank.color} rounded-3xl blur-3xl opacity-40 animate-pulse`}></div>
            
            {/* Main banner */}
            <div className={`relative bg-gradient-to-br ${newRank.color} backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden`}>
              {/* Decorative stars */}
              <div className="absolute top-4 left-4 text-yellow-300 text-2xl animate-bounce">⭐</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>⭐</div>
              
              {/* Content */}
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className={`w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-6xl animate-pulse shadow-2xl border-2 border-white/40`}>
                    {newRank.icon}
                  </div>
                </div>
                
                {/* Title */}
                <div>
                  <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">¡FELICIDADES!</h2>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                    {newRank.title}
                  </h1>
                  <p className="text-white/80 font-bold">Rango Alcanzado</p>
                </div>
                
                {/* Score info */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
                  <p className="text-white/90 text-sm mb-1">Puntuación Total</p>
                  <p className="text-2xl font-black text-white">{userData?.totalScore || 0} / 23.000 pts</p>
                </div>
                
                {/* Message */}
                <p className="text-white/80 text-sm leading-relaxed">
                  Has completado con éxito los requisitos para ascender a <span className="font-black text-white">{newRank.title}</span>. ¡Sigue adelante para alcanzar el siguiente nivel!
                </p>
                
                {/* Close button */}
                <button
                  onClick={() => setShowRankAchievement(false)}
                  className="w-full bg-white text-gray-900 font-black py-3 rounded-xl uppercase tracking-wider hover:bg-white/90 transition-all transform hover:scale-105 shadow-lg"
                >
                  🎮 Continuar Jugando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Roadmap Modal */}
      {showRoadmap && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-8 shadow-2xl shadow-purple-500/30 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white">Ruta de la Gestora Enfermera</h2>
              </div>
              <button
                onClick={() => setShowRoadmap(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stages List */}
            <div className="space-y-4">
              {NURSING_RANKS.map((rank, idx) => {
                const currentScore = userData?.totalScore || 0;
                const isReached = currentScore >= rank.minScore;
                const nextRankScore = NURSING_RANKS[idx + 1]?.minScore || rank.minScore;
                const progressInRank = isReached 
                  ? ((currentScore - rank.minScore) / (nextRankScore - rank.minScore)) * 100
                  : 0;

                return (
                  <div
                    key={rank.title}
                    className={`relative rounded-2xl p-6 border-2 transition-all ${
                      isReached
                        ? 'bg-gradient-to-r from-purple-900/50 to-violet-900/50 border-purple-500/80 shadow-lg shadow-purple-500/20'
                        : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                    }`}
                  >
                    {/* Current indicator */}
                    {isReached && idx === NURSING_RANKS.findIndex(r => r.minScore <= currentScore) && (
                      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-300 flex items-center justify-center shadow-lg">
                        <span className="text-xs font-black text-yellow-900">→</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${rank.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0 ${!isReached && 'opacity-50'}`}>
                        {rank.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                          <h3 className={`text-2xl font-black ${isReached ? 'text-white' : 'text-slate-400'}`}>
                            {rank.title}
                          </h3>
                          <span className="text-xs text-slate-400 font-bold">
                            {rank.minScore} pts
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={isReached ? 'text-purple-300' : 'text-slate-500'}>
                              {Math.round(progressInRank)}% completado
                            </span>
                            <span className="text-slate-500">
                              {isReached ? currentScore : Math.max(0, currentScore - rank.minScore)} / {nextRankScore - rank.minScore} pts en rango
                            </span>
                          </div>
                          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-700">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isReached
                                  ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                                  : 'bg-gradient-to-r from-slate-600 to-slate-700'
                              }`}
                              style={{ width: `${Math.max(0, progressInRank)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Status */}
                        {isReached && (
                          <div className="mt-3 inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full">
                            <span className="text-xs text-emerald-300 font-bold">✓ ALCANZADO</span>
                          </div>
                        )}
                        {!isReached && (
                          <div className="mt-3 inline-block px-3 py-1 bg-slate-600/30 border border-slate-600/50 rounded-full">
                            <span className="text-xs text-slate-400 font-bold">
                              {rank.minScore - currentScore} pts restantes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-300 mb-2">
                  <span className="font-black text-purple-300">{userData?.totalScore || 0} XP</span> acumulados
                </p>
                <p className="text-xs text-slate-500">
                  {currentRank.title === 'Líder Global' 
                    ? '🎉 ¡Eres Líder Global! ¡Máximo rango alcanzado!'
                    : `${nextRank ? nextRank.minScore - (userData?.totalScore || 0) : 0} puntos para alcanzar ${nextRank?.title || 'Líder Global'}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30`}>
              {currentRank.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Rango</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{currentRank.title}</span>
                {currentStreak >= 3 && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full animate-pulse">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-black text-orange-400">Racha x{currentStreak}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 hover:shadow-lg hover:shadow-orange-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Ver Leaderboard"
            >
              <Trophy className="w-6 h-6 text-white" />
            </button>

            <button 
              onClick={() => setShowRoadmap(!showRoadmap)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Ruta de la Gestora Enfermera"
            >
              <Map className="w-6 h-6 text-white" />
            </button>

            <button 
              onClick={() => setShowRewards(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative"
              title="Ver Recompensas"
            >
              <Gift className="w-6 h-6 text-white" />
              {Math.floor((userData?.totalScore || 0) / 2000) > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-black border border-white">
                  {Math.floor((userData?.totalScore || 0) / 2000)}
                </div>
              )}
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Experiencia</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-black">{userData?.totalScore || 0} XP</span>
              </div>
            </div>

            <button 
              onClick={() => setView('welcome')} 
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 hover:shadow-lg hover:shadow-red-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Salir al Inicio"
            >
              <LogOut className="w-6 h-6 text-white" />
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
                        disabled={!isUnlocked}
                        onClick={() => {
                          console.log(`🔘 Click en planta ${topic.id}. Desbloqueada: ${isUnlocked}, Completada: ${isCompleted}`);
                          setSelectedFloor(topic.id);
                        }}
                        className={`
                          w-12 h-12 rounded-lg font-black text-sm transition-all duration-200 transform border-2
                          flex items-center justify-center relative
                          ${isSelected
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-lg shadow-yellow-500/50 text-black scale-105'
                            : isCompleted 
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 cursor-pointer'
                              : isUnlocked
                                ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-500 text-slate-200 hover:border-cyan-400 hover:shadow-cyan-500/30 hover:scale-105 cursor-pointer'
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
          {currentTopic && (isCurrentUnlocked || isCurrentCompleted) && (
            <div className={`flex-1 bg-slate-900/40 backdrop-blur-xl border-2 rounded-3xl p-8 shadow-2xl ${
              isCurrentCompleted 
                ? 'border-emerald-500/50 shadow-emerald-500/20' 
                : 'border-cyan-400/30 shadow-cyan-500/20'
            }`}>
              {/* Module Card */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    isCurrentCompleted 
                      ? 'from-emerald-500 to-teal-600' 
                      : 'from-cyan-500 to-blue-600'
                  } flex items-center justify-center shadow-lg text-3xl`}>
                    {currentTopic.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-black text-white">{currentTopic.title}</h2>
                      {isCurrentCompleted && (
                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-black rounded-full">✓ COMPLETADO</span>
                      )}
                      {(selectedFloor === 1 || selectedFloor === 2) && (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-400 hover:via-red-500 hover:to-rose-500 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] border border-red-400/50 hover:border-red-300 font-black"
                          title="Ver video introductorio"
                        >
                          {/* Glow effect background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 animate-pulse"></div>
                          
                          {/* Play Icon with animation */}
                          <div className="relative flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white group-hover:scale-125 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-white/20 rounded-full group-hover:animate-ping"></div>
                          </div>
                          
                          {/* Text */}
                          <span className="text-sm text-white uppercase tracking-widest font-black group-hover:scale-105 transition-transform duration-300">
                            Ver resumen del Tema
                          </span>
                          
                          {/* Right accent */}
                          <div className="ml-1 w-1 h-1 bg-white/60 rounded-full group-hover:w-4 group-hover:h-4 transition-all duration-300"></div>
                        </button>
                      )}
                    </div>
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

              {/* Start Button - Only next incomplete level */}
              {(() => {
                // Find first uncompleted + unlocked level
                const firstUncompletedIdx = TOPICS.findIndex(t => 
                  (t.id === 1 || (userData?.completedLevels && userData.completedLevels[t.id - 1])) && 
                  !(userData?.completedLevels && userData.completedLevels[t.id])
                );
                const canEnter = firstUncompletedIdx !== -1 && firstUncompletedIdx === selectedFloor - 1;
                
                return (
                  <>
                    {!isCurrentCompleted && canEnter && (
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🎮 BOTÓN Entrar en la Unidad - Topic:', currentTopic?.id, currentTopic?.title);
                          if (!currentTopic) {
                            console.error('❌ ERROR: currentTopic es undefined!');
                            return;
                          }
                          setLevel(currentTopic);
                          setShowElevatorDoors(true);
                        }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                      >
                        ⏬ Entrar en la Unidad ({currentTopic?.questions?.length || 0} preguntas)
                      </button>
                    )}
                    {isCurrentCompleted && (
                      <div className="space-y-4">
                        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4">
                          <p className="text-sm text-emerald-300 font-black mb-2">📊 CONTENIDO APRENDIDO</p>
                          <p className="text-xs text-emerald-200 leading-relaxed">
                            {currentTopic.questions?.length || 0} preguntas de nivel 10/10 completadas sobre: {currentTopic.subtitle}
                          </p>
                        </div>
                        <button
                          disabled
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-500/30 cursor-default"
                        >
                          ✓ Planta Completada
                        </button>
                      </div>
                    )}
                    {!isCurrentCompleted && !canEnter && (
                      <div className="space-y-4">
                        <div className="bg-slate-500/20 border border-slate-500/50 rounded-xl p-4">
                          <p className="text-sm text-slate-300 font-black mb-2">⏸️ BLOQUEADA</p>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            Completa los módulos anteriores para desbloquear esta planta
                          </p>
                        </div>
                        <button
                          disabled
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-slate-400 font-black py-4 rounded-xl uppercase tracking-wider cursor-not-allowed opacity-50"
                        >
                          Próximamente
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
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
