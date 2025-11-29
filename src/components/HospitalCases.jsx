import React, { useState } from 'react';
import { HOSPITAL_CASES, getCompletedCases, markCaseAsCompleted } from '../data/cases';
import { X, CheckCircle } from 'lucide-react';

/**
 * HospitalCases - Healthcare Management Story Arc Component
 * Modal con 8 casos narrativos + sistema de decisiones
 */
const HospitalCases = ({ onClose, onCaseComplete }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const completedCases = getCompletedCases();

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const currentCase = HOSPITAL_CASES[selectedCase];
    const selectedOpt = currentCase.options[selectedOption];
    setShowResult(true);

    // Marcar caso como completado
    markCaseAsCompleted(currentCase.id);

    // Notificar al padre sobre XP ganado
    if (onCaseComplete) {
      onCaseComplete({
        caseId: currentCase.id,
        xp: selectedOpt.xp,
        isCorrect: selectedOpt.correct,
        impact: currentCase.impact
      });
    }
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelectedOption(null);
    setSelectedCase(null);
  };

  // Vista de resultado
  if (selectedCase !== null && showResult) {
    const currentCase = HOSPITAL_CASES[selectedCase];
    const selectedOpt = currentCase.options[selectedOption];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className={`bg-gradient-to-b ${selectedOpt.correct ? 'from-emerald-900 to-slate-800' : 'from-red-900 to-slate-800'} border-2 ${selectedOpt.correct ? 'border-emerald-500' : 'border-red-500'}/50 rounded-3xl shadow-2xl max-w-lg w-full p-8`}>
          <div className="text-center">
            <div className={`text-6xl mb-4 ${selectedOpt.correct ? 'animate-bounce' : 'animate-shake'}`}>
              {selectedOpt.correct ? '✅' : '❌'}
            </div>
            <h3 className={`text-2xl font-black mb-3 ${selectedOpt.correct ? 'text-emerald-300' : 'text-red-300'}`}>
              {selectedOpt.correct ? '¡Decisión Correcta!' : 'Decisión No Óptima'}
            </h3>
            <p className="text-slate-200 mb-4">
              {selectedOpt.correct ? currentCase.impact : "Hay una opción mejor para esta situación"}
            </p>
            <p className={`text-2xl font-black mb-6 ${selectedOpt.correct ? 'text-emerald-400' : 'text-red-400'}`}>
              {selectedOpt.xp > 0 ? `+${selectedOpt.xp} XP` : `${selectedOpt.xp} XP`}
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-3 rounded-xl transition transform hover:scale-105"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de caso seleccionado
  if (selectedCase !== null && !showResult) {
    const currentCase = HOSPITAL_CASES[selectedCase];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentCase.emoji}</span>
              <h3 className="text-2xl font-black text-white">{currentCase.title}</h3>
            </div>
            <button
              onClick={() => setSelectedCase(null)}
              className="text-slate-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Descripción */}
          <p className="text-slate-200 mb-6 text-lg leading-relaxed">
            {currentCase.description}
          </p>

          {/* Opciones */}
          <div className="space-y-3 mb-6">
            {currentCase.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full p-4 rounded-lg border-2 transition transform hover:scale-102 ${
                  selectedOption === index
                    ? 'bg-cyan-500/30 border-cyan-500 text-cyan-100'
                    : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center flex-shrink-0 ${
                    selectedOption === index ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'
                  }`}>
                    {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-left font-semibold">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Botón Submit */}
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl transition transform hover:scale-105"
          >
            Tomar Decisión
          </button>
        </div>
      </div>
    );
  }

  // Vista principal - Lista de casos
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏥</span>
            <h2 className="text-3xl font-black text-white">Hospital Cases</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Info */}
        <p className="text-slate-400 mb-6">
          Resuelve situaciones de gestión hospitalaria. Tus decisiones impactan la narrativa.
        </p>

        {/* Lista de Casos */}
        <div className="space-y-3">
          {HOSPITAL_CASES.map((caseItem, index) => {
            const isCompleted = completedCases[caseItem.id];
            return (
              <button
                key={caseItem.id}
                onClick={() => !isCompleted && setSelectedCase(index)}
                disabled={isCompleted}
                className={`w-full p-4 rounded-lg border-2 transition transform hover:scale-102 text-left ${
                  isCompleted
                    ? 'bg-emerald-900/30 border-emerald-500/50 cursor-not-allowed'
                    : 'bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{caseItem.emoji}</span>
                  <div className="flex-1">
                    <h4 className={`font-black ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                      {caseItem.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{caseItem.description.substring(0, 60)}...</p>
                  </div>
                  {isCompleted && (
                    <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            Completados: {Object.keys(completedCases).length} / {HOSPITAL_CASES.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalCases;
