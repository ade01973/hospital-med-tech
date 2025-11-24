import React, { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Trophy, Activity, Lock, CheckCircle, Play, Heart } from 'lucide-react';
import { User } from 'lucide-react';
import gameLevelBg from '../assets/game-level-bg.png';
import Confetti from './Confetti';
import LivesGameOver from './LivesGameOver';
import { useMissions } from '../hooks/useMissions';
import { useBadges } from '../hooks/useBadges';

const GameLevel = ({ topic, user, studentId, onExit, onComplete }) => {
  const { trackQuestionAnswered, trackStreakCheck, trackFastAnswer, trackPerfectLevel } = useMissions();
  // Note: useBadges se llamará en Dashboard ya que userData se obtiene en App.jsx
  console.log('🎮 GameLevel cargado con topic:', topic?.id, topic?.title, 'Preguntas:', topic?.questions?.length);
  
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isDoorOpening, setIsDoorOpening] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [timeBonus, setTimeBonus] = useState('');
  const [showTimeBonus, setShowTimeBonus] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [pointsToShow, setPointsToShow] = useState('');
  const [lives, setLives] = useState(5);
  const [showLivesGameOver, setShowLivesGameOver] = useState(false);
  const [loseHeartAnimation, setLoseHeartAnimation] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Cargar streak y lives del localStorage al iniciar
  useEffect(() => {
    const savedStreak = localStorage.getItem('userStreak');
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak, 10));
    }

    const livesKey = `gameLives_${topic?.id}`;
    const savedLives = localStorage.getItem(livesKey);
    if (savedLives !== null) {
      const parsedLives = parseInt(savedLives, 10);
      setLives(Math.min(parsedLives, 5)); // No permitir más de 5 vidas
    }
  }, [topic?.id]);

  // Guardar lives en localStorage cuando cambien
  useEffect(() => {
    if (topic?.id) {
      const livesKey = `gameLives_${topic.id}`;
      localStorage.setItem(livesKey, lives.toString());
    }
  }, [lives, topic?.id]);

  // Timer countdown
  useEffect(() => {
    if (selectedOption !== null || completed || showLivesGameOver) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setSelectedOption(0);
          setIsCorrect(false);
          clearInterval(timer);
          
          setTimeout(() => {
            const nextFloor = currentFloor + 1;
            if (nextFloor === topic.questions.length) {
              setCompleted(true);
              setTimeout(() => onComplete(topic.id, score, studentId), 500);
            } else {
              // Perder vida por timeout
              const newLives = lives - 1;
              if (newLives <= 0) {
                setShowLivesGameOver(true);
              } else {
                setLives(newLives);
                setLoseHeartAnimation(true);
                setTimeout(() => setLoseHeartAnimation(false), 600);
              }
              
              setCurrentFloor(nextFloor);
              setSelectedOption(null);
              setIsCorrect(null);
              setRemainingTime(30);
            }
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedOption, completed, currentFloor, topic.questions.length, score, studentId, onComplete, lives, showLivesGameOver]);

  // Resetear timer cuando cambia la pregunta
  useEffect(() => {
    if (selectedOption === null) {
      setRemainingTime(30);
    }
  }, [currentFloor]);

  useEffect(() => {
    console.log(`📄 Pregunta cambió a: ${currentFloor + 1}`);
    setShowModal(true);
  }, [currentFloor]);

  if (!topic || !topic.questions || topic.questions.length === 0) {
    console.error('❌ Topic inválido:', topic);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error: No hay preguntas cargadas</h2>
          <button 
            onClick={onExit}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const floors = [...topic.questions];

  const handleDoorClick = (floorIndex) => {
    if (floorIndex === currentFloor) {
      setIsDoorOpening(true);
      setTimeout(() => {
        setIsDoorOpening(false);
        setShowModal(true);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 600);
    }
  };

  const handleAnswer = (optionIndex) => {
    console.log(`📍 Respuesta en pregunta ${currentFloor + 1}: opción ${optionIndex}`);
    setSelectedOption(optionIndex);
    const correct = topic.questions[currentFloor].correct === optionIndex;
    setIsCorrect(correct);
    
    let pointsEarned = 0;
    let newStreak = currentStreak;
    let speedBonus = '';
    const timeSpent = 30 - remainingTime;
    
    // 📊 TRACKING MISIONES - SIEMPRE se cuenta cada respuesta
    trackQuestionAnswered(); 
    console.log(`🎯 Contador actualizado: verificar localStorage['dailyMissions']`);
    
    if (correct) {
      newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      localStorage.setItem('userStreak', newStreak.toString());
      trackStreakCheck(newStreak); // Verificar racha activa
      console.log(`🔥 Racha tracking llamado con valor: ${newStreak}`);
      
      if (timeSpent < 10) {
        pointsEarned = 150;
        speedBonus = '¡RÁPIDO! +150 PTS';
        trackFastAnswer(); // Respuesta rápida (<10s)
        console.log(`⚡ Respuesta rápida tracking llamado`);
      } else if (timeSpent <= 20) {
        pointsEarned = 100;
        speedBonus = '+100 PTS';
      } else {
        pointsEarned = 50;
        speedBonus = '¡MÁS RÁPIDO! +50 PTS';
      }
      
      if (newStreak >= 5) {
        pointsEarned += 20;
        setShowStreakBonus(true);
        setTimeout(() => setShowStreakBonus(false), 1500);
      }
      
      setTimeBonus(speedBonus);
      setShowTimeBonus(true);
      setTimeout(() => setShowTimeBonus(false), 1500);
      
      setTriggerConfetti(true);
      setPointsToShow(`+${pointsEarned}`);
      setTimeout(() => setTriggerConfetti(false), 3500);
      
      setScore(prev => prev + pointsEarned);
      console.log(`✅ CORRECTO! Tiempo: ${timeSpent}s, Velocidad: ${speedBonus}, Racha: ${newStreak}, Puntos: ${pointsEarned}`);
    } else {
      // Incorrecto - perder 1 vida
      const newLives = lives - 1;
      if (newLives <= 0) {
        setShowLivesGameOver(true);
        console.log(`💔 SIN VIDAS! Juego terminado por falta de energía`);
      } else {
        setLives(newLives);
        setLoseHeartAnimation(true);
        setTimeout(() => setLoseHeartAnimation(false), 600);
        console.log(`❌ INCORRECTO! Vidas restantes: ${newLives}`);
      }
      
      // Racha se resetea
      setCurrentStreak(0);
      localStorage.setItem('userStreak', '0');
      trackStreakCheck(0); // Racha rota a 0
      console.log(`🔥 Racha rota - tracking con valor: 0`);
    }
    
    // AVANZAR solo si hay vidas
    if (!(lives - 1 <= 0)) {
      setTimeout(() => {
        const nextFloor = currentFloor + 1;
        
        if (nextFloor === floors.length) {
          // Verificar si completó con 100% correctas (nivel perfecto para misión semanal)
          // Se considera perfecto si solo tuvo respuestas correctas
          const allCorrect = score > 0; // Simplificado: si tiene puntos, fue 100%
          if (allCorrect && correct) {
            trackPerfectLevel();
            console.log(`🏆 Nivel perfecto completado - tracking llamado`);
          }
          
          setCompleted(true);
          setTimeout(() => onComplete(topic.id, score + (correct ? pointsEarned : 0), studentId), 500);
        } else {
          setCurrentFloor(nextFloor);
          setSelectedOption(null);
          setIsCorrect(null);
        }
      }, 1500);
    }
  };

  const handleLivesGameOverContinue = (newLives) => {
    setLives(newLives);
    setShowLivesGameOver(false);
  };

  const handleWatchVideo = (isBeforeStart = false) => {
    // Video URLs por módulo
    const videoUrl = {
      1: 'https://youtu.be/bL0e705JuZQ',
      2: 'https://youtu.be/eb1nlMUK3-c',
    }[topic.id];

    console.log(`🎥 handleWatchVideo ejecutado - Módulo: ${topic.id}, URL:`, videoUrl);
    
    if (videoUrl) {
      console.log(`✅ Abriendo video en nueva ventana:`, videoUrl);
      window.open(videoUrl, '_blank');
      
      // Si es antes de empezar, no hacer nada especial
      if (!isBeforeStart) {
        // Simular cierre del video después de un tiempo (en producción, detectar cuando cierre)
        setTimeout(() => {
          console.log(`⏰ Agregando 2 corazones después de ver video`);
          setLives(prev => Math.min(prev + 2, 5)); // +2 corazones, máximo 5
          setShowLivesGameOver(false);
        }, 5000);
      }
    } else {
      console.log(`❌ No hay URL de video para el módulo ${topic.id}`);
    }
  };

  const handleUsePowerUp = () => {
    // En producción, verificar si el usuario tiene power-ups disponibles
    setLives(5);
    setShowLivesGameOver(false);
  };

  // 📺 MODAL DE INICIO CON VIDEO
  if (showStartScreen) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 relative overflow-hidden"
        style={{
          backgroundImage: `url(${gameLevelBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60 -z-10"></div>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.4)]">
            <span className="text-4xl">📖</span>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">{topic.title}</h1>
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">Completa todas las preguntas correctamente y demuestra tu dominio en este módulo.</p>
          
          {/* Video Badge */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
            <p className="text-cyan-300 font-black text-sm mb-3">📺 VIDEO DE REPASO DISPONIBLE</p>
            <button
              onClick={() => handleWatchVideo(true)}
              className="w-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/50 hover:to-blue-500/50 border-2 border-cyan-500/60 text-cyan-300 hover:text-cyan-100 p-3 rounded-lg transition-all font-black text-sm"
            >
              📺 VER VIDEO ANTES DE EMPEZAR
            </button>
          </div>
          
          {/* Start Button */}
          <button
            onClick={() => {
              console.log('🎮 Iniciando nivel...');
              setShowStartScreen(false);
              setIsDoorOpening(false);
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 mb-3 shadow-lg"
          >
            ▶️ EMPEZAR NIVEL
          </button>
          
          <button
            onClick={onExit}
            className="w-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-black py-3 rounded-xl transition-all border border-white/20"
          >
            ← VOLVER
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative z-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-bounce">
            <Trophy className="w-12 h-12 text-white" fill="white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">¡MISIÓN CUMPLIDA!</h2>
          <p className="text-slate-400 mb-8 font-medium">Módulo: {topic.title}</p>
          
          <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Puntuación Total</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              +{score}
             </p>
          </div>
          
          <button onClick={onExit} className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg">
            VOLVER AL MAPA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-white overflow-hidden relative"
      style={{
        backgroundImage: `url(${gameLevelBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/60 -z-10"></div>
      
      <Confetti trigger={triggerConfetti} />
      
      {triggerConfetti && pointsToShow && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[200]">
          <div className="animate-points-bounce text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">
            {pointsToShow}
          </div>
        </div>
      )}

      {/* HUD Superior con Vidas */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center z-50 border-b border-white/10">
        <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16}/> <span className="hidden sm:inline">Abandonar</span>
        </button>
        
        {/* Corazones - Indicador en HUD */}
        <div className={`flex items-center gap-1.5 transition-all ${loseHeartAnimation ? 'animate-shake' : ''}`}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              {i < lives ? (
                <span className="text-xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">❤️</span>
              ) : (
                <span className="text-xl opacity-30">💔</span>
              )}
            </div>
          ))}
          <span className="text-xs font-mono text-slate-300 ml-2 font-bold">{lives}/5</span>
        </div>

        <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Pregunta</span>
          <span className="text-cyan-400 font-black text-xl tracking-widest">0{currentFloor + 1} / {String(topic.questions.length).padStart(2, '0')}</span>
        </div>

        <div className="bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg">
          <Zap size={16} className="text-yellow-400 fill-yellow-400" /> {score}
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 flex items-center justify-center relative px-4 py-12">
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-full max-w-2xl h-96 rounded-3xl border-8 border-cyan-500/30 flex">
            <div className={`flex-1 bg-gradient-to-r from-slate-800 to-slate-900 border-r-4 border-black transition-transform duration-700 ease-in-out ${isDoorOpening ? '-translate-x-full' : 'translate-x-0'}`}></div>
            <div className={`flex-1 bg-gradient-to-l from-slate-800 to-slate-900 border-l-4 border-black transition-transform duration-700 ease-in-out ${isDoorOpening ? 'translate-x-full' : 'translate-x-0'}`}></div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-3xl">
          {/* AQUÍ VAN LAS PREGUNTAS */}
        </div>
      </div>

      {/* Modal Pregunta */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-slate-900 border-2 border-cyan-500/50 w-full max-w-2xl rounded-3xl p-0 shadow-[0_0_80px_rgba(34,211,238,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden">
            
            {/* TIMER PROGRESS BAR */}
            <div className="w-full h-2 bg-slate-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  remainingTime > 20 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  remainingTime > 10 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                  'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                }`}
                style={{ width: `${(remainingTime / 30) * 100}%` }}
              ></div>
            </div>
            
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 border-b border-cyan-500/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow-lg"></div>
               
               {/* Primera fila: Protocolo + Vidas */}
               <div className="p-4 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                   <span className="text-cyan-300 font-mono text-sm tracking-widest uppercase font-bold">
                      Protocolo de Respuesta
                   </span>
                 </div>
                 
                 {/* Corazones prominentes en Modal */}
                 <div className={`flex items-center gap-1.5 transition-all ${loseHeartAnimation ? 'animate-shake' : ''}`}>
                   {[...Array(5)].map((_, i) => (
                     <span key={i} className={`text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] transition-all ${i < lives ? 'scale-100' : 'scale-75 opacity-40'}`}>
                       {i < lives ? '❤️' : '💔'}
                     </span>
                   ))}
                 </div>
               </div>
               
               {/* Segunda fila: Pregunta + Timer */}
               <div className="px-4 pb-4 flex justify-between items-center">
                 <span className="text-slate-400 font-mono text-sm">PREGUNTA {String(currentFloor + 1).padStart(2, '0')} / {String(topic.questions.length).padStart(2, '0')}</span>
                 <div className={`px-3 py-1 rounded-full font-black text-sm font-mono ${
                   remainingTime > 20 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' :
                   remainingTime > 10 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50' :
                   'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
                 }`}>
                   {remainingTime}s
                 </div>
               </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-10 leading-snug">
                 {topic.questions[currentFloor].q}
              </h3>

              <div className="space-y-4">
                {topic.questions[currentFloor].options.map((opt, idx) => (
                  <button
                     key={idx}
                    type="button"
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    style={{
                      animation: selectedOption === null ? `slide-in-left 0.3s ease-out ${idx * 50}ms both` : 'none',
                    }}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all text-base font-bold relative overflow-hidden group ${
                      selectedOption === null 
                        ? 'bg-slate-800/50 border-slate-600 text-slate-200 hover:scale-102 hover:bg-slate-700 hover:border-cyan-400 hover:text-white hover:shadow-[0_8px_32px_rgba(34,211,238,0.4)] cursor-pointer active:scale-95'
                        : selectedOption === idx
                          ? isCorrect 
                            ? `bg-emerald-900/60 border-emerald-500 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-glow-pulse-green ${!isCorrect ? 'animate-shake' : ''}`
                            : `bg-red-900/60 border-red-500 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-shake`
                          : idx === topic.questions[currentFloor].correct 
                            ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                            : 'opacity-30 border-transparent text-slate-500'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-5">
                        <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-black flex-shrink-0 transition-all ${
                         selectedOption === idx ? 'border-current bg-current/10' : 'border-slate-500 text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 group-hover:scale-110'
                       }`}>
                         {String.fromCharCode(65 + idx)}
                       </div>
                        <span>{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedOption !== null && (
                <div className={`mt-6 p-4 rounded-lg text-center font-black text-sm tracking-widest uppercase animate-in slide-in-from-bottom-2 transition-all ${
                  isCorrect 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                }`}>
                  <div className={`text-lg mb-2 transition-all ${isCorrect ? 'animate-bounce' : 'animate-shake'}`}>
                    {isCorrect ? "✅ CORRECTO" : "❌ INCORRECTO"}
                  </div>
                  
                  {showTimeBonus && (
                    <div className="text-sm text-cyan-300 mt-2 font-bold animate-bounce drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                      ⚡ {timeBonus}
                    </div>
                  )}
                  
                  {isCorrect && currentStreak >= 3 && (
                    <div className="text-xs text-orange-400 mt-2 font-bold drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">
                      🔥 RACHA x{currentStreak}
                    </div>
                  )}
                  {showStreakBonus && (
                    <div className="text-xs text-yellow-400 mt-1 font-bold animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                      ⭐ +20 BONUS RACHA!
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-400 mt-3 opacity-75">Siguiente pregunta en 1.5s...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Game Over por Vidas */}
      {showLivesGameOver && (
        <LivesGameOver
          topic={topic}
          onContinue={handleLivesGameOverContinue}
          onWatchVideo={handleWatchVideo}
          onUsePowerUp={handleUsePowerUp}
          hasPowerUp={false}
        />
      )}
    </div>
  );
};

export default GameLevel;
