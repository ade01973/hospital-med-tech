import React, { useState } from 'react';
import { ArrowLeft, Zap, Trophy, Activity, Lock, CheckCircle, Play } from 'lucide-react';
import { User } from 'lucide-react';

const GameLevel = ({ topic, user, studentId, onExit, onComplete }) => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

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
    setSelectedOption(optionIndex);
    const correct = topic.questions[currentFloor].correct === optionIndex;
    setIsCorrect(correct);
    if (correct) {
      const pointsEarned = 100;
      setScore(prev => prev + pointsEarned);
      setTimeout(() => {
        setShowModal(false);
        const nextFloor = currentFloor + 1;
        
        if (nextFloor === floors.length) {
          setCompleted(true);
          setTimeout(() => onComplete(topic.id, score + pointsEarned, studentId), 500);
        } else {
          setCurrentFloor(nextFloor);
        }
       }, 1500);
    }
  };

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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* HUD Superior */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center z-50 border-b border-white/10 sticky top-0">
        <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16}/> <span className="hidden sm:inline">Abandonar</span>
        </button>
        <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Planta</span>
          <span className="text-cyan-400 font-black text-xl tracking-widest">0{currentFloor + 1} / 05</span>
        </div>
        <div className="bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg">
          <Zap size={16} className="text-yellow-400 fill-yellow-400" /> {score}
        </div>
      </div>

      {/* Escenario Vertical (Hospital Tower) */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
        <div className="max-w-md mx-auto min-h-full flex flex-col-reverse justify-start py-20 px-6 gap-12 pb-32">
          
          {floors.map((q, index) => {
            const isCurrent = index === currentFloor;
            const isCompleted = index < currentFloor;
            const isLocked = index > currentFloor;
            return (
              <div 
                key={index} 
                className={`relative transition-all duration-700 ${isCurrent ? 'scale-105 z-10' : 'opacity-40 scale-95 grayscale blur-[1px]'}`}
              >
                {/* Estructura de la Planta */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 relative shadow-2xl">
                  
                  {/* Etiqueta de Piso */}
                  <div className="absolute -left-4 top-8 bg-slate-950 text-slate-500 px-3 py-2 text-xs font-black rounded-r border-y border-r border-slate-800 shadow-md tracking-widest writing-vertical-lr transform -rotate-180">
                     PISO 0{index + 1}
                  </div>

                  {/* Interior de la Planta */}
                  <div className="bg-gradient-to-b from-slate-800 to-slate-900 h-40 rounded-xl flex items-end justify-center relative overflow-hidden border border-white/5">
                     
                    {/* Decoración de fondo */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* La Puerta */}
                    <button 
                      onClick={() => handleDoorClick(index)}
                      disabled={!isCurrent}
                      className={`relative mb-0 transition-all duration-500 group ${
                        isCurrent ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {/* Marco de puerta */}
                      <div className={`w-32 h-32 transition-colors duration-500
                         ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-950'} 
                        border-4 ${isCurrent ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-slate-700'} 
                        rounded-t-xl flex items-end justify-center relative overflow-hidden`}
                      >
                        
                         {/* Puertas físicas */}
                        <div className={`absolute inset-0 flex transition-transform duration-700 ease-in-out ${isDoorOpening || isCompleted ? 'scale-x-0 opacity-0' : 'scale-x-100'}`}>
                          <div className="w-1/2 h-full bg-slate-800 border-r border-black flex items-center justify-end pr-2 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]">
                            {isLocked && <Lock size={12} className="text-slate-600" />}
                           </div>
                          <div className="w-1/2 h-full bg-slate-800 border-l border-slate-700 flex items-center pl-2 bg-[linear-gradient(-45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]">
                            {isCurrent && !isDoorOpening && <div className="w-12 h-1 bg-red-500 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2"></div>}
                           </div>
                        </div>

                        {/* Interior de la puerta */}
                        <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/5">
                            {isCompleted ? <CheckCircle className="text-emerald-500 w-12 h-12" /> : 
                            isCurrent ? <Play className="text-cyan-400 w-12 h-12 animate-pulse fill-cyan-400/20" /> : null}
                        </div>
                      </div>
                    </button>

                    {/* Personaje (Avatar) */}
                    {isCurrent && (
                      <div className="absolute bottom-0 right-6 animate-bounce duration-1000 z-20">
                         <div className="bg-cyan-500 p-2 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                            <User className="text-white w-6 h-6" />
                         </div>
                      </div>
                    )}
                  </div>
                 </div>
              </div>
            );
          })}
          
          {/* Suelo base */}
          <div className="text-center text-slate-700 font-black text-xs mt-4 uppercase tracking-[0.5em]">Lobby Principal</div>
        </div>
      </div>

      {/* Modal Pregunta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-cyan-500/30 w-full max-w-lg rounded-2xl p-0 shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-slate-950 p-4 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
               <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2 font-bold">
                  <Activity size={14} className="animate-pulse"/> Protocolo de Respuesta
               </span>
               <span className="text-slate-500 font-mono text-xs">SEC-{currentFloor + 1}</span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-8 leading-snug">
                 {topic.questions[currentFloor].q}
              </h3>

              <div className="space-y-3">
                {topic.questions[currentFloor].options.map((opt, idx) => (
                  <button
                     key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-bold relative overflow-hidden group ${
                      selectedOption === null 
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : selectedOption === idx
                          ? isCorrect 
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400'
                            : 'bg-red-950/50 border-red-500 text-red-400'
                          : idx === topic.questions[currentFloor].correct 
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-600' 
                            : 'opacity-20 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-black ${
                         selectedOption === idx ? 'border-current' : 'border-slate-600 text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-400'
                       }`}>
                         {String.fromCharCode(65 + idx)}
                       </div>
                        {opt}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedOption !== null && (
                <div className={`mt-6 p-4 rounded-lg text-center font-black text-sm tracking-widest uppercase animate-in slide-in-from-bottom-2 ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                  {isCorrect ? ">> ACCESO CONCEDIDO <<" : ">> ERROR CRÍTICO <<"}
                  {!isCorrect && (
                     <button 
                        onClick={() => {
                            setSelectedOption(null);
                            setIsCorrect(null);
                         }}
                        className="block mx-auto mt-3 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white underline"
                    >
                        Reiniciar Simulación
                     </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLevel;
