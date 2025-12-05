import React, { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { ArrowLeft, Send, Bot, User, Users, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Target, Home, Trophy, Sparkles, Crown, TrendingUp, BarChart3, Flame, RefreshCw, ChevronDown, AlertTriangle, Theater, LineChart, BookOpen, Layers, UserCircle, MessageCircle, Settings, Lightbulb, GraduationCap, Heart, Shield, Volume2, Brain, Handshake } from 'lucide-react';
import leadershipBg from '../../assets/leadership-bg.png';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const TeamworkProfileContext = createContext(null);

const useTeamworkProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultProfile = {
    styles: {
      colaborativo: 0,
      competitivo: 0,
      evitativo: 0,
      acomodativo: 0,
      compromiso: 0,
      coordinador: 0,
      liderFacilitador: 0,
      miembroPasivo: 0
    },
    stylesCounts: {
      colaborativo: 0,
      competitivo: 0,
      evitativo: 0,
      acomodativo: 0,
      compromiso: 0,
      coordinador: 0,
      liderFacilitador: 0,
      miembroPasivo: 0
    },
    dimensions: {
      cooperacion: 0,
      cohesion: 0,
      responsabilidadCompartida: 0,
      comunicacionInterna: 0,
      resolucionConjunta: 0,
      apoyoMutuo: 0,
      confianza: 0,
      coordinacion: 0,
      rolFlexible: 0,
      climaUnitario: 0
    },
    dimensionsCounts: {
      cooperacion: 0,
      cohesion: 0,
      responsabilidadCompartida: 0,
      comunicacionInterna: 0,
      resolucionConjunta: 0,
      apoyoMutuo: 0,
      confianza: 0,
      coordinacion: 0,
      rolFlexible: 0,
      climaUnitario: 0
    },
    roles: {
      facilitador: 0,
      moderador: 0,
      coordinador: 0,
      puente: 0,
      expertoTecnico: 0,
      mediador: 0,
      motivador: 0,
      observadorCritico: 0
    },
    rolesCounts: {
      facilitador: 0,
      moderador: 0,
      coordinador: 0,
      puente: 0,
      expertoTecnico: 0,
      mediador: 0,
      motivador: 0,
      observadorCritico: 0
    },
    sessions: [],
    totalSessions: 0,
    averageScore: 0,
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

    if (sessionData.styleDetected) {
      const styleKey = sessionData.styleDetected.toLowerCase().replace(/[áéíóú\s-]/g, match => {
        const map = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', ' ': '', '-': '' };
        return map[match] || match;
      });
      if (updatedProfile.styles[styleKey] !== undefined) {
        updatedProfile.stylesCounts[styleKey] = (updatedProfile.stylesCounts[styleKey] || 0) + 1;
        const count = updatedProfile.stylesCounts[styleKey];
        const prevAvg = updatedProfile.styles[styleKey] || 0;
        updatedProfile.styles[styleKey] = ((prevAvg * (count - 1)) + (sessionData.score / sessionData.maxScore * 5)) / count;
      }
    }

    if (sessionData.dimensions) {
      Object.entries(sessionData.dimensions).forEach(([dim, value]) => {
        if (updatedProfile.dimensions[dim] !== undefined) {
          updatedProfile.dimensionsCounts[dim] = (updatedProfile.dimensionsCounts[dim] || 0) + 1;
          const count = updatedProfile.dimensionsCounts[dim];
          const prevAvg = updatedProfile.dimensions[dim] || 0;
          updatedProfile.dimensions[dim] = ((prevAvg * (count - 1)) + value) / count;
        }
      });
    }

    if (sessionData.roleDetected) {
      const roleKey = sessionData.roleDetected.toLowerCase().replace(/[áéíóú\s-]/g, match => {
        const map = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', ' ': '', '-': '' };
        return map[match] || match;
      });
      if (updatedProfile.roles[roleKey] !== undefined) {
        updatedProfile.rolesCounts[roleKey] = (updatedProfile.rolesCounts[roleKey] || 0) + 1;
      }
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

  const getDominantStyles = useCallback(() => {
    if (!profile || !profile.stylesCounts) return [];
    return Object.entries(profile.stylesCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([style, count]) => ({
        style: style.charAt(0).toUpperCase() + style.slice(1),
        count,
        avgScore: profile.styles[style] || 0
      }));
  }, [profile]);

  const getTrends = useCallback((n = 10) => {
    if (!profile || !profile.sessions) return [];
    return profile.sessions.slice(-n).map(s => ({
      date: new Date(s.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      score: s.score && s.maxScore ? (s.score / s.maxScore * 100) : 0,
      type: s.type,
      style: s.styleDetected
    }));
  }, [profile]);

  const getCriticalAreas = useCallback(() => {
    if (!profile || !profile.dimensions) return [];
    return Object.entries(profile.dimensions)
      .filter(([_, value]) => value > 0 && value < 3)
      .map(([dim, value]) => ({
        dimension: dim,
        value: value.toFixed(1),
        label: {
          cooperacion: 'Cooperación',
          cohesion: 'Cohesión',
          responsabilidadCompartida: 'Responsabilidad Compartida',
          comunicacionInterna: 'Comunicación Interna',
          resolucionConjunta: 'Resolución Conjunta',
          apoyoMutuo: 'Apoyo Mutuo',
          confianza: 'Confianza',
          coordinacion: 'Coordinación',
          rolFlexible: 'Rol Flexible',
          climaUnitario: 'Clima Unitario'
        }[dim] || dim
      }));
  }, [profile]);

  return {
    profile,
    loading,
    addSession,
    getDominantStyles,
    getTrends,
    getCriticalAreas
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
      getDominantStyles: () => [],
      getTrends: () => [],
      getCriticalAreas: () => []
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
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
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
    id: 'scenarios',
    title: 'Escenarios Colaborativos',
    description: 'Simulaciones de situaciones reales en equipos clínicos',
    icon: '🤝',
    color: 'from-amber-500 to-orange-500',
    features: ['7 tipos de escenarios', 'Evaluación IA', 'Puntuación 0-10']
  },
  {
    id: 'roleplay',
    title: 'Role-Play de Equipo',
    description: 'La IA interpreta miembros del equipo con personalidades únicas',
    icon: '🎭',
    color: 'from-violet-500 to-purple-500',
    features: ['6 personajes', 'Reacción dinámica', 'Feedback inmediato'],
    isNew: true
  },
  {
    id: 'teamtest',
    title: 'Test de Trabajo en Equipo',
    description: 'Evalúa tus 10 dimensiones del trabajo colaborativo',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    features: ['20 preguntas', '10 dimensiones', 'Gráfica radar']
  },
  {
    id: 'roles',
    title: 'Dinámicas de Roles',
    description: 'Descubre y mejora tu rol funcional en equipos',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    features: ['8 roles funcionales', 'Análisis contextual', 'Recomendaciones'],
    isNew: true
  },
  {
    id: 'conflict',
    title: 'Conflictos Interprofesionales',
    description: 'Aprende a gestionar tensiones entre profesionales',
    icon: '⚔️',
    color: 'from-rose-500 to-red-500',
    features: ['6 tipos de conflicto', 'Desescalada', 'Soluciones cooperativas']
  },
  {
    id: 'cohesion',
    title: 'Cohesión y Apoyo Mutuo',
    description: 'Desarrolla clima positivo y interdependencia',
    icon: '💪',
    color: 'from-cyan-500 to-blue-500',
    features: ['Clima laboral', 'Reconocimiento', 'Logros colectivos'],
    isNew: true
  },
  {
    id: 'analytics',
    title: 'Panel de Analítica',
    description: 'Dashboard con tu perfil de trabajo en equipo',
    icon: '📈',
    color: 'from-sky-500 to-cyan-500',
    features: ['Métricas detalladas', 'Tendencias', 'Evolución'],
    isNew: true
  },
  {
    id: 'mentor',
    title: 'Modo Mentor',
    description: 'Coach experto en equipos para gestoras enfermeras',
    icon: '🎓',
    color: 'from-yellow-500 to-amber-500',
    features: ['Técnicas avanzadas', 'Dinámicas de equipo', 'Coaching personal'],
    isNew: true
  }
];

const TEAMWORK_SCENARIOS = [
  {
    id: 'carga-desigual',
    title: 'Reparto Desigual de Cargas',
    category: 'Coordinación',
    description: 'Un turno con distribución desigual de pacientes genera tensión en el equipo.',
    difficulty: 'Intermedio',
    icon: '⚖️',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'experiencia-mixta',
    title: 'Coordinación de Experiencias',
    category: 'Mentoría',
    description: 'Debes coordinar enfermeras novatas con veteranas en un turno complejo.',
    difficulty: 'Avanzado',
    icon: '👥',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'prioridades-conflicto',
    title: 'Conflicto de Prioridades',
    category: 'Toma de Decisiones',
    description: 'Dos profesionales tienen criterios distintos sobre la prioridad de atención.',
    difficulty: 'Avanzado',
    icon: '🎯',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'evento-adverso',
    title: 'Evento Adverso Crítico',
    category: 'Crisis',
    description: 'Un incidente crítico requiere coordinación inmediata del equipo.',
    difficulty: 'Experto',
    icon: '🚨',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'multidisciplinar',
    title: 'Equipo Multidisciplinar',
    category: 'Comunicación',
    description: 'Coordinación con médicos, fisios, celadores en un caso complejo.',
    difficulty: 'Avanzado',
    icon: '🏥',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'emergencia-coordinada',
    title: 'Respuesta a Emergencia',
    category: 'Liderazgo',
    description: 'Liderar la respuesta coordinada del equipo ante una emergencia.',
    difficulty: 'Experto',
    icon: '⚡',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'nuevo-protocolo',
    title: 'Implementación de Protocolo',
    category: 'Gestión del Cambio',
    description: 'Introducir un nuevo protocolo en la unidad con resistencias del equipo.',
    difficulty: 'Avanzado',
    icon: '📋',
    color: 'from-cyan-500 to-blue-500'
  }
];

const ROLEPLAY_CHARACTERS = [
  {
    id: 'novata',
    name: 'Elena',
    role: 'Enfermera Novata Insegura',
    emotion: 'Inseguridad',
    description: 'Recién graduada, teme cometer errores y pedir ayuda',
    icon: '😟',
    color: 'from-sky-500 to-blue-500',
    personality: 'Insegura, callada, busca aprobación constante',
    challenge: 'Generar confianza sin sobreproteger ni ignorar',
    prompt: `Eres Elena, una enfermera de 24 años recién graduada.
PERSONALIDAD: Llevas 3 meses en la unidad. Tienes miedo de cometer errores y que te juzguen. No te atreves a pedir ayuda porque crees que pensarán que no vales.
EMOCIÓN DOMINANTE: Inseguridad y miedo al fracaso
COMPORTAMIENTO:
- Hablas bajo, evitas el contacto visual
- Si te presionan: te bloqueas más
- Si te dan seguridad y paciencia: empiezas a abrirte
- Frases típicas: "No sé si lo estoy haciendo bien", "Perdona si molesto", "¿Puedo preguntarte algo?"`
  },
  {
    id: 'veterana',
    name: 'Marta',
    role: 'Enfermera Veterana Dominante',
    emotion: 'Superioridad',
    description: 'Lleva 20 años y cree que siempre tiene razón',
    icon: '😤',
    color: 'from-amber-500 to-orange-500',
    personality: 'Autoritaria, crítica, resistente al cambio',
    challenge: 'Ganar su respeto sin confrontación directa',
    prompt: `Eres Marta, una enfermera de 52 años con 25 años de experiencia.
PERSONALIDAD: Has visto todo. Crees que las nuevas no saben nada. Te resistes a cambios y nuevos protocolos. No confías en nadie.
EMOCIÓN DOMINANTE: Superioridad y desconfianza
COMPORTAMIENTO:
- Interrumpes, das lecciones no pedidas
- Si te cuestionan directamente: te pones a la defensiva
- Si reconocen tu experiencia primero: bajas la guardia
- Frases típicas: "Yo llevo haciendo esto 25 años", "Eso ya lo probamos y no funciona", "Las de ahora no saben nada"`
  },
  {
    id: 'desmotivado',
    name: 'Carlos',
    role: 'Profesional Desmotivado',
    emotion: 'Apatía',
    description: 'Quemado tras años de sobrecarga, hace lo mínimo',
    icon: '😔',
    color: 'from-slate-500 to-gray-500',
    personality: 'Apático, cínico, desconectado del equipo',
    challenge: 'Reconectar sin forzar ni juzgar',
    prompt: `Eres Carlos, un enfermero de 45 años quemado.
PERSONALIDAD: Llevas años con sobrecarga. Ya no te importa nada. Haces lo mínimo y te vas. No crees en cambios ni en la gestión.
EMOCIÓN DOMINANTE: Apatía y cinismo
COMPORTAMIENTO:
- Respuestas cortas, sin implicación
- Si le pides más esfuerzo: se cierra más
- Si escuchas genuinamente su frustración: puede abrirse
- Frases típicas: "Da igual lo que hagamos", "Eso no va a cambiar nada", "Yo ya paso"`
  },
  {
    id: 'nocoopera',
    name: 'Lucía',
    role: 'Profesional que No Coopera',
    emotion: 'Individualismo',
    description: 'Prefiere trabajar sola, evita colaborar',
    icon: '🙄',
    color: 'from-violet-500 to-purple-500',
    personality: 'Individualista, evita compromisos grupales',
    challenge: 'Integrar sin forzar, mostrar beneficios de colaborar',
    prompt: `Eres Lucía, una enfermera de 35 años muy competente pero individualista.
PERSONALIDAD: Prefieres hacer las cosas tú sola porque así salen bien. No confías en el trabajo de otros. Evitas reuniones y actividades grupales.
EMOCIÓN DOMINANTE: Desconfianza en los demás
COMPORTAMIENTO:
- Rechaza propuestas de trabajo conjunto
- Si la obligas: cumple mínimamente y con mala cara
- Si le muestras cómo le beneficia personalmente: puede ceder
- Frases típicas: "Yo me apaño sola", "Prefiero hacerlo yo", "Las reuniones son una pérdida de tiempo"`
  },
  {
    id: 'exceso',
    name: 'Ana',
    role: 'Profesional que Trabaja en Exceso',
    emotion: 'Ansiedad',
    description: 'Se sobrecarga de tareas, no sabe decir no',
    icon: '😰',
    color: 'from-rose-500 to-pink-500',
    personality: 'Perfeccionista, incapaz de delegar, agotada',
    challenge: 'Ayudar a establecer límites sin culpabilizar',
    prompt: `Eres Ana, una enfermera de 38 años que siempre carga con todo.
PERSONALIDAD: No sabes decir que no. Te ofreces para todo. Crees que si no lo haces tú, saldrá mal. Estás agotada pero no paras.
EMOCIÓN DOMINANTE: Ansiedad y necesidad de control
COMPORTAMIENTO:
- Aceptas más tareas aunque estés saturada
- Si te piden que delegues: sientes ansiedad
- Si normalizan que no se puede hacer todo: te alivias un poco
- Frases típicas: "Ya lo hago yo", "No te preocupes, puedo con más", "Si no lo hago yo..."`
  },
  {
    id: 'saturado',
    name: 'Equipo Saturado',
    role: 'Equipo bajo Presión Asistencial',
    emotion: 'Estrés Colectivo',
    description: 'Todo el turno está desbordado por carga excesiva',
    icon: '🔥',
    color: 'from-red-500 to-orange-500',
    personality: 'Tensión generalizada, comunicación cortante',
    challenge: 'Mantener cohesión y priorizar como equipo',
    prompt: `Representas un EQUIPO completo de 5 enfermeras en un turno saturado.
SITUACIÓN: Hay 3 bajas sin cubrir, 2 ingresos urgentes, y el sistema informático ha caído. La tensión es máxima.
COMPORTAMIENTO GRUPAL:
- Respuestas cortantes, prisas, errores por estrés
- Si alguien intenta organizar: algunos resisten, otros agradecen
- Si se priorizan tareas en equipo: mejora la coordinación
- Frases típicas: "¡No damos abasto!", "¿Quién hace esto?", "Necesitamos ayuda"`
  }
];

const INTERPROFESSIONAL_CONFLICTS = [
  {
    id: 'enfermera-medico',
    title: 'Enfermera vs. Médico',
    description: 'Desacuerdo sobre la indicación de un tratamiento que crees inadecuado.',
    icon: '👩‍⚕️',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'auxiliar-enfermera',
    title: 'Auxiliar vs. Enfermera',
    description: 'La auxiliar siente que le delegas tareas que no le corresponden.',
    icon: '🤝',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'turnos',
    title: 'Turno de Mañana vs. Noche',
    description: 'Tensión por tareas que se dejan pendientes entre turnos.',
    icon: '🌙',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'pacientes',
    title: 'Distribución de Pacientes',
    description: 'Conflicto por la asignación desigual de pacientes complejos.',
    icon: '📋',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'criterio-clinico',
    title: 'Diferencias de Criterio Clínico',
    description: 'Dos profesionales con enfoques opuestos sobre el cuidado de un paciente.',
    icon: '⚕️',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'recursos',
    title: 'Competencia por Recursos',
    description: 'Disputa por el uso de material escaso o espacios compartidos.',
    icon: '🏥',
    color: 'from-cyan-500 to-blue-500'
  }
];

const TEAMWORK_TEST_QUESTIONS_BANK = [
  {
    id: 1,
    dimension: 'Cooperación',
    question: 'Una compañera tiene dificultades con un procedimiento. Tienes trabajo pendiente. ¿Qué haces?',
    options: [
      { text: 'Me acerco a ayudarla y reorganizo mis prioridades', score: 4, style: 'colaborativo' },
      { text: 'Le digo que luego la ayudo cuando termine lo mío', score: 2, style: 'acomodativo' },
      { text: 'Asumo que alguien más la ayudará', score: 1, style: 'evitativo' },
      { text: 'Continúo con lo mío, cada uno debe resolver sus problemas', score: 1, style: 'competitivo' }
    ]
  },
  {
    id: 2,
    dimension: 'Cooperación',
    question: 'El equipo debe decidir cómo organizar el turno. Hay varias opiniones. ¿Cómo actúas?',
    options: [
      { text: 'Propongo integrar las ideas de todos buscando consenso', score: 4, style: 'colaborativo' },
      { text: 'Defiendo mi propuesta porque creo que es la mejor', score: 2, style: 'competitivo' },
      { text: 'Acepto lo que diga la mayoría sin opinar', score: 1, style: 'pasivo' },
      { text: 'Sugiero votar rápido para no perder tiempo', score: 2, style: 'compromiso' }
    ]
  },
  {
    id: 3,
    dimension: 'Cohesión',
    question: 'Una compañera nueva parece aislada del grupo. ¿Qué haces?',
    options: [
      { text: 'La incluyo activamente en conversaciones y actividades del equipo', score: 4, style: 'colaborativo' },
      { text: 'Espero a que ella tome la iniciativa de integrarse', score: 1, style: 'evitativo' },
      { text: 'Le doy información práctica sobre el trabajo', score: 2, style: 'formal' },
      { text: 'Aviso al supervisor para que se encargue', score: 1, style: 'delegador' }
    ]
  },
  {
    id: 4,
    dimension: 'Cohesión',
    question: 'Después de un turno difícil, el ambiente está tenso. ¿Cómo contribuyes?',
    options: [
      { text: 'Propongo una breve pausa grupal para descomprimir juntos', score: 4, style: 'facilitador' },
      { text: 'Intento animar con comentarios positivos', score: 3, style: 'motivador' },
      { text: 'Me centro en terminar mis tareas lo antes posible', score: 1, style: 'individualista' },
      { text: 'Comento que ha sido un mal turno y listo', score: 1, style: 'pasivo' }
    ]
  },
  {
    id: 5,
    dimension: 'Responsabilidad Compartida',
    question: 'Descubres un error en el registro que no es tuyo pero afecta al paciente. ¿Qué haces?',
    options: [
      { text: 'Lo corrijo y comunico al equipo para prevenir futuros errores', score: 4, style: 'responsable' },
      { text: 'Busco a quien lo hizo para que lo corrija', score: 2, style: 'delegador' },
      { text: 'Lo corrijo pero no digo nada para no crear conflicto', score: 2, style: 'evitativo' },
      { text: 'No es mi responsabilidad, lo dejo como está', score: 1, style: 'irresponsable' }
    ]
  },
  {
    id: 6,
    dimension: 'Responsabilidad Compartida',
    question: 'Un objetivo del equipo no se cumplió. ¿Cómo reaccionas?',
    options: [
      { text: 'Analizo con el equipo qué podemos mejorar todos', score: 4, style: 'colaborativo' },
      { text: 'Identifico qué falló para no repetirlo', score: 3, style: 'analítico' },
      { text: 'Asumo que no era responsabilidad mía', score: 1, style: 'evasivo' },
      { text: 'Busco quién fue el responsable del fallo', score: 1, style: 'culpabilizador' }
    ]
  },
  {
    id: 7,
    dimension: 'Comunicación Interna',
    question: 'Tienes información importante sobre un paciente. El cambio de turno es en 5 minutos. ¿Qué haces?',
    options: [
      { text: 'Busco activamente al compañero del siguiente turno para transmitirla', score: 4, style: 'proactivo' },
      { text: 'La dejo registrada en el sistema', score: 2, style: 'formal' },
      { text: 'La menciono si me preguntan', score: 1, style: 'pasivo' },
      { text: 'Asumo que lo verán en el registro', score: 1, style: 'negligente' }
    ]
  },
  {
    id: 8,
    dimension: 'Comunicación Interna',
    question: 'En una reunión de equipo, notas que una compañera no ha entendido bien una instrucción. ¿Qué haces?',
    options: [
      { text: 'Después de la reunión, me acerco discretamente para clarificarlo', score: 4, style: 'empático' },
      { text: 'Lo aclaro en el momento para que todos lo oigan', score: 3, style: 'directo' },
      { text: 'Asumo que preguntará si tiene dudas', score: 1, style: 'pasivo' },
      { text: 'No es mi responsabilidad, ya lo entenderá', score: 1, style: 'indiferente' }
    ]
  },
  {
    id: 9,
    dimension: 'Resolución Conjunta',
    question: 'El equipo enfrenta un problema logístico que afecta la atención. ¿Cómo participas?',
    options: [
      { text: 'Propongo una reunión breve para generar soluciones entre todos', score: 4, style: 'colaborativo' },
      { text: 'Aporto mi idea y dejo que otros decidan', score: 2, style: 'acomodativo' },
      { text: 'Espero a que el supervisor lo resuelva', score: 1, style: 'dependiente' },
      { text: 'Resuelvo mi parte del problema individualmente', score: 2, style: 'individualista' }
    ]
  },
  {
    id: 10,
    dimension: 'Resolución Conjunta',
    question: 'Dos compañeras proponen soluciones opuestas a un problema. ¿Cómo actúas?',
    options: [
      { text: 'Facilito el diálogo buscando puntos en común', score: 4, style: 'mediador' },
      { text: 'Apoyo la propuesta que me parece mejor', score: 2, style: 'decidido' },
      { text: 'Sugiero que el supervisor decida', score: 1, style: 'delegador' },
      { text: 'Me mantengo neutral sin opinar', score: 1, style: 'evitativo' }
    ]
  },
  {
    id: 11,
    dimension: 'Apoyo Mutuo',
    question: 'Una compañera está visiblemente estresada durante el turno. ¿Qué haces?',
    options: [
      { text: 'Le pregunto cómo está y ofrezco ayuda concreta', score: 4, style: 'empático' },
      { text: 'Le digo que aguante, que ya queda poco', score: 2, style: 'minimizador' },
      { text: 'Me centro en mi trabajo para no añadirle carga', score: 1, style: 'evitativo' },
      { text: 'Asumo que es cosa suya gestionar su estrés', score: 1, style: 'indiferente' }
    ]
  },
  {
    id: 12,
    dimension: 'Apoyo Mutuo',
    question: 'Un compañero cometió un error menor y está muy afectado. ¿Cómo reaccionas?',
    options: [
      { text: 'Lo apoyo emocionalmente y le ayudo a ver que todos cometemos errores', score: 4, style: 'solidario' },
      { text: 'Le doy consejos para que no le vuelva a pasar', score: 2, style: 'consejero' },
      { text: 'No digo nada para no incomodarlo', score: 1, style: 'evitativo' },
      { text: 'Le recuerdo la importancia de ser cuidadoso', score: 1, style: 'crítico' }
    ]
  },
  {
    id: 13,
    dimension: 'Confianza',
    question: 'Te asignan trabajar con alguien a quien apenas conoces. ¿Cómo te planteas la colaboración?',
    options: [
      { text: 'Confío en su profesionalidad y busco coordinarnos bien', score: 4, style: 'confiado' },
      { text: 'Observo primero cómo trabaja antes de confiar', score: 2, style: 'cauteloso' },
      { text: 'Prefiero hacer yo las tareas importantes', score: 1, style: 'desconfiado' },
      { text: 'Trabajo a mi manera y que ella haga lo suyo', score: 1, style: 'individualista' }
    ]
  },
  {
    id: 14,
    dimension: 'Confianza',
    question: 'Una compañera te pide cubrir una tarea mientras atiende una urgencia. ¿Cómo respondes?',
    options: [
      { text: 'Acepto sin dudar, confiando en que ella haría lo mismo por mí', score: 4, style: 'solidario' },
      { text: 'Acepto pero le pido detalles de qué debo hacer exactamente', score: 3, style: 'prudente' },
      { text: 'Le digo que primero termine lo mío', score: 1, style: 'rígido' },
      { text: 'Dudo porque no sé si luego ella me corresponderá', score: 1, style: 'transaccional' }
    ]
  },
  {
    id: 15,
    dimension: 'Coordinación',
    question: 'El equipo debe realizar varias tareas simultáneas. ¿Cómo contribuyes a la organización?',
    options: [
      { text: 'Propongo distribuir tareas según fortalezas de cada uno', score: 4, style: 'coordinador' },
      { text: 'Me ofrezco para las tareas que mejor se me dan', score: 3, style: 'proactivo' },
      { text: 'Espero a que alguien organice y me asigne tarea', score: 1, style: 'pasivo' },
      { text: 'Elijo una tarea y la hago por mi cuenta', score: 2, style: 'individualista' }
    ]
  },
  {
    id: 16,
    dimension: 'Coordinación',
    question: 'Detectas que dos compañeras están haciendo la misma tarea sin saberlo. ¿Qué haces?',
    options: [
      { text: 'Aviso inmediatamente a ambas para que se coordinen', score: 4, style: 'coordinador' },
      { text: 'Aviso a la supervisora para que lo gestione', score: 2, style: 'formal' },
      { text: 'Dejo que lo descubran ellas', score: 1, style: 'pasivo' },
      { text: 'Me parece bien, así la tarea quedará bien hecha', score: 1, style: 'indiferente' }
    ]
  },
  {
    id: 17,
    dimension: 'Rol Flexible',
    question: 'Te piden asumir temporalmente un rol diferente al habitual por necesidades del servicio. ¿Cómo respondes?',
    options: [
      { text: 'Acepto con actitud positiva, es una oportunidad de aprender', score: 4, style: 'flexible' },
      { text: 'Acepto pero expreso mis limitaciones', score: 3, style: 'honesto' },
      { text: 'Pido que busquen a alguien más preparado', score: 1, style: 'rígido' },
      { text: 'Acepto pero con resistencia interna', score: 2, style: 'conformista' }
    ]
  },
  {
    id: 18,
    dimension: 'Rol Flexible',
    question: 'En una situación de emergencia, debes hacer tareas que no son de tu área. ¿Cómo actúas?',
    options: [
      { text: 'Hago lo necesario priorizando al paciente, luego regularizamos', score: 4, style: 'pragmático' },
      { text: 'Pregunto primero si puedo hacer esas tareas', score: 2, style: 'formal' },
      { text: 'Busco a alguien de esa área para que lo haga', score: 1, style: 'rígido' },
      { text: 'Lo hago pero dejo constancia de que no me corresponde', score: 2, style: 'defensivo' }
    ]
  },
  {
    id: 19,
    dimension: 'Clima Unitario',
    question: 'Escuchas comentarios negativos sobre una compañera ausente. ¿Qué haces?',
    options: [
      { text: 'Redirijo la conversación hacia algo constructivo', score: 4, style: 'constructivo' },
      { text: 'Defiendo a la compañera ausente', score: 3, style: 'solidario' },
      { text: 'No participo pero tampoco digo nada', score: 1, style: 'pasivo' },
      { text: 'Escucho para estar informada de lo que pasa', score: 1, style: 'chismoso' }
    ]
  },
  {
    id: 20,
    dimension: 'Clima Unitario',
    question: 'El equipo acaba de lograr un objetivo importante. ¿Cómo celebras el éxito?',
    options: [
      { text: 'Propongo reconocer públicamente el esfuerzo de todos', score: 4, style: 'celebrador' },
      { text: 'Felicito individualmente a quienes más aportaron', score: 3, style: 'reconocedor' },
      { text: 'Me alegro internamente y sigo con el trabajo', score: 1, style: 'discreto' },
      { text: 'Destaco mi propia contribución al logro', score: 1, style: 'egocéntrico' }
    ]
  }
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleQuestionOptions = (question) => ({
  ...question,
  options: shuffleArray([...question.options])
});

const getShuffledTestQuestions = () => {
  const questionsByDimension = {};
  TEAMWORK_TEST_QUESTIONS_BANK.forEach(q => {
    if (!questionsByDimension[q.dimension]) {
      questionsByDimension[q.dimension] = [];
    }
    questionsByDimension[q.dimension].push(q);
  });
  
  let selectedQuestions = [];
  Object.values(questionsByDimension).forEach(dimQuestions => {
    const shuffledDim = shuffleArray(dimQuestions);
    selectedQuestions.push(...shuffledDim.slice(0, 2));
  });
  
  return shuffleArray(selectedQuestions).map(shuffleQuestionOptions);
};

const EMOJIS_BY_SCORE = {
  excellent: ['🏆', '🌟', '👑', '🎯', '💎', '🚀', '⭐', '🎖️'],
  good: ['😄', '👏', '💪', '🙌', '✨', '🎉', '👍', '🌈'],
  average: ['👀', '🤔', '💭', '📈', '🎯', '💡', '🔄', '📊'],
  poor: ['💪', '🌱', '📚', '🎓', '🔧', '🛠️', '📖', '✏️']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excelente trabajo en equipo!',
    '¡Eres un pilar del equipo!',
    '¡Colaboración ejemplar!',
    '¡El equipo te necesita!',
    '¡Liderazgo colaborativo!'
  ],
  good: [
    '¡Muy buen desempeño!',
    '¡Vas por buen camino!',
    '¡Sigue construyendo equipo!',
    '¡Gran potencial colaborativo!',
    '¡Buena cohesión grupal!'
  ],
  average: [
    'Hay potencial, pero puedes mejorar',
    'Buen intento, sigue practicando',
    'Cada sesión te hace mejor',
    'El trabajo en equipo se aprende',
    'Paso a paso hacia la excelencia'
  ],
  poor: [
    'El trabajo en equipo se desarrolla',
    'Cada práctica te fortalece',
    'No te rindas, sigue adelante',
    'El camino del aprendizaje es largo',
    'La mejora continua es clave'
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

const RadarChart = ({ data, labels, title }) => {
  const center = 120;
  const radius = 80;
  const angleStep = (2 * Math.PI) / labels.length;
  const maxValue = 4;

  const points = data.map((value, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  });

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30">
      <h3 className="text-center text-white font-bold mb-2">{title}</h3>
      <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
        {gridLevels.map((level, idx) => (
          <polygon
            key={idx}
            points={labels.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = level * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#475569"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}
        {labels.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#475569"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}
        <polygon
          points={pathD.replace(/[MLZ]/g, '').trim()}
          fill="rgba(245, 158, 11, 0.3)"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" />
        ))}
        {labels.map((label, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] fill-slate-300"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const ModeSelector = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#f59e0b" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#eab308" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-6 py-3 rounded-2xl border border-amber-500/30 mb-6">
            <Users className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-black text-white">
              Centro de <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Trabajo en Equipo</span>
            </h1>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Desarrolla competencias de colaboración y cohesión grupal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAMWORK_MODES.map((mode, idx) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 ${mode.isNew ? 'border-violet-500/60 ring-1 ring-violet-400/30' : 'border-slate-600'} hover:border-amber-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-amber-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {mode.isNew && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-lg">
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

const ScenarioSelector = ({ onSelectScenario, onBack }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">Escenarios Colaborativos</h2>
          <p className="text-slate-300">Elige una situación de equipo para practicar</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {TEAMWORK_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-amber-400 rounded-2xl p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl shadow-lg`}>
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-100">{scenario.title}</h3>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{scenario.category}</span>
                  <p className="text-slate-300 text-sm mt-2">{scenario.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scenario.difficulty === 'Experto' ? 'bg-red-500/20 text-red-300' :
                      scenario.difficulty === 'Avanzado' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {scenario.difficulty}
                    </span>
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

const ScenarioChat = ({ scenario, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  useEffect(() => {
    const initMessage = {
      role: 'assistant',
      content: `**${scenario.title}**\n\n${scenario.description}\n\n🎯 **Tu misión**: Gestiona esta situación demostrando tus habilidades de trabajo en equipo.\n\n¿Cómo abordarías esta situación?`
    };
    setMessages([initMessage]);
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          systemPrompt: `Eres un simulador de trabajo en equipo para gestoras enfermeras.

ESCENARIO ACTUAL: ${scenario.title}
CONTEXTO: ${scenario.description}
CATEGORÍA: ${scenario.category}

Tu rol es:
1. Presentar situaciones realistas de trabajo en equipo
2. Reaccionar de forma dinámica según las respuestas
3. Evaluar el nivel de trabajo colaborativo demostrado

ESTILOS COLABORATIVOS A DETECTAR:
- Colaborativo: Busca ganar-ganar, integra perspectivas
- Competitivo: Prioriza sus intereses, busca dominar
- Evitativo: Evade conflictos, no se posiciona
- Acomodativo: Cede siempre, prioriza armonía sobre resultados
- Compromiso: Busca punto medio, cede parcialmente
- Coordinador: Organiza, distribuye tareas
- Líder facilitador: Guía sin imponer, empodera
- Miembro pasivo: Espera indicaciones, no proactivo

Después de 3-4 intercambios, proporciona una evaluación completa:

FORMATO DE EVALUACIÓN (usar exactamente este formato JSON al final):
{
  "evaluacion": true,
  "puntuacion": X,
  "estiloDetectado": "nombre del estilo",
  "estiloAdecuado": true/false,
  "feedback": "análisis detallado",
  "fortalezas": ["punto 1", "punto 2"],
  "areasAMejorar": ["punto 1", "punto 2"],
  "sugerencias": ["sugerencia 1", "sugerencia 2"]
}

Responde en español, de forma profesional y constructiva.`
        })
      });

      const data = await response.json();
      
      if (data.response.includes('"evaluacion": true') || data.response.includes('"evaluacion":true')) {
        try {
          const jsonMatch = data.response.match(/\{[\s\S]*"evaluacion"[\s\S]*\}/);
          if (jsonMatch) {
            const evalData = JSON.parse(jsonMatch[0]);
            setResult(evalData);
            setShowResult(true);
            
            addSession({
              type: 'scenario',
              scenarioId: scenario.id,
              score: evalData.puntuacion,
              maxScore: 10,
              styleDetected: evalData.estiloDetectado
            });
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    const category = getScoreCategory(result.puntuacion, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);

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
            
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-amber-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {result.puntuacion}/10
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      category === 'excellent' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                      category === 'good' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                      category === 'average' ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                      'bg-gradient-to-r from-red-400 to-rose-400'
                    }`}
                    style={{ width: `${result.puntuacion * 10}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 mb-3">
                <p className="text-amber-300 font-bold text-sm mb-1">Estilo Colaborativo Detectado:</p>
                <p className="text-white text-lg font-black">{result.estiloDetectado}</p>
                <p className={`text-xs mt-1 ${result.estiloAdecuado ? 'text-green-400' : 'text-orange-400'}`}>
                  {result.estiloAdecuado ? '✓ Adecuado para esta situación' : '⚠ Podría mejorarse para este contexto'}
                </p>
              </div>
              
              <p className="text-slate-200 text-sm mb-3 leading-relaxed">{result.feedback}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 text-left">
                  <p className="text-green-400 font-bold text-xs mb-1">✓ Fortalezas</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.fortalezas?.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2 text-left">
                  <p className="text-orange-400 font-bold text-xs mb-1">↗ Áreas de mejora</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.areasAMejorar?.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-3 text-left max-h-24 overflow-y-auto">
                <p className="text-amber-400 font-bold text-xs mb-1">💡 Sugerencias</p>
                <ul className="text-slate-300 text-xs space-y-0.5">
                  {result.sugerencias?.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setShowResult(false);
                setResult(null);
                setMessages([{
                  role: 'assistant',
                  content: `**${scenario.title}**\n\n${scenario.description}\n\n🎯 **Tu misión**: Gestiona esta situación demostrando tus habilidades de trabajo en equipo.\n\n¿Cómo abordarías esta situación?`
                }]);
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Repetir Escenario
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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-amber-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 bg-gradient-to-br ${scenario.color} rounded-xl flex items-center justify-center shadow-lg text-xl`}>
            {scenario.icon}
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{scenario.title}</h1>
            <p className="text-xs text-amber-300">{scenario.category}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 bg-gradient-to-br ${scenario.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 bg-gradient-to-br ${scenario.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando...</span>
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
            placeholder="Tu respuesta..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-amber-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const RolePlaySelector = ({ onSelectCharacter, onBack }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">🎭 Role-Play de Equipo</h2>
          <p className="text-slate-300">La IA interpretará miembros del equipo con personalidades únicas</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {ROLEPLAY_CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-amber-400 rounded-2xl p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${char.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {char.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-100">{char.name}</h3>
                  <p className="text-amber-300 text-sm font-medium">{char.role}</p>
                  <p className="text-slate-400 text-xs mt-1">{char.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs bg-slate-700/80 text-amber-300 px-2 py-1 rounded-lg">
                      {char.emotion}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-2 italic">Reto: {char.challenge}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RolePlayMode = ({ character, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `*${character.name} se acerca a ti con expresión de ${character.emotion.toLowerCase()}*\n\n${character.description}\n\n**Reto**: ${character.challenge}`
    }]);
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setTurnCount(prev => prev + 1);

    const shouldEvaluate = turnCount >= 3;

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
          systemPrompt: `${character.prompt}

IMPORTANTE: Mantente en personaje. Reacciona emocionalmente según tu personalidad.

${shouldEvaluate ? `
AHORA DEBES EVALUAR al usuario. Sal del personaje y proporciona:

{
  "evaluacion": true,
  "puntuacion": (0-10),
  "coordinacionEfectiva": true/false,
  "tonoColaborativo": true/false,
  "feedback": "análisis de cómo manejó la situación",
  "fortalezas": ["punto 1", "punto 2"],
  "areasAMejorar": ["punto 1", "punto 2"]
}
` : 'Continúa la conversación en personaje, reaccionando según tu estado emocional.'}`
        })
      });

      const data = await response.json();
      
      if (data.response.includes('"evaluacion": true') || data.response.includes('"evaluacion":true')) {
        try {
          const jsonMatch = data.response.match(/\{[\s\S]*"evaluacion"[\s\S]*\}/);
          if (jsonMatch) {
            const evalData = JSON.parse(jsonMatch[0]);
            setResult(evalData);
            setShowResult(true);
            
            addSession({
              type: 'roleplay',
              characterId: character.id,
              score: evalData.puntuacion,
              maxScore: 10,
              roleDetected: 'coordinador'
            });
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    const category = getScoreCategory(result.puntuacion, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);

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
            
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-violet-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {result.puntuacion}/10
                </div>
              </div>
              
              <div className="flex justify-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-sm ${result.coordinacionEfectiva ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.coordinacionEfectiva ? '✓' : '✗'} Coordinación
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${result.tonoColaborativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.tonoColaborativo ? '✓' : '✗'} Tono Colaborativo
                </div>
              </div>
              
              <p className="text-slate-200 text-sm mb-3 leading-relaxed">{result.feedback}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 text-left">
                  <p className="text-green-400 font-bold text-xs mb-1">✓ Fortalezas</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.fortalezas?.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2 text-left">
                  <p className="text-orange-400 font-bold text-xs mb-1">↗ Áreas de mejora</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.areasAMejorar?.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setShowResult(false);
                setResult(null);
                setTurnCount(0);
                setMessages([{
                  role: 'assistant',
                  content: `*${character.name} se acerca a ti con expresión de ${character.emotion.toLowerCase()}*\n\n${character.description}\n\n**Reto**: ${character.challenge}`
                }]);
              }}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Repetir
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-violet-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-violet-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 bg-gradient-to-br ${character.color} rounded-xl flex items-center justify-center shadow-lg text-xl`}>
            {character.icon}
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{character.name}</h1>
            <p className="text-xs text-violet-300">{character.role}</p>
          </div>
        </div>
        <div className="text-xs text-slate-400">Turno {turnCount + 1}/4</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 bg-gradient-to-br ${character.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg text-lg`}>
                {character.icon}
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
            <div className={`w-8 h-8 bg-gradient-to-br ${character.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg text-lg`}>
              {character.icon}
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

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-violet-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu respuesta como gestora..."
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

const TeamworkTest = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [testVersion, setTestVersion] = useState(0);
  const { addSession } = useTeamworkProfileContext();

  const questions = useMemo(() => getShuffledTestQuestions(), [testVersion]);

  const handleAnswer = (optionIndex) => {
    const question = questions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    setAnswers(prev => [...prev, {
      questionId: question.id,
      dimension: question.dimension,
      score: selectedOption.score,
      style: selectedOption.style
    }]);
    
    setCurrentQuestion(prev => prev + 1);
  };

  const handleRetakeTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTestVersion(prev => prev + 1);
  };

  if (currentQuestion >= questions.length) {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const maxScore = questions.length * 4;
    
    const dimensions = {};
    answers.forEach(a => {
      if (!dimensions[a.dimension]) {
        dimensions[a.dimension] = { total: 0, count: 0 };
      }
      dimensions[a.dimension].total += a.score;
      dimensions[a.dimension].count += 1;
    });
    
    const dimensionLabels = Object.keys(dimensions);
    const dimensionScores = dimensionLabels.map(d => dimensions[d].total / dimensions[d].count);
    
    const percentage = (totalScore / maxScore) * 100;
    let feedback = '';
    let areasToImprove = [];
    
    dimensionLabels.forEach((dim, idx) => {
      if (dimensionScores[idx] < 3) {
        areasToImprove.push(dim);
      }
    });

    const dimensionsData = {};
    dimensionLabels.forEach((dim, idx) => {
      const key = dim.toLowerCase().replace(/\s+/g, '');
      dimensionsData[key] = dimensionScores[idx];
    });

    addSession({
      type: 'test',
      score: totalScore,
      maxScore: maxScore,
      dimensions: dimensionsData
    });
    
    if (percentage >= 80) {
      feedback = '¡Excelente! Demuestras habilidades sobresalientes de trabajo en equipo en todas las dimensiones.';
    } else if (percentage >= 60) {
      feedback = 'Buen nivel de trabajo colaborativo. Tienes fortalezas pero aún puedes potenciar algunas áreas.';
    } else {
      feedback = 'Tu trabajo en equipo tiene potencial pero hay oportunidades significativas de mejora.';
    }
    
    const additionalInfo = areasToImprove.length > 0 
      ? `Áreas de mejora prioritarias:\n• ${areasToImprove.join('\n• ')}\n\nRecomendaciones:\n• Practica la escucha activa en reuniones de equipo\n• Ofrece apoyo proactivo a compañeras con dificultades\n• Comunica claramente tus expectativas y necesidades`
      : 'Mantienes un equilibrio excelente en las dimensiones del trabajo en equipo. ¡Sigue así!';

    const category = getScoreCategory(totalScore, maxScore);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);
    
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
            
            <RadarChart 
              data={dimensionScores} 
              labels={dimensionLabels.map(d => d.split(' ')[0].substring(0, 8))} 
              title="Tu Perfil de Trabajo en Equipo"
            />
            
            <div className="mt-4 bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-amber-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  {totalScore}/{maxScore}
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      category === 'excellent' ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                      category === 'good' ? 'bg-gradient-to-r from-yellow-400 to-amber-400' :
                      category === 'average' ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                      'bg-gradient-to-r from-red-400 to-rose-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-slate-300 text-xs">{Math.round(percentage)}% de puntuación</p>
              </div>
              
              <p className="text-slate-200 text-sm mb-3 leading-relaxed">{feedback}</p>
              
              {additionalInfo && (
                <div className="bg-slate-700/50 rounded-xl p-3 text-left max-h-32 overflow-y-auto">
                  <p className="text-slate-300 text-xs whitespace-pre-line">{additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetakeTest}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:scale-105 flex items-center justify-center gap-2"
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
  
  const question = questions[currentQuestion];
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#a855f7" size="250px" left="10%" top="30%" delay="0s" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-400 font-medium">Pregunta {currentQuestion + 1}/{questions.length}</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">{question.dimension}</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
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

const ConflictSelector = ({ onSelectConflict, onBack }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">⚔️ Conflictos Interprofesionales</h2>
          <p className="text-slate-300">Practica la gestión de tensiones entre profesionales</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {INTERPROFESSIONAL_CONFLICTS.map((conflict) => (
            <button
              key={conflict.id}
              onClick={() => onSelectConflict(conflict)}
              className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-rose-400 rounded-2xl p-5 text-left transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${conflict.color} flex items-center justify-center text-xl shadow-lg`}>
                  {conflict.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-rose-100">{conflict.title}</h3>
                  <p className="text-slate-300 text-sm mt-2">{conflict.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConflictMode = ({ conflict, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**${conflict.title}**\n\n${conflict.description}\n\n🎯 **Tu objetivo**: Gestionar este conflicto fomentando la cooperación y preservando el clima laboral.\n\n¿Cómo abordarías esta situación?`
    }]);
  }, [conflict]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          systemPrompt: `Eres un simulador de conflictos interprofesionales para gestoras enfermeras.

CONFLICTO ACTUAL: ${conflict.title}
DESCRIPCIÓN: ${conflict.description}

Tu rol es:
1. Simular el conflicto de forma realista
2. Reaccionar según las respuestas del usuario
3. Evaluar si fomenta cooperación y reduce fricción

Después de 3-4 intercambios, proporciona evaluación:

{
  "evaluacion": true,
  "puntuacion": (0-10),
  "fomentaCooperacion": true/false,
  "reduceFriccion": true/false,
  "preservaClima": true/false,
  "promueveSoluciones": true/false,
  "feedback": "análisis detallado",
  "fortalezas": ["punto 1", "punto 2"],
  "areasAMejorar": ["punto 1", "punto 2"]
}

Responde en español, profesionalmente.`
        })
      });

      const data = await response.json();
      
      if (data.response.includes('"evaluacion": true') || data.response.includes('"evaluacion":true')) {
        try {
          const jsonMatch = data.response.match(/\{[\s\S]*"evaluacion"[\s\S]*\}/);
          if (jsonMatch) {
            const evalData = JSON.parse(jsonMatch[0]);
            setResult(evalData);
            setShowResult(true);
            
            addSession({
              type: 'conflict',
              conflictId: conflict.id,
              score: evalData.puntuacion,
              maxScore: 10
            });
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    const category = getScoreCategory(result.puntuacion, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);

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
            
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-rose-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent mb-2">
                  {result.puntuacion}/10
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`px-2 py-1 rounded-lg text-xs ${result.fomentaCooperacion ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.fomentaCooperacion ? '✓' : '✗'} Fomenta cooperación
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs ${result.reduceFriccion ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.reduceFriccion ? '✓' : '✗'} Reduce fricción
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs ${result.preservaClima ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.preservaClima ? '✓' : '✗'} Preserva clima
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs ${result.promueveSoluciones ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {result.promueveSoluciones ? '✓' : '✗'} Soluciones compartidas
                </div>
              </div>
              
              <p className="text-slate-200 text-sm mb-3 leading-relaxed">{result.feedback}</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-2 text-left">
                  <p className="text-green-400 font-bold text-xs mb-1">✓ Fortalezas</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.fortalezas?.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-2 text-left">
                  <p className="text-orange-400 font-bold text-xs mb-1">↗ Mejoras</p>
                  <ul className="text-slate-300 text-xs space-y-0.5">
                    {result.areasAMejorar?.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setShowResult(false);
                setResult(null);
                setMessages([{
                  role: 'assistant',
                  content: `**${conflict.title}**\n\n${conflict.description}\n\n🎯 **Tu objetivo**: Gestionar este conflicto fomentando la cooperación.\n\n¿Cómo abordarías esta situación?`
                }]);
              }}
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Repetir
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-rose-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-rose-500/30 px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className={`w-10 h-10 bg-gradient-to-br ${conflict.color} rounded-xl flex items-center justify-center shadow-lg text-xl ml-3`}>
          {conflict.icon}
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-black text-white">{conflict.title}</h1>
          <p className="text-xs text-rose-300">Conflicto Interprofesional</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-8 h-8 bg-gradient-to-br ${conflict.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 bg-gradient-to-br ${conflict.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-rose-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-rose-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu respuesta..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-rose-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const CohesionMode = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `💪 **Evaluación de Cohesión y Apoyo Mutuo**\n\nVamos a analizar cómo contribuyes al clima positivo de tu equipo.\n\nCuéntame una situación reciente donde hayas interactuado con tu equipo. Puede ser:\n\n• Una situación donde apoyaste a alguien\n• Un momento de tensión que gestionaste\n• Una decisión que tomasteis en equipo\n• Un logro colectivo\n\n¿Qué situación quieres analizar?`
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          systemPrompt: `Eres un experto en cohesión de equipos para gestoras enfermeras.

Evalúas si el usuario:
- Favorece un clima positivo
- Valora aportaciones de otros
- Refuerza logros colectivos
- Reconoce esfuerzos del personal
- Promueve interdependencia positiva
- Evita aislamiento profesional

Analiza las situaciones que describe y proporciona:
1. Feedback constructivo sobre su contribución a la cohesión
2. Identificación de comportamientos positivos
3. Áreas donde podría mejorar
4. Recomendaciones específicas

Sé empático, profesional y orientado a la mejora continua.
Responde en español.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-cyan-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg text-xl ml-3">
          💪
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-black text-white">Cohesión y Apoyo Mutuo</h1>
          <p className="text-xs text-cyan-300">Desarrolla clima positivo</p>
        </div>
        <button 
          onClick={() => setMessages([{
            role: 'assistant',
            content: `💪 **Evaluación de Cohesión y Apoyo Mutuo**\n\nVamos a analizar cómo contribuyes al clima positivo de tu equipo.\n\nCuéntame una situación reciente donde hayas interactuado con tu equipo.`
          }])}
          className="ml-auto p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-cyan-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe tu situación..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const RolesMode = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  const TEAM_ROLES = [
    { id: 'facilitador', name: 'Facilitador', icon: '🤝', desc: 'Ayuda al equipo a trabajar juntos' },
    { id: 'moderador', name: 'Moderador', icon: '⚖️', desc: 'Mantiene el orden y equilibrio' },
    { id: 'coordinador', name: 'Coordinador', icon: '🎯', desc: 'Organiza y distribuye tareas' },
    { id: 'puente', name: 'Puente', icon: '🌉', desc: 'Conecta diferentes profesionales' },
    { id: 'experto', name: 'Experto Técnico', icon: '🔬', desc: 'Aporta conocimiento especializado' },
    { id: 'mediador', name: 'Mediador', icon: '🕊️', desc: 'Resuelve conflictos' },
    { id: 'motivador', name: 'Motivador', icon: '🔥', desc: 'Impulsa y anima al equipo' },
    { id: 'observador', name: 'Observador Crítico', icon: '👁️', desc: 'Analiza y cuestiona constructivamente' }
  ];

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `🎯 **Dinámicas de Roles en Equipo**\n\nLos roles funcionales determinan cómo contribuyes al equipo:\n\n${TEAM_ROLES.map(r => `${r.icon} **${r.name}**: ${r.desc}`).join('\n')}\n\nPara evaluar tu rol predominante, cuéntame:\n\n¿Cómo sueles comportarte en reuniones de equipo o situaciones de trabajo colaborativo?`
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          systemPrompt: `Eres un experto en dinámicas de roles de equipo para gestoras enfermeras.

ROLES FUNCIONALES:
- Facilitador: Ayuda a que el equipo funcione bien
- Moderador: Mantiene orden y gestiona tiempos
- Coordinador: Organiza y distribuye tareas
- Puente: Conecta diferentes profesionales/unidades
- Experto Técnico: Aporta conocimiento especializado
- Mediador: Resuelve conflictos entre miembros
- Motivador: Impulsa energía positiva al equipo
- Observador Crítico: Analiza y cuestiona constructivamente

Analiza el comportamiento descrito y:
1. Identifica el rol predominante
2. Evalúa si es eficaz para el contexto
3. Detecta si falta complementariedad
4. Sugiere cómo mejorar adaptabilidad

Sé constructivo y profesional. Responde en español.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg text-xl ml-3">
          🎯
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-black text-white">Dinámicas de Roles</h1>
          <p className="text-xs text-emerald-300">Descubre tu rol funcional</p>
        </div>
        <button 
          onClick={() => setMessages([{
            role: 'assistant',
            content: `🎯 **Dinámicas de Roles en Equipo**\n\nCuéntame cómo sueles comportarte en reuniones o situaciones de trabajo colaborativo.`
          }])}
          className="ml-auto p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-emerald-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe tu comportamiento en equipo..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const TeamworkAnalytics = ({ onBack }) => {
  const { profile, getTrends, getDominantStyles, getCriticalAreas } = useTeamworkProfileContext();
  const trends = getTrends(10);
  const dominantStyles = getDominantStyles();
  const criticalAreas = getCriticalAreas();

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2">📈 Panel de Analítica</h2>
          <p className="text-slate-300">Tu perfil de trabajo en equipo</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Resumen General
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Sesiones totales</span>
                <span className="text-amber-400 font-bold">{profile?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Puntuación media</span>
                <span className="text-amber-400 font-bold">{(profile?.averageScore || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Última sesión</span>
                <span className="text-slate-400 text-sm">
                  {profile?.lastUpdated ? new Date(profile.lastUpdated).toLocaleDateString('es-ES') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-violet-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-violet-400" />
              Estilos Predominantes
            </h3>
            {dominantStyles.length > 0 ? (
              <div className="space-y-2">
                {dominantStyles.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-slate-300">{s.style}</span>
                    <span className="text-violet-400">{s.count} veces</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Completa más sesiones para ver datos</p>
            )}
          </div>
        </div>
        
        {profile?.dimensions && Object.values(profile.dimensions).some(v => v > 0) && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Dimensiones del Trabajo en Equipo</h3>
            <div className="space-y-3">
              {Object.entries(profile.dimensions).filter(([_, v]) => v > 0).map(([dim, value]) => (
                <div key={dim}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 capitalize">{dim.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-cyan-400">{value.toFixed(1)}/4</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(value / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {criticalAreas.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Áreas de Mejora Prioritarias
            </h3>
            <ul className="space-y-2">
              {criticalAreas.map((area, idx) => (
                <li key={idx} className="text-slate-300">
                  • {area.label}: {area.value}/4
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {trends.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Evolución Reciente
            </h3>
            <div className="flex items-end gap-2 h-32">
              {trends.map((t, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t"
                    style={{ height: `${t.score}%` }}
                  />
                  <span className="text-xs text-slate-400 mt-1">{t.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MentorMode = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const MENTOR_TOPICS = [
    "Cómo fomentar un equipo cohesionado",
    "Estrategias de reconocimiento y motivación",
    "Técnicas avanzadas de delegación",
    "Dinámicas para cohesionar turnos",
    "Gestión de reuniones de equipo eficientes",
    "Resolución de conflictos desde el liderazgo",
    "Trabajo en equipo bajo presión asistencial"
  ];

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `🎓 **Modo Mentor: Trabajo en Equipo para Gestoras Enfermeras**\n\nSoy tu mentor experto en construcción y gestión de equipos sanitarios de alto rendimiento.\n\n**Temas en los que puedo ayudarte:**\n\n${MENTOR_TOPICS.map((t, i) => `${i+1}. ${t}`).join('\n')}\n\n¿Qué aspecto del trabajo en equipo te gustaría desarrollar?`
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          systemPrompt: `Eres un mentor experto en trabajo en equipo para gestoras enfermeras, con más de 20 años de experiencia en gestión sanitaria.

ÁREAS DE EXPERTISE:
1. Fomentar equipos cohesionados - técnicas de team building
2. Reconocimiento y motivación - sistemas de incentivos no monetarios
3. Delegación efectiva - cuándo, qué y cómo delegar
4. Cohesión entre turnos - estrategias de comunicación
5. Reuniones eficientes - metodologías ágiles para sanidad
6. Resolución de conflictos - mediación y negociación
7. Trabajo bajo presión - gestión del estrés colectivo

Tu estilo:
- Empático pero directo
- Basado en evidencia y experiencia real
- Ofreces ejemplos concretos del ámbito sanitario
- Propones ejercicios prácticos
- Recomiendas lecturas y recursos
- Usas el refuerzo positivo

Formato de respuestas:
- Estructuradas con bullets o números
- Incluyes ejemplos del contexto enfermero
- Añades "ejercicio práctico" cuando sea relevante
- Sugieres "lectura recomendada" cuando aplique

Responde en español, de forma profesional y cercana.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-yellow-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-yellow-500/30 px-4 py-3 flex items-center">
        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg text-xl ml-3">
          🎓
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-black text-white">Modo Mentor</h1>
          <p className="text-xs text-yellow-300">Coach de Trabajo en Equipo</p>
        </div>
        <button 
          onClick={() => setMessages([{
            role: 'assistant',
            content: `🎓 **Modo Mentor: Trabajo en Equipo**\n\n¿Qué aspecto del trabajo en equipo te gustaría desarrollar?`
          }])}
          className="ml-auto p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-yellow-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando respuesta...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {MENTOR_TOPICS.slice(0, 4).map((topic, idx) => (
              <button
                key={idx}
                onClick={() => setInput(topic)}
                className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-yellow-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu pregunta sobre trabajo en equipo..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-yellow-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const TeamworkModuleContent = ({ onBack }) => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const handleBack = () => {
    if (selectedScenario) {
      setSelectedScenario(null);
    } else if (selectedCharacter) {
      setSelectedCharacter(null);
    } else if (selectedConflict) {
      setSelectedConflict(null);
    } else if (selectedMode) {
      setSelectedMode(null);
    } else {
      onBack();
    }
  };

  if (selectedMode === 'scenarios') {
    if (selectedScenario) {
      return <ScenarioChat scenario={selectedScenario} onBack={handleBack} />;
    }
    return <ScenarioSelector onSelectScenario={setSelectedScenario} onBack={handleBack} />;
  }

  if (selectedMode === 'roleplay') {
    if (selectedCharacter) {
      return <RolePlayMode character={selectedCharacter} onBack={handleBack} />;
    }
    return <RolePlaySelector onSelectCharacter={setSelectedCharacter} onBack={handleBack} />;
  }

  if (selectedMode === 'teamtest') {
    return <TeamworkTest onBack={handleBack} />;
  }

  if (selectedMode === 'roles') {
    return <RolesMode onBack={handleBack} />;
  }

  if (selectedMode === 'conflict') {
    if (selectedConflict) {
      return <ConflictMode conflict={selectedConflict} onBack={handleBack} />;
    }
    return <ConflictSelector onSelectConflict={setSelectedConflict} onBack={handleBack} />;
  }

  if (selectedMode === 'cohesion') {
    return <CohesionMode onBack={handleBack} />;
  }

  if (selectedMode === 'analytics') {
    return <TeamworkAnalytics onBack={handleBack} />;
  }

  if (selectedMode === 'mentor') {
    return <MentorMode onBack={handleBack} />;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${leadershipBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Trabajo en Equipo</h1>
              <p className="text-xs text-amber-300">Hub de Entrenamiento IA</p>
            </div>
          </div>
        </div>
        
        <ModeSelector onSelectMode={setSelectedMode} />
      </div>
    </div>
  );
};

const TeamworkModule = ({ onBack }) => {
  return (
    <TeamworkProfileProvider>
      <TeamworkModuleContent onBack={onBack} />
    </TeamworkProfileProvider>
  );
};

export default TeamworkModule;
