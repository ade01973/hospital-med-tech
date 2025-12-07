import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Users, MessageSquare, Target, Briefcase, Sparkles, Zap, Trophy, Home, Star, Rocket } from 'lucide-react';
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
    color: 'from-cyan-500 via-blue-500 to-indigo-500',
    shadowColor: 'shadow-cyan-500/40',
    borderColor: 'border-cyan-400/40',
    bgGlow: 'from-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description: 'Trabaja con casos reales de gestión sanitaria. Comparte tus casos y recibe análisis detallado.'
  },
  {
    id: 'decisions',
    title: 'Toma de Decisiones',
    subtitle: 'Entrena tu capacidad de decisión',
    icon: Target,
    emoji: '🎯',
    color: 'from-blue-500 via-indigo-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/40',
    borderColor: 'border-blue-400/40',
    bgGlow: 'from-blue-500/30',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    description: 'Practica la toma de decisiones en escenarios complejos con feedback inmediato.'
  },
  {
    id: 'leadership',
    title: 'Liderazgo',
    subtitle: 'Desarrolla habilidades de líder',
    icon: Brain,
    emoji: '🧠',
    color: 'from-indigo-500 via-cyan-500 to-blue-500',
    shadowColor: 'shadow-indigo-500/40',
    borderColor: 'border-indigo-400/40',
    bgGlow: 'from-indigo-500/30',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    description: 'Aprende y practica diferentes estilos de liderazgo aplicados a la gestión enfermera.'
  },
  {
    id: 'communication',
    title: 'Comunicación',
    subtitle: 'Mejora tu comunicación efectiva',
    icon: MessageSquare,
    emoji: '💬',
    color: 'from-sky-500 via-cyan-500 to-blue-500',
    shadowColor: 'shadow-sky-500/40',
    borderColor: 'border-sky-400/40',
    bgGlow: 'from-sky-500/30',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    description: 'Practica técnicas de comunicación asertiva, feedback constructivo y gestión de conflictos.'
  },
  {
    id: 'teamwork',
    title: 'Trabajo en Equipo',
    subtitle: 'Potencia la colaboración',
    icon: Users,
    emoji: '👥',
    color: 'from-teal-500 via-cyan-500 to-blue-500',
    shadowColor: 'shadow-teal-500/40',
    borderColor: 'border-teal-400/40',
    bgGlow: 'from-teal-500/30',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    description: 'Desarrolla habilidades para coordinar equipos, delegar tareas y fomentar la cohesión grupal.'
  }
];

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[
      { color: 'from-cyan-500/20 to-blue-500/10', size: 'w-96 h-96', position: 'top-0 -left-48', delay: '0s' },
      { color: 'from-purple-500/20 to-pink-500/10', size: 'w-80 h-80', position: 'top-1/4 -right-40', delay: '2s' },
      { color: 'from-emerald-500/15 to-teal-500/10', size: 'w-72 h-72', position: 'bottom-1/4 -left-36', delay: '4s' },
      { color: 'from-amber-500/15 to-orange-500/10', size: 'w-64 h-64', position: '-bottom-32 right-1/4', delay: '1s' },
      { color: 'from-indigo-500/20 to-violet-500/10', size: 'w-56 h-56', position: 'top-1/2 left-1/3', delay: '3s' },
    ].map((orb, i) => (
      <div
        key={i}
        className={`absolute ${orb.size} ${orb.position} bg-gradient-radial ${orb.color} rounded-full blur-3xl opacity-60`}
        style={{
          animation: `float-orb 8s ease-in-out infinite`,
          animationDelay: orb.delay
        }}
      />
    ))}
  </div>
);

const GlowingStars = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `radial-gradient(circle, ${['#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)]} 0%, transparent 70%)`,
          animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          boxShadow: `0 0 ${6 + Math.random() * 10}px currentColor`
        }}
      />
    ))}
  </div>
);

const FloatingParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${100 + Math.random() * 20}%`,
          background: ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
          animation: `rise-particle ${8 + Math.random() * 12}s linear infinite`,
          animationDelay: `${Math.random() * 10}s`,
          opacity: 0.6
        }}
      />
    ))}
  </div>
);

const ShimmerText = ({ children, className = '' }) => (
  <span className={`relative inline-block ${className}`}>
    <span className="relative z-10">{children}</span>
    <span 
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
      style={{
        animation: 'shimmer-text 3s ease-in-out infinite'
      }}
    />
  </span>
);

const AITrainingHub = ({ onBack }) => {
  const [activeModule, setActiveModule] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 overflow-auto">
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -20px) scale(1.05); }
          50% { transform: translate(-5px, 10px) scale(0.95); }
          75% { transform: translate(15px, 5px) scale(1.02); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes rise-particle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer-text {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color, rgba(6, 182, 212, 0.3)); }
          50% { box-shadow: 0 0 40px var(--glow-color, rgba(6, 182, 212, 0.6)), 0 0 60px var(--glow-color, rgba(6, 182, 212, 0.3)); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(6, 182, 212, 0.3); }
          50% { border-color: rgba(6, 182, 212, 0.7); }
        }
        @keyframes icon-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
        }
        .icon-hover:hover .icon-inner {
          animation: icon-rotate 0.6s ease-out;
        }
        .glow-button {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="fixed inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${aiTrainingBg})` }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/70 via-indigo-950/50 to-purple-950/60" />
      
      <FloatingOrbs />
      <GlowingStars />
      <FloatingParticles />

      <div className="relative z-10 container mx-auto p-4 md:p-8 max-w-7xl">
        
        {/* Título Principal Grande y Centrado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/40 animate-pulse">
              <Brain className="w-7 h-7 md:w-9 md:h-9 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
              HUB IA Gest-Tech
            </h1>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse">
              <Sparkles className="w-7 h-7 md:w-9 md:h-9 text-white" />
            </div>
          </div>
          <p className="text-lg md:text-xl text-cyan-200/80 font-medium max-w-2xl mx-auto">
            Centro de Entrenamiento con Inteligencia Artificial para Gestión Enfermera
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-300 text-sm font-bold">Sistema IA Activo</span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-4 border-2 border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-cyan-500/10 glow-button"
            style={{ '--glow-color': 'rgba(6, 182, 212, 0.3)' }}
          >
            <Home className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-white font-bold">Volver al Dashboard</span>
          </button>

          <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-xl rounded-3xl px-8 py-4 border-2 border-indigo-400/40 shadow-2xl shadow-indigo-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 animate-pulse">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                <ShimmerText>HUB IA Gest-Tech</ShimmerText>
              </h1>
              <p className="text-sm text-indigo-300/80 leading-relaxed">Desarrolla tus competencias con inteligencia artificial</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-xl px-4 py-2 rounded-2xl border-2 border-cyan-400/40 shadow-xl shadow-cyan-500/20 glow-button" style={{ '--glow-color': 'rgba(6, 182, 212, 0.3)' }}>
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 flex items-end justify-center">
              {playerAvatar.characterPreset ? (
                <img
                  src={`/avatar/${playerAvatar.gender === 'male' ? 'male' : 'female'}-characters/${playerAvatar.gender === 'male' ? 'male' : 'female'}-character-${playerAvatar.characterPreset}.png`}
                  alt="Tu Avatar"
                  className="w-full h-full object-contain object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <span className="text-cyan-300 font-black text-sm block">{playerAvatar.name || 'Gestor/a'}</span>
              <span className="text-white/70 font-medium text-xs">En entrenamiento</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-indigo-400/30 rounded-3xl p-7 shadow-2xl shadow-indigo-500/10 card-hover-effect hover:border-indigo-400/60">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/40 transform hover:rotate-6 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">¡Bienvenido/a!</h2>
                  <p className="text-base text-indigo-300 font-medium">{playerAvatar.name || 'Gestora Enfermera'}</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-base leading-relaxed mb-5">
                Este centro utiliza <span className="text-emerald-400 font-black">Inteligencia Artificial</span> avanzada para desarrollar tus competencias en gestión enfermera.
              </p>

              <div className="bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-400/30 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <p className="text-indigo-200 text-sm font-medium leading-relaxed">
                    Cada módulo está diseñado para entrenar habilidades específicas mediante conversaciones interactivas con IA especializada.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-7 shadow-2xl shadow-cyan-500/10 card-hover-effect hover:border-cyan-400/60">
              <h3 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                ¿Cómo funciona?
              </h3>
              
              <div className="space-y-5">
                {[
                  { num: '1', title: 'Elige un área', desc: 'Selecciona el módulo que quieres entrenar' },
                  { num: '2', title: 'Interactúa con la IA', desc: 'Conversa, plantea casos, pide ejemplos' },
                  { num: '3', title: 'Recibe feedback', desc: 'Obtén análisis y recomendaciones personalizadas' }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{step.num}</span>
                    <div>
                      <p className="text-white font-bold text-base">{step.title}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl p-6 shadow-2xl shadow-purple-500/10 card-hover-effect hover:border-purple-400/60">
              <h3 className="text-xl font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                Áreas Disponibles
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {TRAINING_MODULES.map((module, i) => (
                  <button 
                    key={module.id}
                    className="aspect-square bg-slate-800/60 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl border-2 border-slate-700/50 hover:border-cyan-400/70 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/20"
                    onClick={() => setActiveModule(module.id)}
                    title={module.title}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {module.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-900/30 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-3xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  Módulos de Entrenamiento
                </h2>
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm px-5 py-2 rounded-full border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/20">
                  <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                  <span className="text-emerald-300 text-sm font-black">IA Activa</span>
                  <Rocket className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TRAINING_MODULES.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module.id)}
                      onMouseEnter={() => setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                      className={`relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border ${module.borderColor} rounded-2xl p-6 text-left transition-all duration-500 group overflow-hidden icon-hover hover:border-cyan-400/60`}
                      style={{
                        transform: hoveredModule === module.id ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                        boxShadow: hoveredModule === module.id 
                          ? `0 20px 40px -15px ${module.glowColor}, 0 0 30px -10px ${module.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)` 
                          : '0 4px 20px -5px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${module.bgGlow} to-transparent opacity-20 rounded-full blur-3xl transition-all duration-500 ${hoveredModule === module.id ? 'opacity-40 scale-110' : ''}`} />
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg ${module.shadowColor} transform group-hover:rotate-3 group-hover:scale-105 transition-all duration-400`}>
                            <IconComponent className="w-7 h-7 text-white icon-inner drop-shadow-md" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">{module.title}</h3>
                            <p className="text-sm text-cyan-300/60">{module.subtitle}</p>
                          </div>
                          <div className="ml-auto">
                            <span className="text-3xl transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-400 block drop-shadow-lg">{module.emoji}</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300/80 leading-relaxed mb-5">{module.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                            <Star className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                            <span>Comenzar entrenamiento</span>
                          </div>
                          <span className="text-cyan-400 text-lg transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 rounded-2xl p-5 card-hover-effect hover:border-amber-400/40">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <p className="text-white font-black text-base mb-1">Consejo del día</p>
                    <p className="text-slate-400 text-sm leading-relaxed">Combina los módulos para un aprendizaje integral. Empieza por <span className="text-emerald-400 font-bold">Liderazgo</span> y conecta con <span className="text-cyan-400 font-bold">Comunicación</span> y <span className="text-amber-400 font-bold">Trabajo en Equipo</span>.</p>
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
