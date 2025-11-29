import React, { useState, useEffect } from 'react';
import { Target, Play, Heart, Clock, SkipForward } from 'lucide-react';
import { TEAM_CONFIG, TOPICS } from '../data/constants';

const TeamQuest = ({ selectedTeam, selectedTopic, onQuestStart, onQuestComplete }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questState, setQuestState] = useState('menu'); // menu, playing, completed, failed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [teamHealth, setTeamHealth] = useState(100);
  const [timeLeft, setTimeLeft] = useState(5);
  const [questQuestions, setQuestQuestions] = useState([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);

  // Config de dificultades
  const difficultyConfig = {
    EASY: { name: "Fácil", questions: 8, xp: 200, coinMultiplier: 1, timePerQuestion: 3, damage: 5 },
    NORMAL: { name: "Normal", questions: 10, xp: 200, coinMultiplier: 1.5, timePerQuestion: 5, damage: 5 },
    HARD: { name: "Difícil", questions: 12, xp: 200, coinMultiplier: 2, timePerQuestion: 2, damage: 8 }
  };

  // Inicializar quest
  const startQuest = (difficulty) => {
    if (!selectedTopic) return;
    
    const topic = TOPICS[selectedTopic];
    const config = difficultyConfig[difficulty];
    
    // Seleccionar preguntas aleatorias
    const shuffled = [...topic.questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, config.questions);
    
    setSelectedDifficulty(difficulty);
    setQuestQuestions(selectedQuestions);
    setTeamHealth(100);
    setCurrentQuestion(0);
    setAnsweredCount(0);
    setTimeLeft(config.timePerQuestion);
    setQuestState('playing');
    setIsAnswering(false);
    onQuestStart(difficulty);
  };

  // Timer countdown
  useEffect(() => {
    if (questState !== 'playing' || isAnswering || !questQuestions.length) return;
    
    const config = difficultyConfig[selectedDifficulty];
    const timerDuration = config?.timePerQuestion || 5;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Tiempo agotado = respuesta incorrecta
          handleAnswer(null);
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [questState, isAnswering, selectedDifficulty, questQuestions]);

  // Manejar respuesta
  const handleAnswer = (selectedIndex) => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    const question = questQuestions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    const config = difficultyConfig[selectedDifficulty];
    const damage = config?.damage || 5;
    
    // Actualizar salud
    if (isCorrect) {
      setTeamHealth(prev => Math.min(100, prev + 10));
    } else {
      setTeamHealth(prev => Math.max(0, prev - damage));
    }
    
    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);
    
    // Esperar 1 segundo antes de pasar a siguiente pregunta
    setTimeout(() => {
      if (newAnsweredCount >= questQuestions.length) {
        // Quest completado
        completeQuest(true);
        return;
      }
      
      if (teamHealth <= 5 && !isCorrect) {
        // Equipo eliminado
        completeQuest(false);
        return;
      }
      
      // Siguiente pregunta
      setCurrentQuestion(prev => prev + 1);
      const nextConfig = difficultyConfig[selectedDifficulty];
      setTimeLeft(nextConfig?.timePerQuestion || 5);
      setIsAnswering(false);
    }, 1000);
  };

  // Completar quest
  const completeQuest = (won) => {
    const config = difficultyConfig[selectedDifficulty];
    const coins = Math.floor(100 * config.coinMultiplier);
    
    setQuestState(won ? 'completed' : 'failed');
    
    if (won) {
      onQuestComplete({
        difficulty: selectedDifficulty,
        xpReward: config.xp,
        coinReward: coins,
        teamSize: selectedTeam.members.length,
        questsCompleted: 1
      });
    }
  };

  // Menu de dificultades
  if (questState === 'menu') {
    if (!selectedTeam) {
      return (
        <div className="text-center py-8 text-slate-400">
          Selecciona un equipo para comenzar quests
        </div>
      );
    }

    if (!selectedTopic) {
      return (
        <div className="text-center py-8 text-slate-400">
          Selecciona un tema para comenzar quests
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h3 className="font-bold text-cyan-300 flex items-center gap-2">
          <Target size={18} /> Quests Disponibles
        </h3>

        {Object.entries(difficultyConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => startQuest(key)}
            className="w-full bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600 hover:border-purple-500/50 rounded-lg p-4 text-left transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{config.name}</p>
                <p className="text-xs text-slate-400">
                  {config.questions} preguntas • {config.xp} XP • {Math.floor(100 * config.coinMultiplier)} coins
                </p>
              </div>
              <Play size={20} className="text-cyan-400" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Quiz en progreso
  if (questState === 'playing' && questQuestions.length > 0) {
    const question = questQuestions[currentQuestion];
    const config = difficultyConfig[selectedDifficulty];
    
    // Seleccionar 2 opciones aleatorias (siempre incluir la correcta)
    const correctOption = question.options[question.correct];
    const otherOptions = question.options.filter((_, i) => i !== question.correct);
    const randomOtherOption = otherOptions[Math.floor(Math.random() * otherOptions.length)];
    
    const displayOptions = [correctOption, randomOtherOption].sort(() => Math.random() - 0.5);
    const correctIndex = displayOptions.indexOf(correctOption);
    
    // Color de salud
    let healthColor = 'from-green-500 to-emerald-500';
    if (teamHealth <= 50) healthColor = 'from-yellow-500 to-orange-500';
    if (teamHealth <= 20) healthColor = 'from-red-500 to-pink-500';

    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/50 rounded-xl p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-cyan-300">🎯 Team Quest: {selectedTopic >= 0 && TOPICS[selectedTopic]?.title}</h3>
          <div className="text-sm font-bold text-slate-300">
            {answeredCount + 1} / {config.questions}
          </div>
        </div>

        {/* Barra de Salud */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              <Heart size={18} className={teamHealth > 50 ? 'text-green-400' : teamHealth > 20 ? 'text-yellow-400' : 'text-red-400'} />
              Salud del Equipo
            </span>
            <span className="font-black text-lg" style={{
              color: teamHealth > 50 ? '#22c55e' : teamHealth > 20 ? '#eab308' : '#ef4444'
            }}>
              {teamHealth} / 100
            </span>
          </div>
          <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
            <div
              className={`h-full bg-gradient-to-r ${healthColor} transition-all duration-300`}
              style={{ width: `${teamHealth}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 justify-center">
          <Clock size={24} className={timeLeft <= 2 ? 'text-red-400 animate-pulse' : 'text-cyan-400'} />
          <div className="text-4xl font-black" style={{
            color: timeLeft <= 2 ? '#ef4444' : '#06b6d4'
          }}>
            {timeLeft}s
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 space-y-4">
          <p className="text-lg font-bold text-white">
            {question.q}
          </p>

          {/* Opciones - Modo Rápido (2 opciones) */}
          <div className="grid grid-cols-1 gap-3">
            {displayOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(correctIndex === idx ? question.correct : -1)}
                disabled={isAnswering}
                className={`p-4 rounded-lg font-bold text-left transition-all transform hover:scale-105 disabled:opacity-50 ${
                  isAnswering
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-700 hover:bg-slate-600 text-white hover:border-cyan-400 border-2 border-slate-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Info de equipo */}
        <div className="text-xs text-slate-400 text-center">
          {selectedTeam.members.join(', ')}
        </div>
      </div>
    );
  }

  // Pantalla de Victoria
  if (questState === 'completed') {
    const config = difficultyConfig[selectedDifficulty];
    const coins = Math.floor(100 * config.coinMultiplier);

    return (
      <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-2 border-emerald-500/50 rounded-xl p-8 text-center space-y-6">
        <h3 className="text-3xl font-black text-emerald-300">🎉 ¡QUEST COMPLETADO!</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">RECOMPENSAS</p>
            <div className="flex justify-around items-center">
              <div>
                <p className="text-2xl font-black text-cyan-300">{config.xp}</p>
                <p className="text-xs text-slate-400">XP</p>
              </div>
              <div>
                <p className="text-2xl font-black text-yellow-300">{coins}</p>
                <p className="text-xs text-slate-400">coins</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-300">+{questQuestions.length}</p>
                <p className="text-xs text-slate-400">preguntas</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 font-bold">Equipo: {selectedTeam.members.join(', ')}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setQuestState('menu');
            setSelectedDifficulty(null);
          }}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-3 rounded-lg transition"
        >
          Volver al Menú
        </button>
      </div>
    );
  }

  // Pantalla de Derrota
  if (questState === 'failed') {
    return (
      <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-2 border-red-500/50 rounded-xl p-8 text-center space-y-6">
        <h3 className="text-3xl font-black text-red-300">💀 ¡QUEST FALLIDO!</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-2">RESULTADO</p>
            <p className="text-2xl font-black text-red-300">Salud del Equipo: 0 HP</p>
            <p className="text-sm text-slate-400 mt-2">{answeredCount} / {questQuestions.length} preguntas respondidas</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 font-bold">Equipo: {selectedTeam.members.join(', ')}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setQuestState('menu');
            setSelectedDifficulty(null);
          }}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black py-3 rounded-lg transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return null;
};

export default TeamQuest;
