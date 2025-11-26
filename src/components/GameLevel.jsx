import React, { useState, useEffect } from 'react';
import { TOPICS } from '../data/constants';

export default function GameLevel({ topic, user, userData, studentId, onExit, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Mezclar y preparar preguntas aleatoriamente
  useEffect(() => {
    if (!topic) return;

    // Obtener módulos 1 y 2
    const module1 = TOPICS.find(t => t.id === 1);
    const module2 = TOPICS.find(t => t.id === 2);
    
    if (!module1 || !module2) return;

    // Combinar preguntas de ambos módulos
    const allQuestions = [...module1.questions, ...module2.questions];
    
    // Limitar a 25 preguntas totales
    const limitedQuestions = allQuestions.slice(0, 25);
    
    // Barajar aleatoriamente
    const shuffled = [...limitedQuestions].sort(() => Math.random() - 0.5);
    
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [topic]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setAnswered(true);

    if (optionIndex === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowResult(false);
    } else {
      // Calcular puntos (1 punto por pregunta correcta)
      const pointsEarned = score * 100;
      onComplete(topic.id, pointsEarned, studentId);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center text-white">
          <p className="text-xl">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

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
              Pregunta {currentIndex + 1}/{questions.length}
            </span>
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
            Puntuación: <span className="text-blue-400">{score}/{questions.length}</span>
          </p>
        </div>

        {/* Next button */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
          >
            {isLastQuestion ? '🏁 Completar' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}
