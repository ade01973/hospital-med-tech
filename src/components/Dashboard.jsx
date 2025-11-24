import React, { useState, useEffect } from 'react';
import { Lock, Trophy, Zap, ShieldCheck, ChevronUp, ChevronDown, LogOut, Map, Play, X, Star, Gift, Target, TrendingUp, Calendar } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';
import Rewards from './Rewards.jsx';
import Missions from './Missions.jsx';
import Leagues from './Leagues.jsx';
import LoginCalendar from './LoginCalendar.jsx';
import ShareModal from './ShareModal';
import elevatorBg from '../assets/elevator-bg.png';
import { useMissions } from '../hooks/useMissions';
import { useLeagues } from '../hooks/useLeagues';
import { useLoginStreak } from '../hooks/useLoginStreak';
import useNotifications from '../hooks/useNotifications';
import { useMediCoins } from '../hooks/useMediCoins';
import ShopModal from './ShopModal';

const Dashboard = ({ user, userData, setView, setLevel, setShowElevatorDoors }) => {
  const { enabled: notificationsEnabled, toggleNotifications } = useNotifications();
  const { balance, inventory, upgrades, buyConsumable, buyUpgrade } = useMediCoins();
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [showRankAchievement, setShowRankAchievement] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showLeagues, setShowLeagues] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newRank, setNewRank] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('userStreak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const { dailyMissions, weeklyMission, claimReward, getCompletedNotClaimed } = useMissions();
  const { calendarData, currentStreakDay, getDaysInCurrentMonth } = useLoginStreak();
  const [notificationsOn, setNotificationsOn] = useState(notificationsEnabled);

  const currentRank = userData?.rank || 'Estudiante';
  const { currentLeague, leagueRanking, playerPosition, weeklyXP, getNextLeague, getDaysUntilWeekEnd } = useLeagues(
    currentRank, 
    userData?.totalScore || 0, 
    user?.uid || 'demo'
  );

  const videoLinks = {
    1: "bL0e705JuZQ",
    2: "eb1nlMUK3-c",
  };

  useEffect(() => {
    if (userData?.rank && previousScore !== userData.totalScore) {
      const nextRank = NURSING_RANKS.find(r => r.minScore > userData.totalScore);
      if (nextRank) {
        setNewRank(nextRank);
        setShowRankAchievement(true);

        // Preparar datos para compartir
        const currentStreak = parseInt(localStorage.getItem('userStreak') || '0', 10);
        setShareData({
          rankTitle: nextRank.title,
          score: userData.totalScore,
          streak: currentStreak,
        });

        // Mostrar modal de compartir después del banner de logro
        setTimeout(() => {
          setShowRankAchievement(false);
          setShowShareModal(true);
        }, 3000);
      }
      setPreviousScore(userData.totalScore);
    }
  }, [userData?.totalScore, userData?.rank]);

  useEffect(() => {
    setCurrentStreak(parseInt(localStorage.getItem('userStreak') || '0', 10));
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
            ⏳
          </div>
          <p className="text-white font-black text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const currentTopic = TOPICS[selectedFloor - 1];
  const isCurrentCompleted = userData?.completedLevels && userData.completedLevels[selectedFloor];
  const isCurrentUnlocked = selectedFloor === 1 || (userData?.completedLevels && userData.completedLevels[selectedFloor - 1]);
  const currentRankData = NURSING_RANKS.find(r => r.title === userData.rank);
  const nextRankData = NURSING_RANKS.find(r => r.minScore > userData.totalScore);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{backgroundImage: `url(${elevatorBg})`}}></div>

      {/* Rank Achievement Banner */}
      {showRankAchievement && newRank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-center max-w-sm animate-bounce">
            <p className="text-white font-black text-lg mb-2">¡NUEVO RANGO!</p>
            <p className="text-2xl font-black text-yellow-300">{newRank.title}</p>
            <p className="text-white text-sm mt-2">Requiere {newRank.minScore} pts</p>
          </div>
        </div>
      )}

      {/* Missions Modal */}
      <Missions 
        isOpen={showMissions} 
        onClose={() => setShowMissions(false)} 
        dailyMissions={dailyMissions}
        weeklyMission={weeklyMission}
        onClaimReward={claimReward}
      />

      {/* Leagues Modal */}
      <Leagues
        isOpen={showLeagues}
        onClose={() => setShowLeagues(false)}
        currentLeague={currentLeague}
        leagueRanking={leagueRanking}
        playerPosition={playerPosition}
        weeklyXP={weeklyXP}
        nextLeague={getNextLeague()}
        daysLeft={getDaysUntilWeekEnd()}
      />

      {/* Login Calendar Modal */}
      <LoginCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        calendarData={calendarData}
        currentStreakDay={currentStreakDay}
        daysInMonth={getDaysInCurrentMonth()}
      />

      {/* Rewards Modal */}
      <Rewards
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        userData={userData}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        moduleTitle={shareData?.rankTitle}
        score={shareData?.score}
        streak={shareData?.streak}
        rankTitle={shareData?.rankTitle}
      />

      {/* Shop Modal */}
      <ShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        balance={balance}
        onBuyConsumable={buyConsumable}
        onBuyUpgrade={buyUpgrade}
        inventory={inventory}
        upgrades={upgrades}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6 max-w-7xl">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleNotifications}
              className={`w-12 h-12 rounded-full ${
                notificationsEnabled 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50' 
                  : 'bg-gradient-to-br from-slate-600 to-slate-700 hover:shadow-lg hover:shadow-slate-500/50'
              } flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative`}
              title={notificationsEnabled ? "Desactivar notificaciones" : "Activar notificaciones"}
            >
              <span className="text-2xl">{notificationsEnabled ? '🔔' : '🔕'}</span>
            </button>

            <button 
              onClick={() => setShowMissions(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative"
              title="Ver Misiones"
            >
              <Target className="w-6 h-6 text-white" />
              {getCompletedNotClaimed() > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 text-xs font-black border border-white animate-pulse">
                  {getCompletedNotClaimed()}
                </div>
              )}
            </button>

            <button 
              onClick={() => setShowLeagues(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative"
              title="Ver Ligas"
            >
              <Trophy className="w-6 h-6 text-white" />
              {playerPosition && playerPosition <= 3 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 text-xs font-black border border-white">
                  {playerPosition === 1 ? '🥇' : playerPosition === 2 ? '🥈' : '🥉'}
                </div>
              )}
            </button>

            <button 
              onClick={() => setShowCalendar(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative"
              title="Calendario de Recompensas"
            >
              <Calendar className="w-6 h-6 text-white" />
              {currentStreakDay > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-slate-900 text-xs font-black border border-white">
                  {currentStreakDay}
                </div>
              )}
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

            <button 
              onClick={() => setShowShop(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110 relative"
              title="Tienda MediCoins"
            >
              <span className="text-2xl">🛍️</span>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">MediCoins</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">💸</span>
                <span className="text-lg font-black text-yellow-300">{balance}</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Experiencia</span>
              <div className="flex items-center gap-1">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-black text-yellow-300">{userData?.totalScore || 0}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setView('welcome'); setShowElevatorDoors(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left - Elevator */}
          <div>
            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">Módulos</h2>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
                {TOPICS.map((topic) => {
                  const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
                  const isUnlocked = topic.id === 1 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);

                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedFloor(topic.id)}
                      className={`w-full px-4 py-3 rounded-lg font-black text-sm uppercase tracking-wider border-2 transition-all ${
                        selectedFloor === topic.id
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/30'
                          : isCompleted 
                            ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300'
                            : isUnlocked
                              ? 'bg-slate-700/30 border-slate-500 hover:border-cyan-400'
                              : 'bg-slate-800/20 border-slate-700 text-slate-500 cursor-not-allowed opacity-40'
                      }`}
                      disabled={!isUnlocked}
                    >
                      {isCompleted ? '✓' : String(topic.id).padStart(2, '0')} {topic.title.substring(0, 10)}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => selectedFloor > 1 && setSelectedFloor(selectedFloor - 1)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg text-xs"
                >
                  <ChevronUp size={16} className="inline" /> Bajar
                </button>
                <button
                  onClick={() => selectedFloor < TOPICS.length && setSelectedFloor(selectedFloor + 1)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs"
                >
                  <ChevronUp size={16} className="inline" /> Subir
                </button>
              </div>
            </div>
          </div>

          {/* Center - Module Info */}
          {currentTopic && (isCurrentUnlocked || isCurrentCompleted) && (
            <div className="bg-slate-900/40 backdrop-blur-xl border-2 rounded-3xl p-8 shadow-2xl" 
                 style={{borderColor: isCurrentCompleted ? '#10b981' : '#06b6d4'}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{currentTopic.icon}</div>
                <div>
                  <h3 className="text-2xl font-black text-white">{currentTopic.title}</h3>
                  <p className="text-sm text-slate-300">{currentTopic.subtitle}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold">PROGRESO</span>
                  <span className="font-black text-cyan-300">{isCurrentCompleted ? '✓ 100%' : '0%'}</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width: isCurrentCompleted ? '100%' : '0%'}}></div>
                </div>
              </div>

              {!isCurrentCompleted && (
                <button
                  onClick={() => { setLevel(currentTopic); setShowElevatorDoors(true); }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  Iniciar Nivel →
                </button>
              )}

              {isCurrentCompleted && (
                <div className="text-center py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-300 font-black">✓ COMPLETADO</p>
                </div>
              )}
            </div>
          )}

          {/* Right - Rank & Stats */}
          <div>
            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-4">Rango Actual</h3>

              {currentRankData && (
                <div className="text-center mb-6 p-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border-2 border-cyan-500/30">
                  <p className="text-4xl mb-2">{currentRankData.icon}</p>
                  <p className="text-2xl font-black text-cyan-300 mb-1">{currentRankData.title}</p>
                  <p className="text-xs text-slate-400">Requiere {currentRankData.minScore} pts</p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Progreso</p>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                    style={{width: `${Math.min(100, (userData.totalScore / (nextRankData?.minScore || 23001)) * 100)}%`}}
                  ></div>
                </div>
              </div>

              {nextRankData && (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Siguiente</p>
                  <p className="text-white font-black">{nextRankData.title}</p>
                  <p className="text-xs text-slate-300">{Math.max(0, nextRankData.minScore - userData.totalScore)} pts restantes</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Racha Actual</span>
                  <span className="text-2xl font-black text-orange-400">🔥 {currentStreak}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Completados</span>
                  <span className="text-lg font-black text-emerald-400">{Object.values(userData?.completedLevels || {}).filter(Boolean).length}/22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;