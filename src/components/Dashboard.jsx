import React, { useState, useEffect } from 'react';
// 1. AQUI HE AÑADIDO LOS ICONOS NUEVOS (Swords y BrainCircuit)
import { Lock, Trophy, Zap, ShieldCheck, ChevronUp, ChevronDown, LogOut, Map, Play, Star, Gift, Target, TrendingUp, Calendar, Users, Swords, BrainCircuit } from 'lucide-react';
import { TOPICS, NURSING_RANKS } from '../data/constants.js';
import Rewards from './Rewards.jsx';
import Missions from './Missions.jsx';
import Leagues from './Leagues.jsx';
import LoginCalendar from './LoginCalendar.jsx';
import ShareModal from './ShareModal';
import AvatarPreviewDisplay from './AvatarPreviewDisplay';
import AvatarFullViewModal from './AvatarFullViewModal';
import CurrencyDisplay from './CurrencyDisplay';
import AdvancedMilestoneTimeline from './AdvancedMilestoneTimeline';
import DailyChallenge from './DailyChallenge';
import PreGameModal from './PreGameModal';
import StreakTracker from './StreakTracker';
import Leaderboards from './Leaderboards';
import TeamChallenges from './TeamChallenges';
import CareerProgressionModal from './CareerProgressionModal';
import HospitalCases from './HospitalCases';
import BadgesDisplay from './BadgesDisplay';
import Toast from './Toast';
import InfographiesGallery from './InfographiesGallery';
import AITrainingHub from './AITrainingHub';
import elevatorBg from '../assets/elevator-bg.png';
import { useMissions } from '../hooks/useMissions';
import { useLeagues } from '../hooks/useLeagues';
import { useLoginStreak } from '../hooks/useLoginStreak';
import useNotifications from '../hooks/useNotifications';
import { useGestCoins } from '../hooks/useGestCoins';
import useDashboardBackgroundMusic from '../hooks/useDashboardBackgroundMusic';
import ShopModal from './ShopModal';

const Dashboard = ({ user, userData, setView, setLevel, setShowElevatorDoors }) => {
  // Música de fondo en dashboard
  useDashboardBackgroundMusic(true);
  
  const { enabled: notificationsEnabled, toggleNotifications } = useNotifications();
  const { balance, inventory, upgrades, buyConsumable, buyUpgrade } = useGestCoins();
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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPreGameModal, setShowPreGameModal] = useState(false);
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  const [showTeamChallenges, setShowTeamChallenges] = useState(false);
  const [showCareerProgression, setShowCareerProgression] = useState(false);
  const [showHospitalCases, setShowHospitalCases] = useState(false);
  const [showInfographics, setShowInfographics] = useState(false);
  const [showAITraining, setShowAITraining] = useState(false);
  const [selectedLevelForGame, setSelectedLevelForGame] = useState(null);
  const [newRank, setNewRank] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { dailyMissions, weeklyMission, claimReward, getCompletedNotClaimed } = useMissions();
  const { calendarData, currentStreakDay, getDaysInCurrentMonth } = useLoginStreak();

  const currentRank = userData?.rank || 'Estudiante';
  const { currentLeague, leagueRanking, playerPosition, weeklyXP, getNextLeague, getDaysUntilWeekEnd } = useLeagues(
    currentRank, 
    userData?.totalScore || 0, 
    user?.uid || 'demo'
  );

  const videoLinks = {
    1: "bL0e705JuZQ",
    2: "eb1nlMUK3-c",
    3: "ThHodVUzC9c",
    4: "oB4ol3EYEIs",
    5: "yUOPtM_yEHc",
    6: "NMY7SwEgC50",
    7: "TU9VF7sWh-w",
    8: "7yo2d-MtgBw",
    9: "rTJXMJqkUSw",
    10: "pem8VkjbNA4",
    11: "iJNKzYCRoEw",
    12: "VvHqG2ec744",
    13: "scs2OI7IB2c",
    14: "HBnbjZKqyjA",
    15: "5KbUJ6fDVRA",
    16: "DVlSigTdaoQ",
    17: "e0AbDC1DlLI",
    18: "pvOTsv6alS8",
    19: "p2qaUIymS9M",
    20: "w_YbsjGtn1s",
    21: "hvI5afYV9kM",
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
          achievementType: 'rank',
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


  // Monitorear cambios en misión semanal completada
  useEffect(() => {
    if (weeklyMission?.completed && !weeklyMission?.claimed) {
      const currentStreak = parseInt(localStorage.getItem('userStreak') || '0', 10);
      setShareData({
        score: userData.totalScore,
        streak: currentStreak,
        achievementType: 'mission',
      });
      setTimeout(() => {
        setShowShareModal(true);
      }, 500);
    }
  }, [weeklyMission?.completed]);

  // Monitorear racha de 30 días
  useEffect(() => {
    if (currentStreakDay === 30) {
      const currentScore = userData.totalScore || 0;
      setShareData({
        score: currentScore,
        streak: 30,
        achievementType: 'streak',
      });
      setTimeout(() => {
        setShowShareModal(true);
      }, 1000);
    }
  }, [currentStreakDay]);

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
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{backgroundImage: `url(/images/hospital-bg.png)`}}></div>

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

      {/* Modals */}
      <Missions isOpen={showMissions} onClose={() => setShowMissions(false)} dailyMissions={dailyMissions} weeklyMission={weeklyMission} onClaimReward={claimReward} />
      <Leagues isOpen={showLeagues} onClose={() => setShowLeagues(false)} currentLeague={currentLeague} leagueRanking={leagueRanking} playerPosition={playerPosition} weeklyXP={weeklyXP} nextLeague={getNextLeague()} daysLeft={getDaysUntilWeekEnd()} />
      <LoginCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} calendarData={calendarData} currentStreakDay={currentStreakDay} daysInMonth={getDaysInCurrentMonth()} />
      <Rewards isOpen={showRewards} onClose={() => setShowRewards(false)} userData={userData} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} moduleTitle={shareData?.moduleTitle} score={shareData?.score} streak={shareData?.streak} rankTitle={shareData?.rankTitle} achievementType={shareData?.achievementType || 'module'} />
      <ShopModal isOpen={showShop} onClose={() => setShowShop(false)} balance={balance} onBuyConsumable={buyConsumable} onBuyUpgrade={buyUpgrade} inventory={inventory} upgrades={upgrades} />
      <Leaderboards isOpen={showLeaderboards} onClose={() => setShowLeaderboards(false)} playerScore={userData?.totalScore || 0} playerName={playerAvatar.name || 'Desconocido'} playerUID={user?.uid || 'demo'} weeklyXP={weeklyXP || 0} />
      <TeamChallenges isOpen={showTeamChallenges} onClose={() => setShowTeamChallenges(false)} playerName={playerAvatar.name || 'Desconocido'} playerUID={user?.uid || 'demo'} />
      <CareerProgressionModal isOpen={showCareerProgression} onClose={() => setShowCareerProgression(false)} currentScore={userData?.totalScore || 0} playerName={playerAvatar.name || 'Desconocido'} />
      <AvatarFullViewModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} playerAvatar={playerAvatar} />
      <InfographiesGallery isOpen={showInfographics} onClose={() => setShowInfographics(false)} />
      {showHospitalCases && <HospitalCases onClose={() => setShowHospitalCases(false)} />}
      <AITrainingHub isOpen={showAITraining} onClose={() => setShowAITraining(false)} />
      {showPreGameModal && (
        <PreGameModal 
          isOpen={showPreGameModal} 
          onClose={() => setShowPreGameModal(false)} 
          levelData={selectedLevelForGame}
          onStart={() => {
            setShowPreGameModal(false);
            if(selectedLevelForGame) {
              setLevel(selectedLevelForGame);
              setShowElevatorDoors(true);
            }
          }}
        />
      )}


      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6 max-w-7xl">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar Display */}
            {playerAvatar.name && (
              <button
                onClick={() => setShowAvatarModal(true)}
                className="flex items-center gap-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-3 border-2 border-cyan-500/50 hover:border-cyan-400 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800/50">
                  {playerAvatar.characterPreset ? (
                    <img 
                      src={`/avatar/${playerAvatar.gender === 'male' ? 'male' : 'female'}-characters/${playerAvatar.gender === 'male' ? 'male' : 'female'}-character-${playerAvatar.characterPreset}.png`}
                      alt="Avatar"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <AvatarPreviewDisplay avatar={playerAvatar} size="small" />
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{playerAvatar.name}</p>
                  <p className="text-cyan-400 font-bold text-xs">{userData.rank || 'Estudiante'}</p>
                </div>
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <CurrencyDisplay balance={balance} />

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
              onClick={() => setShowLeaderboards(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 hover:shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Clasificaciones"
            >
              <Trophy className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowTeamChallenges(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Desafíos en Equipo"
            >
              <Users className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={() => setShowCareerProgression(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center border border-white/20 transition-all transform hover:scale-110"
              title="Carrera Profesional"
            >
              <TrendingUp className="w-6 h-6 text-white" />
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
              title="Tienda GestCoins"
            >
              <span className="text-2xl">🛍️</span>
            </button>

            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">GestCoins</span>
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

            <div className="flex flex-col items-center bg-gradient-to-br from-yellow-600 to-orange-600 px-4 py-2 rounded-lg border-2 border-yellow-300/50 shadow-lg shadow-yellow-500/40">
              <span className="text-xs text-yellow-100 font-bold uppercase tracking-wider">Puntos Totales</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl">⭐</span>
                <span className="text-2xl font-black text-white">{userData?.totalScore || 0}</span>
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

          {/* Left - Unified Game Panel (Modules + Level Start) - Side by Side */}
          <div className="lg:col-span-2">
            
            {/* --- 2. AQUÍ ESTÁ EL NUEVO BLOQUE DE BATALLA DE LAS IDEAS --- */}
            <div className="mb-6 bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-slate-900/60 backdrop-blur-xl border-2 border-violet-500/30 rounded-3xl p-5 relative overflow-hidden group hover:border-violet-400/50 transition-all">
              
              {/* Efectos de fondo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse"></div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                
                {/* Texto y Título */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="bg-violet-500/20 p-2 rounded-lg border border-violet-500/30">
                      <Swords className="w-6 h-6 text-violet-300" />
                    </div>
                    <h2 className="text-2xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
                      La Batalla de las Ideas
                    </h2>
                  </div>
                  <p className="text-violet-200/70 text-sm ml-1">
                    Debate en tiempo real. Lanza preguntas y compite por el conocimiento.
                  </p>
                </div>

                {/* Botones Compactos y Visuales */}
                <div className="flex items-center gap-3">
                  
                  {/* Botón ALUMNO */}
                  <button
                    onClick={() => setView('brainstorm_join')}
                    className="group relative px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-violet-400 rounded-xl transition-all flex items-center gap-3 shadow-lg"
                  >
                    <div className="bg-slate-700 group-hover:bg-violet-500/20 p-1.5 rounded-lg transition-colors">
                      <Users className="w-5 h-5 text-slate-300 group-hover:text-violet-300" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estudiante</div>
                      <div className="text-white font-bold leading-none text-sm">Unirse</div>
                    </div>
                  </button>

                  {/* Botón PROFE (Destacado) */}
                  <button
                    onClick={() => setView('brainstorm_host')}
                    className="group relative px-5 py-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-fuchsia-900/20 hover:shadow-fuchsia-500/40 border border-white/10 transition-all transform hover:-translate-y-0.5 flex items-center gap-3"
                  >
                    <div className="bg-white/20 p-1.5 rounded-lg">
                      <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-fuchsia-200 font-black uppercase tracking-wider">Profesor</div>
                      <div className="text-white font-bold leading-none text-sm">Crear Sala</div>
                    </div>
                  </button>

                </div>
              </div>
            </div>
            {/* --- FIN BLOQUE BATALLA --- */}


            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Entrenamiento de la Gestora Enfermera</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/50">
                    <Play className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-xs font-bold">{Object.keys(userData?.completedLevels || {}).length}/{TOPICS.length}</span>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
              </div>

              {/* Two Column Layout - Selector & Level Info Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Left: Module Selector */}
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white font-bold">Seleccionar Módulo</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => selectedFloor > 1 && setSelectedFloor(selectedFloor - 1)}
                        className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
                      >
                        <ChevronUp size={14} className="text-white" />
                      </button>
                      <button
                        onClick={() => selectedFloor < TOPICS.length && setSelectedFloor(selectedFloor + 1)}
                        className="w-7 h-7 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all"
                      >
                        <ChevronDown size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {TOPICS.map((topic) => {
                      const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
                      const isUnlocked = topic.id === 1 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedFloor(topic.id)}
                          className={`w-full px-3 py-2 rounded-lg font-bold text-xs border-2 transition-all flex items-center gap-2 ${
                            selectedFloor === topic.id
                              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                              : isCompleted 
                                ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300 hover:border-emerald-400'
                                : isUnlocked
                                  ? 'bg-slate-700/30 border-slate-600 hover:border-cyan-400/70'
                                  : 'bg-slate-800/20 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-40'
                          }`}
                          disabled={!isUnlocked}
                        >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            isCompleted ? 'bg-emerald-500/30 text-emerald-300' : 
                            selectedFloor === topic.id ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-600/50'
                          }`}>
                            {isCompleted ? '✓' : topic.id}
                          </span>
                          <span className="flex-1 text-left truncate">{topic.title}</span>
                          {!isUnlocked && <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Module Info & Start Button */}
                <div className="flex flex-col">
                  {currentTopic && (isCurrentUnlocked || isCurrentCompleted) ? (
                    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-4 border-2 transition-all flex-1 flex flex-col"
                          style={{borderColor: isCurrentCompleted ? '#10b981' : '#06b6d4'}}>
                      
                      {/* Module Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-4xl">{currentTopic.icon}</div>
                        <div className="flex-1">
                          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-black mb-1 ${isCurrentCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                            {isCurrentCompleted ? '✓ Completado' : `Nivel ${selectedFloor}`}
                          </div>
                          <h3 className="text-lg font-black text-white leading-tight">{currentTopic.title}</h3>
                          <p className="text-xs text-slate-400">{currentTopic.subtitle}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-slate-700/40 rounded-xl p-3 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-slate-400 font-bold">PROGRESO DEL MÓDULO</span>
                          <span className="font-black text-sm text-cyan-300">{isCurrentCompleted ? '100%' : '0%'}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all relative" style={{width: isCurrentCompleted ? '100%' : '0%'}}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1"></div>

                      {/* Start Button or Completed Badge */}
                      {!isCurrentCompleted ? (
                        <button
                          onClick={() => {
                            setSelectedLevelForGame(currentTopic);
                            setShowPreGameModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3 text-lg"
                        >
                          <Play className="w-6 h-6" />
                          Iniciar Nivel
                          <span className="text-2xl">→</span>
                        </button>
                      ) : (
                        <div className="text-center py-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
                          <p className="text-emerald-300 font-black text-lg flex items-center justify-center gap-2">
                            <span className="text-2xl">✓</span> NIVEL COMPLETADO
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-800/40 rounded-2xl p-6 border-2 border-slate-700/50 flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 font-bold">Módulo bloqueado</p>
                        <p className="text-slate-500 text-sm">Completa el nivel anterior</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hub de IA Gest-Tech - Below Training, Above Daily Challenge */}
              <button
                onClick={() => setShowAITraining(true)}
                className="mt-5 w-full bg-gradient-to-br from-emerald-900/60 via-teal-900/50 to-cyan-900/60 backdrop-blur-xl border-2 border-emerald-400/40 rounded-2xl p-5 text-left transition-all hover:scale-[1.01] hover:border-emerald-400 group shadow-xl shadow-emerald-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Hub de IA Gest-Tech</h3>
                        <span className="bg-emerald-500/30 px-2 py-0.5 rounded-full text-xs text-emerald-200 font-bold border border-emerald-400/50">5 Módulos</span>
                      </div>
                      <p className="text-emerald-200/80 text-sm">Entrenamiento avanzado con Inteligencia Artificial</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-400/50">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-emerald-300 text-xs font-bold">IA Activa</span>
                    </div>
                    <span className="text-emerald-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              {/* Daily Challenge - Below */}
              <div className="mt-5">
                <DailyChallenge />
              </div>
            </div>
          </div>

          {/* Right Column - All Other Features */}
          <div className="flex flex-col gap-4">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Infografías Button */}
              <button
                onClick={() => setShowInfographics(true)}
                className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border-2 border-purple-400/40 rounded-2xl p-4 text-left transition-all hover:scale-[1.02] hover:border-purple-400 group shadow-lg shadow-purple-500/20"
              >
                 {/* ... Contenido del botón de infografías ... */}
                 <div className="flex flex-col h-full justify-between">
                    <div className="bg-purple-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-500/30 transition-colors">
                      <Map className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Infografías</h4>
                      <p className="text-purple-200/60 text-xs">Biblioteca visual</p>
                    </div>
                 </div>
              </button>

              {/* Casos Clínicos Button (Reconstruido por si acaso) */}
              <button
                onClick={() => setShowHospitalCases(true)}
                className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-xl border-2 border-blue-400/40 rounded-2xl p-4 text-left transition-all hover:scale-[1.02] hover:border-blue-400 group shadow-lg shadow-blue-500/20"
              >
                 <div className="flex flex-col h-full justify-between">
                    <div className="bg-blue-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors">
                      <ShieldCheck className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Casos Clínicos</h4>
                      <p className="text-blue-200/60 text-xs">Pacientes reales</p>
                    </div>
                 </div>
              </button>
            </div>

            {/* Timeline de Hitos */}
            <div className="mt-4">
              <AdvancedMilestoneTimeline score={userData?.totalScore || 0} />
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast message={toastMessage} icon={toastIcon} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default Dashboard;
