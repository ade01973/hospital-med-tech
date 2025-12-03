import React, { useState } from 'react';
import { ArrowLeft, Brain, Users, MessageSquare, Target, Briefcase, Sparkles } from 'lucide-react';
import CaseManagementModule from './training/CaseManagementModule';
import DecisionMakingModule from './training/DecisionMakingModule';
import LeadershipModule from './training/LeadershipModule';
import CommunicationModule from './training/CommunicationModule';
import TeamworkModule from './training/TeamworkModule';

const TRAINING_MODULES = [
  {
    id: 'cases',
    title: 'Gestión de Casos',
    subtitle: 'Analiza casos clínicos y de gestión',
    icon: Briefcase,
    color: 'from-red-500 to-orange-500',
    shadowColor: 'shadow-red-500/30',
    borderColor: 'border-red-400/40',
    description: 'Trabaja con casos reales de gestión sanitaria. Sube tus casos y recibe análisis, feedback y recomendaciones.'
  },
  {
    id: 'decisions',
    title: 'Toma de Decisiones',
    subtitle: 'Entrena tu capacidad de decisión',
    icon: Target,
    color: 'from-purple-500 to-indigo-500',
    shadowColor: 'shadow-purple-500/30',
    borderColor: 'border-purple-400/40',
    description: 'Practica la toma de decisiones en escenarios complejos de gestión sanitaria con feedback inmediato.'
  },
  {
    id: 'leadership',
    title: 'Liderazgo',
    subtitle: 'Desarrolla habilidades de líder',
    icon: Brain,
    color: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/30',
    borderColor: 'border-emerald-400/40',
    description: 'Aprende y practica diferentes estilos de liderazgo aplicados a la gestión enfermera.'
  },
  {
    id: 'communication',
    title: 'Comunicación',
    subtitle: 'Mejora tu comunicación efectiva',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/30',
    borderColor: 'border-cyan-400/40',
    description: 'Practica técnicas de comunicación asertiva, feedback constructivo y gestión de conflictos.'
  },
  {
    id: 'teamwork',
    title: 'Trabajo en Equipo',
    subtitle: 'Potencia la colaboración',
    icon: Users,
    color: 'from-amber-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/30',
    borderColor: 'border-amber-400/40',
    description: 'Desarrolla habilidades para coordinar equipos, delegar tareas y fomentar la cohesión grupal.'
  }
];

const AITrainingHub = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'cases':
        return <CaseManagementModule onBack={() => setActiveModule(null)} />;
      case 'decisions':
        return <DecisionMakingModule onBack={() => setActiveModule(null)} />;
      case 'leadership':
        return <LeadershipModule onBack={() => setActiveModule(null)} />;
      case 'communication':
        return <CommunicationModule onBack={() => setActiveModule(null)} />;
      case 'teamwork':
        return <TeamworkModule onBack={() => setActiveModule(null)} />;
      default:
        return null;
    }
  };

  if (activeModule) {
    return renderActiveModule();
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-indigo-500/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Centro de Entrenamiento IA</h1>
            <p className="text-sm text-indigo-300">Desarrolla tus competencias con inteligencia artificial</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Selecciona un área de entrenamiento</h2>
            <p className="text-slate-400">Cada módulo está diseñado para desarrollar competencias específicas en gestión sanitaria</p>
          </div>

          {/* Training Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_MODULES.map((module) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`bg-slate-800/60 backdrop-blur-xl border-2 ${module.borderColor} rounded-2xl p-6 text-left transition-all hover:scale-[1.02] hover:bg-slate-800/80 group relative overflow-hidden`}
                >
                  {/* Background Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center mb-4 shadow-lg ${module.shadowColor}`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-white mb-1">{module.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{module.subtitle}</p>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed">{module.description}</p>

                    {/* Action hint */}
                    <div className={`mt-4 flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}>
                      <span>Comenzar entrenamiento</span>
                      <span>→</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              ¿Cómo funciona?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">1</span>
                <p>Selecciona el área que quieres entrenar</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">2</span>
                <p>Interactúa con la IA especializada en ese tema</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">3</span>
                <p>Recibe feedback personalizado y mejora tus habilidades</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrainingHub;
