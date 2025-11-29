import React, { useState, useEffect } from 'react';
import { getCurrentCase, completeCurrentCase, getSessionProgress, resetCaseSession, getFullReward, getCaseSession } from '../data/cases';
import { X, CheckCircle } from 'lucide-react';
import ConfettiCelebration from './ConfettiCelebration';
import { useGestCoins } from '../hooks/useGestCoins';

/**
 * HospitalCases - Healthcare Management Story Arc Component
 * Modal con 8 casos narrativos + sistema de decisiones
 */
const HospitalCases = ({ onClose, onCaseComplete }) => {
  const { earnCoins } = useGestCoins();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentCase, setCurrentCase] = useState(() => getCurrentCase());
  const [progress, setProgress] = useState(() => getSessionProgress());
  const [resultData, setResultData] = useState(null);
  const [rewardData, setRewardData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setCurrentCase(getCurrentCase());
    setProgress(getSessionProgress());
  }, []);

  const handleSelectOption = (index) => {
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentCase) return;

    const selectedOpt = currentCase.options[selectedOption];
    setResultData({ option: selectedOpt, isCorrect: selectedOpt.correct });
    setShowResult(true);

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
    const result = completeCurrentCase(resultData.isCorrect);
    
    setShowResult(false);
    setSelectedOption(null);
    setResultData(null);

    // Si se completaron todos con respuestas correctas
    if (result.reward) {
      // Dar gestcoins
      earnCoins(result.reward.gestcoins, `Ronda perfecta de Hospital Cases - ${result.reward.title}`);
      
      setRewardData(result.reward);
      setShowReward(true);
      setShowCelebration(true);
      return;
    }

    // Si hay más casos, mostrar el siguiente
    if (result.nextCase) {
      setCurrentCase(result.nextCase);
      setProgress(getSessionProgress());
    } else {
      // Ronda completada, reiniciar para la siguiente
      const newSession = resetCaseSession();
      setCurrentCase(getCurrentCase());
      setProgress(getSessionProgress());
    }
  };

  // Vista de recompensa final
  if (showReward && rewardData) {
    const isLevel2 = rewardData.level === 2;
    return (
      <>
        {showCelebration && <ConfettiCelebration trigger={true} celebrationType="rank" numberOfPieces={500} />}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`bg-gradient-to-br ${isLevel2 ? 'from-red-900 to-black' : 'from-amber-900 to-purple-900'} border-2 ${isLevel2 ? 'border-red-400/70' : 'border-yellow-400/70'} rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center`}>
            <div className="text-7xl mb-6 animate-bounce">{rewardData.icon}</div>
            <h2 className={`text-4xl font-black mb-4 ${isLevel2 ? 'text-red-200' : 'text-yellow-100'}`}>{rewardData.title}</h2>
            <p className={`text-lg mb-6 ${isLevel2 ? 'text-red-100' : 'text-white/90'}`}>{rewardData.message}</p>
            
            {isLevel2 && (
              <p className="text-sm mb-4 px-3 py-2 bg-red-950/70 rounded-lg text-red-200 font-bold">
                ⚠️ ¡Has desbloqueado NIVEL 2 - CASOS CASI IMPOSIBLES!
              </p>
            )}
            
            <div className="space-y-3 mb-8">
              <p className={`text-3xl font-black ${isLevel2 ? 'text-red-300' : 'text-emerald-300'}`}>
                +{rewardData.xp} XP
              </p>
              <p className={`text-2xl font-black ${isLevel2 ? 'text-red-400 bg-red-950/50' : 'text-yellow-400 bg-amber-900/50'} rounded-lg py-2`}>
                💸 +{rewardData.gestcoins} GestCoins
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowReward(false);
                setShowCelebration(false);
                resetCaseSession();
                onClose();
              }}
              className={`w-full ${isLevel2 ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500' : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400'} text-black font-black py-4 rounded-xl transition transform hover:scale-105 text-lg`}
            >
              ¡INCREÍBLE! → {isLevel2 ? 'Nuevos Casos Imposibles' : 'Nuevos Casos'}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Vista de resultado
  if (showResult && resultData && currentCase) {
    const selectedOpt = resultData.option;

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

  // Vista de caso - Auto mostrar cuando se abre
  if (currentCase && !showResult && !showReward) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentCase.emoji}</span>
              <div>
                <h3 className="text-2xl font-black text-white">{currentCase.title}</h3>
                <p className="text-xs text-cyan-400">Caso {progress.completed + 1} de {progress.total}</p>
              </div>
            </div>
            <button
              onClick={onClose}
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

};

export default HospitalCases;
