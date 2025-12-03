import React, { useState } from 'react';
import { ArrowLeft, Brain, Users, MessageSquare, Target, Briefcase, Sparkles, Zap, Trophy, Home } from 'lucide-react';
import CaseManagementModule from './training/CaseManagementModule';
import DecisionMakingModule from './training/DecisionMakingModule';
import LeadershipModule from './training/LeadershipModule';
import CommunicationModule from './training/CommunicationModule';
import TeamworkModule from './training/TeamworkModule';
import aiTrainingBg from '../assets/ai-training-bg.png';

const TRAINING_MODULES = [
  {
    id: 'cases',
    title: 'Gestión de Casos',
    subtitle: 'Analiza casos clínicos y de gestión',
    icon: Briefcase,
    emoji: '📋',
    color: 'from-red-500 to-orange-500',
    shadowColor: 'shadow-red-500/30',
    borderColor: 'border-red-400/40',
    bgGlow: 'from-red-500/20',
    description: 'Trabaja con casos reales de gestión sanitaria. Comparte tus casos y recibe análisis detallado.'
  },
  {
    id: 'decisions',
    title: 'Toma de Decisiones',
    subtitle: 'Entrena tu capacidad de decisión',
    icon: Target,
    emoji: '🎯',
    color: 'from-purple-500 to-indigo-500',
    shadowColor: 'shadow-purple-500/30',
    borderColor: 'border-purple-400/40',
    bgGlow: 'from-purple-500/20',
    description: 'Practica la toma de decisiones en escenarios complejos con feedback inmediato.'
  },
  {
    id: 'leadership',
    title: 'Liderazgo',
    subtitle: 'Desarrolla habilidades de líder',
    icon: Brain,
    emoji: '🧠',
    color: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/30',
    borderColor: 'border-emerald-400/40',
    bgGlow: 'from-emerald-500/20',
    description: 'Aprende y practica diferentes estilos de liderazgo aplicados a la gestión enfermera.'
  },
  {
    id: 'communication',
    title: 'Comunicación',
    subtitle: 'Mejora tu comunicación efectiva',
    icon: MessageSquare,
    emoji: '💬',
    color: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/30',
    borderColor: 'border-cyan-400/40',
    bgGlow: 'from-cyan-500/20',
    description: 'Practica técnicas de comunicación asertiva, feedback constructivo y gestión de conflictos.'
  },
  {
    id: 'teamwork',
    title: 'Trabajo en Equipo',
    subtitle: 'Potencia la colaboración',
    icon: Users,
    emoji: '👥',
    color: 'from-amber-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/30',
    borderColor: 'border-amber-400/40',
    bgGlow: 'from-amber-500/20',
    description: 'Desarrolla habilidades para coordinar equipos, delegar tareas y fomentar la cohesión grupal.'
  }
];

const AITrainingHub = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState(null);
  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');

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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Image - Office */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${aiTrainingBg})` }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-indigo-950/60 to-slate-950/90"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6 max-w-7xl">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {/* Back Button with Avatar */}
            <button
              onClick={onBack}
              className="flex items-center gap-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-3 border-2 border-cyan-500/50 hover:border-cyan-400 hover:from-cyan-500/30 hover:to-blue-600/30 transition-all cursor-pointer transform hover:scale-105"
            >
              <Home className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-bold text-sm">Volver al Dashboard</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Title Badge */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 backdrop-blur-xl rounded-2xl px-6 py-3 border-2 border-indigo-400/50 shadow-lg shadow-indigo-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Centro de Entrenamiento IA</h1>
                <p className="text-xs text-indigo-300">Desarrolla tus competencias con inteligencia artificial</p>
              </div>
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600/40 to-teal-600/40 px-4 py-2 rounded-xl border border-emerald-400/50">
            <span className="text-2xl">🤖</span>
            <span className="text-emerald-300 font-bold text-sm">Powered by Gemini AI</span>
          </div>
        </div>

        {/* Main Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Welcome & How It Works */}
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-indigo-400/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">¡Bienvenido/a!</h2>
                  <p className="text-sm text-indigo-300">{playerAvatar.name || 'Gestora Enfermera'}</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Este centro de entrenamiento utiliza <span className="text-emerald-400 font-bold">Inteligencia Artificial</span> para ayudarte a desarrollar competencias clave en gestión enfermera.
              </p>

              <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-4">
                <p className="text-indigo-200 text-xs font-medium">
                  💡 Cada módulo está diseñado para entrenar habilidades específicas mediante conversaciones interactivas con IA especializada.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                ¿Cómo funciona?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">1</span>
                  <div>
                    <p className="text-white font-bold text-sm">Elige un área</p>
                    <p className="text-slate-400 text-xs">Selecciona el módulo que quieres entrenar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">2</span>
                  <div>
                    <p className="text-white font-bold text-sm">Interactúa con la IA</p>
                    <p className="text-slate-400 text-xs">Conversa, plantea casos, pide ejemplos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-lg">3</span>
                  <div>
                    <p className="text-white font-bold text-sm">Recibe feedback</p>
                    <p className="text-slate-400 text-xs">Obtén análisis y recomendaciones personalizadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Preview */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-5 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Áreas Disponibles
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {TRAINING_MODULES.map((module) => (
                  <div 
                    key={module.id}
                    className="aspect-square bg-slate-800/50 rounded-xl flex items-center justify-center text-2xl border border-slate-700/50 hover:border-cyan-400/50 transition-all cursor-pointer transform hover:scale-110"
                    onClick={() => setActiveModule(module.id)}
                    title={module.title}
                  >
                    {module.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Training Modules Grid */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">Módulos de Entrenamiento</h2>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/50">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-emerald-300 text-xs font-bold">IA Activa</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRAINING_MODULES.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      className={`bg-slate-800/60 backdrop-blur-xl border-2 ${module.borderColor} rounded-2xl p-5 text-left transition-all hover:scale-[1.02] hover:bg-slate-800/80 group relative overflow-hidden`}
                    >
                      {/* Background Glow */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.bgGlow} to-transparent opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                      
                      <div className="relative z-10">
                        {/* Icon & Title Row */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg ${module.shadowColor}`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-base font-black text-white">{module.title}</h3>
                            <p className="text-xs text-slate-400">{module.subtitle}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-300 leading-relaxed mb-3">{module.description}</p>

                        {/* Action hint */}
                        <div className={`flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}>
                          <span>Comenzar entrenamiento</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Tips */}
              <div className="mt-6 bg-slate-800/40 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="text-white font-bold text-sm">Consejo del día</p>
                    <p className="text-slate-400 text-xs">Combina los módulos para un aprendizaje integral. Empieza por Liderazgo y conecta con Comunicación y Trabajo en Equipo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITrainingHub;
