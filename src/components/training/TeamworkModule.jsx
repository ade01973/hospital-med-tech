import React, { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { ArrowLeft, Send, Bot, User, Users, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Target, Home, Trophy, Sparkles, Crown, TrendingUp, BarChart3, Flame, RefreshCw, ChevronDown, AlertTriangle, Theater, LineChart, BookOpen, Layers, UserCircle, MessageCircle, Settings, Lightbulb, GraduationCap, Heart, Shield, Brain, Puzzle, Network, Handshake } from 'lucide-react';
import leadershipBg from '../../assets/leadership-bg.png';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const TeamworkProfileContext = createContext(null);

const useTeamworkProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultProfile = {
    belbinRoles: {
      cerebro: 0,
      investigador: 0,
      coordinador: 0,
      impulsor: 0,
      monitor: 0,
      cohesionador: 0,
      implementador: 0,
      finalizador: 0,
      especialista: 0
    },
    belbinCounts: {
      cerebro: 0,
      investigador: 0,
      coordinador: 0,
      impulsor: 0,
      monitor: 0,
      cohesionador: 0,
      implementador: 0,
      finalizador: 0,
      especialista: 0
    },
    teamSkills: {
      colaboracion: 0,
      coordinacion: 0,
      delegacion: 0,
      cohesion: 0,
      resolucionProblemas: 0,
      comunicacionEquipo: 0
    },
    teamSkillsCounts: {
      colaboracion: 0,
      coordinacion: 0,
      delegacion: 0,
      cohesion: 0,
      resolucionProblemas: 0,
      comunicacionEquipo: 0
    },
    sessions: [],
    totalSessions: 0,
    averageScore: 0,
    dominantRole: null,
    lastUpdated: null
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'teamworkProfiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            await setDoc(docRef, defaultProfile);
            setProfile(defaultProfile);
          }
        } else {
          const stored = localStorage.getItem('teamworkProfile');
          if (stored) {
            setProfile(JSON.parse(stored));
          } else {
            localStorage.setItem('teamworkProfile', JSON.stringify(defaultProfile));
            setProfile(defaultProfile);
          }
        }
      } catch (error) {
        console.error('Error loading teamwork profile:', error);
        const stored = localStorage.getItem('teamworkProfile');
        setProfile(stored ? JSON.parse(stored) : defaultProfile);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const addSession = useCallback(async (sessionData) => {
    if (!profile) return;

    const newSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...sessionData
    };

    const updatedProfile = { ...profile };
    updatedProfile.sessions = [...(updatedProfile.sessions || []).slice(-49), newSession];
    updatedProfile.totalSessions = (updatedProfile.totalSessions || 0) + 1;
    
    if (sessionData.score !== undefined && sessionData.maxScore) {
      const percentage = (sessionData.score / sessionData.maxScore) * 100;
      const prevTotal = (updatedProfile.averageScore || 0) * ((updatedProfile.totalSessions || 1) - 1);
      updatedProfile.averageScore = (prevTotal + percentage) / updatedProfile.totalSessions;
    }

    if (sessionData.belbinRole) {
      const roleKey = sessionData.belbinRole.toLowerCase();
      if (!updatedProfile.belbinRoles) updatedProfile.belbinRoles = { ...defaultProfile.belbinRoles };
      if (!updatedProfile.belbinCounts) updatedProfile.belbinCounts = { ...defaultProfile.belbinCounts };
      if (updatedProfile.belbinRoles[roleKey] !== undefined) {
        updatedProfile.belbinCounts[roleKey] = (updatedProfile.belbinCounts[roleKey] || 0) + 1;
        const count = updatedProfile.belbinCounts[roleKey];
        const prevAvg = updatedProfile.belbinRoles[roleKey] || 0;
        updatedProfile.belbinRoles[roleKey] = ((prevAvg * (count - 1)) + (sessionData.roleScore || 5)) / count;
      }
    }

    if (sessionData.teamSkills) {
      if (!updatedProfile.teamSkills) updatedProfile.teamSkills = { ...defaultProfile.teamSkills };
      if (!updatedProfile.teamSkillsCounts) updatedProfile.teamSkillsCounts = { ...defaultProfile.teamSkillsCounts };
      Object.entries(sessionData.teamSkills).forEach(([skill, value]) => {
        if (updatedProfile.teamSkills[skill] !== undefined) {
          updatedProfile.teamSkillsCounts[skill] = (updatedProfile.teamSkillsCounts[skill] || 0) + 1;
          const count = updatedProfile.teamSkillsCounts[skill];
          const prevAvg = updatedProfile.teamSkills[skill] || 0;
          updatedProfile.teamSkills[skill] = ((prevAvg * (count - 1)) + value) / count;
        }
      });
    }

    updatedProfile.lastUpdated = new Date().toISOString();

    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'teamworkProfiles', user.uid);
        await setDoc(docRef, updatedProfile, { merge: true });
      }
      localStorage.setItem('teamworkProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving session:', error);
      localStorage.setItem('teamworkProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    }
  }, [profile]);

  const getDominantRoles = useCallback(() => {
    if (!profile || !profile.belbinCounts) return [];
    return Object.entries(profile.belbinCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([role, count]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        count,
        avgScore: profile.belbinRoles[role] || 0
      }));
  }, [profile]);

  const getTrends = useCallback((n = 10) => {
    if (!profile || !profile.sessions) return [];
    return profile.sessions.slice(-n).map(s => ({
      date: new Date(s.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      score: s.score && s.maxScore ? (s.score / s.maxScore * 100) : 0,
      type: s.type,
      role: s.belbinRole
    }));
  }, [profile]);

  return {
    profile,
    loading,
    addSession,
    getDominantRoles,
    getTrends
  };
};

export const TeamworkProfileProvider = ({ children }) => {
  const profileData = useTeamworkProfile();
  return (
    <TeamworkProfileContext.Provider value={profileData}>
      {children}
    </TeamworkProfileContext.Provider>
  );
};

export const useTeamworkProfileContext = () => {
  const context = useContext(TeamworkProfileContext);
  if (!context) {
    return {
      profile: null,
      loading: false,
      addSession: () => {},
      getDominantRoles: () => [],
      getTrends: () => []
    };
  }
  return context;
};

const usePlayerAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('playerAvatar');
      if (stored) {
        setAvatar(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading avatar:', e);
    }
  }, []);
  
  return avatar;
};

const PlayerAvatarIcon = ({ size = 'sm', className = '' }) => {
  const avatar = usePlayerAvatar();
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const FallbackAvatar = () => (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
      <User className="w-1/2 h-1/2 text-white" />
    </div>
  );
  
  if (!avatar || !avatar.characterPreset || imgError) {
    return <FallbackAvatar />;
  }
  
  const gender = avatar.gender || 'female';
  const preset = avatar.characterPreset;
  const imgPath = new URL(`../../assets/${gender}-characters/${gender}-character-${preset}.png`, import.meta.url).href;
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-amber-400/50 ${className}`}>
      <img 
        src={imgPath}
        alt="Tu avatar"
        className="w-full h-full object-cover object-top"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-30"
        style={{
          width: Math.random() * 6 + 2 + 'px',
          height: Math.random() * 6 + 2 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          background: `linear-gradient(135deg, ${['#f59e0b', '#eab308', '#d97706', '#fbbf24'][Math.floor(Math.random() * 4)]}, transparent)`,
          animation: `float ${8 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
      }
    `}</style>
  </div>
);

const GlowingOrb = ({ color, size, left, top, delay }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: color,
      animationDelay: delay,
      animationDuration: '4s'
    }}
  />
);

const COLLABORATIVE_STYLES = [
  { id: 'colaborativo', name: 'Colaborativo', icon: '🤝', color: 'from-emerald-500 to-teal-500', description: 'Busca el beneficio mutuo y la sinergia del grupo' },
  { id: 'competitivo', name: 'Competitivo', icon: '⚔️', color: 'from-red-500 to-orange-500', description: 'Enfocado en ganar y destacar sobre otros' },
  { id: 'evitativo', name: 'Evitativo', icon: '🚪', color: 'from-slate-500 to-gray-500', description: 'Tiende a evadir conflictos y responsabilidades' },
  { id: 'acomodativo', name: 'Acomodativo', icon: '🕊️', color: 'from-sky-500 to-blue-500', description: 'Prioriza las necesidades de otros sobre las propias' },
  { id: 'compromiso', name: 'Compromiso', icon: '⚖️', color: 'from-amber-500 to-yellow-500', description: 'Busca soluciones intermedias que satisfagan a todos' },
  { id: 'coordinador', name: 'Coordinador', icon: '👔', color: 'from-violet-500 to-purple-500', description: 'Organiza y facilita el trabajo del equipo' },
  { id: 'lider_facilitador', name: 'Líder Facilitador', icon: '🌟', color: 'from-fuchsia-500 to-pink-500', description: 'Guía al equipo hacia objetivos compartidos' },
  { id: 'miembro_pasivo', name: 'Miembro Pasivo', icon: '💤', color: 'from-zinc-500 to-stone-500', description: 'Participación mínima, sigue instrucciones sin iniciativa' }
];

const TEAMWORK_MODES = [
  {
    id: 'teamworkTest',
    title: 'Test de Evaluación',
    description: 'Evalúa tus competencias de trabajo en equipo con 20 preguntas',
    icon: '📋',
    color: 'from-indigo-500 to-violet-500',
    features: ['20 preguntas IA', 'Gráfica radar', 'Conclusión profesional'],
    isNew: true
  },
  {
    id: 'styleIdentification',
    title: 'Identificar Mi Estilo',
    description: 'Descubre tu estilo de participación en equipos de gestión',
    icon: '🎭',
    color: 'from-fuchsia-500 to-rose-500',
    features: ['8 estilos', 'Análisis contextual', 'Feedback personalizado'],
    isNew: true
  },
  {
    id: 'simulation',
    title: 'Simulación de Dinámicas',
    description: 'Simula situaciones reales de equipos clínicos con IA',
    icon: '🎮',
    color: 'from-orange-500 to-amber-500',
    features: ['Detección de estilo', 'Puntuación 0-10', 'Feedback personalizado'],
    isNew: true
  },
  {
    id: 'delegation',
    title: 'Delegación Efectiva',
    description: 'Aprende a delegar tareas de forma estratégica',
    icon: '📋',
    color: 'from-yellow-500 to-lime-500',
    features: ['Matriz de delegación', 'Seguimiento', 'Casos prácticos']
  },
  {
    id: 'dynamics',
    title: 'Dinámicas de Roles',
    description: 'Evalúa tu desempeño en 8 roles funcionales del equipo',
    icon: '🤝',
    color: 'from-emerald-500 to-teal-500',
    features: ['8 roles funcionales', 'Escenarios IA', 'Feedback detallado'],
    isNew: true
  },
  {
    id: 'meetings',
    title: 'Reuniones Eficaces',
    description: 'Domina el arte de conducir reuniones productivas',
    icon: '📅',
    color: 'from-teal-500 to-cyan-500',
    features: ['Planificación', 'Facilitación', 'Seguimiento acuerdos']
  },
  {
    id: 'analytics',
    title: 'Panel de Analítica',
    description: 'Visualiza tu evolución y perfil de equipo',
    icon: '📊',
    color: 'from-sky-500 to-blue-500',
    features: ['Roles dominantes', 'Tendencias', 'Competencias'],
    isNew: true
  },
  {
    id: 'dysfunctions',
    title: 'Disfunciones del Equipo',
    description: 'Identifica y resuelve las 5 disfunciones de Lencioni',
    icon: '🔧',
    color: 'from-rose-500 to-pink-500',
    features: ['Diagnóstico', 'Estrategias', 'Plan de acción']
  },
  {
    id: 'mentor',
    title: 'Modo Mentor',
    description: 'Coach experto en trabajo en equipo sanitario',
    icon: '🎓',
    color: 'from-violet-500 to-purple-500',
    features: ['Coaching personal', 'Recursos', 'Técnicas avanzadas'],
    isNew: true
  },
  {
    id: 'conflicts',
    title: 'Conflictos Interprofesionales',
    description: 'Simula y resuelve tensiones entre profesionales sanitarios',
    icon: '⚔️',
    color: 'from-red-500 to-rose-500',
    features: ['5 tipos de conflicto', 'Escenarios IA', 'Evaluación 4 dimensiones'],
    isNew: true
  },
  {
    id: 'cohesion',
    title: 'Cohesión y Apoyo Mutuo',
    description: 'Evalúa tu capacidad de fomentar unión y apoyo en el equipo',
    icon: '💎',
    color: 'from-cyan-500 to-blue-500',
    features: ['6 dimensiones', 'Escenarios IA', 'Recomendaciones personalizadas'],
    isNew: true
  },
  {
    id: 'roleplay',
    title: 'Role-Play de Equipo',
    description: 'Interactúa con perfiles de profesionales simulados por IA',
    icon: '🎭',
    color: 'from-fuchsia-500 to-pink-500',
    features: ['6 perfiles', 'Chat dinámico', 'Feedback inmediato'],
    isNew: true
  },
  {
    id: 'teamProfile',
    title: 'Mi Perfil de Equipo',
    description: 'Tu evolución y perfil longitudinal de trabajo en equipo',
    icon: '📈',
    color: 'from-emerald-500 to-green-500',
    features: ['Métricas', 'Gráficos', 'Evolución temporal'],
    isNew: true
  }
];

const BELBIN_ROLES = [
  {
    id: 'cerebro',
    name: 'Cerebro',
    icon: '🧠',
    color: 'from-purple-500 to-violet-500',
    description: 'Creativo, imaginativo, resuelve problemas difíciles',
    strengths: ['Genera ideas innovadoras', 'Pensamiento no convencional', 'Resuelve problemas complejos'],
    weaknesses: ['Puede ignorar detalles prácticos', 'Comunicación abstracta']
  },
  {
    id: 'investigador',
    name: 'Investigador de Recursos',
    icon: '🔍',
    color: 'from-cyan-500 to-blue-500',
    description: 'Extrovertido, entusiasta, explora oportunidades',
    strengths: ['Desarrolla contactos', 'Explora oportunidades', 'Negocia recursos'],
    weaknesses: ['Puede perder interés rápido', 'Optimismo excesivo']
  },
  {
    id: 'coordinador',
    name: 'Coordinador',
    icon: '👔',
    color: 'from-amber-500 to-yellow-500',
    description: 'Maduro, seguro, identifica talentos y delega',
    strengths: ['Clarifica metas', 'Delega efectivamente', 'Promueve decisiones'],
    weaknesses: ['Puede delegar demasiado', 'Puede parecer manipulador']
  },
  {
    id: 'impulsor',
    name: 'Impulsor',
    icon: '⚡',
    color: 'from-red-500 to-orange-500',
    description: 'Retador, dinámico, trabaja bien bajo presión',
    strengths: ['Dinamismo', 'Coraje para superar obstáculos', 'Orientado a resultados'],
    weaknesses: ['Puede herir sensibilidades', 'Impaciente']
  },
  {
    id: 'monitor',
    name: 'Monitor Evaluador',
    icon: '📊',
    color: 'from-slate-500 to-gray-500',
    description: 'Serio, estratégico, analiza todas las opciones',
    strengths: ['Juicio crítico', 'Ve todas las opciones', 'Decisiones ponderadas'],
    weaknesses: ['Falta de entusiasmo', 'Puede parecer crítico']
  },
  {
    id: 'cohesionador',
    name: 'Cohesionador',
    icon: '💚',
    color: 'from-green-500 to-emerald-500',
    description: 'Cooperador, perceptivo, evita fricciones',
    strengths: ['Escucha activa', 'Diplomacia', 'Construye armonía'],
    weaknesses: ['Evita confrontaciones', 'Indeciso en situaciones críticas']
  },
  {
    id: 'implementador',
    name: 'Implementador',
    icon: '🔨',
    color: 'from-blue-500 to-indigo-500',
    description: 'Disciplinado, eficiente, convierte ideas en acciones',
    strengths: ['Organización práctica', 'Disciplina', 'Eficiencia'],
    weaknesses: ['Inflexible', 'Resistente al cambio']
  },
  {
    id: 'finalizador',
    name: 'Finalizador',
    icon: '✅',
    color: 'from-teal-500 to-cyan-500',
    description: 'Esmerado, concienzudo, busca errores y omisiones',
    strengths: ['Atención al detalle', 'Cumple plazos', 'Detecta errores'],
    weaknesses: ['Perfeccionismo', 'Dificultad para delegar']
  },
  {
    id: 'especialista',
    name: 'Especialista',
    icon: '🎯',
    color: 'from-pink-500 to-rose-500',
    description: 'Entregado, independiente, aporta conocimiento experto',
    strengths: ['Conocimiento técnico profundo', 'Automotivación', 'Dedicación'],
    weaknesses: ['Contribuye en ámbito limitado', 'Se enfoca solo en tecnicismos']
  }
];

const ModeSelector = ({ onSelectMode }) => {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#f59e0b" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#eab308" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10 pb-24">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-6 py-3 rounded-2xl border border-amber-500/30 mb-6">
            <Users className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-black text-white">
              Centro de <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Trabajo en Equipo</span>
            </h1>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Desarrolla tus competencias para trabajar eficazmente en equipos sanitarios
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAMWORK_MODES.map((mode, idx) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 ${mode.isNew ? 'border-amber-500/60 ring-1 ring-amber-400/30' : 'border-slate-600'} hover:border-amber-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-amber-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {mode.isNew && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                  NUEVO
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-100">{mode.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{mode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((feature, fidx) => (
                      <span key={fidx} className="text-xs bg-slate-700/80 text-amber-300 px-2 py-1 rounded-lg">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SCENARIO_TYPES = [
  {
    id: 'workload',
    title: 'Reparto de Cargas',
    description: 'Reparto desigual de tareas durante el turno',
    icon: '⚖️',
    color: 'from-orange-500 to-amber-500',
    difficulty: 'Media'
  },
  {
    id: 'experience',
    title: 'Niveles de Experiencia',
    description: 'Coordinación entre profesionales con diferente experiencia',
    icon: '📊',
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'Media'
  },
  {
    id: 'priorities',
    title: 'Conflicto de Prioridades',
    description: 'Desacuerdo entre profesionales por prioridades asistenciales',
    icon: '⚡',
    color: 'from-rose-500 to-pink-500',
    difficulty: 'Alta'
  },
  {
    id: 'critical',
    title: 'Incidente Crítico',
    description: 'Trabajo en equipo ante un evento adverso',
    icon: '🚨',
    color: 'from-red-500 to-orange-500',
    difficulty: 'Alta'
  },
  {
    id: 'multidisciplinary',
    title: 'Equipo Multidisciplinar',
    description: 'Comunicación con médicos, fisios, celadores...',
    icon: '🏥',
    color: 'from-emerald-500 to-teal-500',
    difficulty: 'Media'
  },
  {
    id: 'emergency',
    title: 'Respuesta a Emergencias',
    description: 'Coordinación del equipo en situación de emergencia',
    icon: '🆘',
    color: 'from-purple-500 to-violet-500',
    difficulty: 'Alta'
  },
  {
    id: 'protocol',
    title: 'Nuevo Protocolo',
    description: 'Introducción de un nuevo procedimiento en la unidad',
    icon: '📋',
    color: 'from-yellow-500 to-lime-500',
    difficulty: 'Media'
  }
];

const EMOJIS_BY_SCORE = {
  excellent: ['🎉', '🏆', '⭐', '🌟', '💫', '🚀', '👑', '💯', '🥇', '✨', '🔥', '💎', '🎯', '🙌', '🦸', '💪'],
  good: ['👏', '✨', '💪', '🎯', '👍', '😊', '🌈', '🔥', '🌻', '💚', '🎖️', '👌', '🤩', '💐', '🧩', '⚡'],
  average: ['🤔', '📈', '💡', '🔄', '👀', '🌱', '📚', '⏳', '🧭', '🔑', '🌤️', '🎓', '📊', '🛠️', '🧠', '💭'],
  poor: ['😕', '📉', '⚠️', '🔧', '💭', '🎓', '🔍', '📝', '🌅', '🔄', '🎯', '💪', '🚶', '🌱', '📖', '🛤️']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excepcional! Tu trabajo en equipo es ejemplar',
    '¡Brillante! Dominas la colaboración',
    '¡Impresionante! Nivel experto en equipos',
    '¡Sobresaliente! Tu equipo tiene suerte de tenerte',
    '¡Extraordinario! Lideras con el ejemplo',
    '¡Fantástico! Eres un referente para el equipo',
    '¡Espectacular! Tu desempeño es inspirador',
    '¡Magnífico! Construyes equipos ganadores',
    '¡Increíble! Tu coordinación es admirable',
    '¡Excelente! Tienes madera de líder',
    '¡Asombroso! Transmites confianza al equipo',
    '¡Perfecto! Eres el alma del equipo'
  ],
  good: [
    '¡Muy bien! Colaboras con eficacia',
    '¡Buen trabajo! Tu coordinación es efectiva',
    '¡Genial! Tienes buenas bases de equipo',
    '¡Bien hecho! Sigue desarrollando tu potencial',
    '¡Vas por buen camino! El equipo confía en ti',
    '¡Sólido! Tu aporte al equipo es valioso',
    '¡Positivo! Contribuyes al éxito grupal',
    '¡Prometedor! Tus habilidades crecen cada día',
    '¡Notable! El trabajo en equipo te sale natural',
    '¡Efectivo! Sabes cómo sumar al equipo',
    '¡Competente! Tu rol en el equipo está claro',
    '¡Capaz! Demuestras buenas competencias'
  ],
  average: [
    'Hay potencial, pero puedes mejorar',
    'En desarrollo, sigue practicando',
    'Base correcta, pero puedes crecer más',
    'Oportunidad de crecimiento detectada',
    'Estás en el camino, no pares ahora',
    'Con más práctica llegarás lejos',
    'Tienes la base, solo falta pulir',
    'El progreso se construye paso a paso',
    'Cada ejercicio te acerca a la meta',
    'Tu esfuerzo dará frutos pronto',
    'Sigue adelante, la mejora está cerca',
    'Buen intento, la próxima será mejor'
  ],
  poor: [
    'Es momento de trabajar el trabajo en equipo',
    'Necesitas práctica, no te rindas',
    'Cada intento es una oportunidad de aprender',
    'La mejora viene con la práctica constante',
    'No te desanimes, todos empezamos así',
    'El camino del experto comienza con un paso',
    'Practica hoy para brillar mañana',
    'Los grandes líderes también fueron principiantes',
    'Tu siguiente intento puede ser el bueno',
    'Aprende de esto y vuelve más fuerte',
    'La perseverancia es la clave del éxito',
    'Cada error es una lección valiosa'
  ]
};

const getScoreCategory = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'average';
  return 'poor';
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const STYLE_IDENTIFICATION_SCENARIOS = [
  {
    id: 'resource_conflict',
    title: 'Conflicto de Recursos',
    description: 'El equipo discute sobre la distribución del material y personal',
    icon: '⚖️',
    color: 'from-rose-500 to-pink-500',
    context: 'Eres la gestora enfermera de una unidad de hospitalización. Hay escasez de material y personal para cubrir el turno de noche.'
  },
  {
    id: 'change_resistance',
    title: 'Resistencia al Cambio',
    description: 'Introducción de un nuevo protocolo con oposición del equipo',
    icon: '🔄',
    color: 'from-violet-500 to-purple-500',
    context: 'Debes implementar un nuevo sistema de registros electrónicos. Varios miembros veteranos se resisten activamente.'
  },
  {
    id: 'team_tension',
    title: 'Tensiones Interpersonales',
    description: 'Conflicto entre dos profesionales del equipo',
    icon: '💥',
    color: 'from-orange-500 to-red-500',
    context: 'Dos enfermeras de tu unidad tienen un conflicto personal que está afectando al ambiente de trabajo y la calidad asistencial.'
  },
  {
    id: 'delegation_challenge',
    title: 'Desafío de Delegación',
    description: 'Decidir cómo distribuir tareas críticas en situación de sobrecarga',
    icon: '📋',
    color: 'from-amber-500 to-yellow-500',
    context: 'Es un turno de mañana con alta carga asistencial. Tienes que decidir cómo repartir las tareas entre personal con distintos niveles de experiencia.'
  },
  {
    id: 'crisis_management',
    title: 'Gestión de Crisis',
    description: 'Coordinación del equipo ante una emergencia inesperada',
    icon: '🚨',
    color: 'from-red-500 to-rose-500',
    context: 'Se produce una emergencia con múltiples pacientes que requiere movilizar a todo el equipo de forma inmediata.'
  },
  {
    id: 'multidisciplinary_meeting',
    title: 'Reunión Multidisciplinar',
    description: 'Coordinar una sesión clínica con diferentes profesionales',
    icon: '🏥',
    color: 'from-emerald-500 to-teal-500',
    context: 'Debes liderar una reunión multidisciplinar sobre un caso complejo donde hay opiniones enfrentadas entre medicina, enfermería y trabajo social.'
  },
  {
    id: 'quality_improvement',
    title: 'Mejora de Calidad',
    description: 'Proponer cambios ante indicadores negativos de la unidad',
    icon: '📈',
    color: 'from-cyan-500 to-blue-500',
    context: 'Los indicadores de calidad de la unidad han empeorado. Debes presentar un plan de mejora al equipo que implicará cambios en sus rutinas.'
  },
  {
    id: 'new_member',
    title: 'Integración de Personal',
    description: 'Incorporar a un nuevo profesional al equipo establecido',
    icon: '👋',
    color: 'from-lime-500 to-green-500',
    context: 'Se incorpora un enfermero nuevo con mucha experiencia pero carácter difícil. El equipo ya muestra reticencias.'
  }
];

const STYLE_ANALYSIS_PROMPTS = {
  colaborativo: {
    positive: 'que puede ser ideal para esta situación ya que fomenta la participación y el consenso del equipo',
    negative: 'aunque en este contexto podría ralentizar la toma de decisiones urgentes'
  },
  competitivo: {
    positive: 'que puede ser útil para tomar decisiones rápidas y mostrar liderazgo fuerte',
    negative: 'pero en este contexto disminuye la cohesión del equipo y genera resistencias'
  },
  evitativo: {
    positive: 'que puede dar tiempo al equipo para reflexionar y reducir tensiones',
    negative: 'pero en esta situación puede agravar el problema al no abordarlo directamente'
  },
  acomodativo: {
    positive: 'que mantiene la armonía del equipo y reduce conflictos',
    negative: 'aunque puede hacer que tus necesidades como gestora queden desatendidas'
  },
  compromiso: {
    positive: 'que permite encontrar un punto medio satisfactorio para todas las partes',
    negative: 'aunque puede resultar en soluciones que no satisfacen completamente a nadie'
  },
  coordinador: {
    positive: 'que es muy adecuado para organizar al equipo y clarificar roles y responsabilidades',
    negative: 'aunque puede percibirse como exceso de control si no se equilibra'
  },
  lider_facilitador: {
    positive: 'que empodera al equipo y fomenta el desarrollo profesional de sus miembros',
    negative: 'aunque puede requerir más tiempo del disponible en situaciones urgentes'
  },
  miembro_pasivo: {
    positive: 'que puede ser apropiado en momentos donde otros deben asumir protagonismo',
    negative: 'pero como gestora, esta situación requiere un rol más activo y directivo'
  }
};

const ParticipationStyleIdentifier = ({ onBack }) => {
  const [phase, setPhase] = useState('intro');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [generatedScenario, setGeneratedScenario] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  const VALID_COLORS = ['amber', 'emerald', 'cyan', 'violet', 'rose', 'fuchsia', 'indigo', 'teal', 'orange', 'lime', 'pink', 'sky'];

  const validateColor = (colorStr) => {
    if (!colorStr) return 'from-fuchsia-500 to-pink-500';
    const hasValidColors = VALID_COLORS.some(c => colorStr.includes(c));
    return hasValidColors ? colorStr : 'from-fuchsia-500 to-pink-500';
  };

  const generateScenario = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedScenario(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un escenario nuevo para analizar estilos de participación',
          history: [],
          systemPrompt: `Eres un experto en gestión de equipos de enfermería y análisis de estilos de participación.

GENERA UN NUEVO ESCENARIO original para analizar el estilo de participación de una gestora enfermera.

El escenario debe:
1. Ser diferente a los típicos (reparto de cargas, conflictos de turno, etc.)
2. Involucrar dinámicas de equipo complejas
3. Requerir toma de decisiones que revelen el estilo de participación
4. Ser realista en un contexto hospitalario español

RESPONDE EXACTAMENTE EN ESTE FORMATO JSON:
{
  "title": "Título del escenario (máx 5 palabras)",
  "description": "Descripción breve del escenario (1 frase)",
  "context": "Contexto detallado de la situación (2-3 frases)",
  "icon": "emoji representativo",
  "color": "from-[color1]-500 to-[color2]-500"
}

Colores disponibles: amber, emerald, cyan, violet, rose, fuchsia, indigo, teal, orange, lime, pink, sky

Solo responde con el JSON, sin texto adicional.`
        })
      });

      if (!response.ok) {
        throw new Error('Error de conexión con la IA');
      }

      const data = await response.json();
      
      if (!data || !data.response) {
        throw new Error('Respuesta vacía de la IA');
      }

      const responseText = data.response;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Formato de respuesta inválido');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.title || !parsed.description || !parsed.context) {
        throw new Error('Escenario incompleto generado');
      }

      setGeneratedScenario({
        id: 'generated_' + Date.now(),
        title: parsed.title.substring(0, 50),
        description: parsed.description.substring(0, 150),
        context: parsed.context,
        icon: parsed.icon || '✨',
        color: validateColor(parsed.color),
        isGenerated: true
      });
    } catch (error) {
      console.error('Error generating scenario:', error);
      setGenerationError(error.message || 'No se pudo generar el escenario. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const startScenario = async (scenario) => {
    setSelectedScenario(scenario);
    setPhase('conversation');
    setIsLoading(true);
    setExchangeCount(0);
    setMessages([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Presenta el escenario: ${scenario.title}`,
          history: [],
          systemPrompt: `Eres un experto en análisis de estilos de participación en equipos sanitarios.

ESCENARIO: ${scenario.title}
CONTEXTO: ${scenario.context}

TU OBJETIVO: Presentar una situación realista de gestión de equipos de enfermería que permita identificar el estilo de participación del usuario.

FORMATO DE PRESENTACIÓN:
1. Describe el contexto con detalle (unidad, turno, situación)
2. Presenta 2-3 personajes del equipo con nombres, roles y actitudes
3. Plantea el conflicto o desafío específico
4. Termina preguntando: "Como gestora enfermera, ¿cómo abordarías esta situación?"

PERSONAJES TÍPICOS:
- Elena (enfermera veterana, algo escéptica)
- Carlos (TCAE, muy colaborador)
- Dr. García (médico, exigente)
- Marta (supervisora, apoyo institucional)
- Luis (enfermero nuevo, motivado pero inseguro)

ESTILO: Narrativo, inmersivo, con diálogos entre comillas. Crea una atmósfera realista de hospital español.

NO evalúes aún. Solo presenta la situación y espera la respuesta del usuario.

Siempre en español.`
        })
      });

      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([{ 
        role: 'assistant', 
        content: '❌ Error al iniciar el escenario. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const newExchangeCount = exchangeCount + 1;
    setExchangeCount(newExchangeCount);

    const shouldAnalyze = newExchangeCount >= 2;

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const analysisPrompt = shouldAnalyze ? `

ES MOMENTO DEL ANÁLISIS FINAL DEL ESTILO DE PARTICIPACIÓN.

Analiza TODAS las respuestas del usuario en la conversación para identificar su estilo de participación.

ESTILOS POSIBLES (elige UNO):
- colaborativo: Busca consenso, integra opiniones, trabaja en equipo
- competitivo: Quiere imponer su visión, busca ganar, es directivo
- evitativo: Evita el conflicto, delega responsabilidad, no se posiciona
- acomodativo: Cede ante otros, prioriza la armonía sobre sus propias necesidades
- compromiso: Busca punto medio, hace concesiones mutuas
- coordinador: Organiza, delega, clarifica roles y responsabilidades
- lider_facilitador: Guía al equipo, fomenta participación, desarrolla a otros
- miembro_pasivo: Mínima iniciativa, sigue instrucciones, no propone

Tu respuesta DEBE contener EXACTAMENTE estos marcadores:

---ANÁLISIS DE ESTILO---

[ESTILO:nombre_del_estilo]
[ADECUADO:si/no]
[PUNTUACION:X] (número del 0 al 10, evalúa calidad de la participación)
[EMOJI:emoji] (un emoji emocional que represente el resultado, diferente cada vez: 😄🎯💪🌟🏆✨🚀💫🎉👏🤔💡📈🔥⭐)
[FRASE:frase motivadora o correctiva de 1-2 líneas]

**Análisis de tu Participación:**
[Descripción detallada de cómo participó el usuario, qué decisiones tomó, cómo se comunicó con el equipo, qué actitudes mostró]

**Comportamientos Observados:**
- [comportamiento 1 específico que indica el estilo]
- [comportamiento 2 específico que indica el estilo]
- [comportamiento 3 específico que indica el estilo]

**Impacto en el Equipo:**
[Descripción de cómo este estilo afecta al equipo en esta situación concreta]

**Sugerencias para Mejorar la Colaboración:**
- [sugerencia 1 concreta y accionable]
- [sugerencia 2 concreta y accionable]
- [sugerencia 3 concreta y accionable]

**Alternativa Sugerida:**
Para esta situación, un estilo más [nombre estilo alternativo] podría ser más efectivo porque [razón].

EJEMPLO DE RESPUESTA:
[PUNTUACION:8]
[EMOJI:😄]
[FRASE:¡Muy bien! Has promovido la cooperación entre turnos. Para avanzar más, considera reforzar la delegación compartida y el reconocimiento del equipo.]` : '';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un experto en análisis de estilos de participación en equipos sanitarios.

ESCENARIO ACTUAL: ${selectedScenario.title}
CONTEXTO: ${selectedScenario.context}
INTERCAMBIOS: ${newExchangeCount}

${shouldAnalyze ? 'ES EL MOMENTO DE HACER EL ANÁLISIS FINAL.' : 'Continúa el escenario respondiendo a la acción del usuario.'}

${shouldAnalyze ? '' : `INSTRUCCIONES:
1. Los personajes reaccionan de forma realista
2. Muestra las consecuencias de sus decisiones
3. Desarrolla la situación con nuevos elementos
4. Si es necesario, plantea un nuevo desafío
5. Termina preguntando cómo continuaría`}

${analysisPrompt}

Siempre en español, vocabulario sanitario apropiado.`
        })
      });

      const data = await response.json();
      const responseText = data.response;

      if (shouldAnalyze && responseText.includes('[ESTILO:')) {
        const styleMatch = responseText.match(/\[ESTILO:(\w+)\]/);
        const adequateMatch = responseText.match(/\[ADECUADO:(si|no)\]/i);
        const scoreMatch = responseText.match(/\[PUNTUACION:(\d+)\]/);
        const emojiMatch = responseText.match(/\[EMOJI:([^\]]+)\]/);
        const phraseMatch = responseText.match(/\[FRASE:([^\]]+)\]/);
        
        if (styleMatch) {
          const detectedStyle = styleMatch[1].toLowerCase();
          const isAdequate = adequateMatch ? adequateMatch[1].toLowerCase() === 'si' : true;
          const score = scoreMatch ? Math.min(10, Math.max(0, parseInt(scoreMatch[1]))) : (isAdequate ? 7 : 4);
          const emoji = emojiMatch ? emojiMatch[1].trim() : (score >= 7 ? '😄' : score >= 5 ? '🤔' : '💪');
          const phrase = phraseMatch ? phraseMatch[1].trim() : '';
          
          const cleanAnalysis = responseText
            .replace(/\[ESTILO:\w+\]/, '')
            .replace(/\[ADECUADO:(si|no)\]/i, '')
            .replace(/\[PUNTUACION:\d+\]/, '')
            .replace(/\[EMOJI:[^\]]+\]/, '')
            .replace(/\[FRASE:[^\]]+\]/, '')
            .replace(/---ANÁLISIS DE ESTILO---/g, '')
            .trim();
          
          setResult({
            style: detectedStyle,
            isAdequate: isAdequate,
            score: score,
            emoji: emoji,
            phrase: phrase,
            analysis: cleanAnalysis,
            scenario: selectedScenario
          });
          setPhase('result');
          
          addSession({
            type: 'style_identification',
            scenarioId: selectedScenario.id,
            scenarioTitle: selectedScenario.title,
            detectedStyle: detectedStyle,
            isStyleAdequate: isAdequate,
            score: score,
            maxScore: 10,
            teamSkills: {
              colaboracion: Math.round(score * 0.9),
              coordinacion: Math.round(score * 0.8),
              cohesion: Math.round(score * 0.85)
            }
          });
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetIdentifier = () => {
    setPhase('intro');
    setSelectedScenario(null);
    setMessages([]);
    setResult(null);
    setExchangeCount(0);
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#ec4899" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#f43f5e" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-4xl mx-auto relative z-10 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-fuchsia-500/20 to-rose-500/20 px-6 py-3 rounded-2xl border border-fuchsia-500/30 mb-4">
              <span className="text-3xl">🎭</span>
              <h1 className="text-2xl font-black text-white">Identifica Tu Estilo de Participación</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Descubre cómo participas en equipos de gestión enfermera
            </p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-fuchsia-400" />
              Los 8 Estilos de Participación
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COLLABORATIVE_STYLES.map(style => (
                <div 
                  key={style.id}
                  className={`bg-gradient-to-br ${style.color} rounded-xl p-3 text-center transform hover:scale-105 transition-all`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <p className="text-white text-sm font-bold">{style.name}</p>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-fuchsia-400" />
            Elige un Escenario de Gestión
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {STYLE_IDENTIFICATION_SCENARIOS.map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-fuchsia-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-fuchsia-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                    {scenario.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-fuchsia-100">{scenario.title}</h3>
                    <p className="text-slate-300 text-sm">{scenario.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-fuchsia-400 text-sm font-medium group-hover:text-fuchsia-300">
                  <Play className="w-4 h-4" />
                  <span>Comenzar análisis</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 mb-6">
            <button
              onClick={generateScenario}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-fuchsia-600/30 to-rose-600/30 hover:from-fuchsia-600/50 hover:to-rose-600/50 border-2 border-dashed border-fuchsia-500/50 hover:border-fuchsia-400 rounded-2xl p-5 text-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {isGenerating ? (
                  <Loader2 className="w-6 h-6 text-fuchsia-400 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-fuchsia-300 font-bold text-lg">
                  {isGenerating ? 'Generando escenario...' : 'Generar Escenario con IA'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Crea un escenario personalizado único para analizar tu estilo
              </p>
            </button>

            {generationError && (
              <div className="mt-3 bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center">
                <p className="text-red-300 text-sm">{generationError}</p>
                <button 
                  onClick={generateScenario}
                  className="text-red-400 hover:text-red-300 text-sm mt-1 underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}

            {generatedScenario && (
              <div className="mt-4 bg-gradient-to-br from-fuchsia-500/10 to-rose-500/10 border-2 border-fuchsia-500/40 rounded-2xl p-5 animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span className="text-fuchsia-300 text-xs font-bold uppercase tracking-wide">Escenario Generado con IA</span>
                </div>
                <button
                  onClick={() => startScenario(generatedScenario)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${generatedScenario.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-fuchsia-400/50 group-hover:scale-110 transition-transform`}>
                      {generatedScenario.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-fuchsia-100">{generatedScenario.title}</h3>
                      <p className="text-slate-300 text-sm">{generatedScenario.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-fuchsia-400 text-sm font-medium group-hover:text-fuchsia-300">
                    <Play className="w-4 h-4" />
                    <span>Comenzar con este escenario</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                
                <div className="mt-3 pt-3 border-t border-fuchsia-500/20 flex justify-end">
                  <button
                    onClick={generateScenario}
                    disabled={isGenerating}
                    className="text-fuchsia-400 hover:text-fuchsia-300 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    Generar otro
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-fuchsia-400" />
              ¿Cómo funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Situación</p>
                  <p className="text-slate-400">La IA presenta un escenario de gestión real</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Tu Respuesta</p>
                  <p className="text-slate-400">Explica cómo actuarías como gestora</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Análisis</p>
                  <p className="text-slate-400">La IA identifica tu estilo y da feedback contextual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const styleData = COLLABORATIVE_STYLES.find(s => s.id === result.style) || COLLABORATIVE_STYLES[0];
    const scoreColor = result.score >= 8 ? 'from-emerald-500 to-green-500' : 
                       result.score >= 6 ? 'from-amber-500 to-yellow-500' : 
                       result.score >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';
    const styleCategory = getScoreCategory(result.score, 10);
    const styleEmoji = result.emoji || getRandomElement(EMOJIS_BY_SCORE[styleCategory]);
    const stylePhrase = result.phrase || getRandomElement(PHRASES_BY_SCORE[styleCategory]);
    
    return (
      <div className="h-screen flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto relative z-10 pb-8">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-fuchsia-500/30 shadow-2xl">
              
              <div className="text-center mb-4">
                <div className="text-6xl mb-2 animate-bounce">{styleEmoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                  {stylePhrase}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-2xl p-5 mb-5 border border-slate-600/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl font-black text-white">{result.score}</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Puntuación</p>
                      <p className="text-white text-xl font-bold">{result.score}/10</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {result.isAdequate ? (
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Adecuado
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" /> Mejorable
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center mb-5">
                <div className="text-5xl mb-2">{styleData.icon}</div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Tu Estilo de Participación</p>
                <h2 className="text-2xl font-black bg-gradient-to-r from-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                  {styleData.name}
                </h2>
              </div>

              <div className={`bg-gradient-to-br ${styleData.color} rounded-2xl p-4 mb-5 relative overflow-hidden`}>
                <p className="text-white/90">{styleData.description}</p>
              </div>

              <div className="bg-fuchsia-500/20 border border-fuchsia-500/40 rounded-xl p-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${result.scenario?.color || 'from-fuchsia-500 to-rose-500'} rounded-xl flex items-center justify-center text-lg shadow-lg`}>
                    {result.scenario?.icon || '🎭'}
                  </div>
                  <div>
                    <p className="text-fuchsia-300 text-xs">Escenario analizado</p>
                    <p className="text-white font-bold">{result.scenario?.title}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-5">
                <h4 className="text-fuchsia-400 font-bold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Análisis Detallado
                </h4>
                <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  <div 
                    className="text-slate-200 text-sm leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatMessage(result.analysis) }}
                  />
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 mb-5">
                <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Recuerda
                </h4>
                <p className="text-slate-300 text-sm">
                  No hay estilos "buenos" o "malos". Cada estilo es útil en diferentes contextos. 
                  Lo importante es reconocer tu estilo natural y saber adaptarlo según la situación del equipo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetIdentifier}
              className="flex-1 bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-400 hover:to-rose-400 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-fuchsia-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Probar Otro Escenario
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      <FloatingParticles />
      
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-fuchsia-500/30 px-4 py-3 flex items-center gap-3 relative z-10">
        <button onClick={resetIdentifier} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className={`w-10 h-10 bg-gradient-to-br ${selectedScenario?.color || 'from-fuchsia-500 to-rose-500'} rounded-xl flex items-center justify-center shadow-lg text-xl`}>
          {selectedScenario?.icon || '🎭'}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-black text-white">{selectedScenario?.title}</h1>
          <p className="text-xs text-fuchsia-300">Análisis de estilo de participación</p>
        </div>
        <div className="bg-fuchsia-500/20 border border-fuchsia-500/40 px-3 py-1 rounded-full">
          <span className="text-fuchsia-300 text-sm font-medium">{exchangeCount}/2</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white' 
                  : 'bg-slate-700/80 backdrop-blur-xl text-white border border-slate-600'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === 'user' ? (
                    <>
                      <PlayerAvatarIcon size="xs" />
                      <span className="text-sm font-medium">Tú</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-fuchsia-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-fuchsia-400" />
                      </div>
                      <span className="text-sm font-medium text-fuchsia-300">Análisis IA</span>
                    </>
                  )}
                </div>
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-600">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
                  <span className="text-slate-300">Analizando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explica cómo actuarías como gestora enfermera..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-400 hover:to-rose-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-fuchsia-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const CollaborativeScenarioSimulator = ({ onBack }) => {
  const [phase, setPhase] = useState('select');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  const generateNewScenarios = async () => {
    setIsGeneratingScenarios(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera 7 escenarios nuevos de trabajo en equipo',
          history: [],
          systemPrompt: `Genera EXACTAMENTE 7 escenarios de trabajo en equipo para enfermería.

FORMATO OBLIGATORIO - Responde SOLO con este JSON, sin texto adicional:
[
  {"title": "Título corto", "description": "Descripción en 1 línea", "difficulty": "Media"},
  {"title": "Título corto", "description": "Descripción en 1 línea", "difficulty": "Alta"},
  ...
]

TIPOS DE ESCENARIOS (incluye variedad):
1. Gestión de conflictos entre compañeros
2. Coordinación en emergencias
3. Delegación de tareas
4. Comunicación con equipos multidisciplinares
5. Integración de personal nuevo
6. Gestión de cargas de trabajo desiguales
7. Implementación de cambios/protocolos

REGLAS:
- Títulos máximo 4 palabras
- Descripciones máximo 12 palabras
- Dificultad: "Media" o "Alta"
- Contexto español/sanitario
- Situaciones realistas de hospital

Responde SOLO con el JSON válido.`
        })
      });

      const data = await response.json();
      let scenarios = [];
      
      try {
        const jsonMatch = data.response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          scenarios = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing scenarios:', e);
      }

      if (scenarios.length > 0) {
        const icons = ['🔄', '⚡', '🎯', '💬', '🤝', '📋', '🏥'];
        const colors = [
          'from-violet-500 to-purple-500',
          'from-rose-500 to-pink-500',
          'from-cyan-500 to-blue-500',
          'from-emerald-500 to-teal-500',
          'from-amber-500 to-orange-500',
          'from-indigo-500 to-violet-500',
          'from-lime-500 to-green-500'
        ];
        
        const formattedScenarios = scenarios.slice(0, 7).map((s, idx) => ({
          id: `gen-${Date.now()}-${idx}`,
          title: s.title,
          description: s.description,
          icon: icons[idx % icons.length],
          color: colors[idx % colors.length],
          difficulty: s.difficulty || 'Media',
          isGenerated: true
        }));
        
        setGeneratedScenarios(formattedScenarios);
      }
    } catch (error) {
      console.error('Error generating scenarios:', error);
    } finally {
      setIsGeneratingScenarios(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };


  const startScenario = async (scenario) => {
    setSelectedScenario(scenario);
    setPhase('simulation');
    setIsLoading(true);
    setExchangeCount(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Inicia el escenario: ${scenario.title} - ${scenario.description}`,
          history: [],
          systemPrompt: `Eres un simulador de escenarios de trabajo en equipo en entornos sanitarios.

ESCENARIO SELECCIONADO: ${scenario.title}
DESCRIPCIÓN: ${scenario.description}
DIFICULTAD: ${scenario.difficulty}

TU ROL: Crear una situación inmersiva y realista donde el usuario (enfermero/a) debe demostrar habilidades de trabajo en equipo.

INSTRUCCIONES PARA ESTE ESCENARIO:
1. Presenta la situación con contexto detallado (unidad, momento del turno, carga de trabajo)
2. Introduce 2-4 personajes con nombres españoles, roles y personalidades definidas
3. Plantea el conflicto o situación que requiere colaboración
4. Describe las tensiones o desafíos presentes
5. Termina preguntando al usuario cómo actuaría

PERSONAJES EJEMPLO:
- María (supervisora, exigente pero justa)
- Carlos (enfermero veterano, algo resistente al cambio)
- Lucía (enfermera nueva, insegura pero motivada)
- Dr. Martínez (médico, a veces impaciente)
- Pedro (celador, muy colaborador)

ESTILO: Narrativo, inmersivo, con diálogos realistas entre comillas. Haz que el usuario se sienta dentro de la situación.

IMPORTANTE: No evalúes todavía. Solo presenta el escenario y pregunta qué haría el usuario.

Siempre en español, vocabulario sanitario apropiado.`
        })
      });

      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([{ 
        role: 'assistant', 
        content: '❌ Error al iniciar el escenario. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const newExchangeCount = exchangeCount + 1;
    setExchangeCount(newExchangeCount);

    const shouldEvaluate = newExchangeCount >= 3;

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const evaluationPrompt = shouldEvaluate ? `

IMPORTANTE - ES MOMENTO DE LA EVALUACIÓN FINAL:
Después de responder brevemente a la acción del usuario, DEBES proporcionar una evaluación completa.

Tu respuesta DEBE terminar con este formato EXACTO (respeta los corchetes y la estructura):

---EVALUACIÓN FINAL---

[PUNTUACION:X] (donde X es un número del 0 al 10)

[ESTILO:nombre_estilo] (DEBE ser UNO de: colaborativo, competitivo, evitativo, acomodativo, compromiso, coordinador, lider_facilitador, miembro_pasivo)

[ESTILO_ADECUADO:si/no]

**Análisis del Estilo Colaborativo:**
Has adoptado un estilo [nombre del estilo], que [análisis contextual de si es adecuado o no para esta situación específica, explicando por qué].

**Análisis de tu Participación:**
[Descripción detallada de cómo el usuario participó en el escenario, qué decisiones tomó, cómo interactuó con el equipo]

**Puntos Fuertes Detectados:**
- [fortaleza 1 específica observada]
- [fortaleza 2 específica observada]

**Sugerencias para Mejorar la Colaboración:**
- [sugerencia concreta 1]
- [sugerencia concreta 2]
- [sugerencia concreta 3]

**Frase Motivadora:**
[Una frase motivadora o correctiva personalizada según el desempeño]` : '';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un simulador de escenarios de trabajo en equipo en entornos sanitarios.

ESCENARIO ACTUAL: ${selectedScenario.title}
INTERCAMBIOS REALIZADOS: ${newExchangeCount}

TU ROL: Continuar el escenario de forma inmersiva, reaccionando a las decisiones del usuario.

INSTRUCCIONES:
1. Los personajes reaccionan de forma realista a la decisión del usuario
2. Muestra las consecuencias de sus acciones
3. Desarrolla la situación con nuevos diálogos
4. Si la respuesta del usuario es vaga, pide más detalles
5. Mantén la tensión dramática del escenario

EVALÚA internamente:
- ¿Demuestra comunicación efectiva?
- ¿Colabora con el equipo?
- ¿Considera las perspectivas de otros?
- ¿Propone soluciones constructivas?
- ¿Maneja el conflicto apropiadamente?

${evaluationPrompt}

ESTILO: Narrativo, con diálogos de los personajes, consecuencias claras de las acciones.

Siempre en español.`
        })
      });

      const data = await response.json();
      const responseText = data.response;

      if (shouldEvaluate && responseText.includes('[PUNTUACION:')) {
        const scoreMatch = responseText.match(/\[PUNTUACION:(\d+(?:\.\d+)?)\]/);
        const styleMatch = responseText.match(/\[ESTILO:(\w+)\]/);
        const adequateMatch = responseText.match(/\[ESTILO_ADECUADO:(si|no)\]/i);
        
        if (scoreMatch) {
          const score = parseFloat(scoreMatch[1]);
          const detectedStyle = styleMatch ? styleMatch[1].toLowerCase() : 'colaborativo';
          const isStyleAdequate = adequateMatch ? adequateMatch[1].toLowerCase() === 'si' : true;
          
          const cleanFeedback = responseText
            .replace(/\[PUNTUACION:\d+(?:\.\d+)?\]/, '')
            .replace(/\[ESTILO:\w+\]/, '')
            .replace(/\[ESTILO_ADECUADO:(si|no)\]/i, '');
          
          setEvaluation({
            score: Math.min(10, Math.max(0, score)),
            feedback: cleanFeedback,
            collaborativeStyle: detectedStyle,
            isStyleAdequate: isStyleAdequate
          });
          setPhase('results');
          
          addSession({
            type: 'collaborative_scenario',
            scenarioId: selectedScenario.id,
            scenarioTitle: selectedScenario.title,
            score: score,
            maxScore: 10,
            collaborativeStyle: detectedStyle,
            teamSkills: {
              colaboracion: score * 0.9,
              coordinacion: score * 0.85,
              comunicacionEquipo: score * 0.95
            }
          });
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSimulator = () => {
    setPhase('select');
    setSelectedScenario(null);
    setMessages([]);
    setEvaluation(null);
    setExchangeCount(0);
  };

  if (phase === 'select') {
    const scenariosToShow = generatedScenarios.length > 0 ? generatedScenarios : SCENARIO_TYPES;
    
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#f97316" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#eab308" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-4xl mx-auto relative z-10 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 px-6 py-3 rounded-2xl border border-orange-500/30 mb-4">
              <span className="text-3xl">🎮</span>
              <h1 className="text-2xl font-black text-white">Simulación de Dinámicas de Equipo</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Practica situaciones reales de trabajo en equipo clínico
            </p>
          </div>

          <div className="mb-6 flex justify-center">
            <button
              onClick={generateNewScenarios}
              disabled={isGeneratingScenarios}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:scale-105 flex items-center gap-3"
            >
              {isGeneratingScenarios ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generando 7 escenarios...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generar 7 Escenarios Nuevos</span>
                  <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {generatedScenarios.length > 0 && (
            <div className="mb-4 text-center">
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/40">
                ✨ Escenarios generados por IA
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {scenariosToShow.map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className={`bg-slate-800/90 backdrop-blur-xl border-2 ${scenario.isGenerated ? 'border-purple-500/50' : 'border-slate-600'} hover:border-orange-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-orange-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  {scenario.isGenerated && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      IA
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    scenario.difficulty === 'Alta' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                    {scenario.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-100">{scenario.title}</h3>
                    <p className="text-slate-300 text-sm">{scenario.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm font-medium group-hover:text-orange-300">
                  <Play className="w-4 h-4" />
                  <span>Iniciar escenario</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              ¿Cómo funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold flex-shrink-0">1</div>
                <div>
                  <p className="text-white font-medium">Escenario</p>
                  <p className="text-slate-400">La IA genera una situación clínica realista</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">2</div>
                <div>
                  <p className="text-white font-medium">Tu Respuesta</p>
                  <p className="text-slate-400">Explica cómo actuarías con el equipo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">3</div>
                <div>
                  <p className="text-white font-medium">Evaluación</p>
                  <p className="text-slate-400">Puntuación y feedback personalizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && evaluation) {
    const category = getScoreCategory(evaluation.score, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);
    const percentage = Math.round((evaluation.score / 10) * 100);
    
    const detectedStyleData = COLLABORATIVE_STYLES.find(s => s.id === evaluation.collaborativeStyle) || COLLABORATIVE_STYLES[0];
    
    return (
      <div className="h-screen flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto relative z-10 pb-8">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-orange-500/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-7xl mb-3 animate-bounce">{emoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-3">
                  {phrase}
                </p>
                <div className="text-5xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
                  {evaluation.score.toFixed(1)}/10
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3 mb-2 max-w-xs mx-auto">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      category === 'excellent' ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                      category === 'good' ? 'bg-gradient-to-r from-teal-400 to-cyan-400' :
                      category === 'average' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                      'bg-gradient-to-r from-rose-400 to-red-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm">{percentage}% de puntuación</p>
              </div>

              <div className={`bg-gradient-to-br ${detectedStyleData.color} rounded-2xl p-5 mb-5 relative overflow-hidden`}>
                <div className="absolute top-2 right-2">
                  {evaluation.isStyleAdequate ? (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Adecuado
                    </span>
                  ) : (
                    <span className="bg-red-500/30 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Mejorable
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{detectedStyleData.icon}</div>
                  <div>
                    <p className="text-white/80 text-xs uppercase tracking-wide">Tu estilo colaborativo</p>
                    <h3 className="text-2xl font-black text-white">{detectedStyleData.name}</h3>
                    <p className="text-white/90 text-sm mt-1">{detectedStyleData.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${selectedScenario?.color || 'from-orange-500 to-amber-500'} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                    {selectedScenario?.icon || '🎮'}
                  </div>
                  <div>
                    <p className="text-orange-300 text-xs">Escenario completado</p>
                    <p className="text-white text-lg font-bold">{selectedScenario?.title}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4 mb-5">
                <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Feedback Detallado
                </h4>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  <div 
                    className="text-slate-200 text-sm leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatMessage(evaluation.feedback) }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetSimulator}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Otro Escenario
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-4 rounded-xl transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-orange-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={resetSimulator} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 bg-gradient-to-br ${selectedScenario?.color || 'from-orange-500 to-amber-500'} rounded-xl flex items-center justify-center shadow-lg`}>
            <span className="text-xl">{selectedScenario?.icon || '🎮'}</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{selectedScenario?.title || 'Simulador'}</h1>
            <p className="text-xs text-orange-300">Intercambio {exchangeCount}/3 • Responde para continuar</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-700/80 px-3 py-1.5 rounded-lg">
            <span className="text-xs text-slate-300">Progreso: </span>
            <span className="text-orange-400 font-bold">{Math.min(100, Math.round((exchangeCount / 3) * 100))}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 bg-gradient-to-br ${selectedScenario?.color || 'from-orange-500 to-amber-500'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 bg-gradient-to-br ${selectedScenario?.color || 'from-orange-500 to-amber-500'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-orange-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{exchangeCount >= 2 ? 'Preparando evaluación...' : 'Procesando respuesta...'}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-orange-500/30 p-4">
        {exchangeCount >= 3 && !evaluation ? (
          <div className="text-center text-orange-300 py-2">
            <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
            Generando evaluación final...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Cómo actuarías en esta situación?"
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-orange-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const MENTOR_EXPERTISE = [
  { id: 'belbin', name: 'Roles Belbin', icon: '🧩', color: 'from-purple-500 to-violet-500', desc: 'Los 9 roles de equipo' },
  { id: 'tuckman', name: 'Fases Tuckman', icon: '📈', color: 'from-blue-500 to-cyan-500', desc: 'Desarrollo del equipo' },
  { id: 'lencioni', name: 'Disfunciones', icon: '🔧', color: 'from-rose-500 to-pink-500', desc: 'Las 5 disfunciones' },
  { id: 'delegacion', name: 'Delegación', icon: '📋', color: 'from-amber-500 to-orange-500', desc: 'Delegar efectivamente' },
  { id: 'reuniones', name: 'Reuniones', icon: '📅', color: 'from-emerald-500 to-teal-500', desc: 'Reuniones productivas' },
  { id: 'conflictos', name: 'Conflictos', icon: '⚔️', color: 'from-red-500 to-rose-500', desc: 'Resolver tensiones' },
  { id: 'motivacion', name: 'Motivación', icon: '🔥', color: 'from-orange-500 to-yellow-500', desc: 'Inspirar al equipo' },
  { id: 'comunicacion', name: 'Comunicación', icon: '💬', color: 'from-sky-500 to-blue-500', desc: 'Comunicar mejor' }
];

const MENTOR_RESOURCES = [
  { title: 'Modelo Belbin', desc: '9 roles de equipo', icon: '🧩' },
  { title: 'Etapas Tuckman', desc: 'Forming → Performing', icon: '📊' },
  { title: '5 Disfunciones', desc: 'Pirámide de Lencioni', icon: '🔺' },
  { title: 'Seguridad Psicológica', desc: 'Modelo Edmondson', icon: '🛡️' },
  { title: 'Matriz Eisenhower', desc: 'Priorizar tareas', icon: '⚡' },
  { title: 'RACI Matrix', desc: 'Roles y responsabilidades', icon: '📋' }
];

const MentorMode = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido/a a tu sesión de mentoría! 🎓\n\nSoy tu coach experto en **trabajo en equipo sanitario**. Estoy aquí para ayudarte con cualquier desafío que enfrentes.\n\n**Puedo ayudarte con:**\n• Dinámicas de equipo y roles\n• Resolución de conflictos\n• Liderazgo y delegación\n• Comunicación efectiva\n• Reuniones productivas\n\n¿Qué situación te gustaría explorar hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '<span class="text-violet-400">•</span>')
      .replace(/\n/g, '<br/>');
  };

  const handleExpertiseClick = (expertise) => {
    setSelectedExpertise(expertise);
    const prompts = {
      belbin: "Explícame los 9 roles de Belbin y cómo identificar mi rol dominante en el equipo",
      tuckman: "¿Cuáles son las fases de desarrollo de un equipo según Tuckman y cómo facilitar cada transición?",
      lencioni: "Explícame las 5 disfunciones de un equipo de Lencioni y cómo superarlas",
      delegacion: "¿Cómo puedo delegar tareas de forma efectiva en mi equipo de enfermería?",
      reuniones: "Dame consejos para hacer reuniones de equipo más productivas y breves",
      conflictos: "Tengo un conflicto entre dos compañeros del equipo, ¿cómo puedo mediarlo?",
      motivacion: "Mi equipo está desmotivado últimamente, ¿qué estrategias puedo usar?",
      comunicacion: "¿Cómo mejorar la comunicación en un equipo multidisciplinar sanitario?"
    };
    setInput(prompts[expertise.id] || `Háblame sobre ${expertise.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setSelectedExpertise(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un mentor experto y carismático en trabajo en equipo y dinámicas grupales, especializado en equipos sanitarios y de enfermería.

TU EXPERTISE PROFUNDO:
1. **Roles de equipo (Belbin)**: Los 9 roles (Cerebro, Investigador, Coordinador, Impulsor, Monitor, Cohesionador, Implementador, Finalizador, Especialista), cómo equilibrar equipos, identificar fortalezas y debilidades
2. **Etapas de desarrollo (Tuckman)**: Forming, Storming, Norming, Performing, Adjourning - cómo facilitar cada transición, señales de cada fase
3. **Las 5 disfunciones (Lencioni)**: Falta de confianza, miedo al conflicto, falta de compromiso, evitar responsabilidad, falta de atención a resultados - estrategias para cada una
4. **Seguridad psicológica (Edmondson)**: Cómo crear entornos donde el equipo puede arriesgar, preguntar y fallar sin miedo
5. **Delegación efectiva**: Matriz Eisenhower aplicada, los 5 niveles de delegación, seguimiento sin microgestión
6. **Reuniones productivas**: Técnicas (stand-up, retrospectivas), roles (facilitador, timekeeper), seguimiento de acuerdos
7. **Resolución de conflictos**: Modelo Thomas-Kilmann, mediación, conversaciones difíciles
8. **Motivación de equipos**: Teoría de Herzberg, reconocimiento, propósito compartido

ESTILO DE COACHING TRANSFORMADOR:
- Haz preguntas poderosas y reflexivas antes de dar consejos directos
- Usa el método socrático para guiar al aprendizaje
- Ofrece frameworks y modelos teóricos cuando sean útiles, pero hazlos prácticos
- Da ejemplos concretos del ámbito sanitario (urgencias, turnos, equipos multidisciplinares)
- Sugiere ejercicios, dinámicas o actividades que puedan implementar
- Equilibra teoría con aplicación inmediata
- Celebra los pequeños avances y valida las dificultades
- Usa metáforas y analogías para explicar conceptos complejos

FORMATO DE RESPUESTAS:
- Usa **negritas** para conceptos clave
- Usa listas con • para pasos o elementos
- Sé conciso pero profundo
- Incluye una pregunta reflexiva al final cuando sea apropiado

TONO: Cálido, empático, profesional y motivador. Como un mentor experimentado que ha visto de todo pero sigue creyendo en el potencial de cada equipo.

Siempre en español, contextualizado al ámbito sanitario/enfermería española.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Nueva sesión de mentoría iniciada! 🎓✨\n\nEstoy listo para explorar nuevos desafíos contigo. ¿Qué aspecto del trabajo en equipo te gustaría trabajar?'
    }]);
    setSessionTime(0);
  };

  const questionsAsked = messages.filter(m => m.role === 'user').length;

  return (
    <div className="h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400/20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-violet-500/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-violet-500/20 rounded-xl transition-all group">
                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </button>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/40 ring-2 ring-violet-400/30">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-slate-800">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                  Mentor de Equipos
                </h1>
                <p className="text-xs text-violet-300/80 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Coach experto en trabajo en equipo sanitario
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 bg-slate-800/60 rounded-xl px-4 py-2 border border-violet-500/20">
                <div className="flex items-center gap-2 text-violet-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">{formatTime(sessionTime)}</span>
                </div>
                <div className="w-px h-4 bg-violet-500/30" />
                <div className="flex items-center gap-2 text-violet-300">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{questionsAsked}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowResources(!showResources)}
                className={`p-2.5 rounded-xl transition-all ${showResources ? 'bg-violet-500 text-white' : 'hover:bg-violet-500/20 text-slate-300 hover:text-white'}`}
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button onClick={clearChat} className="p-2.5 hover:bg-rose-500/20 rounded-xl transition-all text-slate-400 hover:text-rose-400">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeInUp 0.3s ease-out' }}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30 ring-2 ring-violet-400/20">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-xl shadow-violet-500/20'
                    : 'bg-slate-800/90 backdrop-blur border border-violet-500/20 text-slate-100 shadow-xl'
                }`}>
                  <div 
                    className="text-sm leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} 
                  />
                </div>
                {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-800/90 backdrop-blur border border-violet-500/20 rounded-2xl px-5 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-violet-300">Reflexionando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {messages.length <= 2 && (
          <div className="px-4 md:px-6 pb-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-violet-400 mb-3 text-center font-medium">Elige un tema para comenzar</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {MENTOR_EXPERTISE.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => handleExpertiseClick(exp)}
                    className={`bg-slate-800/80 hover:bg-slate-700/80 border border-violet-500/30 hover:border-violet-400/50 rounded-xl p-3 text-left transition-all group hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10 ${selectedExpertise?.id === exp.id ? 'ring-2 ring-violet-500 bg-violet-500/20' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{exp.icon}</span>
                      <span className="text-sm font-bold text-white group-hover:text-violet-200">{exp.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">{exp.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-t border-violet-500/30 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Cuéntame tu situación o pregunta..."
                  className="w-full bg-slate-800/80 border-2 border-violet-500/30 hover:border-violet-500/50 focus:border-violet-500 rounded-xl px-5 py-3.5 text-white placeholder-slate-400 focus:outline-none transition-all pr-12"
                  disabled={isLoading}
                />
                <Lightbulb className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500/50" />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] flex items-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                <span className="hidden md:inline">Enviar</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {showResources && (
        <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-l border-violet-500/30 p-4 overflow-y-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-400" />
              Recursos
            </h3>
            <button 
              onClick={() => setShowResources(false)}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white md:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-violet-400" />
                <span className="font-bold text-white">Modelos Teóricos</span>
              </div>
              <div className="space-y-2">
                {MENTOR_RESOURCES.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(`Explícame el ${res.title} y cómo aplicarlo en mi equipo`);
                      setShowResources(false);
                    }}
                    className="w-full bg-slate-800/60 hover:bg-slate-700/60 rounded-lg p-2.5 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{res.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-violet-200">{res.title}</p>
                        <p className="text-xs text-slate-400">{res.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-white">Preguntas Sugeridas</span>
              </div>
              <div className="space-y-2">
                {[
                  "¿Cómo crear un buen ambiente de equipo?",
                  "¿Cómo manejar un compañero difícil?",
                  "¿Cómo motivar al equipo en turnos largos?",
                  "¿Cómo integrar a alguien nuevo?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q);
                      setShowResources(false);
                    }}
                    className="w-full text-left text-sm text-violet-300 hover:text-violet-200 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg px-3 py-2 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white">Tu Sesión</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-white">{formatTime(sessionTime)}</p>
                  <p className="text-xs text-slate-400">Tiempo</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-black text-white">{questionsAsked}</p>
                  <p className="text-xs text-slate-400">Preguntas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

const TeamworkAnalytics = ({ onBack }) => {
  const { profile, getDominantRoles, getTrends } = useTeamworkProfileContext();
  const dominantRoles = getDominantRoles();
  const trends = getTrends(10);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
      <FloatingParticles />
      <GlowingOrb color="#0ea5e9" size="250px" left="5%" top="20%" delay="0s" />

      <div className="max-w-4xl mx-auto relative z-10 pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500/20 to-blue-500/20 px-6 py-3 rounded-2xl border border-sky-500/30 mb-4">
            <BarChart3 className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-black text-white">Tu Perfil de Equipo</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sesiones Totales</p>
                <p className="text-2xl font-black text-white">{profile?.totalSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Puntuación Media</p>
                <p className="text-2xl font-black text-white">{(profile?.averageScore || 0).toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Rol Dominante</p>
                <p className="text-lg font-black text-white">{dominantRoles[0]?.role || 'Sin datos'}</p>
              </div>
            </div>
          </div>
        </div>

        {dominantRoles.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-amber-400" />
              Tus Roles Belbin Principales
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {dominantRoles.map((role, idx) => {
                const roleData = BELBIN_ROLES.find(r => r.id === role.role.toLowerCase());
                return (
                  <div key={idx} className={`bg-gradient-to-br ${roleData?.color || 'from-slate-600 to-slate-700'} rounded-xl p-4 text-center`}>
                    <div className="text-3xl mb-2">{roleData?.icon || '🧩'}</div>
                    <p className="text-white font-bold">{role.role}</p>
                    <p className="text-white/80 text-sm">{role.count} evaluaciones</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {trends.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-sky-400" />
              Historial Reciente
            </h3>
            <div className="space-y-3">
              {trends.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-700/50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">{t.date}</span>
                    <span className="text-white font-medium">{t.type === 'belbin' ? 'Test Belbin' : t.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.role && <span className="text-amber-400 text-sm">{t.role}</span>}
                    <span className={`font-bold ${t.score >= 70 ? 'text-emerald-400' : t.score >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {t.score.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!profile || profile.totalSessions === 0) && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Aún no hay datos</h3>
            <p className="text-slate-300">Completa actividades para ver tu perfil de trabajo en equipo aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TEAMWORK_DIMENSIONS = [
  { id: 'cohesion', name: 'Cohesión', icon: '🤝', color: 'from-emerald-500 to-teal-500' },
  { id: 'comunicacion', name: 'Comunicación Interna', icon: '💬', color: 'from-blue-500 to-cyan-500' },
  { id: 'coordinacion', name: 'Coordinación', icon: '⚙️', color: 'from-violet-500 to-purple-500' },
  { id: 'responsabilidad', name: 'Responsabilidad', icon: '✅', color: 'from-amber-500 to-orange-500' },
  { id: 'confianza', name: 'Confianza', icon: '🛡️', color: 'from-indigo-500 to-blue-500' },
  { id: 'resolucion', name: 'Resolución Conjunta', icon: '🧩', color: 'from-rose-500 to-pink-500' }
];

const RadarChart = ({ data, size = 280 }) => {
  const dimensions = TEAMWORK_DIMENSIONS;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.38;
  const levels = 5;

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const radius = (value / 10) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const gridPoints = (level) => {
    return dimensions.map((_, i) => {
      const point = getPoint(i, (level / levels) * 10);
      return `${point.x},${point.y}`;
    }).join(' ');
  };

  const dataPoints = dimensions.map((dim, i) => {
    const point = getPoint(i, data[dim.id] || 0);
    return `${point.x},${point.y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width={size} height={size} className="mx-auto">
        {[...Array(levels)].map((_, i) => (
          <polygon
            key={i}
            points={gridPoints(i + 1)}
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1"
          />
        ))}
        
        {dimensions.map((dim, i) => {
          const point = getPoint(i, 10);
          return (
            <line
              key={dim.id}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeWidth="1"
            />
          );
        })}

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.6)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
          </linearGradient>
        </defs>

        <polygon
          points={dataPoints}
          fill="url(#radarGradient)"
          stroke="rgba(139, 92, 246, 0.8)"
          strokeWidth="2"
          className="drop-shadow-lg"
        />

        {dimensions.map((dim, i) => {
          const point = getPoint(i, data[dim.id] || 0);
          return (
            <circle
              key={`point-${dim.id}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="white"
              stroke="rgba(139, 92, 246, 1)"
              strokeWidth="2"
              className="drop-shadow-md"
            />
          );
        })}

        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(i, 12.5);
          return (
            <text
              key={`label-${dim.id}`}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 text-[10px] font-medium"
            >
              {dim.icon} {dim.name.split(' ')[0]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const TeamworkTestMode = ({ onBack }) => {
  const { addSession } = useTeamworkProfileContext();
  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [isGeneratingConclusion, setIsGeneratingConclusion] = useState(false);

  const generateQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera exactamente 20 preguntas NUEVAS y ÚNICAS para evaluar competencias de trabajo en equipo en contexto de enfermería hospitalaria.

DIMENSIONES A EVALUAR (2 preguntas por dimensión, intercaladas):
1. Cooperación - Disposición a ayudar y trabajar junto a otros
2. Cohesión - Sentido de pertenencia y unidad del grupo
3. Responsabilidad compartida - Asumir compromisos colectivos
4. Comunicación interna - Intercambio efectivo de información
5. Resolución conjunta de problemas - Solucionar dificultades en equipo
6. Apoyo mutuo - Respaldo entre compañeros
7. Confianza en el equipo - Fe en las capacidades del grupo
8. Coordinación - Sincronización de acciones y tareas
9. Rol flexible - Adaptación a diferentes funciones
10. Clima unitario - Ambiente positivo de trabajo

FORMATO DE RESPUESTA (JSON estricto):
{
  "questions": [
    {
      "id": 1,
      "text": "Pregunta contextualizada en enfermería",
      "dimension": "cooperacion|cohesion|responsabilidad|comunicacion|resolucion|apoyo|confianza|coordinacion|rol_flexible|clima",
      "radarDimension": "cohesion|comunicacion|coordinacion|responsabilidad|confianza|resolucion"
    }
  ]
}

REGLAS:
- Cada pregunta debe ser situacional y específica de enfermería hospitalaria
- Las preguntas serán respondidas con escala Likert (1-5)
- Mezcla situaciones de urgencias, hospitalización, atención primaria, etc.
- Varía los escenarios: turnos, guardias, cambios, supervisión, etc.
- NUNCA repitas estructuras o situaciones similares
- Las preguntas deben reflejar situaciones reales del día a día enfermero
- Mapea cada dimensión a una de las 6 dimensiones del radar: cohesion, comunicacion, coordinacion, responsabilidad, confianza, resolucion

Solo responde con el JSON, sin texto adicional.`,
          systemPrompt: 'Eres un experto en evaluación de competencias de trabajo en equipo sanitario. Genera preguntas originales y profesionales para evaluar enfermeros/as.'
        })
      });

      if (!response.ok) throw new Error('Error generando preguntas');

      const data = await response.json();
      let questionsData;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          questionsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e) {
        throw new Error('Error parseando respuesta');
      }

      if (!questionsData.questions || questionsData.questions.length < 20) {
        throw new Error('Preguntas incompletas');
      }

      setQuestions(questionsData.questions.slice(0, 20));
      setPhase('test');
      setCurrentQuestion(0);
      setAnswers({});
    } catch (err) {
      console.error('Error:', err);
      setError('Error generando las preguntas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value) => {
    const q = questions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [q.id]: { value, dimension: q.dimension, radarDimension: q.radarDimension }
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    setPhase('calculating');
    
    const radarScores = {
      cohesion: { total: 0, count: 0 },
      comunicacion: { total: 0, count: 0 },
      coordinacion: { total: 0, count: 0 },
      responsabilidad: { total: 0, count: 0 },
      confianza: { total: 0, count: 0 },
      resolucion: { total: 0, count: 0 }
    };

    const dimensionScores = {};

    Object.values(answers).forEach(answer => {
      const radar = answer.radarDimension;
      if (radarScores[radar]) {
        radarScores[radar].total += answer.value;
        radarScores[radar].count += 1;
      }

      if (!dimensionScores[answer.dimension]) {
        dimensionScores[answer.dimension] = { total: 0, count: 0 };
      }
      dimensionScores[answer.dimension].total += answer.value;
      dimensionScores[answer.dimension].count += 1;
    });

    const radarData = {};
    Object.entries(radarScores).forEach(([key, data]) => {
      radarData[key] = data.count > 0 ? (data.total / data.count) * 2 : 5;
    });

    const overallScore = Object.values(radarData).reduce((a, b) => a + b, 0) / 6;

    const sortedDimensions = Object.entries(radarData)
      .sort((a, b) => a[1] - b[1]);

    const weakAreas = sortedDimensions.slice(0, 2).map(([key]) => 
      TEAMWORK_DIMENSIONS.find(d => d.id === key)
    );

    const strongAreas = sortedDimensions.slice(-2).reverse().map(([key]) => 
      TEAMWORK_DIMENSIONS.find(d => d.id === key)
    );

    setResults({
      radarData,
      overallScore,
      weakAreas,
      strongAreas,
      dimensionScores
    });

    setIsGeneratingConclusion(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera una conclusión profesional para un/a enfermero/a que ha completado un test de trabajo en equipo.

RESULTADOS DEL RADAR:
- Cohesión: ${radarData.cohesion.toFixed(1)}/10
- Comunicación Interna: ${radarData.comunicacion.toFixed(1)}/10
- Coordinación: ${radarData.coordinacion.toFixed(1)}/10
- Responsabilidad: ${radarData.responsabilidad.toFixed(1)}/10
- Confianza: ${radarData.confianza.toFixed(1)}/10
- Resolución Conjunta: ${radarData.resolucion.toFixed(1)}/10

PUNTUACIÓN GLOBAL: ${overallScore.toFixed(1)}/10

ÁREAS MÁS DÉBILES: ${weakAreas.map(a => a?.name).join(', ')}
ÁREAS MÁS FUERTES: ${strongAreas.map(a => a?.name).join(', ')}

Genera una respuesta con este formato EXACTO:

[TITULO:Un título motivador de 3-5 palabras]

[RESUMEN:2-3 frases describiendo el perfil general del profesional en trabajo en equipo]

[FORTALEZAS:
- Fortaleza 1 específica de enfermería
- Fortaleza 2 específica de enfermería
]

[MEJORAS:
- Área de mejora 1 con consejo práctico para enfermería
- Área de mejora 2 con consejo práctico para enfermería
- Área de mejora 3 con consejo práctico para enfermería
]

[CONCLUSION:Párrafo final motivador y profesional adaptado al contexto enfermero, mencionando cómo estas competencias impactan en la calidad asistencial]`,
          systemPrompt: 'Eres un experto en desarrollo profesional de enfermería y competencias de trabajo en equipo sanitario. Tus conclusiones son profesionales, específicas y motivadoras.'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.response;

        const titleMatch = text.match(/\[TITULO:([^\]]+)\]/);
        const summaryMatch = text.match(/\[RESUMEN:([^\]]+)\]/);
        const strengthsMatch = text.match(/\[FORTALEZAS:([\s\S]*?)\]/);
        const improvementsMatch = text.match(/\[MEJORAS:([\s\S]*?)\]/);
        const conclusionMatch = text.match(/\[CONCLUSION:([^\]]+)\]/);

        setResults(prev => ({
          ...prev,
          aiConclusion: {
            title: titleMatch ? titleMatch[1].trim() : 'Tu Perfil de Equipo',
            summary: summaryMatch ? summaryMatch[1].trim() : '',
            strengths: strengthsMatch ? strengthsMatch[1].trim().split('\n').filter(s => s.trim().startsWith('-')).map(s => s.replace('-', '').trim()) : [],
            improvements: improvementsMatch ? improvementsMatch[1].trim().split('\n').filter(s => s.trim().startsWith('-')).map(s => s.replace('-', '').trim()) : [],
            conclusion: conclusionMatch ? conclusionMatch[1].trim() : ''
          }
        }));
      }
    } catch (err) {
      console.error('Error generating conclusion:', err);
    } finally {
      setIsGeneratingConclusion(false);
      setPhase('results');
    }

    addSession({
      type: 'teamwork_test',
      score: overallScore,
      maxScore: 10,
      radarData,
      teamSkills: {
        colaboracion: radarData.cohesion,
        coordinacion: radarData.coordinacion,
        cohesion: radarData.cohesion,
        comunicacionEquipo: radarData.comunicacion,
        resolucionProblemas: radarData.resolucion
      }
    });
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const resetTest = () => {
    setPhase('intro');
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
    setError(null);
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#6366f1" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#8b5cf6" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-3xl mx-auto relative z-10 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 px-6 py-3 rounded-2xl border border-indigo-500/30 mb-4">
              <span className="text-3xl">📋</span>
              <h1 className="text-2xl font-black text-white">Test de Evaluación del Trabajo en Equipo</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              20 preguntas generadas por IA para evaluar tus competencias
            </p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Dimensiones a Evaluar
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Cooperación', 'Cohesión', 'Responsabilidad', 'Comunicación', 'Resolución', 'Apoyo mutuo', 'Confianza', 'Coordinación', 'Rol flexible', 'Clima'].map((dim, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-700/50 rounded-xl p-3 text-center border border-slate-600/50"
                >
                  <p className="text-slate-200 text-sm font-medium">{dim}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              ¿Qué obtendrás?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-white font-medium">Gráfica Radar</p>
                  <p className="text-slate-400 text-sm">Visualización de tus 6 dimensiones clave</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="text-white font-medium">Áreas de Mejora</p>
                  <p className="text-slate-400 text-sm">Recomendaciones personalizadas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏥</span>
                </div>
                <div>
                  <p className="text-white font-medium">Conclusión Enfermera</p>
                  <p className="text-slate-400 text-sm">Análisis adaptado a tu contexto</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-indigo-200 font-medium mb-1">Preguntas Generadas por IA</p>
                <p className="text-slate-300 text-sm">
                  Cada vez que entres al test, se generarán 20 preguntas completamente nuevas y 
                  contextualizadas en situaciones reales de enfermería. Nunca repetirás las mismas preguntas.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-6 text-center">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={generateQuestions}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando preguntas personalizadas...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Comenzar Test
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'test') {
    const q = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentAnswer = answers[q?.id]?.value;

    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl p-3 border border-slate-700 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Pregunta {currentQuestion + 1} de {questions.length}</span>
              <span className="text-indigo-400 text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/30 shadow-2xl mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30">
                {q?.dimension?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
              {q?.text}
            </h2>

            <div className="space-y-3">
              {[
                { value: 1, label: 'Totalmente en desacuerdo', emoji: '😕' },
                { value: 2, label: 'En desacuerdo', emoji: '🤔' },
                { value: 3, label: 'Neutral', emoji: '😐' },
                { value: 4, label: 'De acuerdo', emoji: '🙂' },
                { value: 5, label: 'Totalmente de acuerdo', emoji: '😊' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                    currentAnswer === option.value
                      ? 'bg-indigo-500/20 border-indigo-400 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:border-indigo-400/50 hover:bg-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    currentAnswer === option.value
                      ? 'bg-indigo-500'
                      : 'bg-slate-600'
                  }`}>
                    {option.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.value
                      ? 'border-indigo-400 bg-indigo-500'
                      : 'border-slate-500'
                  }`}>
                    {currentAnswer === option.value && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              onClick={resetTest}
              className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'calculating') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analizando tus respuestas</h2>
          <p className="text-slate-300">Generando tu perfil de trabajo en equipo...</p>
        </div>
      </div>
    );
  }

  if (phase === 'results' && results) {
    const scoreColor = results.overallScore >= 8 ? 'from-emerald-500 to-green-500' : 
                       results.overallScore >= 6 ? 'from-amber-500 to-yellow-500' : 
                       results.overallScore >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';
    const testCategory = getScoreCategory(results.overallScore, 10);
    const testEmoji = getRandomElement(EMOJIS_BY_SCORE[testCategory]);
    const testPhrase = getRandomElement(PHRASES_BY_SCORE[testCategory]);

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 px-5 py-2.5 rounded-2xl border border-indigo-500/30">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-black text-white">Resultados del Test</h1>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-indigo-500/30 shadow-2xl mb-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2 animate-bounce">{testEmoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {testPhrase}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Puntuación Global</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                      {results.overallScore.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-lg">/10</span>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">
                    {results.overallScore >= 8 ? '🏆' : results.overallScore >= 6 ? '⭐' : results.overallScore >= 4 ? '📈' : '💪'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Tu Perfil Radar
              </h3>
              
              <div className="bg-slate-900/50 rounded-xl p-3 mb-3">
                <RadarChart data={results.radarData} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {TEAMWORK_DIMENSIONS.map(dim => (
                  <div key={dim.id} className={`bg-gradient-to-br ${dim.color} rounded-xl p-2 text-center`}>
                    <span className="text-lg">{dim.icon}</span>
                    <p className="text-white text-[10px] font-medium">{dim.name}</p>
                    <p className="text-white/90 text-sm font-bold">{results.radarData[dim.id]?.toFixed(1) || '0'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Fortalezas
                </h3>
                <div className="space-y-1.5">
                  {results.strongAreas.map((area, idx) => area && (
                    <div key={idx} className="flex items-center gap-2 bg-emerald-500/10 rounded-lg p-2">
                      <span className="text-base">{area.icon}</span>
                      <span className="text-emerald-100 text-xs font-medium flex-1">{area.name}</span>
                      <span className="text-emerald-400 text-xs font-bold">{results.radarData[area.id]?.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Mejorar
                </h3>
                <div className="space-y-1.5">
                  {results.weakAreas.map((area, idx) => area && (
                    <div key={idx} className="flex items-center gap-2 bg-amber-500/10 rounded-lg p-2">
                      <span className="text-base">{area.icon}</span>
                      <span className="text-amber-100 text-xs font-medium flex-1">{area.name}</span>
                      <span className="text-amber-400 text-xs font-bold">{results.radarData[area.id]?.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {results.aiConclusion && (
              <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-violet-500/30 shadow-2xl mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{results.aiConclusion.title}</h3>
                    <p className="text-violet-300 text-xs">Conclusión Profesional</p>
                  </div>
                </div>

                {results.aiConclusion.summary && (
                  <p className="text-slate-200 text-sm mb-3 leading-relaxed">
                    {results.aiConclusion.summary}
                  </p>
                )}

                {results.aiConclusion.strengths?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-emerald-400 text-xs font-bold mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Aspectos Destacados
                    </h4>
                    <ul className="space-y-0.5">
                      {results.aiConclusion.strengths.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                          <span className="text-emerald-400">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.aiConclusion.improvements?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-amber-400 text-xs font-bold mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Recomendaciones
                    </h4>
                    <ul className="space-y-0.5">
                      {results.aiConclusion.improvements.slice(0, 2).map((s, i) => (
                        <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                          <span className="text-amber-400">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.aiConclusion.conclusion && (
                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                    <p className="text-violet-100 text-xs leading-relaxed italic">
                      "{results.aiConclusion.conclusion}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {isGeneratingConclusion && (
              <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-700 mb-4 text-center">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin mx-auto mb-2" />
                <p className="text-slate-300 text-sm">Generando conclusión profesional...</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={resetTest}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Repetir Test
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const FUNCTIONAL_ROLES = [
  {
    id: 'facilitador',
    name: 'Facilitador',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    description: 'Guía procesos grupales y asegura la participación de todos',
    skills: ['Escucha activa', 'Gestión del tiempo', 'Síntesis de ideas'],
    scenarios: ['Reunión de equipo', 'Sesión de formación', 'Comité de calidad']
  },
  {
    id: 'moderador',
    name: 'Moderador',
    icon: '⚖️',
    color: 'from-blue-500 to-indigo-500',
    description: 'Mantiene el orden y equilibra las intervenciones',
    skills: ['Imparcialidad', 'Control de tiempos', 'Gestión de turnos'],
    scenarios: ['Debate clínico', 'Sesión de casos', 'Reunión interdisciplinar']
  },
  {
    id: 'coordinador',
    name: 'Coordinador',
    icon: '👔',
    color: 'from-violet-500 to-purple-500',
    description: 'Organiza recursos y sincroniza acciones del equipo',
    skills: ['Planificación', 'Delegación', 'Seguimiento'],
    scenarios: ['Cambio de turno', 'Emergencia', 'Proyecto de mejora']
  },
  {
    id: 'puente',
    name: 'Puente entre profesionales',
    icon: '🌉',
    color: 'from-cyan-500 to-sky-500',
    description: 'Conecta diferentes disciplinas y facilita la comunicación',
    skills: ['Comunicación interdisciplinar', 'Traducción técnica', 'Networking'],
    scenarios: ['Pase de visita', 'Alta compleja', 'Interconsulta']
  },
  {
    id: 'experto',
    name: 'Experto técnico',
    icon: '🔬',
    color: 'from-amber-500 to-orange-500',
    description: 'Aporta conocimiento especializado al equipo',
    skills: ['Conocimiento profundo', 'Enseñanza', 'Resolución técnica'],
    scenarios: ['Procedimiento complejo', 'Formación de nuevos', 'Protocolo específico']
  },
  {
    id: 'mediador',
    name: 'Mediador de conflictos',
    icon: '🕊️',
    color: 'from-rose-500 to-pink-500',
    description: 'Resuelve tensiones y construye consensos',
    skills: ['Empatía', 'Negociación', 'Gestión emocional'],
    scenarios: ['Conflicto entre compañeros', 'Queja de paciente', 'Desacuerdo clínico']
  },
  {
    id: 'motivador',
    name: 'Motivador',
    icon: '🔥',
    color: 'from-yellow-500 to-amber-500',
    description: 'Inspira y mantiene el ánimo del equipo',
    skills: ['Entusiasmo', 'Reconocimiento', 'Energía positiva'],
    scenarios: ['Turno difícil', 'Cambio organizacional', 'Meta de equipo']
  },
  {
    id: 'observador',
    name: 'Observador crítico',
    icon: '👁️',
    color: 'from-slate-500 to-gray-600',
    description: 'Analiza objetivamente y aporta perspectiva externa',
    skills: ['Análisis objetivo', 'Pensamiento crítico', 'Feedback constructivo'],
    scenarios: ['Evaluación de proceso', 'Auditoría', 'Mejora continua']
  }
];

const GroupDynamicsMode = ({ onBack }) => {
  const { addSession } = useTeamworkProfileContext();
  const [phase, setPhase] = useState('intro');
  const [selectedRole, setSelectedRole] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  const generateScenario = async (role) => {
    setIsLoading(true);
    setError(null);

    const hospitalUnits = ['UCI', 'Urgencias', 'Hospitalización Médica', 'Hospitalización Quirúrgica', 'Pediatría', 'Oncología', 'Cardiología', 'Traumatología', 'Neurología', 'Geriatría', 'Neonatología', 'Psiquiatría', 'Rehabilitación', 'Paliativos'];
    const shifts = ['turno de mañana', 'turno de tarde', 'turno de noche', 'turno de fin de semana', 'guardia de 24 horas'];
    const teamSizes = ['equipo reducido (3 personas)', 'equipo estándar (5-6 personas)', 'equipo ampliado (8+ personas)', 'equipo multidisciplinar'];
    const challenges = ['alta carga asistencial', 'situación de emergencia', 'conflicto interpersonal', 'cambio de protocolo', 'falta de recursos', 'paciente complejo', 'familiar difícil', 'nuevo miembro del equipo', 'auditoría interna', 'evento adverso reciente'];
    
    const randomUnit = hospitalUnits[Math.floor(Math.random() * hospitalUnits.length)];
    const randomShift = shifts[Math.floor(Math.random() * shifts.length)];
    const randomTeam = teamSizes[Math.floor(Math.random() * teamSizes.length)];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera un escenario COMPLETAMENTE NUEVO Y ÚNICO para evaluar el rol de "${role.name}" en un equipo de enfermería hospitalaria.

ID ÚNICO DE GENERACIÓN: ${uniqueId}
¡IMPORTANTE! Este escenario debe ser DIFERENTE a cualquier otro generado antes. Usa creatividad máxima.

PARÁMETROS ALEATORIOS PARA ESTE ESCENARIO:
- Unidad hospitalaria: ${randomUnit}
- Turno: ${randomShift}  
- Composición del equipo: ${randomTeam}
- Desafío principal: ${randomChallenge}

ROL A EVALUAR: ${role.name}
DESCRIPCIÓN: ${role.description}
HABILIDADES CLAVE: ${role.skills.join(', ')}

GENERA UN JSON con este formato EXACTO:
{
  "title": "Título breve y ÚNICO del escenario (5-8 palabras, relacionado con ${randomUnit} y ${randomChallenge})",
  "context": "Descripción del contexto en ${randomUnit} durante ${randomShift}, con ${randomTeam}, enfrentando ${randomChallenge} (2-3 frases, situación muy específica y realista)",
  "situation": "Situación concreta que requiere actuar en el rol de ${role.name} (2-3 frases)",
  "steps": [
    {
      "id": 1,
      "prompt": "Primera situación específica relacionada con ${randomChallenge} que el usuario debe resolver como ${role.name}",
      "options": [
        {"id": "a", "text": "Opción concreta A", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "b", "text": "Opción concreta B", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "c", "text": "Opción concreta C", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)}
      ]
    },
    {
      "id": 2,
      "prompt": "Segunda situación que escala o cambia el contexto inicial",
      "options": [
        {"id": "a", "text": "Opción A", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "b", "text": "Opción B", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "c", "text": "Opción C", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)}
      ]
    },
    {
      "id": 3,
      "prompt": "Tercera situación con un giro inesperado o complicación",
      "options": [
        {"id": "a", "text": "Opción A", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "b", "text": "Opción B", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "c", "text": "Opción C", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)}
      ]
    },
    {
      "id": 4,
      "prompt": "Cuarta situación que resuelve o cierra el escenario",
      "options": [
        {"id": "a", "text": "Opción A", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "b", "text": "Opción B", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)},
        {"id": "c", "text": "Opción C", "effectiveness": (número 1-10), "roleAlignment": (número 1-10)}
      ]
    }
  ]
}

REGLAS OBLIGATORIAS:
- NUNCA repitas escenarios - cada generación debe ser única y creativa
- Usa el contexto aleatorio (${randomUnit}, ${randomShift}, ${randomTeam}, ${randomChallenge}) para crear una historia coherente
- Las opciones deben ser TODAS plausibles - no debe haber una respuesta "obvia"
- Varía las puntuaciones: a veces la opción A es mejor, a veces B, a veces C
- Incluye detalles específicos: nombres de colegas, situaciones concretas, diálogos
- El escenario debe tener una narrativa que fluya entre los 4 pasos
- Solo responde con el JSON, sin texto adicional`,
          systemPrompt: 'Eres un experto creativo en dinámicas de equipos sanitarios. Cada escenario que generas es ÚNICO, con historias originales, personajes diferentes y situaciones novedosas. Nunca repites contenido.'
        })
      });

      if (!response.ok) throw new Error('Error generando escenario');

      const data = await response.json();
      let scenarioData;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          scenarioData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e) {
        throw new Error('Error parseando respuesta');
      }

      if (!scenarioData.steps || scenarioData.steps.length < 4) {
        throw new Error('Escenario incompleto');
      }

      setScenario(scenarioData);
      setPhase('scenario');
      setCurrentStep(0);
      setResponses([]);
    } catch (err) {
      console.error('Error:', err);
      setError('Error generando el escenario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const newResponses = [...responses, {
      step: currentStep,
      option: option,
      effectiveness: option.effectiveness,
      roleAlignment: option.roleAlignment
    }];
    setResponses(newResponses);

    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateEvaluation(newResponses);
    }
  };

  const generateEvaluation = async (allResponses) => {
    setPhase('evaluating');
    setIsLoading(true);

    const avgEffectiveness = allResponses.reduce((a, r) => a + r.effectiveness, 0) / allResponses.length;
    const avgAlignment = allResponses.reduce((a, r) => a + r.roleAlignment, 0) / allResponses.length;
    const overallScore = ((avgEffectiveness + avgAlignment) / 2);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera una evaluación profesional para un/a enfermero/a que ha completado un ejercicio de rol de equipo.

ROL EVALUADO: ${selectedRole.name}
DESCRIPCIÓN DEL ROL: ${selectedRole.description}
HABILIDADES CLAVE: ${selectedRole.skills.join(', ')}

ESCENARIO: ${scenario.title}
CONTEXTO: ${scenario.context}

RESULTADOS:
- Efectividad promedio: ${avgEffectiveness.toFixed(1)}/10
- Alineación con el rol: ${avgAlignment.toFixed(1)}/10
- Puntuación global: ${overallScore.toFixed(1)}/10

RESPUESTAS DEL USUARIO:
${allResponses.map((r, i) => `Paso ${i + 1}: Opción "${r.option.text}" (Efectividad: ${r.effectiveness}, Alineación: ${r.roleAlignment})`).join('\n')}

Genera un JSON con este formato EXACTO:
{
  "roleEffectiveness": {
    "score": ${avgEffectiveness.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre si el rol fue desempeñado eficazmente",
    "strengths": ["Fortaleza 1 específica", "Fortaleza 2 específica"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"]
  },
  "complementarity": {
    "score": ${(Math.random() * 3 + 5).toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre complementariedad con otros roles del equipo",
    "suggestedRoles": ["Rol complementario 1", "Rol complementario 2"],
    "gaps": "Descripción de qué falta en la complementariedad"
  },
  "adaptability": {
    "score": ${avgAlignment.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre capacidad de adaptación",
    "tips": ["Consejo práctico 1 para mejorar adaptabilidad", "Consejo práctico 2", "Consejo práctico 3"]
  },
  "overallConclusion": "Párrafo de conclusión profesional (3-4 frases) integrando efectividad, complementariedad y adaptabilidad, con recomendaciones específicas para enfermería"
}

Solo responde con el JSON, sin texto adicional.`,
          systemPrompt: 'Eres un experto en evaluación de competencias de equipos sanitarios y desarrollo profesional de enfermería.'
        })
      });

      if (response.ok) {
        const data = await response.json();
        let evalData;

        try {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            evalData = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing evaluation:', e);
        }

        setEvaluation({
          ...evalData,
          overallScore,
          avgEffectiveness,
          avgAlignment,
          responses: allResponses
        });
      }
    } catch (err) {
      console.error('Error generating evaluation:', err);
      setEvaluation({
        overallScore,
        avgEffectiveness,
        avgAlignment,
        responses: allResponses,
        roleEffectiveness: {
          score: avgEffectiveness,
          assessment: 'Evaluación basada en tus respuestas.',
          strengths: ['Participación activa', 'Toma de decisiones'],
          improvements: ['Práctica continua', 'Explorar otros roles']
        },
        complementarity: {
          score: 6,
          assessment: 'Tu rol puede complementarse con otros del equipo.',
          suggestedRoles: ['Coordinador', 'Mediador'],
          gaps: 'Considera desarrollar habilidades complementarias.'
        },
        adaptability: {
          score: avgAlignment,
          assessment: 'Tu capacidad de adaptación al rol evaluado.',
          tips: ['Practica en diferentes contextos', 'Observa a compañeros expertos', 'Solicita feedback']
        },
        overallConclusion: 'Has completado la evaluación de rol. Continúa practicando para mejorar tu desempeño en equipos sanitarios.'
      });
    } finally {
      setIsLoading(false);
      setPhase('results');

      addSession({
        type: 'role_dynamics',
        role: selectedRole.id,
        roleName: selectedRole.name,
        score: overallScore,
        maxScore: 10,
        effectiveness: avgEffectiveness,
        roleAlignment: avgAlignment,
        teamSkills: {
          colaboracion: avgAlignment,
          coordinacion: avgEffectiveness,
          cohesion: (avgEffectiveness + avgAlignment) / 2
        }
      });
    }
  };

  const resetExercise = () => {
    setPhase('intro');
    setSelectedRole(null);
    setScenario(null);
    setCurrentStep(0);
    setResponses([]);
    setEvaluation(null);
    setError(null);
  };

  if (phase === 'intro') {
    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        <GlowingOrb color="#10b981" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#14b8a6" size="200px" left="80%" top="55%" delay="2s" />

        <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Handshake className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Dinámicas de Roles</h1>
            <p className="text-xs text-emerald-300">Evalúa tu desempeño en roles funcionales</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-6">
              <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block text-sm">
                Selecciona un rol funcional para practicar en un escenario simulado
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {FUNCTIONAL_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={`bg-slate-800/90 backdrop-blur-xl border-2 ${
                    selectedRole?.id === role.id 
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30' 
                      : 'border-slate-600 hover:border-emerald-400/50'
                  } rounded-xl p-4 text-left transition-all group`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    {role.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{role.name}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2">{role.description}</p>
                </button>
              ))}
            </div>

            {selectedRole && (
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-3xl shadow-xl`}>
                    {selectedRole.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{selectedRole.name}</h3>
                    <p className="text-slate-300 text-sm mb-3">{selectedRole.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-emerald-400 text-xs font-medium mb-1">Habilidades clave:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedRole.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-400 text-xs font-medium mb-1">Contextos típicos:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedRole.scenarios.map((sc, idx) => (
                          <span key={idx} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 mb-4 text-center">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => generateScenario(selectedRole)}
              disabled={!selectedRole || isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando escenario...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Iniciar Simulación
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'scenario' && scenario) {
    const step = scenario.steps[currentStep];
    const progress = ((currentStep + 1) / scenario.steps.length) * 100;

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-xl shadow-lg`}>
                {selectedRole.icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{scenario.title}</p>
                <p className="text-slate-400 text-xs">Rol: {selectedRole.name}</p>
              </div>
            </div>
            <span className="text-emerald-400 text-sm font-medium">{currentStep + 1}/{scenario.steps.length}</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto relative z-10">
            {currentStep === 0 && (
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-slate-700 mb-4">
                <h3 className="text-emerald-400 font-bold text-sm mb-2">Contexto</h3>
                <p className="text-slate-200 text-sm mb-2">{scenario.context}</p>
                <p className="text-slate-300 text-sm">{scenario.situation}</p>
              </div>
            )}

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                  Situación {currentStep + 1}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-6 leading-relaxed">
                {step.prompt}
              </h2>

              <div className="space-y-3">
                {step.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className="w-full p-4 rounded-xl border-2 border-slate-600 bg-slate-700/50 text-slate-200 hover:border-emerald-400/50 hover:bg-slate-700 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold text-white group-hover:bg-emerald-500 transition-colors">
                        {option.id.toUpperCase()}
                      </div>
                      <p className="flex-1 text-sm leading-relaxed">{option.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'evaluating') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Evaluando tu desempeño</h2>
          <p className="text-slate-300">Analizando efectividad, complementariedad y adaptabilidad...</p>
        </div>
      </div>
    );
  }

  if (phase === 'results' && evaluation) {
    const scoreColor = evaluation.overallScore >= 8 ? 'from-emerald-500 to-green-500' : 
                       evaluation.overallScore >= 6 ? 'from-amber-500 to-yellow-500' : 
                       evaluation.overallScore >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';
    const dynamicsCategory = getScoreCategory(evaluation.overallScore, 10);
    const dynamicsEmoji = getRandomElement(EMOJIS_BY_SCORE[dynamicsCategory]);
    const dynamicsPhrase = getRandomElement(PHRASES_BY_SCORE[dynamicsCategory]);

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-5 py-2.5 rounded-2xl border border-emerald-500/30">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-black text-white">Evaluación del Rol: {selectedRole.name}</h1>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 shadow-2xl mb-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2 animate-bounce">{dynamicsEmoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {dynamicsPhrase}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Puntuación Global</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                      {evaluation.overallScore.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-lg">/10</span>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{selectedRole.icon}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Efectividad</p>
                  <p className="text-2xl font-bold text-emerald-400">{evaluation.avgEffectiveness.toFixed(1)}</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs mb-1">Alineación con Rol</p>
                  <p className="text-2xl font-bold text-teal-400">{evaluation.avgAlignment.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {evaluation.roleEffectiveness && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Efectividad del Rol
                </h3>
                <p className="text-slate-200 text-sm mb-3">{evaluation.roleEffectiveness.assessment}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-emerald-300 text-xs font-medium mb-1">Fortalezas</p>
                    <ul className="space-y-0.5">
                      {evaluation.roleEffectiveness.strengths?.map((s, i) => (
                        <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                          <span className="text-emerald-400">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-amber-300 text-xs font-medium mb-1">Mejorar</p>
                    <ul className="space-y-0.5">
                      {evaluation.roleEffectiveness.improvements?.map((s, i) => (
                        <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                          <span className="text-amber-400">→</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {evaluation.complementarity && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Complementariedad
                </h3>
                <p className="text-slate-200 text-sm mb-3">{evaluation.complementarity.assessment}</p>
                
                <div className="mb-2">
                  <p className="text-blue-300 text-xs font-medium mb-1">Roles que te complementan:</p>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.complementarity.suggestedRoles?.map((role, i) => (
                      <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                {evaluation.complementarity.gaps && (
                  <p className="text-slate-400 text-xs italic">{evaluation.complementarity.gaps}</p>
                )}
              </div>
            )}

            {evaluation.adaptability && (
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Adaptabilidad
                </h3>
                <p className="text-slate-200 text-sm mb-3">{evaluation.adaptability.assessment}</p>
                
                <p className="text-violet-300 text-xs font-medium mb-1">Consejos para mejorar:</p>
                <ul className="space-y-0.5">
                  {evaluation.adaptability.tips?.map((tip, i) => (
                    <li key={i} className="text-slate-300 text-xs flex items-start gap-1">
                      <span className="text-violet-400">💡</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.overallConclusion && (
              <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-amber-500/30">
                <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Conclusión
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed italic">
                  "{evaluation.overallConclusion}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={resetExercise}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Probar Otro Rol
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const COHESION_DIMENSIONS = [
  { id: 'positiveClimate', name: 'Clima Positivo', icon: '☀️', color: 'from-amber-500 to-yellow-500', description: 'Favoreces un ambiente de trabajo agradable y motivador' },
  { id: 'valueContributions', name: 'Valoración de Aportaciones', icon: '💬', color: 'from-emerald-500 to-green-500', description: 'Reconoces y valoras las ideas y sugerencias de otros' },
  { id: 'collectiveAchievements', name: 'Logros Colectivos', icon: '🏆', color: 'from-violet-500 to-purple-500', description: 'Celebras y refuerzas los éxitos del equipo' },
  { id: 'effortRecognition', name: 'Reconocimiento de Esfuerzos', icon: '⭐', color: 'from-pink-500 to-rose-500', description: 'Aprecias el trabajo y dedicación del personal' },
  { id: 'positiveInterdependence', name: 'Interdependencia Positiva', icon: '🔗', color: 'from-cyan-500 to-blue-500', description: 'Promueves la colaboración y dependencia saludable' },
  { id: 'avoidIsolation', name: 'Prevención del Aislamiento', icon: '🤝', color: 'from-orange-500 to-red-500', description: 'Evitas que compañeros se sientan excluidos' }
];

const COHESION_CONTEXTS = [
  'Reunión de equipo de enfermería tras turno difícil',
  'Cambio de turno con traspaso de pacientes críticos',
  'Sesión clínica multidisciplinar',
  'Presentación de nuevo protocolo de trabajo',
  'Momento de estrés por alta carga asistencial',
  'Celebración tras superar objetivo de calidad',
  'Incorporación de personal nuevo al equipo',
  'Resolución de incidencia con paciente complejo',
  'Planificación de vacaciones y turnos',
  'Evaluación trimestral del funcionamiento del equipo'
];

const COHESION_SITUATIONS = [
  'Una compañera ha cometido un error menor que nadie más ha notado',
  'El equipo acaba de conseguir un objetivo importante',
  'Un miembro del equipo parece desmotivado últimamente',
  'Hay tensión entre dos compañeras por diferencias de criterio',
  'Una auxiliar nueva se siente insegura con sus tareas',
  'El supervisor ha felicitado solo a una persona del equipo',
  'Un compañero ha cubierto varios turnos extra esta semana',
  'Se ha resuelto una situación crítica gracias al trabajo en equipo',
  'Alguien propone una idea innovadora en la reunión',
  'Un miembro veterano critica la forma de trabajar de los nuevos'
];

const COHESION_EMOJIS = {
  excellent: ['🌟', '💎', '🏆', '👑', '✨', '🎯', '💪', '🚀', '🌈', '💫', '🔥', '🎉', '⭐', '🙌', '💯'],
  good: ['👏', '💚', '🌻', '🎖️', '✅', '👍', '🌿', '💐', '🌸', '☀️', '🎊', '🤩', '💙', '🌺', '🍀'],
  average: ['📈', '🔄', '💡', '🧭', '🌱', '🔑', '📚', '🎓', '🌤️', '🛠️', '💭', '🧩', '📊', '⚡', '🌅'],
  poor: ['😕', '📉', '🔧', '⚠️', '🎯', '💪', '🌅', '🔄', '📖', '🛤️', '🌱', '💭', '🧠', '📝', '🔍']
};

const COHESION_PHRASES = {
  excellent: [
    '¡Excepcional! Eres un pilar de cohesión en tu equipo',
    '¡Brillante! Tu capacidad de unir al equipo es extraordinaria',
    '¡Sobresaliente! Fomentas un ambiente de apoyo ejemplar',
    '¡Impresionante! Tu liderazgo cohesivo inspira a otros',
    '¡Fantástico! Eres un/a auténtico/a constructor/a de equipos'
  ],
  good: [
    '¡Muy bien! Contribuyes positivamente a la unión del equipo',
    '¡Buen trabajo! Tu apoyo mutuo fortalece al grupo',
    '¡Genial! Sabes crear vínculos profesionales saludables',
    '¡Estupendo! Tu actitud cohesiva marca la diferencia',
    '¡Notable! Fomentas un clima de colaboración efectivo'
  ],
  average: [
    'Hay base, pero puedes potenciar más la cohesión grupal',
    'Vas por buen camino, sigue reforzando los vínculos del equipo',
    'Tienes potencial para ser más influyente en la unión del grupo',
    'Con pequeños ajustes, tu impacto en la cohesión será mayor',
    'Estás en el camino correcto, pero hay margen de mejora'
  ],
  poor: [
    'Es importante trabajar más en fortalecer los lazos del equipo',
    'La cohesión grupal es clave - enfócate en mejorar esta área',
    'El apoyo mutuo necesita más atención en tu práctica diaria',
    'Reflexiona sobre cómo puedes contribuir más a la unión del equipo',
    'Hay oportunidades claras para mejorar tu rol cohesivo'
  ]
};

const CohesionEvaluatorMode = ({ onBack }) => {
  const { addSession } = useTeamworkProfileContext();
  const [phase, setPhase] = useState('intro');
  const [scenario, setScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [usedCombinations, setUsedCombinations] = useState(new Set());
  const [scenariosCompleted, setScenariosCompleted] = useState(0);

  const getUnusedCombination = () => {
    let attempts = 0;
    let context, situation;
    do {
      context = COHESION_CONTEXTS[Math.floor(Math.random() * COHESION_CONTEXTS.length)];
      situation = COHESION_SITUATIONS[Math.floor(Math.random() * COHESION_SITUATIONS.length)];
      attempts++;
    } while (usedCombinations.has(`${context}-${situation}`) && attempts < 50);
    return { context, situation };
  };

  const getScoreCategory = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return 'excellent';
    if (pct >= 60) return 'good';
    if (pct >= 40) return 'average';
    return 'poor';
  };

  const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateCohesionScenario = async () => {
    setIsLoading(true);
    setError(null);

    const { context, situation } = getUnusedCombination();
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    setUsedCombinations(prev => new Set([...prev, `${context}-${situation}`]));

    const professionalNames = ['Carmen', 'Lucía', 'María', 'Ana', 'Rosa', 'Elena', 'Laura', 'Marta', 'Paula', 'Sofía', 'Carlos', 'Javier', 'Miguel', 'Pedro', 'Luis', 'David', 'Pablo', 'Sergio', 'Andrés', 'Manuel'];
    const shuffledNames = [...professionalNames].sort(() => Math.random() - 0.5).slice(0, 4);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera un escenario ÚNICO para evaluar la COHESIÓN Y APOYO MUTUO en un equipo sanitario.

ID ÚNICO: ${uniqueId}
¡IMPORTANTE! Cada escenario debe ser DIFERENTE y CREATIVO. Nunca repitas situaciones.

CONTEXTO: ${context}
SITUACIÓN CLAVE: ${situation}
PERSONAJES: ${shuffledNames.join(', ')}

Las 6 DIMENSIONES a evaluar son:
1. CLIMA POSITIVO - ¿Favorece un ambiente agradable y motivador?
2. VALORACIÓN DE APORTACIONES - ¿Reconoce las ideas y sugerencias de otros?
3. LOGROS COLECTIVOS - ¿Celebra y refuerza los éxitos del equipo?
4. RECONOCIMIENTO DE ESFUERZOS - ¿Aprecia el trabajo y dedicación del personal?
5. INTERDEPENDENCIA POSITIVA - ¿Promueve la colaboración saludable?
6. PREVENCIÓN DEL AISLAMIENTO - ¿Evita que compañeros se sientan excluidos?

Genera un JSON con este formato EXACTO:
{
  "title": "Título breve del escenario (6-10 palabras)",
  "context": "Descripción del contexto en ${context}, ambiente y estado del equipo (3-4 frases)",
  "situation": "Descripción de ${situation} con nombres de ${shuffledNames.slice(0, 2).join(' y ')} (3-4 frases con diálogos)",
  "yourRole": "Tu papel como profesional de enfermería que debe actuar",
  "steps": [
    {
      "id": 1,
      "dimension": "positiveClimate",
      "dimensionName": "Clima Positivo",
      "situation": "Primera situación relacionada con crear buen ambiente (incluir diálogo)",
      "options": [
        {"id": "a", "text": "Respuesta que fomenta clima positivo", "score": 9, "feedback": "Por qué es buena opción"},
        {"id": "b", "text": "Respuesta neutral", "score": 5, "feedback": "Por qué es neutral"},
        {"id": "c", "text": "Respuesta que perjudica el clima", "score": 2, "feedback": "Por qué es negativa"}
      ]
    },
    {
      "id": 2,
      "dimension": "valueContributions",
      "dimensionName": "Valoración de Aportaciones",
      "situation": "Situación donde alguien aporta una idea o sugerencia",
      "options": [
        {"id": "a", "text": "Opción A", "score": (1-10), "feedback": "Explicación"},
        {"id": "b", "text": "Opción B", "score": (1-10), "feedback": "Explicación"},
        {"id": "c", "text": "Opción C", "score": (1-10), "feedback": "Explicación"}
      ]
    },
    {
      "id": 3,
      "dimension": "collectiveAchievements",
      "dimensionName": "Logros Colectivos",
      "situation": "Momento para celebrar o reconocer un logro grupal",
      "options": [
        {"id": "a", "text": "Opción A", "score": (1-10), "feedback": "Explicación"},
        {"id": "b", "text": "Opción B", "score": (1-10), "feedback": "Explicación"},
        {"id": "c", "text": "Opción C", "score": (1-10), "feedback": "Explicación"}
      ]
    },
    {
      "id": 4,
      "dimension": "effortRecognition",
      "dimensionName": "Reconocimiento de Esfuerzos",
      "situation": "Oportunidad de reconocer el esfuerzo de un compañero/a",
      "options": [
        {"id": "a", "text": "Opción A", "score": (1-10), "feedback": "Explicación"},
        {"id": "b", "text": "Opción B", "score": (1-10), "feedback": "Explicación"},
        {"id": "c", "text": "Opción C", "score": (1-10), "feedback": "Explicación"}
      ]
    },
    {
      "id": 5,
      "dimension": "positiveInterdependence",
      "dimensionName": "Interdependencia Positiva",
      "situation": "Momento que requiere colaboración y dependencia mutua",
      "options": [
        {"id": "a", "text": "Opción A", "score": (1-10), "feedback": "Explicación"},
        {"id": "b", "text": "Opción B", "score": (1-10), "feedback": "Explicación"},
        {"id": "c", "text": "Opción C", "score": (1-10), "feedback": "Explicación"}
      ]
    },
    {
      "id": 6,
      "dimension": "avoidIsolation",
      "dimensionName": "Prevención del Aislamiento",
      "situation": "Situación donde alguien podría sentirse excluido",
      "options": [
        {"id": "a", "text": "Opción A", "score": (1-10), "feedback": "Explicación"},
        {"id": "b", "text": "Opción B", "score": (1-10), "feedback": "Explicación"},
        {"id": "c", "text": "Opción C", "score": (1-10), "feedback": "Explicación"}
      ]
    }
  ]
}

REGLAS OBLIGATORIAS:
- NUNCA repitas escenarios - cada generación debe ser ÚNICA
- Las opciones deben ser REALISTAS en el contexto sanitario español
- Varía las puntuaciones - a veces A es mejor, a veces B o C
- Incluye DIÁLOGOS concretos entre profesionales
- Cada paso debe evaluar claramente UNA dimensión de cohesión
- El feedback debe explicar el impacto en la cohesión del equipo
- Solo responde con el JSON, sin texto adicional`,
          systemPrompt: 'Eres un experto en psicología de equipos sanitarios y cohesión grupal. Creas escenarios realistas para evaluar cómo los profesionales de enfermería fomentan el apoyo mutuo, el reconocimiento y la unión del equipo en hospitales españoles.'
        })
      });

      if (!response.ok) throw new Error('Error generando escenario');

      const data = await response.json();
      let scenarioData;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          scenarioData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e) {
        throw new Error('Error parseando respuesta');
      }

      if (!scenarioData.steps || scenarioData.steps.length < 6) {
        throw new Error('Escenario incompleto');
      }

      setScenario(scenarioData);
      setPhase('scenario');
      setCurrentStep(0);
      setResponses([]);
    } catch (err) {
      console.error('Error:', err);
      setError('Error generando el escenario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const currentDimension = scenario.steps[currentStep].dimension;
    const newResponses = [...responses, {
      step: currentStep,
      dimension: currentDimension,
      dimensionName: scenario.steps[currentStep].dimensionName,
      option: option,
      score: option.score,
      feedback: option.feedback
    }];
    setResponses(newResponses);

    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateEvaluation(newResponses);
    }
  };

  const generateEvaluation = async (allResponses) => {
    setPhase('evaluating');
    setIsLoading(true);

    const dimensionScores = {};
    COHESION_DIMENSIONS.forEach(dim => {
      const resp = allResponses.find(r => r.dimension === dim.id);
      dimensionScores[dim.id] = resp ? resp.score : 5;
    });

    const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0);
    const avgScore = totalScore / 6;
    const maxScore = 10;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera una evaluación profesional de COHESIÓN Y APOYO MUTUO para un/a enfermero/a.

ESCENARIO: ${scenario.title}
CONTEXTO: ${scenario.context}

RESULTADOS EN LAS 6 DIMENSIONES:
- Clima Positivo: ${dimensionScores.positiveClimate}/10
- Valoración de Aportaciones: ${dimensionScores.valueContributions}/10
- Logros Colectivos: ${dimensionScores.collectiveAchievements}/10
- Reconocimiento de Esfuerzos: ${dimensionScores.effortRecognition}/10
- Interdependencia Positiva: ${dimensionScores.positiveInterdependence}/10
- Prevención del Aislamiento: ${dimensionScores.avoidIsolation}/10
- PUNTUACIÓN MEDIA: ${avgScore.toFixed(1)}/10

RESPUESTAS DEL USUARIO:
${allResponses.map((r, i) => `${r.dimensionName}: "${r.option.text}" (${r.score}/10) - ${r.feedback}`).join('\n')}

Genera un JSON con este formato EXACTO:
{
  "dimensionAnalysis": {
    "positiveClimate": {"score": ${dimensionScores.positiveClimate}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"},
    "valueContributions": {"score": ${dimensionScores.valueContributions}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"},
    "collectiveAchievements": {"score": ${dimensionScores.collectiveAchievements}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"},
    "effortRecognition": {"score": ${dimensionScores.effortRecognition}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"},
    "positiveInterdependence": {"score": ${dimensionScores.positiveInterdependence}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"},
    "avoidIsolation": {"score": ${dimensionScores.avoidIsolation}, "assessment": "Evaluación 2-3 frases", "tip": "Un consejo específico"}
  },
  "cohesionStyle": "Nombre del estilo de cohesión predominante (ej: Constructor de Equipos, Animador, Cohesionador Natural, Colaborador, Observador Pasivo, etc.)",
  "strengths": ["Fortaleza 1", "Fortaleza 2"],
  "areasToImprove": ["Área de mejora 1", "Área de mejora 2"],
  "personalizedRecommendation": "Párrafo personalizado de 4-5 frases con recomendación específica basada en los resultados. Debe seguir el formato: 'Tu estilo favorece [aspecto positivo], pero puedes reforzar la cohesión [recomendación específica].' Incluir consejos prácticos para el día a día en enfermería."
}

Solo responde con el JSON, sin texto adicional.`,
          systemPrompt: 'Eres un experto en desarrollo de equipos sanitarios. Proporcionas feedback constructivo y personalizado sobre cohesión grupal y apoyo mutuo en enfermería.'
        })
      });

      if (response.ok) {
        const data = await response.json();
        let evalData;

        try {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            evalData = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing evaluation:', e);
        }

        setEvaluation({
          ...evalData,
          avgScore,
          dimensionScores,
          responses: allResponses
        });

        addSession({
          type: 'cohesion_evaluation',
          score: avgScore,
          maxScore: 10,
          dimensionScores,
          cohesionStyle: evalData?.cohesionStyle || 'No determinado',
          teamSkills: {
            cohesion: Math.round(avgScore),
            colaboracion: Math.round((dimensionScores.positiveInterdependence + dimensionScores.valueContributions) / 2)
          }
        });
      }
    } catch (err) {
      console.error('Error generating evaluation:', err);
      setEvaluation({
        avgScore,
        dimensionScores,
        responses: allResponses
      });
    } finally {
      setIsLoading(false);
      setPhase('results');
    }
  };

  const generateNewScenario = () => {
    setScenario(null);
    setCurrentStep(0);
    setResponses([]);
    setEvaluation(null);
    setError(null);
    setScenariosCompleted(prev => prev + 1);
    generateCohesionScenario();
  };

  if (phase === 'intro') {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 relative">
        <FloatingParticles />
        <GlowingOrb color="#06b6d4" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#3b82f6" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-4xl mx-auto relative z-10 pb-24">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-3 rounded-2xl border border-cyan-500/30 mb-4">
              <span className="text-3xl">💎</span>
              <h1 className="text-2xl font-black text-white">Evaluación de Cohesión y Apoyo Mutuo</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Descubre cómo fomentas la unión y el apoyo en tu equipo sanitario
            </p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Las 6 Dimensiones de Cohesión
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COHESION_DIMENSIONS.map((dim) => (
                <div key={dim.id} className={`bg-gradient-to-br ${dim.color} bg-opacity-20 border border-white/20 rounded-xl p-3 text-center`}>
                  <div className="text-2xl mb-1">{dim.icon}</div>
                  <p className="text-white text-xs font-medium">{dim.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-600 mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              ¿Cómo funciona?
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>La IA genera un escenario único de trabajo en equipo sanitario</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Responderás a 6 situaciones, una por cada dimensión de cohesión</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Recibirás un análisis detallado con recomendaciones personalizadas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Cada escenario es diferente - practica todas las veces que quieras</span>
              </li>
            </ul>
          </div>

          <button
            onClick={generateCohesionScenario}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generando escenario...
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Comenzar Evaluación
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
              <p className="text-red-300">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-red-400 hover:text-red-300 text-sm underline">
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'scenario' && scenario) {
    const currentStepData = scenario.steps[currentStep];
    const progress = ((currentStep + 1) / scenario.steps.length) * 100;
    const currentDimension = COHESION_DIMENSIONS.find(d => d.id === currentStepData.dimension) || COHESION_DIMENSIONS[0];

    return (
      <div className="h-full flex flex-col relative">
        <div className="bg-slate-800/90 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className={`w-10 h-10 bg-gradient-to-br ${currentDimension.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{currentDimension.icon}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{currentDimension.name}</h1>
                <p className="text-xs text-cyan-300">Paso {currentStep + 1} de {scenario.steps.length}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {currentStep === 0 && (
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 mb-4 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-cyan-400 mb-2">📍 Contexto</h3>
                <p className="text-slate-200 text-sm mb-3">{scenario.context}</p>
                <h3 className="text-sm font-bold text-amber-400 mb-2">💬 Situación</h3>
                <p className="text-slate-200 text-sm mb-3">{scenario.situation}</p>
                <h3 className="text-sm font-bold text-emerald-400 mb-2">👤 Tu Rol</h3>
                <p className="text-slate-200 text-sm">{scenario.yourRole}</p>
              </div>
            )}

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-slate-600 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentDimension.color} flex items-center justify-center`}>
                  <span className="text-xl">{currentDimension.icon}</span>
                </div>
                <div>
                  <p className="text-cyan-300 text-xs">{currentDimension.name}</p>
                  <p className="text-white font-medium">¿Cómo actuarías?</p>
                </div>
              </div>

              <p className="text-slate-200 mb-5 leading-relaxed bg-slate-700/50 rounded-xl p-4 border-l-4 border-cyan-500">
                {currentStepData.situation}
              </p>

              <div className="space-y-3">
                {currentStepData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold text-white group-hover:bg-cyan-500 transition-colors">
                        {option.id.toUpperCase()}
                      </div>
                      <p className="flex-1 text-slate-200 text-sm leading-relaxed">{option.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'evaluating') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analizando tu perfil de cohesión</h2>
          <p className="text-slate-300">Evaluando las 6 dimensiones de apoyo mutuo...</p>
        </div>
      </div>
    );
  }

  if (phase === 'results' && evaluation) {
    const scoreColor = evaluation.avgScore >= 8 ? 'from-emerald-500 to-green-500' : 
                       evaluation.avgScore >= 6 ? 'from-amber-500 to-yellow-500' : 
                       evaluation.avgScore >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';
    const category = getScoreCategory(evaluation.avgScore, 10);
    const resultEmoji = getRandomElement(COHESION_EMOJIS[category]);
    const resultPhrase = getRandomElement(COHESION_PHRASES[category]);

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto relative z-10 pb-24">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-5 py-2.5 rounded-2xl border border-cyan-500/30">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-black text-white">Tu Perfil de Cohesión</h1>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 shadow-2xl mb-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2 animate-bounce">{resultEmoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {resultPhrase}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Puntuación Global</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                      {evaluation.avgScore.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-lg">/10</span>
                  </div>
                </div>
                {evaluation.cohesionStyle && (
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Tu Estilo</p>
                    <p className="text-cyan-400 font-bold">{evaluation.cohesionStyle}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {COHESION_DIMENSIONS.map((dim) => (
                  <div key={dim.id} className={`bg-gradient-to-br ${dim.color} bg-opacity-20 border border-white/10 rounded-xl p-2 text-center`}>
                    <div className="text-lg mb-0.5">{dim.icon}</div>
                    <p className="text-white text-2xl font-bold">{evaluation.dimensionScores[dim.id]}</p>
                    <p className="text-white/70 text-[10px]">{dim.name}</p>
                  </div>
                ))}
              </div>

              {evaluation.strengths && evaluation.strengths.length > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 mb-3">
                  <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" /> Tus Fortalezas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.strengths.map((s, i) => (
                      <span key={i} className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded-lg">✓ {s}</span>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.areasToImprove && evaluation.areasToImprove.length > 0 && (
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 mb-3">
                  <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Áreas de Mejora
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.areasToImprove.map((a, i) => (
                      <span key={i} className="text-xs bg-amber-500/30 text-amber-200 px-2 py-1 rounded-lg">→ {a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {evaluation.dimensionAnalysis && (
              <div className="space-y-3 mb-4">
                {COHESION_DIMENSIONS.map((dim) => {
                  const analysis = evaluation.dimensionAnalysis[dim.id];
                  if (!analysis) return null;
                  return (
                    <div key={dim.id} className={`bg-gradient-to-r ${dim.color} bg-opacity-10 border border-white/20 rounded-xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{dim.icon}</span>
                        <h4 className="text-white font-bold text-sm">{dim.name}</h4>
                        <span className="ml-auto text-lg font-bold text-white">{analysis.score}/10</span>
                      </div>
                      <p className="text-slate-200 text-sm mb-2">{analysis.assessment}</p>
                      {analysis.tip && (
                        <p className="text-xs bg-white/10 text-white/80 px-3 py-1.5 rounded-lg">💡 {analysis.tip}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {evaluation.personalizedRecommendation && (
              <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-amber-500/30">
                <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Recomendación Personalizada
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed italic">
                  "{evaluation.personalizedRecommendation}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto">
            {scenariosCompleted > 0 && (
              <div className="text-center mb-3">
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
                  💎 {scenariosCompleted + 1} evaluaciones completadas
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={generateNewScenario}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Nuevo Escenario
              </button>
              <button
                onClick={onBack}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const ROLEPLAY_PROFILES = [
  {
    id: 'novice',
    name: 'Enfermera Novata Insegura',
    icon: '🌱',
    color: 'from-green-500 to-emerald-500',
    description: 'Recién graduada, necesita orientación y apoyo',
    personality: 'Tímida, hace muchas preguntas, duda de sí misma, busca validación constante',
    challenges: ['Miedo a cometer errores', 'No pregunta por vergüenza', 'Se bloquea ante decisiones']
  },
  {
    id: 'dominant',
    name: 'Enfermera Veterana Dominante',
    icon: '👑',
    color: 'from-purple-500 to-violet-500',
    description: 'Mucha experiencia, puede ser imponente',
    personality: 'Segura, directa, a veces brusca, cuestiona decisiones de otros, le cuesta delegar',
    challenges: ['Resistencia al cambio', 'Subestima a los nuevos', 'Impone su criterio']
  },
  {
    id: 'unmotivated',
    name: 'Profesional Desmotivado',
    icon: '😔',
    color: 'from-slate-500 to-gray-500',
    description: 'Ha perdido la ilusión por el trabajo',
    personality: 'Apático, hace lo mínimo, se queja constantemente, contagia negatividad',
    challenges: ['Bajo rendimiento', 'Afecta al clima', 'No participa en mejoras']
  },
  {
    id: 'uncooperative',
    name: 'Profesional que No Coopera',
    icon: '🚫',
    color: 'from-red-500 to-orange-500',
    description: 'Trabaja de forma aislada, evita colaborar',
    personality: 'Individualista, rechaza ayuda, no comparte información, evasivo',
    challenges: ['Fragmenta el equipo', 'No comunica', 'Genera desconfianza']
  },
  {
    id: 'overworker',
    name: 'Profesional que Trabaja en Exceso',
    icon: '🔥',
    color: 'from-amber-500 to-yellow-500',
    description: 'Se sobrecarga y no delega',
    personality: 'Perfeccionista, no confía en otros, acumula tareas, se agota',
    challenges: ['Burnout inminente', 'No delega', 'Crea dependencia']
  },
  {
    id: 'saturated',
    name: 'Equipo Saturado',
    icon: '⚠️',
    color: 'from-rose-500 to-pink-500',
    description: 'Alta carga asistencial, estrés colectivo',
    personality: 'Estresados, comunicación mínima, errores frecuentes, tensión palpable',
    challenges: ['Priorización difícil', 'Conflictos por sobrecarga', 'Riesgo de errores']
  }
];

const ROLEPLAY_CONTEXTS = [
  'Inicio de turno de mañana con alta ocupación',
  'Cambio de turno con pacientes críticos',
  'Momento de máxima carga asistencial',
  'Reunión de equipo semanal',
  'Situación de urgencia en planta',
  'Incorporación de nuevo personal',
  'Después de incidente con paciente',
  'Planificación de tareas del turno'
];

const RolePlayTeamMode = ({ onBack }) => {
  const { addSession } = useTeamworkProfileContext();
  const [phase, setPhase] = useState('intro');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [context, setContext] = useState('');
  const [interactionCount, setInteractionCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRolePlay = async (profile) => {
    setSelectedProfile(profile);
    setIsLoading(true);
    const randomContext = ROLEPLAY_CONTEXTS[Math.floor(Math.random() * ROLEPLAY_CONTEXTS.length)];
    setContext(randomContext);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Eres ${profile.name} en un hospital español. 
CONTEXTO: ${randomContext}
PERSONALIDAD: ${profile.personality}
DESAFÍOS TÍPICOS: ${profile.challenges.join(', ')}

Inicia una conversación breve (2-3 frases) mostrando tu personalidad. Actúa como este personaje de forma realista. Usa lenguaje coloquial español. NO uses asteriscos ni descripciones de acciones, solo diálogo directo.`,
          systemPrompt: `Eres un actor interpretando a "${profile.name}" para un ejercicio de formación en trabajo en equipo sanitario. Mantén el personaje de forma consistente. Responde siempre en español con lenguaje natural y coloquial. Sé breve (2-4 frases por respuesta).`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([{
          role: 'character',
          content: data.response,
          profile: profile
        }]);
        setPhase('chat');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setInteractionCount(prev => prev + 1);

    const conversationHistory = messages.map(m => 
      m.role === 'user' ? `Usuario: ${m.content}` : `${selectedProfile.name}: ${m.content}`
    ).join('\n');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Eres ${selectedProfile.name}. PERSONALIDAD: ${selectedProfile.personality}
CONTEXTO: ${context}
CONVERSACIÓN PREVIA:
${conversationHistory}

El usuario dice: "${userMessage}"

Responde como tu personaje (2-4 frases). Reacciona de forma coherente con tu personalidad. Si el usuario muestra buena coordinación/empatía, puedes ir mejorando tu actitud gradualmente. NO uses asteriscos ni descripciones, solo diálogo directo.`,
          systemPrompt: `Mantén el personaje de "${selectedProfile.name}" de forma consistente. Responde en español coloquial. Sé breve y natural.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'character',
          content: data.response,
          profile: selectedProfile
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const finishRolePlay = async () => {
    setPhase('evaluating');
    setIsLoading(true);

    const conversationHistory = messages.map(m => 
      m.role === 'user' ? `TÚ: ${m.content}` : `${selectedProfile.name}: ${m.content}`
    ).join('\n');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Evalúa esta interacción de trabajo en equipo entre un/a enfermero/a y "${selectedProfile.name}" (${selectedProfile.description}).

CONTEXTO: ${context}
CONVERSACIÓN:
${conversationHistory}

Genera un JSON con este formato EXACTO:
{
  "coordination": {"score": (1-10), "feedback": "Evaluación de capacidad de coordinación (2 frases)"},
  "tone": {"score": (1-10), "feedback": "Evaluación del tono usado (2 frases)"},
  "collaboration": {"score": (1-10), "feedback": "Evaluación del enfoque colaborativo (2 frases)"},
  "empathy": {"score": (1-10), "feedback": "Evaluación de la empatía mostrada (2 frases)"},
  "effectiveness": {"score": (1-10), "feedback": "Evaluación de la efectividad de la intervención (2 frases)"},
  "overallScore": (1-10),
  "characterReaction": "Cómo reaccionó el personaje a tu intervención (1-2 frases)",
  "strengths": ["Fortaleza 1", "Fortaleza 2"],
  "improvements": ["Área de mejora 1", "Área de mejora 2"],
  "tips": ["Consejo práctico 1", "Consejo práctico 2"]
}

Solo responde con el JSON.`,
          systemPrompt: 'Eres un experto en evaluación de competencias de trabajo en equipo en enfermería. Evalúa de forma constructiva y específica.'
        })
      });

      if (response.ok) {
        const data = await response.json();
        let evalData;
        try {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            evalData = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Parse error:', e);
        }

        setEvaluation(evalData);

        if (evalData) {
          addSession({
            type: 'roleplay_team',
            profileId: selectedProfile.id,
            profileName: selectedProfile.name,
            score: evalData.overallScore,
            maxScore: 10,
            coordination: evalData.coordination?.score || 5,
            collaboration: evalData.collaboration?.score || 5,
            empathy: evalData.empathy?.score || 5,
            interactionCount,
            teamSkills: {
              coordinacion: Math.round(evalData.coordination?.score || 5),
              colaboracion: Math.round(evalData.collaboration?.score || 5),
              cohesion: Math.round(evalData.empathy?.score || 5)
            }
          });
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setPhase('results');
    }
  };

  const resetRolePlay = () => {
    setPhase('intro');
    setSelectedProfile(null);
    setMessages([]);
    setEvaluation(null);
    setInteractionCount(0);
  };

  if (phase === 'intro') {
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 relative">
        <FloatingParticles />
        <GlowingOrb color="#d946ef" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#ec4899" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-4xl mx-auto relative z-10 pb-24">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 px-6 py-3 rounded-2xl border border-fuchsia-500/30 mb-4">
              <span className="text-3xl">🎭</span>
              <h1 className="text-2xl font-black text-white">Role-Play de Trabajo en Equipo</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Interactúa con profesionales simulados por IA y mejora tus habilidades
            </p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              ¿Cómo funciona?
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Elige un perfil de profesional con el que quieras practicar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Mantén una conversación natural con el personaje</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>La IA reacciona dinámicamente según tus respuestas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Al finalizar, recibe feedback sobre coordinación, tono y empatía</span>
              </li>
            </ul>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-fuchsia-400" />
            Elige un Perfil
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {ROLEPLAY_PROFILES.map((profile, idx) => (
              <button
                key={profile.id}
                onClick={() => startRolePlay(profile)}
                disabled={isLoading}
                className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-fuchsia-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-fuchsia-500/20 hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                    {profile.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-fuchsia-100">{profile.name}</h3>
                    <p className="text-slate-300 text-sm mb-2">{profile.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.challenges.map((ch, i) => (
                        <span key={i} className="text-xs bg-slate-700/80 text-fuchsia-300 px-2 py-0.5 rounded-lg">{ch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-6 text-center">
              <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin mx-auto mb-2" />
              <p className="text-slate-300">Preparando el role-play...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'chat') {
    return (
      <div className="h-full flex flex-col relative">
        <div className="bg-slate-800/90 backdrop-blur-xl border-b border-fuchsia-500/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={resetRolePlay} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedProfile.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{selectedProfile.icon}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{selectedProfile.name}</h1>
                <p className="text-xs text-fuchsia-300">{context}</p>
              </div>
            </div>
            <button
              onClick={finishRolePlay}
              disabled={messages.length < 3}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold py-2 px-4 rounded-xl transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white' 
                  : 'bg-slate-700 text-slate-200'
              }`}>
                {msg.role === 'character' && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                    <span>{msg.profile.icon}</span>
                    <span>{msg.profile.name}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 rounded-2xl p-4">
                <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-slate-500 text-xs mt-2">
            Mínimo 3 intercambios para evaluar • {messages.filter(m => m.role === 'user').length} mensajes enviados
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'evaluating') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Evaluando tu interacción</h2>
          <p className="text-slate-300">Analizando coordinación, tono y colaboración...</p>
        </div>
      </div>
    );
  }

  if (phase === 'results' && evaluation) {
    const scoreColor = evaluation.overallScore >= 8 ? 'from-emerald-500 to-green-500' : 
                       evaluation.overallScore >= 6 ? 'from-amber-500 to-yellow-500' : 
                       evaluation.overallScore >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto relative z-10 pb-24">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 px-5 py-2.5 rounded-2xl border border-fuchsia-500/30">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-black text-white">Evaluación del Role-Play</h1>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-fuchsia-500/30 shadow-2xl mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedProfile.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{selectedProfile.icon}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Interacción con</p>
                  <p className="text-white font-bold text-lg">{selectedProfile.name}</p>
                  <p className="text-fuchsia-300 text-xs">{interactionCount} intercambios</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-slate-400 text-xs">Puntuación</p>
                  <p className={`text-4xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                    {evaluation.overallScore}/10
                  </p>
                </div>
              </div>

              {evaluation.characterReaction && (
                <div className="bg-slate-700/50 rounded-xl p-3 mb-4">
                  <p className="text-slate-300 text-sm italic">"{evaluation.characterReaction}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {evaluation.coordination && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                    <p className="text-blue-300 text-xs mb-1">Coordinación</p>
                    <p className="text-2xl font-bold text-blue-400">{evaluation.coordination.score}/10</p>
                  </div>
                )}
                {evaluation.tone && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3">
                    <p className="text-amber-300 text-xs mb-1">Tono</p>
                    <p className="text-2xl font-bold text-amber-400">{evaluation.tone.score}/10</p>
                  </div>
                )}
                {evaluation.collaboration && (
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3">
                    <p className="text-emerald-300 text-xs mb-1">Colaboración</p>
                    <p className="text-2xl font-bold text-emerald-400">{evaluation.collaboration.score}/10</p>
                  </div>
                )}
                {evaluation.empathy && (
                  <div className="bg-pink-500/20 border border-pink-500/30 rounded-xl p-3">
                    <p className="text-pink-300 text-xs mb-1">Empatía</p>
                    <p className="text-2xl font-bold text-pink-400">{evaluation.empathy.score}/10</p>
                  </div>
                )}
              </div>
            </div>

            {evaluation.strengths && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-3">
                <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Fortalezas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {evaluation.strengths.map((s, i) => (
                    <span key={i} className="text-xs bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded-lg">✓ {s}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.improvements && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-3">
                <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Áreas de Mejora
                </h4>
                <div className="flex flex-wrap gap-2">
                  {evaluation.improvements.map((a, i) => (
                    <span key={i} className="text-xs bg-amber-500/30 text-amber-200 px-2 py-1 rounded-lg">→ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.tips && (
              <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-4">
                <h4 className="text-fuchsia-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Consejos Prácticos
                </h4>
                <ul className="space-y-1">
                  {evaluation.tips.map((t, i) => (
                    <li key={i} className="text-slate-200 text-sm">💡 {t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={resetRolePlay}
              className="flex-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Nuevo Role-Play
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const TeamProfileMode = ({ onBack }) => {
  const { profile, loading, getDominantRoles, getTrends } = useTeamworkProfileContext();
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const dominantRoles = getDominantRoles();
  const trends = getTrends(10);
  
  const teamSkills = profile?.teamSkills || {};
  const belbinRoles = profile?.belbinRoles || {};
  
  const cooperationLevel = Math.round(teamSkills.colaboracion || 0);
  const coordinationLevel = Math.round(teamSkills.coordinacion || 0);
  const cohesionLevel = Math.round(teamSkills.cohesion || 0);
  const avgScore = profile?.averageScore || 0;
  const totalSessions = profile?.totalSessions || 0;

  const getSkillColor = (value) => {
    if (value >= 8) return 'from-emerald-500 to-green-500';
    if (value >= 6) return 'from-amber-500 to-yellow-500';
    if (value >= 4) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const maxTrendScore = Math.max(...trends.map(t => t.score), 100);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#10b981" size="280px" left="5%" top="15%" delay="0s" />
      <GlowingOrb color="#22c55e" size="200px" left="80%" top="55%" delay="2s" />

      <div className="max-w-4xl mx-auto relative z-10 pb-24">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-6 py-3 rounded-2xl border border-emerald-500/30 mb-4">
            <span className="text-3xl">📈</span>
            <h1 className="text-2xl font-black text-white">Mi Perfil de Trabajo en Equipo</h1>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Tu evolución y competencias en trabajo colaborativo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sesiones Totales</p>
                <p className="text-3xl font-black text-white">{totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Puntuación Media</p>
                <p className="text-3xl font-black text-white">{avgScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-violet-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Rol Predominante</p>
                <p className="text-lg font-bold text-white">{dominantRoles[0]?.role || 'Por determinar'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-600 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Competencias de Equipo
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-blue-400" /> Nivel de Cooperación
                </span>
                <span className="text-white font-bold">{cooperationLevel}/10</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getSkillColor(cooperationLevel)} rounded-full transition-all duration-500`} style={{ width: `${cooperationLevel * 10}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm flex items-center gap-2">
                  <Network className="w-4 h-4 text-emerald-400" /> Eficacia en Coordinación
                </span>
                <span className="text-white font-bold">{coordinationLevel}/10</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getSkillColor(coordinationLevel)} rounded-full transition-all duration-500`} style={{ width: `${coordinationLevel * 10}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" /> Empatía en Contexto Grupal
                </span>
                <span className="text-white font-bold">{cohesionLevel}/10</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getSkillColor(cohesionLevel)} rounded-full transition-all duration-500`} style={{ width: `${cohesionLevel * 10}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" /> Capacidad de Mantener Clima
                </span>
                <span className="text-white font-bold">{Math.round((cooperationLevel + cohesionLevel) / 2)}/10</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${getSkillColor((cooperationLevel + cohesionLevel) / 2)} rounded-full transition-all duration-500`} style={{ width: `${((cooperationLevel + cohesionLevel) / 2) * 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        {dominantRoles.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-violet-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-violet-400" />
              Roles Predominantes en Equipos
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {dominantRoles.map((role, idx) => (
                <div key={role.role} className={`bg-gradient-to-br ${idx === 0 ? 'from-amber-500/20 to-yellow-500/20 border-amber-500/40' : 'from-slate-700/50 to-slate-600/50 border-slate-500/30'} border rounded-xl p-3 text-center`}>
                  <div className="text-2xl mb-1">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                  <p className="text-white font-bold text-sm">{role.role}</p>
                  <p className="text-slate-400 text-xs">{role.count} veces</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {trends.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              Evolución de Sesiones
            </h3>
            <div className="h-32 flex items-end gap-2">
              {trends.map((t, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`w-full bg-gradient-to-t ${t.score >= 80 ? 'from-emerald-500 to-green-400' : t.score >= 60 ? 'from-amber-500 to-yellow-400' : 'from-orange-500 to-red-400'} rounded-t-lg transition-all hover:opacity-80`}
                    style={{ height: `${(t.score / maxTrendScore) * 100}%`, minHeight: '10%' }}
                    title={`${t.date}: ${t.score.toFixed(0)}%`}
                  />
                  <p className="text-slate-500 text-[10px] mt-1 rotate-0">{t.date}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Sesiones anteriores</span>
              <span>Más reciente →</span>
            </div>
          </div>
        )}

        {totalSessions === 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-white mb-2">¡Empieza tu Perfil!</h3>
            <p className="text-slate-300 mb-4">
              Completa ejercicios en los otros módulos para construir tu perfil de trabajo en equipo.
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Explorar Módulos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CONFLICT_TYPES = [
  {
    id: 'nurse_doctor',
    name: 'Enfermera vs. Médico',
    icon: '⚕️',
    color: 'from-red-500 to-rose-500',
    description: 'Tensiones por diferencias de criterio clínico o jerarquía',
    examples: ['Discrepancia en indicaciones', 'Falta de comunicación', 'Órdenes contradictorias']
  },
  {
    id: 'auxiliary_nurse',
    name: 'Auxiliar vs. Enfermera',
    icon: '🤝',
    color: 'from-orange-500 to-amber-500',
    description: 'Conflictos por delegación de tareas o roles',
    examples: ['Límites de competencias', 'Sobrecarga de trabajo', 'Supervisión inadecuada']
  },
  {
    id: 'shift_tension',
    name: 'Turno Mañana vs. Noche',
    icon: '🌓',
    color: 'from-indigo-500 to-violet-500',
    description: 'Fricciones entre turnos por continuidad asistencial',
    examples: ['Tareas pendientes', 'Información incompleta', 'Percepción de injusticia']
  },
  {
    id: 'patient_distribution',
    name: 'Distribución de Pacientes',
    icon: '📊',
    color: 'from-teal-500 to-cyan-500',
    description: 'Tensiones por reparto desigual de carga asistencial',
    examples: ['Pacientes complejos', 'Número desigual', 'Zonas de trabajo']
  },
  {
    id: 'clinical_criteria',
    name: 'Diferencias de Criterio Clínico',
    icon: '🧠',
    color: 'from-purple-500 to-fuchsia-500',
    description: 'Choques por distintas perspectivas profesionales',
    examples: ['Protocolos vs. experiencia', 'Prioridades asistenciales', 'Enfoque terapéutico']
  }
];

const CONFLICT_CONTEXTS = [
  'UCI durante turno nocturno con alta ocupación',
  'Urgencias en fin de semana con múltiples emergencias',
  'Planta de hospitalización con déficit de personal',
  'Quirófano tras intervención prolongada',
  'Oncología durante tratamiento paliativo',
  'Pediatría con padres exigentes',
  'Geriatría con paciente agitado',
  'Cardiología tras parada cardíaca',
  'Traumatología con accidentado múltiple',
  'Psiquiatría con paciente en crisis'
];

const CONFLICT_TRIGGERS = [
  'un comentario percibido como despectivo',
  'una orden dada sin explicación',
  'una tarea delegada en el último momento',
  'información crítica no comunicada',
  'una decisión tomada unilateralmente',
  'un error atribuido injustamente',
  'una carga de trabajo desigual',
  'un cambio de protocolo no consensuado',
  'una queja de un familiar',
  'una situación de estrés extremo'
];

const ConflictSimulatorMode = ({ onBack }) => {
  const { addSession } = useTeamworkProfileContext();
  const [phase, setPhase] = useState('intro');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [usedCombinations, setUsedCombinations] = useState(new Set());
  const [conflictsCompleted, setConflictsCompleted] = useState(0);

  const getUnusedCombination = () => {
    let attempts = 0;
    let context, trigger;
    do {
      context = CONFLICT_CONTEXTS[Math.floor(Math.random() * CONFLICT_CONTEXTS.length)];
      trigger = CONFLICT_TRIGGERS[Math.floor(Math.random() * CONFLICT_TRIGGERS.length)];
      attempts++;
    } while (usedCombinations.has(`${context}-${trigger}`) && attempts < 50);
    
    return { context, trigger };
  };

  const generateConflictScenario = async (conflict) => {
    setIsLoading(true);
    setError(null);

    const { context: randomContext, trigger: randomTrigger } = getUnusedCombination();
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    setUsedCombinations(prev => new Set([...prev, `${randomContext}-${randomTrigger}`]));
    
    const professionalNames = ['Carmen', 'Lucía', 'María', 'Ana', 'Rosa', 'Elena', 'Laura', 'Marta', 'Paula', 'Sofía', 'Carlos', 'Javier', 'Miguel', 'Pedro', 'Luis', 'David', 'Pablo', 'Sergio', 'Andrés', 'Manuel'];
    const name1 = professionalNames[Math.floor(Math.random() * professionalNames.length)];
    let name2 = professionalNames[Math.floor(Math.random() * professionalNames.length)];
    while (name2 === name1) name2 = professionalNames[Math.floor(Math.random() * professionalNames.length)];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera un escenario de CONFLICTO INTERPROFESIONAL completamente ÚNICO para entrenamiento de gestión sanitaria.

ID ÚNICO: ${uniqueId}
¡IMPORTANTE! Cada escenario debe ser DIFERENTE y CREATIVO. Nunca repitas situaciones.

TIPO DE CONFLICTO: ${conflict.name}
DESCRIPCIÓN: ${conflict.description}
EJEMPLOS DE SITUACIONES: ${conflict.examples.join(', ')}

PARÁMETROS ALEATORIOS:
- Contexto: ${randomContext}
- Detonante: ${randomTrigger}
- Profesionales involucrados: ${name1} y ${name2}

Genera un JSON con este formato EXACTO:
{
  "title": "Título breve del conflicto (6-10 palabras)",
  "context": "Descripción detallada del contexto en ${randomContext}, incluyendo ambiente, hora, carga de trabajo (3-4 frases)",
  "conflict": "Descripción del conflicto entre ${name1} y ${name2}, detonado por ${randomTrigger} (3-4 frases, con diálogo inicial)",
  "yourRole": "Tu papel como profesional de enfermería que debe intervenir",
  "steps": [
    {
      "id": 1,
      "situation": "Primera fase del conflicto - la tensión escala (incluir diálogo entre ${name1} y ${name2})",
      "options": [
        {"id": "a", "text": "Respuesta que fomenta cooperación", "cooperation": 9, "frictionReduction": 8, "climatePreservation": 9, "sharedSolution": 8},
        {"id": "b", "text": "Respuesta neutral o parcialmente efectiva", "cooperation": 5, "frictionReduction": 5, "climatePreservation": 6, "sharedSolution": 5},
        {"id": "c", "text": "Respuesta que podría agravar el conflicto", "cooperation": 2, "frictionReduction": 2, "climatePreservation": 3, "sharedSolution": 2}
      ]
    },
    {
      "id": 2,
      "situation": "Segunda fase - el conflicto se intensifica o cambia de dirección",
      "options": [
        {"id": "a", "text": "Opción A", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "b", "text": "Opción B", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "c", "text": "Opción C", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)}
      ]
    },
    {
      "id": 3,
      "situation": "Tercera fase - momento crítico de decisión",
      "options": [
        {"id": "a", "text": "Opción A", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "b", "text": "Opción B", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "c", "text": "Opción C", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)}
      ]
    },
    {
      "id": 4,
      "situation": "Cuarta fase - resolución o consecuencias",
      "options": [
        {"id": "a", "text": "Opción A", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "b", "text": "Opción B", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)},
        {"id": "c", "text": "Opción C", "cooperation": (1-10), "frictionReduction": (1-10), "climatePreservation": (1-10), "sharedSolution": (1-10)}
      ]
    }
  ]
}

REGLAS OBLIGATORIAS:
- NUNCA repitas escenarios - cada generación debe ser ÚNICA
- Las opciones deben ser REALISTAS y plausibles en el contexto sanitario español
- Varía las puntuaciones - a veces la opción A es mejor, a veces B o C
- Incluye DIÁLOGOS concretos entre los profesionales
- El conflicto debe tener una progresión narrativa coherente
- Evalúa cada opción en las 4 dimensiones: cooperación, reducción de fricción, preservación del clima, solución compartida
- Solo responde con el JSON, sin texto adicional`,
          systemPrompt: 'Eres un experto en gestión de conflictos en equipos sanitarios. Creas escenarios de conflicto interprofesional realistas, intensos pero educativos, con diálogos auténticos y situaciones que reflejan la realidad de la enfermería hospitalaria española.'
        })
      });

      if (!response.ok) throw new Error('Error generando escenario');

      const data = await response.json();
      let scenarioData;

      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          scenarioData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e) {
        throw new Error('Error parseando respuesta');
      }

      if (!scenarioData.steps || scenarioData.steps.length < 4) {
        throw new Error('Escenario incompleto');
      }

      setScenario(scenarioData);
      setPhase('scenario');
      setCurrentStep(0);
      setResponses([]);
    } catch (err) {
      console.error('Error:', err);
      setError('Error generando el escenario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    const newResponses = [...responses, {
      step: currentStep,
      option: option,
      cooperation: option.cooperation,
      frictionReduction: option.frictionReduction,
      climatePreservation: option.climatePreservation,
      sharedSolution: option.sharedSolution
    }];
    setResponses(newResponses);

    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateEvaluation(newResponses);
    }
  };

  const generateEvaluation = async (allResponses) => {
    setPhase('evaluating');
    setIsLoading(true);

    const avgCooperation = allResponses.reduce((a, r) => a + r.cooperation, 0) / allResponses.length;
    const avgFriction = allResponses.reduce((a, r) => a + r.frictionReduction, 0) / allResponses.length;
    const avgClimate = allResponses.reduce((a, r) => a + r.climatePreservation, 0) / allResponses.length;
    const avgSolution = allResponses.reduce((a, r) => a + r.sharedSolution, 0) / allResponses.length;
    const overallScore = (avgCooperation + avgFriction + avgClimate + avgSolution) / 4;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera una evaluación profesional para un/a enfermero/a que ha completado un ejercicio de gestión de conflictos interprofesionales.

TIPO DE CONFLICTO: ${selectedConflict.name}
ESCENARIO: ${scenario.title}
CONTEXTO: ${scenario.context}

RESULTADOS EN LAS 4 DIMENSIONES:
- Fomento de cooperación: ${avgCooperation.toFixed(1)}/10
- Reducción de fricción: ${avgFriction.toFixed(1)}/10
- Preservación del clima laboral: ${avgClimate.toFixed(1)}/10
- Promoción de soluciones compartidas: ${avgSolution.toFixed(1)}/10
- Puntuación global: ${overallScore.toFixed(1)}/10

RESPUESTAS DEL USUARIO:
${allResponses.map((r, i) => `Paso ${i + 1}: "${r.option.text}" (Coop: ${r.cooperation}, Fricción: ${r.frictionReduction}, Clima: ${r.climatePreservation}, Solución: ${r.sharedSolution})`).join('\n')}

Genera un JSON con este formato EXACTO:
{
  "cooperationAnalysis": {
    "score": ${avgCooperation.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre cómo fomentó la cooperación",
    "tips": ["Consejo 1 para mejorar cooperación", "Consejo 2"]
  },
  "frictionAnalysis": {
    "score": ${avgFriction.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre reducción de fricción",
    "tips": ["Consejo 1 para reducir fricción", "Consejo 2"]
  },
  "climateAnalysis": {
    "score": ${avgClimate.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre preservación del clima laboral",
    "tips": ["Consejo 1 para mantener buen clima", "Consejo 2"]
  },
  "solutionAnalysis": {
    "score": ${avgSolution.toFixed(1)},
    "assessment": "Evaluación de 2-3 frases sobre promoción de soluciones compartidas",
    "tips": ["Consejo 1 para soluciones compartidas", "Consejo 2"]
  },
  "conflictStyle": "Nombre del estilo de gestión de conflictos predominante (ej: Colaborativo, Competitivo, Evitativo, Acomodativo, Compromiso)",
  "overallConclusion": "Párrafo de conclusión profesional (4-5 frases) integrando todas las dimensiones, destacando fortalezas, áreas de mejora y recomendaciones específicas para enfermería"
}

Solo responde con el JSON, sin texto adicional.`,
          systemPrompt: 'Eres un experto en gestión de conflictos y desarrollo profesional en enfermería. Proporcionas feedback constructivo, específico y motivador.'
        })
      });

      if (response.ok) {
        const data = await response.json();
        let evalData;

        try {
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            evalData = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing evaluation:', e);
        }

        setEvaluation({
          ...evalData,
          overallScore,
          avgCooperation,
          avgFriction,
          avgClimate,
          avgSolution,
          responses: allResponses
        });

        addSession({
          type: 'conflict_simulation',
          conflictType: selectedConflict.id,
          conflictName: selectedConflict.name,
          score: overallScore,
          maxScore: 10,
          cooperation: avgCooperation,
          frictionReduction: avgFriction,
          climatePreservation: avgClimate,
          sharedSolution: avgSolution,
          conflictStyle: evalData?.conflictStyle || 'No determinado',
          teamSkills: {
            colaboracion: Math.round(avgCooperation),
            coordinacion: Math.round(avgSolution),
            cohesion: Math.round(avgClimate)
          }
        });
      }
    } catch (err) {
      console.error('Error generating evaluation:', err);
      setEvaluation({
        overallScore,
        avgCooperation,
        avgFriction,
        avgClimate,
        avgSolution,
        responses: allResponses
      });
    } finally {
      setIsLoading(false);
      setPhase('results');
    }
  };

  const resetExercise = () => {
    setPhase('intro');
    setSelectedConflict(null);
    setScenario(null);
    setCurrentStep(0);
    setResponses([]);
    setEvaluation(null);
    setError(null);
  };

  const generateNewConflictSameType = () => {
    if (selectedConflict) {
      setScenario(null);
      setCurrentStep(0);
      setResponses([]);
      setEvaluation(null);
      setError(null);
      setConflictsCompleted(prev => prev + 1);
      generateConflictScenario(selectedConflict);
    }
  };

  const generateNewConflictDifferentType = () => {
    const otherConflicts = CONFLICT_TYPES.filter(c => c.id !== selectedConflict?.id);
    const randomConflict = otherConflicts[Math.floor(Math.random() * otherConflicts.length)];
    setSelectedConflict(randomConflict);
    setScenario(null);
    setCurrentStep(0);
    setResponses([]);
    setEvaluation(null);
    setError(null);
    setConflictsCompleted(prev => prev + 1);
    generateConflictScenario(randomConflict);
  };

  if (phase === 'intro') {
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#ef4444" size="280px" left="5%" top="15%" delay="0s" />
        <GlowingOrb color="#f43f5e" size="200px" left="80%" top="55%" delay="2s" />

        <div className="max-w-4xl mx-auto relative z-10 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 px-6 py-3 rounded-2xl border border-red-500/30 mb-4">
              <span className="text-3xl">⚔️</span>
              <h1 className="text-2xl font-black text-white">Simulador de Conflictos Interprofesionales</h1>
            </div>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Aprende a gestionar tensiones entre profesionales sanitarios
            </p>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-red-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-red-400" />
              Dimensiones de Evaluación
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 text-center">
                <Handshake className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-emerald-300 text-xs font-medium">Cooperación</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 text-center">
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-blue-300 text-xs font-medium">Reducción Fricción</p>
              </div>
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 text-center">
                <Heart className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <p className="text-amber-300 text-xs font-medium">Clima Laboral</p>
              </div>
              <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl p-3 text-center">
                <Puzzle className="w-6 h-6 text-violet-400 mx-auto mb-1" />
                <p className="text-violet-300 text-xs font-medium">Soluciones Compartidas</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-400" />
            Elige un Tipo de Conflicto
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {CONFLICT_TYPES.map((conflict, idx) => (
              <button
                key={conflict.id}
                onClick={() => {
                  setSelectedConflict(conflict);
                  generateConflictScenario(conflict);
                }}
                disabled={isLoading}
                className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-red-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden disabled:opacity-50"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${conflict.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                    {conflict.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-100">{conflict.name}</h3>
                    <p className="text-slate-300 text-sm mb-2">{conflict.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {conflict.examples.map((ex, i) => (
                        <span key={i} className="text-xs bg-slate-700/80 text-red-300 px-2 py-0.5 rounded-lg">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
              >
                Cerrar
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-6 text-center">
              <Loader2 className="w-8 h-8 text-red-400 animate-spin mx-auto mb-2" />
              <p className="text-slate-300">Generando escenario de conflicto...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'scenario' && scenario) {
    const currentStepData = scenario.steps[currentStep];
    const progress = ((currentStep + 1) / scenario.steps.length) * 100;

    return (
      <div className="h-full flex flex-col relative">
        <div className="bg-slate-800/90 backdrop-blur-xl border-b border-red-500/30 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button onClick={resetExercise} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className={`w-10 h-10 bg-gradient-to-br ${selectedConflict.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{selectedConflict.icon}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{scenario.title}</h1>
                <p className="text-xs text-red-300">Paso {currentStep + 1} de {scenario.steps.length}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {currentStep === 0 && (
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 mb-4 border border-red-500/30">
                <h3 className="text-sm font-bold text-red-400 mb-2">Contexto</h3>
                <p className="text-slate-200 text-sm mb-3">{scenario.context}</p>
                <h3 className="text-sm font-bold text-amber-400 mb-2">El Conflicto</h3>
                <p className="text-slate-200 text-sm mb-3">{scenario.conflict}</p>
                <h3 className="text-sm font-bold text-emerald-400 mb-2">Tu Rol</h3>
                <p className="text-slate-200 text-sm">{scenario.yourRole}</p>
              </div>
            )}

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-slate-600 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-red-300 text-xs">Situación {currentStep + 1}</p>
                  <p className="text-white font-medium">¿Cómo actuarías?</p>
                </div>
              </div>

              <p className="text-slate-200 mb-5 leading-relaxed bg-slate-700/50 rounded-xl p-4 border-l-4 border-red-500">
                {currentStepData.situation}
              </p>

              <div className="space-y-3">
                {currentStepData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className="w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-red-400 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold text-white group-hover:bg-red-500 transition-colors">
                        {option.id.toUpperCase()}
                      </div>
                      <p className="flex-1 text-slate-200 text-sm leading-relaxed">{option.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'evaluating') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Evaluando tu gestión del conflicto</h2>
          <p className="text-slate-300">Analizando cooperación, fricción, clima y soluciones...</p>
        </div>
      </div>
    );
  }

  if (phase === 'results' && evaluation) {
    const scoreColor = evaluation.overallScore >= 8 ? 'from-emerald-500 to-green-500' : 
                       evaluation.overallScore >= 6 ? 'from-amber-500 to-yellow-500' : 
                       evaluation.overallScore >= 4 ? 'from-orange-500 to-amber-500' : 'from-red-500 to-rose-500';
    const conflictCategory = getScoreCategory(evaluation.overallScore, 10);
    const conflictEmoji = getRandomElement(EMOJIS_BY_SCORE[conflictCategory]);
    const conflictPhrase = getRandomElement(PHRASES_BY_SCORE[conflictCategory]);

    return (
      <div className="h-full flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 px-5 py-2.5 rounded-2xl border border-red-500/30">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h1 className="text-xl font-black text-white">Evaluación del Conflicto</h1>
              </div>
            </div>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-red-500/30 shadow-2xl mb-4">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2 animate-bounce">{conflictEmoji}</div>
                <p className="text-lg font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                  {conflictPhrase}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Puntuación Global</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                      {evaluation.overallScore.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-lg">/10</span>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedConflict.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{selectedConflict.icon}</span>
                </div>
              </div>

              {evaluation.conflictStyle && (
                <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl p-3 mb-4 text-center">
                  <p className="text-violet-300 text-xs">Tu estilo de gestión de conflictos</p>
                  <p className="text-white font-bold text-lg">{evaluation.conflictStyle}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-3 text-center">
                  <Handshake className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-slate-400 text-xs mb-1">Cooperación</p>
                  <p className="text-2xl font-bold text-emerald-400">{evaluation.avgCooperation.toFixed(1)}</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 text-center">
                  <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-slate-400 text-xs mb-1">Reducción Fricción</p>
                  <p className="text-2xl font-bold text-blue-400">{evaluation.avgFriction.toFixed(1)}</p>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-3 text-center">
                  <Heart className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-slate-400 text-xs mb-1">Clima Laboral</p>
                  <p className="text-2xl font-bold text-amber-400">{evaluation.avgClimate.toFixed(1)}</p>
                </div>
                <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl p-3 text-center">
                  <Puzzle className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <p className="text-slate-400 text-xs mb-1">Soluciones</p>
                  <p className="text-2xl font-bold text-violet-400">{evaluation.avgSolution.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {evaluation.cooperationAnalysis && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-3">
                <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <Handshake className="w-4 h-4" />
                  Fomento de Cooperación
                </h3>
                <p className="text-slate-200 text-sm mb-2">{evaluation.cooperationAnalysis.assessment}</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.cooperationAnalysis.tips?.map((tip, i) => (
                    <span key={i} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg">💡 {tip}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.frictionAnalysis && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-3">
                <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Reducción de Fricción
                </h3>
                <p className="text-slate-200 text-sm mb-2">{evaluation.frictionAnalysis.assessment}</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.frictionAnalysis.tips?.map((tip, i) => (
                    <span key={i} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg">💡 {tip}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.climateAnalysis && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-3">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Preservación del Clima
                </h3>
                <p className="text-slate-200 text-sm mb-2">{evaluation.climateAnalysis.assessment}</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.climateAnalysis.tips?.map((tip, i) => (
                    <span key={i} className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg">💡 {tip}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.solutionAnalysis && (
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mb-3">
                <h3 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <Puzzle className="w-4 h-4" />
                  Soluciones Compartidas
                </h3>
                <p className="text-slate-200 text-sm mb-2">{evaluation.solutionAnalysis.assessment}</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.solutionAnalysis.tips?.map((tip, i) => (
                    <span key={i} className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-lg">💡 {tip}</span>
                  ))}
                </div>
              </div>
            )}

            {evaluation.overallConclusion && (
              <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl p-4 border border-amber-500/30">
                <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Conclusión
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed italic">
                  "{evaluation.overallConclusion}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
          <div className="max-w-3xl mx-auto">
            {conflictsCompleted > 0 && (
              <div className="text-center mb-3">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
                  🔥 {conflictsCompleted + 1} conflictos resueltos en esta sesión
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={generateNewConflictSameType}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-bold py-3 px-3 rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Mismo Tipo
              </button>
              <button
                onClick={generateNewConflictDifferentType}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold py-3 px-3 rounded-xl transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Tipo Diferente
              </button>
              <button
                onClick={onBack}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const DELEGATION_LEVELS = [
  { 
    level: 1, 
    name: 'Investiga', 
    icon: '🔍', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Investiga y dame todas las opciones. Yo decido.',
    autonomy: 20,
    example: 'Busca proveedores de material y prepárame un informe comparativo.'
  },
  { 
    level: 2, 
    name: 'Recomienda', 
    icon: '💡', 
    color: 'from-teal-500 to-emerald-500',
    description: 'Investiga y recomiéndame una opción. Yo apruebo.',
    autonomy: 40,
    example: 'Evalúa las opciones y recomiéndame la mejor. Me dices antes de actuar.'
  },
  { 
    level: 3, 
    name: 'Consulta', 
    icon: '🤝', 
    color: 'from-amber-500 to-yellow-500',
    description: 'Decide tú, pero consúltame antes de actuar.',
    autonomy: 60,
    example: 'Organiza el turno del fin de semana, pero coméntalo conmigo antes de publicarlo.'
  },
  { 
    level: 4, 
    name: 'Actúa e Informa', 
    icon: '📣', 
    color: 'from-orange-500 to-red-500',
    description: 'Decide y actúa. Infórmame después de hacerlo.',
    autonomy: 80,
    example: 'Gestiona el pedido de farmacia y luego me cuentas cómo fue.'
  },
  { 
    level: 5, 
    name: 'Autonomía Total', 
    icon: '🚀', 
    color: 'from-violet-500 to-purple-500',
    description: 'Hazlo tú completamente. No necesitas informarme.',
    autonomy: 100,
    example: 'Encárgate del inventario mensual como consideres mejor.'
  }
];

const DELEGATION_MATRIX_QUADRANTS = [
  { 
    id: 'urgent-important', 
    name: 'Urgente + Importante', 
    icon: '🔥',
    color: 'from-red-500 to-rose-500',
    action: 'HACER TÚ MISMO',
    description: 'Crisis, emergencias, deadlines críticos',
    examples: ['Emergencia con paciente', 'Error crítico en medicación', 'Auditoría mañana'],
    delegable: false
  },
  { 
    id: 'not-urgent-important', 
    name: 'No Urgente + Importante', 
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    action: 'PLANIFICAR Y DELEGAR PARCIALMENTE',
    description: 'Desarrollo, mejoras, formación',
    examples: ['Formar al equipo', 'Mejorar protocolos', 'Planificar turnos mes siguiente'],
    delegable: true
  },
  { 
    id: 'urgent-not-important', 
    name: 'Urgente + No Importante', 
    icon: '📞',
    color: 'from-amber-500 to-orange-500',
    action: 'DELEGAR',
    description: 'Interrupciones, algunas reuniones, tareas operativas',
    examples: ['Llamadas rutinarias', 'Pedidos estándar', 'Reuniones informativas'],
    delegable: true
  },
  { 
    id: 'not-urgent-not-important', 
    name: 'No Urgente + No Importante', 
    icon: '🗑️',
    color: 'from-slate-500 to-gray-500',
    action: 'ELIMINAR O AUTOMATIZAR',
    description: 'Tareas que no aportan valor',
    examples: ['Emails innecesarios', 'Reuniones sin objetivo', 'Tareas duplicadas'],
    delegable: false
  }
];

const DELEGATION_SCENARIOS = [
  {
    id: 1,
    title: 'Turno sobrecargado',
    context: 'Es lunes por la mañana y tienes 3 ingresos nuevos, 2 altas pendientes, y la supervisora te pide que prepares un informe para la reunión de las 14h.',
    tasks: [
      { name: 'Valoración de ingresos nuevos', urgent: true, important: true },
      { name: 'Documentación de altas', urgent: true, important: false },
      { name: 'Informe para reunión', urgent: true, important: true },
      { name: 'Actualizar plan de cuidados', urgent: false, important: true },
      { name: 'Organizar armario de material', urgent: false, important: false }
    ]
  },
  {
    id: 2,
    title: 'Nueva enfermera en el equipo',
    context: 'Acaba de incorporarse María, una enfermera recién graduada. Es su segunda semana y debes asignarle responsabilidades.',
    tasks: [
      { name: 'Administración de medicación IV', urgent: true, important: true },
      { name: 'Toma de constantes', urgent: false, important: true },
      { name: 'Registro en historia clínica', urgent: false, important: true },
      { name: 'Atender llamadas de pacientes', urgent: true, important: false },
      { name: 'Preparar material para curas', urgent: false, important: false }
    ]
  },
  {
    id: 3,
    title: 'Fin de semana con personal reducido',
    context: 'Es sábado y solo estáis 2 enfermeras para 20 pacientes. Una auxiliar está de baja.',
    tasks: [
      { name: 'Medicación de alto riesgo', urgent: true, important: true },
      { name: 'Movilizaciones de pacientes', urgent: false, important: true },
      { name: 'Documentar evoluciones', urgent: false, important: true },
      { name: 'Reposición de stocks', urgent: false, important: false },
      { name: 'Responder emails', urgent: false, important: false }
    ]
  }
];

const DelegationMode = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [taskAssignments, setTaskAssignments] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiScenario, setAiScenario] = useState(null);
  const [delegatedTasks, setDelegatedTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', person: '', level: 3, dueDate: '', notes: '' });

  const generateAIScenario = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un escenario de delegación para enfermería',
          systemPrompt: `Genera un escenario realista de delegación para una enfermera gestora en un hospital español.

FORMATO DE RESPUESTA (JSON estricto):
{
  "title": "Título breve del escenario",
  "context": "Descripción de la situación en 2-3 frases",
  "tasks": [
    {"name": "Tarea 1", "urgent": true/false, "important": true/false},
    {"name": "Tarea 2", "urgent": true/false, "important": true/false},
    {"name": "Tarea 3", "urgent": true/false, "important": true/false},
    {"name": "Tarea 4", "urgent": true/false, "important": true/false},
    {"name": "Tarea 5", "urgent": true/false, "important": true/false}
  ]
}

REQUISITOS:
- Exactamente 5 tareas variadas
- Mezcla de urgentes/no urgentes e importantes/no importantes
- Contexto realista de hospital (UCI, urgencias, planta, consultas...)
- Incluir tareas delegables y no delegables
- Solo responde con el JSON, sin texto adicional`
        })
      });
      const data = await response.json();
      try {
        const scenario = JSON.parse(data.response);
        setAiScenario(scenario);
        setCurrentScenario(scenario);
        setTaskAssignments({});
        setShowFeedback(false);
      } catch {
        setCurrentScenario(DELEGATION_SCENARIOS[Math.floor(Math.random() * DELEGATION_SCENARIOS.length)]);
      }
    } catch (error) {
      setCurrentScenario(DELEGATION_SCENARIOS[Math.floor(Math.random() * DELEGATION_SCENARIOS.length)]);
    } finally {
      setAiLoading(false);
    }
  };

  const startPractice = (scenario = null) => {
    if (scenario) {
      setCurrentScenario(scenario);
    } else {
      setCurrentScenario(DELEGATION_SCENARIOS[Math.floor(Math.random() * DELEGATION_SCENARIOS.length)]);
    }
    setTaskAssignments({});
    setShowFeedback(false);
    setPracticeMode(true);
  };

  const assignTask = (taskName, quadrant) => {
    setTaskAssignments(prev => ({ ...prev, [taskName]: quadrant }));
  };

  const evaluateAssignments = () => {
    setShowFeedback(true);
  };

  const getCorrectQuadrant = (task) => {
    if (task.urgent && task.important) return 'urgent-important';
    if (!task.urgent && task.important) return 'not-urgent-important';
    if (task.urgent && !task.important) return 'urgent-not-important';
    return 'not-urgent-not-important';
  };

  const getScore = () => {
    if (!currentScenario) return 0;
    let correct = 0;
    currentScenario.tasks.forEach(task => {
      if (taskAssignments[task.name] === getCorrectQuadrant(task)) {
        correct++;
      }
    });
    return Math.round((correct / currentScenario.tasks.length) * 100);
  };

  const addDelegatedTask = () => {
    if (!newTask.name.trim()) return;
    const task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setDelegatedTasks(prev => [...prev, task]);
    setNewTask({ name: '', person: '', level: 3, dueDate: '', notes: '' });
    setShowTaskForm(false);
  };

  const updateTaskStatus = (taskId, status) => {
    setDelegatedTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const deleteTask = (taskId) => {
    setDelegatedTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const tabs = [
    { id: 'matrix', name: 'Matriz', icon: '📊' },
    { id: 'levels', name: 'Niveles', icon: '📈' },
    { id: 'practice', name: 'Práctica', icon: '🎮' },
    { id: 'tracking', name: 'Seguimiento', icon: '📋' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-400/20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `floatParticle ${8 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2.5 hover:bg-yellow-500/20 rounded-xl transition-all group">
                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-white" />
              </button>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 via-lime-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/30 ring-2 ring-yellow-400/30">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-slate-800">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-200 via-lime-200 to-emerald-200 bg-clip-text text-transparent">
                  Delegación Efectiva
                </h1>
                <p className="text-xs text-yellow-300/80">Aprende a delegar tareas de forma estratégica</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setPracticeMode(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-500 to-lime-500 text-white shadow-lg shadow-yellow-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm">{tab.name}</span>
              </button>
            ))}
          </div>

          {activeTab === 'matrix' && !practiceMode && (
            <div className="space-y-6">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📊</span> Matriz de Delegación (Eisenhower)
                </h2>
                <p className="text-slate-300 mb-6">
                  Clasifica las tareas según su urgencia e importancia para decidir qué hacer tú mismo, qué delegar y qué eliminar.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {DELEGATION_MATRIX_QUADRANTS.map(quadrant => (
                    <button
                      key={quadrant.id}
                      onClick={() => setSelectedQuadrant(selectedQuadrant === quadrant.id ? null : quadrant.id)}
                      className={`bg-gradient-to-br ${quadrant.color} rounded-2xl p-5 text-left transition-all hover:scale-[1.02] ${
                        selectedQuadrant === quadrant.id ? 'ring-4 ring-white/50 scale-[1.02]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{quadrant.icon}</span>
                        <div>
                          <h3 className="font-bold text-white">{quadrant.name}</h3>
                          <p className="text-white/90 text-sm font-medium">{quadrant.action}</p>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-3">{quadrant.description}</p>
                      
                      {selectedQuadrant === quadrant.id && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-white/90 text-xs font-medium mb-2">Ejemplos:</p>
                          <ul className="space-y-1">
                            {quadrant.examples.map((ex, idx) => (
                              <li key={idx} className="text-white/80 text-xs flex items-center gap-2">
                                <span>•</span> {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-lime-500/20 rounded-2xl p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-yellow-400" />
                    Practica con escenarios
                  </h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  Pon a prueba tus habilidades clasificando tareas en escenarios reales de enfermería.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => startPractice()}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-lime-500 hover:from-yellow-400 hover:to-lime-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Escenario Aleatorio
                  </button>
                  <button
                    onClick={generateAIScenario}
                    disabled={aiLoading}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Generar con IA
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && practiceMode && currentScenario && (
            <div className="space-y-6">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{currentScenario.title}</h2>
                  <button
                    onClick={() => setPracticeMode(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-slate-300 bg-slate-700/50 rounded-xl p-4 mb-6">{currentScenario.context}</p>

                <h3 className="font-bold text-white mb-4">Clasifica cada tarea en su cuadrante:</h3>
                
                <div className="space-y-3 mb-6">
                  {currentScenario.tasks.map((task, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-white font-medium mb-3">{task.name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {DELEGATION_MATRIX_QUADRANTS.map(q => (
                          <button
                            key={q.id}
                            onClick={() => assignTask(task.name, q.id)}
                            disabled={showFeedback}
                            className={`text-xs py-2 px-3 rounded-lg transition-all ${
                              taskAssignments[task.name] === q.id
                                ? `bg-gradient-to-r ${q.color} text-white font-bold`
                                : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                            } ${showFeedback && getCorrectQuadrant(task) === q.id ? 'ring-2 ring-emerald-400' : ''}`}
                          >
                            {q.icon} {q.name.split('+')[0]}
                          </button>
                        ))}
                      </div>
                      {showFeedback && (
                        <div className={`mt-2 text-xs ${
                          taskAssignments[task.name] === getCorrectQuadrant(task) 
                            ? 'text-emerald-400' 
                            : 'text-rose-400'
                        }`}>
                          {taskAssignments[task.name] === getCorrectQuadrant(task) 
                            ? '✓ Correcto' 
                            : `✗ Debería estar en: ${DELEGATION_MATRIX_QUADRANTS.find(q => q.id === getCorrectQuadrant(task))?.name}`
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!showFeedback ? (
                  <button
                    onClick={evaluateAssignments}
                    disabled={Object.keys(taskAssignments).length < currentScenario.tasks.length}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
                  >
                    Evaluar mis respuestas
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-6 border border-emerald-500/30">
                    <div className="text-center mb-4">
                      <p className="text-4xl font-black text-white mb-2">{getScore()}%</p>
                      <p className="text-emerald-300">
                        {getScore() >= 80 ? '¡Excelente! Dominas la matriz' : 
                         getScore() >= 60 ? 'Bien, pero puedes mejorar' : 
                         'Necesitas más práctica'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startPractice()}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded-xl transition-all"
                      >
                        Otro escenario
                      </button>
                      <button
                        onClick={() => setPracticeMode(false)}
                        className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-xl transition-all"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'levels' && (
            <div className="space-y-6">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span>📈</span> Los 5 Niveles de Delegación
                </h2>
                <p className="text-slate-300 mb-6">
                  No toda delegación es igual. Elige el nivel de autonomía apropiado según la tarea y la persona.
                </p>

                <div className="space-y-4">
                  {DELEGATION_LEVELS.map(level => (
                    <button
                      key={level.level}
                      onClick={() => setSelectedLevel(selectedLevel === level.level ? null : level.level)}
                      className={`w-full bg-slate-700/50 hover:bg-slate-700/70 rounded-xl p-4 text-left transition-all ${
                        selectedLevel === level.level ? 'ring-2 ring-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                          {level.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-yellow-400 font-mono text-sm">Nivel {level.level}</span>
                            <h3 className="font-bold text-white">{level.name}</h3>
                          </div>
                          <p className="text-slate-300 text-sm">{level.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400 mb-1">Autonomía</div>
                          <div className="w-24 h-2 bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${level.color} transition-all`}
                              style={{ width: `${level.autonomy}%` }}
                            />
                          </div>
                          <div className="text-xs text-white font-bold mt-1">{level.autonomy}%</div>
                        </div>
                      </div>
                      
                      {selectedLevel === level.level && (
                        <div className="mt-4 pt-4 border-t border-slate-600">
                          <p className="text-xs text-yellow-400 font-medium mb-2">Ejemplo práctico:</p>
                          <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3 italic">
                            "{level.example}"
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  Consejos para elegir el nivel
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="font-bold text-emerald-400 mb-2">✓ Delega más cuando:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• La persona tiene experiencia</li>
                      <li>• La tarea no es crítica</li>
                      <li>• Hay margen para errores</li>
                      <li>• Quieres desarrollar al equipo</li>
                    </ul>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="font-bold text-rose-400 mb-2">✗ Delega menos cuando:</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• La persona es nueva</li>
                      <li>• Alto riesgo para pacientes</li>
                      <li>• Requiere tu firma/autorización</li>
                      <li>• Es la primera vez que lo hace</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎮</span> Casos Prácticos
                </h2>
                <p className="text-slate-300 mb-6">
                  Elige un escenario para practicar tus habilidades de delegación o genera uno nuevo con IA.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {DELEGATION_SCENARIOS.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => { setActiveTab('matrix'); startPractice(scenario); }}
                      className="bg-slate-700/50 hover:bg-slate-700/70 rounded-xl p-5 text-left transition-all group hover:scale-[1.02]"
                    >
                      <h3 className="font-bold text-white mb-2 group-hover:text-yellow-300">{scenario.title}</h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{scenario.context}</p>
                      <div className="flex items-center gap-2 text-yellow-400 text-sm">
                        <Play className="w-4 h-4" />
                        <span>{scenario.tasks.length} tareas</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setActiveTab('matrix'); generateAIScenario(); }}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generar Escenario con IA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-6">
              <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📋</span> Seguimiento de Tareas Delegadas
                  </h2>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-gradient-to-r from-yellow-500 to-lime-500 hover:from-yellow-400 hover:to-lime-400 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Nueva Tarea
                  </button>
                </div>

                {showTaskForm && (
                  <div className="bg-slate-700/50 rounded-xl p-5 mb-6 border border-yellow-500/30">
                    <h3 className="font-bold text-white mb-4">Añadir tarea delegada</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Nombre de la tarea"
                        value={newTask.name}
                        onChange={e => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
                      />
                      <input
                        type="text"
                        placeholder="Persona asignada"
                        value={newTask.person}
                        onChange={e => setNewTask(prev => ({ ...prev, person: e.target.value }))}
                        className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
                      />
                      <select
                        value={newTask.level}
                        onChange={e => setNewTask(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                        className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500"
                      >
                        {DELEGATION_LEVELS.map(l => (
                          <option key={l.level} value={l.level}>Nivel {l.level}: {l.name}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={e => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <textarea
                      placeholder="Notas adicionales (opcional)"
                      value={newTask.notes}
                      onChange={e => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500 mb-4"
                      rows={2}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={addDelegatedTask}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl transition-all"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-xl transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {delegatedTasks.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 rounded-xl">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-slate-300 mb-2">No hay tareas delegadas todavía</p>
                    <p className="text-slate-500 text-sm">Añade tareas para hacer seguimiento</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {delegatedTasks.map(task => {
                      const levelInfo = DELEGATION_LEVELS.find(l => l.level === task.level);
                      return (
                        <div key={task.id} className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                          <button
                            onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                              task.status === 'completed' 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                          >
                            {task.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                          </button>
                          <div className="flex-1">
                            <p className={`font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {task.name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span>👤 {task.person || 'Sin asignar'}</span>
                              <span className={`bg-gradient-to-r ${levelInfo?.color} bg-clip-text text-transparent font-bold`}>
                                {levelInfo?.icon} Nivel {task.level}
                              </span>
                              {task.dueDate && <span>📅 {task.dueDate}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-500/30">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Estadísticas de Delegación
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-black text-white">{delegatedTasks.length}</p>
                    <p className="text-slate-400 text-xs">Total tareas</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-black text-emerald-400">{delegatedTasks.filter(t => t.status === 'completed').length}</p>
                    <p className="text-slate-400 text-xs">Completadas</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-black text-amber-400">{delegatedTasks.filter(t => t.status === 'pending').length}</p>
                    <p className="text-slate-400 text-xs">Pendientes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-25px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

const ComingSoonMode = ({ title, icon, onBack }) => (
  <div className="min-h-screen p-4 md:p-8 relative flex items-center justify-center">
    <FloatingParticles />
    <div className="max-w-md mx-auto relative z-10 text-center">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600 mx-auto"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </button>

      <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-500/30 shadow-2xl">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-2xl font-black text-white mb-3">{title}</h2>
        <p className="text-slate-300 mb-6">
          Este modo está en desarrollo. ¡Pronto estará disponible!
        </p>
        <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-4">
          <p className="text-amber-300 text-sm">🚧 Próximamente</p>
        </div>
      </div>
    </div>
  </div>
);

const TeamworkModule = ({ onBack }) => {
  const [currentMode, setCurrentMode] = useState(null);

  const handleSelectMode = (modeId) => {
    setCurrentMode(modeId);
  };

  const handleBack = () => {
    setCurrentMode(null);
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'teamworkTest':
        return <TeamworkTestMode onBack={handleBack} />;
      case 'styleIdentification':
        return <ParticipationStyleIdentifier onBack={handleBack} />;
      case 'simulation':
        return <CollaborativeScenarioSimulator onBack={handleBack} />;
      case 'mentor':
        return <MentorMode onBack={handleBack} />;
      case 'analytics':
        return <TeamworkAnalytics onBack={handleBack} />;
      case 'delegation':
        return <DelegationMode onBack={handleBack} />;
      case 'dynamics':
        return <GroupDynamicsMode onBack={handleBack} />;
      case 'conflicts':
        return <ConflictSimulatorMode onBack={handleBack} />;
      case 'cohesion':
        return <CohesionEvaluatorMode onBack={handleBack} />;
      case 'roleplay':
        return <RolePlayTeamMode onBack={handleBack} />;
      case 'teamProfile':
        return <TeamProfileMode onBack={handleBack} />;
      case 'meetings':
        return <ComingSoonMode title="Reuniones Eficaces" icon="📅" onBack={handleBack} />;
      case 'dysfunctions':
        return <ComingSoonMode title="Disfunciones del Equipo" icon="🔧" onBack={handleBack} />;
      default:
        return <ModeSelector onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <TeamworkProfileProvider>
      <div 
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundImage: `url(${leadershipBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-amber-900/20 to-slate-900/95" />
        
        {!currentMode && (
          <div className="relative z-10 bg-slate-800/80 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3 flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Trabajo en Equipo</h1>
              <p className="text-xs text-amber-300">Centro de entrenamiento colaborativo</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10 flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </TeamworkProfileProvider>
  );
};

export default TeamworkModule;
