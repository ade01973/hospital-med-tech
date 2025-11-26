import React, { useState, useEffect, useRef } from 'react';
import { TOPICS } from '../data/constants';
import useSoundEffects from '../hooks/useSoundEffects';
import { useGestCoins } from '../hooks/useGestCoins';
import ReviewOrDashboard from './ReviewOrDashboard';

export default function GameLevel({ topic, user, userData, studentId, onExit, onComplete, videoId }) {
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

  const { playSuccess, playError, playVictory } = useSoundEffects();
  const { earnCoins } = useGestCoins();
  const completedRef = useRef(false);

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
    completedRef.current = false;
  }, [topic]);

  const currentQuestion = questions[currentIndex];

  // Función para avanzar a la siguiente pregunta
  const advanceQuestion = () => {
    const nextIndex = currentIndex + 1;
    
    // Si es la última pregunta, completar el módulo
    if (nextIndex >= questions.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsCompleted(true);
        playVictory();
        earnCoins(score * 10, `Respuestas correctas: ${score}/10`);
        
        // Mostrar pantalla de elección después de un pequeño delay
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
  };

  const handleViewReview = () => {
    setShowReviewVideo(true);
  };

  const handleGoToDashboard = () => {
    const pointsEarned = score * 100;
    onComplete(topic.id, pointsEarned, studentId);
  };

  // Cronómetro - solo cuando NO ha respondido y el quiz no está completado
  useEffect(() => {
    if (answered || isCompleted || questions.length === 0 || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          advanceQuestion();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, isCompleted, currentQuestion, questions.length]);

  // Auto-avance 2 segundos después de responder
  useEffect(() => {
    if (!answered || isCompleted || questions.length === 0) return;

    const timer = setTimeout(() => {
      advanceQuestion();
    }, 2000);

    return () => clearTimeout(timer);
  }, [answered, isCompleted, questions.length]);

  const handleAnswer = (optionIndex) => {
    if (answered || isCompleted) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered(true);

    if (optionIndex === currentQuestion.correct) {
      setScore(prev => prev + 1);
      setTimeout(() => playSuccess(), 100);
    } else {
      setTimeout(() => playError(), 100);
    }
  };

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center text-white">
          <p className="text-xl">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  // Mostrar video de repaso si se seleccionó esa opción
  if (showReviewVideo && videoId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <button
            onClick={() => {
              const pointsEarned = score * 100;
              onComplete(topic.id, pointsEarned, studentId);
            }}
            className="mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            ← Finalizar
          </button>
          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Video de repaso"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / 10) * 100;
  let timerColor = 'text-blue-400';
  if (timeLeft <= 5) timerColor = 'text-red-500';
  else if (timeLeft <= 10) timerColor = 'text-yellow-400';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4">
      {/* Review Choice Modal */}
      <ReviewOrDashboard
        isOpen={showReviewChoice}
        score={score}
        totalQuestions={questions.length}
        topic={topic}
        videoId={videoId}
        onViewVideo={handleViewReview}
        onGoToDashboard={handleGoToDashboard}
        onClose={() => setShowReviewChoice(false)}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              disabled={isCompleted}
            >
              ← Salir
            </button>
            <span className="text-white font-bold text-lg">
              Pregunta {currentIndex + 1}/10
            </span>
            <div className={`text-3xl font-bold ${timerColor} w-16 text-center`}>
              {timeLeft}s
            </div>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
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
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                  !answered
                    ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                    : index === currentQuestion.correct
                    ? 'bg-green-600 text-white'
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
              : 'bg-red-900 text-red-200'
          }`}>
            {selectedAnswer === currentQuestion.correct ? '✓ ¡Correcto!' : '✗ Respuesta incorrecta'}
          </div>
        )}

        {/* Score display */}
        <div className="text-center mb-6">
          <p className="text-white text-lg font-semibold">
            Puntuación: <span className="text-blue-400">{score}/10</span>
          </p>
        </div>
      </div>
    </div>
  );
}
