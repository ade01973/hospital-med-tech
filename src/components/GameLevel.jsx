import React, { useState, useEffect } from 'react';
import { TOPICS } from '../data/constants';

export default function GameLevel({ topic, user, userData, studentId, onExit, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // Preparar 10 preguntas aleatorias SOLO del módulo actual
  useEffect(() => {
    if (!topic) return;

    // Buscar el módulo específico
    const currentModule = TOPICS.find(t => t.id === topic.id);
    if (!currentModule || !currentModule.questions) return;

    // Seleccionar 10 preguntas aleatorias del módulo
    const allQuestions = [...currentModule.questions];
    const selectedQuestions = [];
    
    // Fisher-Yates shuffle para seleccionar 10 aleatorias
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
  }, [topic]);

  // Cronómetro de 15 segundos
  useEffect(() => {
    if (answered || !currentIndex || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Pasar automáticamente a la siguiente pregunta
          handleNextQuestion();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answered, currentIndex, questions.length]);

  // Reset timer cuando cambia la pregunta
  useEffect(() => {
    if (!answered) {
      setTimeLeft(15);
    }
  }, [currentIndex, answered]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered(true);

    if (optionIndex === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowResult(false);
      setTimeLeft(15);
    } else {
      // Completar el módulo
      const pointsEarned = score * 100;
      onComplete(topic.id, pointsEarned, studentId);
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

  const progress = ((currentIndex + 1) / 10) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Color del cronómetro según tiempo restante
  let timerColor = 'text-blue-400';
  if (timeLeft <= 5) timerColor = 'text-red-500';
  else if (timeLeft <= 10) timerColor = 'text-yellow-400';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onExit}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
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

          {/* Progress bar */}
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

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !answered && handleAnswer(index)}
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

        {/* Next button */}
        {answered && (
          <button
            onClick={handleNextQuestion}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
          >
            {isLastQuestion ? '🏁 Completar' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
