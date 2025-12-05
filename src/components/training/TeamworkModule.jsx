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
    title: 'Dinámicas de Grupo',
    description: 'Actividades para mejorar la cohesión del equipo',
    icon: '🤝',
    color: 'from-emerald-500 to-teal-500',
    features: ['Team building', 'Ice breakers', 'Resolución conflictos']
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
    <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
      <FloatingParticles />
      <GlowingOrb color="#f59e0b" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#eab308" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10 pb-8">
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
  excellent: ['🎉', '🏆', '⭐', '🌟', '💫', '🚀', '👑', '💯'],
  good: ['👏', '✨', '💪', '🎯', '👍', '😊', '🌈', '🔥'],
  average: ['🤔', '📈', '💡', '🔄', '👀', '🌱', '📚', '⏳'],
  poor: ['😕', '📉', '⚠️', '🔧', '💭', '🎓', '🔍', '📝']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excepcional! Tu trabajo en equipo es ejemplar',
    '¡Brillante! Dominas la colaboración',
    '¡Impresionante! Nivel experto en equipos',
    '¡Sobresaliente! Tu equipo tiene suerte de tenerte'
  ],
  good: [
    '¡Muy bien! Colaboras con eficacia',
    '¡Buen trabajo! Tu coordinación es efectiva',
    '¡Genial! Tienes buenas bases de equipo',
    '¡Bien hecho! Sigue desarrollando tu potencial'
  ],
  average: [
    'Hay potencial, pero puedes mejorar',
    'En desarrollo, sigue practicando',
    'Base correcta, pero puedes crecer más',
    'Oportunidad de crecimiento detectada'
  ],
  poor: [
    'Es momento de trabajar el trabajo en equipo',
    'Necesitas práctica, no te rindas',
    'Cada intento es una oportunidad de aprender',
    'La mejora viene con la práctica constante'
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
    
    return (
      <div className="h-screen flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto relative z-10 pb-8">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-fuchsia-500/30 shadow-2xl">
              
              <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-2xl p-5 mb-5 border border-slate-600/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreColor} flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl font-black text-white">{result.score}</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Puntuación</p>
                      <p className="text-white text-xl font-bold">{result.score}/10 <span className="text-3xl ml-1">{result.emoji}</span></p>
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
                
                {result.phrase && (
                  <div className="bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl p-4">
                    <p className="text-fuchsia-100 text-sm leading-relaxed italic">
                      "{result.phrase}"
                    </p>
                  </div>
                )}
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

const MentorMode = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu mentor experto en trabajo en equipo. 🎓\n\n**¿En qué puedo ayudarte hoy?**\n\n📚 **Teorías y modelos** - Belbin, Tuckman, Lencioni\n🔧 **Problemas de equipo** - Conflictos, desmotivación, falta de cohesión\n💡 **Estrategias** - Delegación, reuniones, comunicación\n🏥 **Equipos sanitarios** - Multidisciplinares, turnos, emergencias\n\nCuéntame tu situación y te ayudaré con estrategias concretas.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
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
          systemPrompt: `Eres un mentor experto en trabajo en equipo y dinámicas grupales, especializado en equipos sanitarios.

TU EXPERTISE:
1. **Roles de equipo (Belbin)**: Los 9 roles, cómo equilibrar equipos, identificar fortalezas
2. **Etapas de desarrollo (Tuckman)**: Forming, Storming, Norming, Performing, cómo facilitar transiciones
3. **Las 5 disfunciones (Lencioni)**: Falta de confianza, miedo al conflicto, falta de compromiso, evitar responsabilidad, falta de atención a resultados
4. **Seguridad psicológica (Edmondson)**: Cómo crear entornos donde el equipo puede arriesgar
5. **Delegación efectiva**: Matriz Eisenhower aplicada, niveles de delegación
6. **Reuniones productivas**: Técnicas, roles, seguimiento

ESTILO DE COACHING:
- Haz preguntas poderosas antes de dar consejos
- Ofrece frameworks y modelos teóricos cuando sean útiles
- Da ejemplos prácticos del ámbito sanitario
- Sugiere ejercicios o actividades concretas
- Equilibra teoría con aplicación práctica

TONO: Cálido pero profesional, como un mentor experimentado. Empático pero directo.

Siempre en español, contextualizado al ámbito sanitario/enfermería.`
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
      content: '¡Nueva sesión de mentoría! 🎓 ¿Qué aspecto del trabajo en equipo quieres explorar?'
    }]);
  };

  const quickTopics = [
    "Mi equipo está desmotivado",
    "Cómo delegar mejor",
    "Conflicto entre compañeros",
    "Reuniones más productivas"
  ];

  return (
    <div className="h-screen flex flex-col relative">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-violet-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Modo Mentor</h1>
            <p className="text-xs text-violet-300">Coach de trabajo en equipo</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-violet-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setInput(topic)}
                className="text-xs bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-violet-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu pregunta sobre trabajo en equipo..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-violet-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
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
        return <ComingSoonMode title="Delegación Efectiva" icon="📋" onBack={handleBack} />;
      case 'dynamics':
        return <ComingSoonMode title="Dinámicas de Grupo" icon="🤝" onBack={handleBack} />;
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
        
        <div className="relative z-10 flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </TeamworkProfileProvider>
  );
};

export default TeamworkModule;
