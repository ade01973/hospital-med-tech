import React, { useState, useEffect, useRef } from 'react';
import { TOPICS } from '../data/constants';
import useSoundEffects from '../hooks/useSoundEffects';
import { useGestCoins } from '../hooks/useGestCoins';
import LivesGameOver from './LivesGameOver';

// Componente de puntos flotantes
const FloatingPoints = ({ points, isCorrect, x, y }) => {
  return (
    <div
      className="fixed pointer-events-none z-50 animate-float-up"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div 
        className={`text-4xl font-black ${
          isCorrect ? 'text-green-400' : 'text-[#FF3B3B]'
        } drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]`}
        style={!isCorrect ? {
          textShadow: '0 0 10px rgba(255, 59, 59, 0.8), 0 0 20px rgba(255, 59, 59, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.9)'
        } : {}}
      >
        {isCorrect ? '+' : ''}{points}
      </div>
    </div>
  );
};

// Componente de mensaje de racha
const StreakMessage = ({ streak }) => {
  if (streak < 2) return null;

  let message = '';
  let color = '';

  if (streak >= 5) {
    message = '¡IMPARABLE! 🔥';
    color = 'from-orange-500 to-red-500';
  } else if (streak === 4) {
    message = '¡4 SEGUIDAS! 🔥';
    color = 'from-yellow-500 to-orange-500';
  } else if (streak === 3) {
    message = '¡3 EN RACHA! 🔥';
    color = 'from-yellow-400 to-yellow-500';
  } else if (streak === 2) {
    message = '¡2 SEGUIDAS!';
    color = 'from-blue-400 to-blue-500';
  }

  return (
    <div className={`bg-gradient-to-r ${color} text-white px-6 py-2 rounded-full font-black text-lg shadow-lg animate-bounce`}>
      {message}
    </div>
  );
};

export default function GameLevel({ topic, user, userData, studentId, onExit, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReviewChoice, setShowReviewChoice] = useState(false);
  const [showReviewVideo, setShowReviewVideo] = useState(false);

  // 🎮 GAMIFICACIÓN
  const [lives, setLives] = useState(5);
  const [streak, setStreak] = useState(0);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [shakeLife, setShakeLife] = useState(false);

  const { playSuccess, playError, playVictory } = useSoundEffects();
  const { earnCoins } = useGestCoins();
  const completedRef = useRef(false);
  const floatingPointsIdRef = useRef(0);

  // Preparar 10 preguntas aleatorias SOLO del módulo actual
  useEffect(() => {
    if (!topic) return;

    const currentModule = TOPICS.find(t => t.id === topic.id);
    if (!currentModule || !currentModule.questions) return;

    const allQuestions = [...currentModule.questions];
    const selectedQuestions = [];

    for (let i = 0; i < Math.min(10, allQuestions.length); i++) {
      const randomIndex = Math.floor(Math.random() * (allQuestions.length - i)) + i;
      [allQuestions[i], allQuestions[randomIndex]] = [allQuestions[randomIndex], allQuestions[i]];
      selectedQuestions.push(allQuestions[i]);
    }

    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setIsCompleted(false);
    setLives(5);
    setStreak(0);
    completedRef.current = false;
  }, [topic]);

  const currentQuestion = questions[currentIndex];

  // Función para mostrar puntos flotantes
  const showFloatingPoints = (points, isCorrect, event) => {
    const id = floatingPointsIdRef.current++;
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setFloatingPoints(prev => [...prev, { id, points, isCorrect, x, y }]);

    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1500);
  };

  // Función para avanzar a la siguiente pregunta
  const advanceQuestion = () => {
    const nextIndex = currentIndex + 1;

    // Si es la última pregunta, completar el módulo
    if (nextIndex >= questions.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsCompleted(true);
        playVictory();
        const pointsEarned = score;
        earnCoins(score / 10, `Respuestas correctas en ${topic.title}`);

        // Mostrar modal de opciones después de completar
        setTimeout(() => {
          setShowReviewChoice(true);
        }, 1000);
      }
      return;
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
    setTimeLeft(15);
    setShowStreakMessage(false);
  };

  // Cronómetro - solo cuando NO ha respondido y el quiz no está completado
  useEffect(() => {
    if (answered || isCompleted || questions.length === 0 || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Tiempo agotado: contar como respuesta incorrecta
          handleTimeOut();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, isCompleted, currentQuestion, questions.length, currentIndex]);

  // Manejar timeout (tiempo agotado)
  const handleTimeOut = () => {
    if (answered) return;

    setAnswered(true);
    setShowResult(true);
    setSelectedAnswer(null);

    // Perder vida y resetear racha
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    setShakeLife(true);
    setTimeout(() => setShakeLife(false), 500);

    playError();

    // Auto-avance después de 2 segundos
    setTimeout(() => {
      if (newLives <= 0) {
        // Game Over se maneja en el render
        return;
      }
      advanceQuestion();
    }, 2000);
  };

  // Auto-avance 2 segundos después de responder
  useEffect(() => {
    if (!answered || isCompleted || questions.length === 0) return;

    const timer = setTimeout(() => {
      if (lives > 0) {
        advanceQuestion();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [answered, isCompleted, questions.length, lives]);

  const handleAnswer = (optionIndex, event) => {
    if (answered || isCompleted) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correct;

    if (isCorrect) {
      // 🎯 RESPUESTA CORRECTA

      // Incrementar racha
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Mostrar mensaje de racha
      if (newStreak >= 2) {
        setShowStreakMessage(true);
        setTimeout(() => setShowStreakMessage(false), 2000);
      }

      // Calcular puntos según tiempo restante
      let basePoints = 100;
      if (timeLeft > 10) {
        basePoints = 200;
      } else if (timeLeft > 5) {
        basePoints = 150;
      }

      // Bonificación por racha
      let bonusPoints = 0;
      if (newStreak >= 3) {
        bonusPoints = 50;
      }

      const totalPoints = basePoints + bonusPoints;
      setScore(prev => prev + totalPoints);

      // Mostrar puntos flotantes
      showFloatingPoints(totalPoints, true, event);

      setTimeout(() => playSuccess(), 100);
    } else {
      // ❌ RESPUESTA INCORRECTA

      // Perder vida
      const newLives = lives - 1;
      setLives(newLives);

      // Resetear racha
      setStreak(0);

      // Animación de shake
      setShakeLife(true);
      setTimeout(() => setShakeLife(false), 500);

      // Mostrar puntos negativos
      showFloatingPoints(-50, false, event);

      setTimeout(() => playError(), 100);
    }
  };

  // 💔 GAME OVER - Mostrar modal de vidas
  if (lives <= 0 && !isCompleted) {
    return (
      <LivesGameOver
        topic={topic}
        onContinue={(recoveredLives) => {
          setLives(recoveredLives);
          setAnswered(false);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }}
        onWatchVideo={() => {
          console.log('🎬 Usuario eligió ver video');
          // Aquí se puede implementar la lógica del video
          // Por ahora, recuperamos 2 vidas
          setLives(2);
          setAnswered(false);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }}
        onUsePowerUp={() => {
          console.log('⚡ Usuario usó power-up');
          setLives(5);
          setAnswered(false);
          setShowResult(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }}
        hasPowerUp={false} // Aquí se puede conectar con el sistema de power-ups real
      />
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center text-white">
          <p className="text-xl">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / 10) * 100;
  let timerColor = 'text-blue-400';
  if (timeLeft <= 5) timerColor = 'text-red-500';
  else if (timeLeft <= 10) timerColor = 'text-yellow-400';


    // Handlers para el modal de revisión
    const handleWatchReviewVideo = () => {
      setShowReviewChoice(false);
      setShowReviewVideo(true);
    };

    const handleCloseReviewVideo = () => {
      setShowReviewVideo(false);
      setShowReviewChoice(true);
    };

  const handleGoToDashboard = () => {
    // Guardar el progreso antes de salir
    onComplete(topic.id, score, studentId);
    // Luego salir al dashboard
    onExit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 relative">
      {/* Puntos flotantes */}
      {floatingPoints.map(fp => (
        <FloatingPoints
          key={fp.id}
          points={fp.points}
          isCorrect={fp.isCorrect}
          x={fp.x}
          y={fp.y}
        />
      ))}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleGoToDashboard}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              disabled={isCompleted}
            >
              ← Salir
            </button>

            {/* Vidas */}
            <div className={`flex gap-1 ${shakeLife ? 'animate-shake' : ''}`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < lives ? '❤️' : '🤍'}
                </span>
              ))}
            </div>

            <div className={`text-3xl font-bold ${timerColor} w-16 text-center`}>
              {timeLeft}s
            </div>
          </div>

          {/* Badge de racha */}
          {streak > 0 && (
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full font-bold text-sm">
                🔥 {streak} en racha
              </div>
            </div>
          )}

          {/* Mensaje de racha */}
          {showStreakMessage && (
            <div className="flex justify-center mb-3">
              <StreakMessage streak={streak} />
            </div>
          )}

          {/* Progreso */}
          <div className="mb-2">
            <div className="flex justify-between text-white text-sm mb-1">
              <span>Pregunta {currentIndex + 1}/10</span>
              <span className="font-bold text-yellow-400">{score} pts</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl md:text-2xl text-white font-bold mb-6 leading-relaxed">
            {currentQuestion.q}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={(e) => handleAnswer(index, e)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                  !answered
                    ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer transform hover:scale-[1.02]'
                    : index === currentQuestion.correct
                    ? 'bg-green-600 text-white scale-[1.02]'
                    : index === selectedAnswer
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-opacity-20 bg-white rounded-full mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className={`p-4 rounded-lg mb-6 font-semibold text-lg ${
            selectedAnswer === currentQuestion.correct
              ? 'bg-green-900 text-green-200'
              : selectedAnswer === null
              ? 'bg-orange-900 text-orange-200'
              : 'bg-red-900 text-red-200'
          }`}>
            {selectedAnswer === currentQuestion.correct
              ? '✓ ¡Correcto!'
              : selectedAnswer === null
              ? '⏱️ ¡Tiempo agotado!'
              : '✗ Respuesta incorrecta'}
          </div>
        )}
      </div>
    </div>
  );

    {/* Modal de revisión o dashboard */}
    {showReviewChoice && (
      <ReviewOrDashboard
        onWatchVideo={handleWatchReviewVideo}
        onGoToDashboard={handleGoToDashboard}
        onClose={() => setShowReviewChoice(false)}
      />
    )}

    {/* Video de repaso */}
    {showReviewVideo && topic.reviewVideoId && (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="relative w-full h-full max-w-6xl max-h-screen p-8">
          <button
            onClick={handleCloseReviewVideo}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
          >
            ×
          </button>
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${topic.reviewVideoId}?autoplay=1`}
            title="Video de Repaso"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )}

}