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
      if (updatedProfile.belbinRoles[roleKey] !== undefined) {
        updatedProfile.belbinCounts[roleKey] = (updatedProfile.belbinCounts[roleKey] || 0) + 1;
        const count = updatedProfile.belbinCounts[roleKey];
        const prevAvg = updatedProfile.belbinRoles[roleKey] || 0;
        updatedProfile.belbinRoles[roleKey] = ((prevAvg * (count - 1)) + (sessionData.roleScore || 5)) / count;
      }
    }

    if (sessionData.teamSkills) {
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

const TEAMWORK_MODES = [
  {
    id: 'belbin',
    title: 'Test Roles Belbin',
    description: 'Descubre tu rol predominante en equipos de trabajo',
    icon: '🧩',
    color: 'from-amber-500 to-yellow-500',
    features: ['9 roles de equipo', 'Análisis personalizado', 'Fortalezas y debilidades'],
    isNew: true
  },
  {
    id: 'simulation',
    title: 'Simulador de Equipo',
    description: 'Practica situaciones reales de trabajo en equipo',
    icon: '🎮',
    color: 'from-orange-500 to-amber-500',
    features: ['Escenarios interactivos', 'Toma de decisiones', 'Feedback IA']
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

const BelbinTest = ({ onBack }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { addSession } = useTeamworkProfileContext();

  const BELBIN_QUESTIONS = useMemo(() => [
    {
      id: 1,
      question: 'Cuando trabajo en equipo, mi contribución más valiosa es:',
      options: [
        { text: 'Aporto ideas originales y creativas', role: 'cerebro', score: 4 },
        { text: 'Busco contactos y recursos externos', role: 'investigador', score: 4 },
        { text: 'Coordino al equipo y delego tareas', role: 'coordinador', score: 4 },
        { text: 'Impulso al equipo hacia los objetivos', role: 'impulsor', score: 4 }
      ]
    },
    {
      id: 2,
      question: 'Si hay un problema en el equipo, generalmente yo:',
      options: [
        { text: 'Analizo todas las opciones antes de decidir', role: 'monitor', score: 4 },
        { text: 'Busco el consenso y la armonía', role: 'cohesionador', score: 4 },
        { text: 'Organizo un plan de acción práctico', role: 'implementador', score: 4 },
        { text: 'Me aseguro de que no queden cabos sueltos', role: 'finalizador', score: 4 }
      ]
    },
    {
      id: 3,
      question: 'Los demás valoran de mí que:',
      options: [
        { text: 'Aporto conocimiento técnico especializado', role: 'especialista', score: 4 },
        { text: 'Genero soluciones innovadoras', role: 'cerebro', score: 4 },
        { text: 'Traigo información y contactos del exterior', role: 'investigador', score: 4 },
        { text: 'Mantengo al equipo enfocado y motivado', role: 'impulsor', score: 4 }
      ]
    },
    {
      id: 4,
      question: 'En las reuniones de equipo, suelo:',
      options: [
        { text: 'Facilitar la participación de todos', role: 'coordinador', score: 4 },
        { text: 'Evaluar críticamente las propuestas', role: 'monitor', score: 4 },
        { text: 'Mediar cuando hay tensiones', role: 'cohesionador', score: 4 },
        { text: 'Tomar notas y seguir la agenda', role: 'finalizador', score: 4 }
      ]
    },
    {
      id: 5,
      question: 'Mi debilidad más reconocida en equipos es:',
      options: [
        { text: 'A veces mis ideas son poco prácticas', role: 'cerebro', score: 4 },
        { text: 'Pierdo interés cuando la novedad pasa', role: 'investigador', score: 4 },
        { text: 'Puedo delegar demasiado trabajo', role: 'coordinador', score: 4 },
        { text: 'A veces soy demasiado directo', role: 'impulsor', score: 4 }
      ]
    },
    {
      id: 6,
      question: 'Cuando el equipo enfrenta un desafío nuevo:',
      options: [
        { text: 'Investigo cómo lo han resuelto otros', role: 'investigador', score: 4 },
        { text: 'Propongo una estrategia estructurada', role: 'implementador', score: 4 },
        { text: 'Me aseguro de que todos estén alineados', role: 'cohesionador', score: 4 },
        { text: 'Busco la solución más innovadora', role: 'cerebro', score: 4 }
      ]
    },
    {
      id: 7,
      question: 'Al final de un proyecto, generalmente:',
      options: [
        { text: 'Reviso que todo esté perfecto antes de entregar', role: 'finalizador', score: 4 },
        { text: 'Evalúo qué aprendimos para el futuro', role: 'monitor', score: 4 },
        { text: 'Celebro los logros con el equipo', role: 'cohesionador', score: 4 },
        { text: 'Ya estoy pensando en el siguiente reto', role: 'impulsor', score: 4 }
      ]
    },
    {
      id: 8,
      question: 'Prefiero trabajar en equipos donde pueda:',
      options: [
        { text: 'Aplicar mi expertise técnico', role: 'especialista', score: 4 },
        { text: 'Organizar y ejecutar planes', role: 'implementador', score: 4 },
        { text: 'Liderar y tomar decisiones', role: 'coordinador', score: 4 },
        { text: 'Innovar y proponer cambios', role: 'cerebro', score: 4 }
      ]
    },
    {
      id: 9,
      question: 'Cuando hay conflicto en el equipo:',
      options: [
        { text: 'Busco un acuerdo que satisfaga a todos', role: 'cohesionador', score: 4 },
        { text: 'Analizo objetivamente quién tiene razón', role: 'monitor', score: 4 },
        { text: 'Presiono para resolverlo rápido y seguir', role: 'impulsor', score: 4 },
        { text: 'Propongo una solución creativa', role: 'cerebro', score: 4 }
      ]
    }
  ], []);

  const calculateResults = () => {
    const roleScores = {};
    BELBIN_ROLES.forEach(r => { roleScores[r.id] = 0; });
    
    answers.forEach(a => {
      if (a.role && roleScores[a.role] !== undefined) {
        roleScores[a.role] += a.score;
      }
    });

    const sortedRoles = Object.entries(roleScores)
      .sort((a, b) => b[1] - a[1])
      .map(([roleId, score]) => ({
        ...BELBIN_ROLES.find(r => r.id === roleId),
        score
      }));

    return sortedRoles;
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < BELBIN_QUESTIONS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      const results = calculateResults();
      addSession({
        type: 'belbin',
        belbinRole: results[0]?.id,
        roleScore: results[0]?.score,
        score: results[0]?.score,
        maxScore: BELBIN_QUESTIONS.length * 4
      });
    }
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setStarted(true);
  };

  if (showResults) {
    const results = calculateResults();
    const topRole = results[0];
    const secondRole = results[1];
    const thirdRole = results[2];

    return (
      <div className="h-screen flex flex-col relative">
        <FloatingParticles />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto relative z-10">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-200 hover:text-white mb-4 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-6 border-2 border-amber-500/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{topRole?.icon}</div>
                <h2 className="text-2xl font-black text-white mb-1">Tu Rol Dominante</h2>
                <p className="text-amber-400 font-bold text-xl">{topRole?.name}</p>
              </div>

              <div className={`bg-gradient-to-br ${topRole?.color} p-4 rounded-2xl mb-6`}>
                <p className="text-white text-center font-medium">{topRole?.description}</p>
              </div>

              <div className="grid gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Fortalezas
                  </h4>
                  <ul className="space-y-1">
                    {topRole?.strengths.map((s, i) => (
                      <li key={i} className="text-slate-200 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Áreas de Mejora
                  </h4>
                  <ul className="space-y-1">
                    {topRole?.weaknesses.map((w, i) => (
                      <li key={i} className="text-slate-200 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-slate-300 font-medium mb-3">Roles Secundarios</h4>
                <div className="flex gap-3">
                  {[secondRole, thirdRole].filter(Boolean).map((role, i) => (
                    <div key={i} className="flex-1 bg-slate-700/50 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{role.icon}</div>
                      <p className="text-white text-sm font-medium">{role.name}</p>
                      <p className="text-amber-400 text-xs">{role.score} pts</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetake}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Repetir Test
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative flex items-center justify-center">
        <FloatingParticles />
        <GlowingOrb color="#f59e0b" size="250px" left="10%" top="20%" delay="0s" />

        <div className="max-w-lg mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-500/30 shadow-2xl text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h2 className="text-2xl font-black text-white mb-3">Test de Roles Belbin</h2>
            <p className="text-slate-300 mb-6">
              Descubre cuál es tu rol natural en un equipo de trabajo. 
              Este test de 9 preguntas identificará tus fortalezas y cómo contribuyes mejor al equipo.
            </p>

            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-amber-400 font-bold mb-2">Los 9 Roles de Belbin:</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                {BELBIN_ROLES.map(role => (
                  <div key={role.id} className="text-2xl" title={role.name}>
                    {role.icon}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105 flex items-center justify-center gap-2 w-full"
            >
              <Play className="w-5 h-5" />
              Comenzar Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = BELBIN_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#f59e0b" size="250px" left="10%" top="30%" delay="0s" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-amber-400 font-medium">Pregunta {currentQuestion + 1}/{BELBIN_QUESTIONS.length}</span>
            <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm">Roles Belbin</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / BELBIN_QUESTIONS.length) * 100}%` }}
            />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full text-left bg-slate-700/50 hover:bg-amber-500/20 border-2 border-slate-600 hover:border-amber-400 rounded-xl p-4 transition-all group"
              >
                <span className="text-slate-200 group-hover:text-white">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamSimulation = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al Simulador de Equipos! 🎮\n\nAquí practicarás situaciones reales de trabajo en equipo en entornos sanitarios.\n\n**Escenarios disponibles:**\n\n🏥 **Equipo de turno** - Gestiona un equipo durante un turno complicado\n⚠️ **Crisis en la unidad** - Coordina al equipo en una emergencia\n🆕 **Integración de nuevo miembro** - Facilita la adaptación de un compañero\n🔄 **Cambio de protocolo** - Lidera la implementación de un nuevo procedimiento\n\n¿Qué escenario quieres practicar?'
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
          systemPrompt: `Eres un simulador de situaciones de trabajo en equipo en entornos sanitarios.

TU ROL: Creas escenarios interactivos donde el usuario debe tomar decisiones como líder o miembro de un equipo de enfermería.

MECÁNICA:
1. Presenta una situación con personajes definidos (nombres, roles, personalidades)
2. Describe el contexto y el problema a resolver
3. Ofrece 3-4 opciones de acción al usuario
4. Según su elección, desarrolla las consecuencias
5. Al final, evalúa sus decisiones y da feedback

ESCENARIOS TIPO:
- Conflictos entre compañeros
- Sobrecarga de trabajo y priorización
- Comunicación en emergencias
- Integración de nuevos miembros
- Resistencia al cambio
- Delegación de tareas

ESTILO: Narrativo, inmersivo, con diálogos de los personajes. Usa nombres españoles.

FEEDBACK: Valora trabajo en equipo, comunicación, liderazgo, resolución de problemas.

Siempre en español, contextualizado al ámbito sanitario.`
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
      content: '¡Nueva simulación! 🎮 ¿Qué escenario de equipo quieres practicar?'
    }]);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-xl">🎮</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Simulador de Equipo</h1>
            <p className="text-xs text-amber-300">Escenarios interactivos</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando escenario...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-amber-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu decisión o respuesta..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-amber-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
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
      case 'belbin':
        return <BelbinTest onBack={handleBack} />;
      case 'simulation':
        return <TeamSimulation onBack={handleBack} />;
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
