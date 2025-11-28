import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Crown, Building2 } from 'lucide-react';

/**
 * AdvancedMilestoneTimeline - Línea de tiempo interactiva de hitos
 * Muestra progresión: Estudiante → Enfermera → Jefa → Directora
 */
const AdvancedMilestoneTimeline = ({ currentRank = 'Estudiante' }) => {
  const milestones = [
    {
      id: 1,
      title: 'Estudiante',
      description: 'Inicio del camino',
      icon: Users,
      minScore: 0,
      color: 'from-blue-500 to-cyan-500',
      unlocked: true,
    },
    {
      id: 2,
      title: 'Enfermera',
      description: 'Cuidadora certificada',
      icon: Stethoscope,
      minScore: 500,
      color: 'from-cyan-500 to-teal-500',
      unlocked: currentRank === 'Enfermera' || currentRank === 'Jefa' || currentRank === 'Directora',
    },
    {
      id: 3,
      title: 'Jefa',
      description: 'Lideranza clínica',
      icon: Crown,
      minScore: 1500,
      color: 'from-teal-500 to-emerald-500',
      unlocked: currentRank === 'Jefa' || currentRank === 'Directora',
    },
    {
      id: 4,
      title: 'Directora',
      description: 'Máxima autoridad',
      icon: Building2,
      minScore: 3000,
      color: 'from-emerald-500 to-green-500',
      unlocked: currentRank === 'Directora',
    },
  ];

  const [animateIndex, setAnimateIndex] = useState(-1);

  useEffect(() => {
    const currentIndex = milestones.findIndex(m => m.title === currentRank);
    if (currentIndex !== -1) {
      setAnimateIndex(currentIndex);
    }
  }, [currentRank]);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-6 border border-cyan-500/20">
      <h3 className="text-lg font-black text-white mb-8 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        Progresión de Rango
      </h3>

      <div className="flex items-center justify-between relative">
        {/* Línea de conexión de fondo */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-slate-700 via-cyan-600/40 to-slate-700 -z-10"></div>

        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon;
          const isUnlocked = milestone.unlocked;
          const isCurrent = milestone.title === currentRank;

          return (
            <div key={milestone.id} className="flex flex-col items-center relative flex-1">
              {/* Icono del hito */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-500 ${
                  isCurrent
                    ? `bg-gradient-to-br ${milestone.color} shadow-lg animate-pulse`
                    : isUnlocked
                    ? `bg-gradient-to-br ${milestone.color}/60 border-2 border-cyan-400/50`
                    : 'bg-slate-700/50 border-2 border-slate-600 opacity-60'
                } ${idx === animateIndex ? 'animate-bounce' : ''}`}
              >
                <Icon
                  size={32}
                  className={`${isCurrent || isUnlocked ? 'text-white' : 'text-slate-500'}`}
                />
              </div>

              {/* Etiqueta del hito */}
              <div className="text-center">
                <h4 className={`font-black text-sm ${isCurrent ? 'text-cyan-300' : isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {milestone.title}
                </h4>
                <p className={`text-xs ${isCurrent ? 'text-cyan-200' : isUnlocked ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                  {milestone.description}
                </p>
              </div>

              {/* Indicador de "ACTUAL" */}
              {isCurrent && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-black whitespace-nowrap animate-fadeInUp">
                  ← ACTUAL
                </div>
              )}

              {/* Indicador desbloqueado */}
              {isUnlocked && !isCurrent && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-emerald-400 text-xs font-black">
                  ✓ Desbloqueado
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-12 pt-4 border-t border-slate-700/50">
        <p className="text-center text-sm text-slate-400">
          Continúa completando quizzes para desbloquear el siguiente rango
        </p>
      </div>
    </div>
  );
};

export default AdvancedMilestoneTimeline;
