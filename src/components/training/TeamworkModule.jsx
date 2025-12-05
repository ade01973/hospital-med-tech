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
