import React, { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { ArrowLeft, Send, Bot, User, MessageSquare, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Users, Target, Home, Trophy, Sparkles, Crown, TrendingUp, BarChart3, Flame, RefreshCw, ChevronDown, AlertTriangle, Theater, LineChart, BookOpen, Layers, UserCircle, MessageCircle, Settings, Lightbulb, GraduationCap, Heart, Shield, Volume2, Brain } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import leadershipBg from '../../assets/leadership-bg.png';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const CommunicationProfileContext = createContext(null);

const useCommunicationProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultProfile = {
    styles: {
      asertiva: 0,
      pasiva: 0,
      agresiva: 0,
      pasivoAgresiva: 0,
      manipuladora: 0,
      empatica: 0
    },
    stylesCounts: {
      asertiva: 0,
      pasiva: 0,
      agresiva: 0,
      pasivoAgresiva: 0,
      manipuladora: 0,
      empatica: 0
    },
    dimensions: {
      asertividad: 0,
      claridad: 0,
      empatia: 0,
      escuchaActiva: 0,
      regulacionEmocional: 0,
      comunicacionMalasNoticias: 0,
      negociacion: 0,
      influencia: 0,
      conversacionesDificiles: 0,
      feedbackConstructivo: 0
    },
    dimensionsCounts: {
      asertividad: 0,
      claridad: 0,
      empatia: 0,
      escuchaActiva: 0,
      regulacionEmocional: 0,
      comunicacionMalasNoticias: 0,
      negociacion: 0,
      influencia: 0,
      conversacionesDificiles: 0,
      feedbackConstructivo: 0
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
          const docRef = doc(db, 'communicationProfiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            await setDoc(docRef, defaultProfile);
            setProfile(defaultProfile);
          }
        } else {
          const stored = localStorage.getItem('communicationProfile');
          if (stored) {
            setProfile(JSON.parse(stored));
          } else {
            localStorage.setItem('communicationProfile', JSON.stringify(defaultProfile));
            setProfile(defaultProfile);
          }
        }
      } catch (error) {
        console.error('Error loading communication profile:', error);
        const stored = localStorage.getItem('communicationProfile');
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

    updatedProfile.lastUpdated = new Date().toISOString();

    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'communicationProfiles', user.uid);
        await setDoc(docRef, updatedProfile, { merge: true });
      }
      localStorage.setItem('communicationProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving session:', error);
      localStorage.setItem('communicationProfile', JSON.stringify(updatedProfile));
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
          asertividad: 'Asertividad',
          claridad: 'Claridad',
          empatia: 'Empatía',
          escuchaActiva: 'Escucha Activa',
          regulacionEmocional: 'Regulación Emocional',
          comunicacionMalasNoticias: 'Comunicación Malas Noticias',
          negociacion: 'Negociación',
          influencia: 'Influencia',
          conversacionesDificiles: 'Conversaciones Difíciles',
          feedbackConstructivo: 'Feedback Constructivo'
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

export const CommunicationProfileProvider = ({ children }) => {
  const profileData = useCommunicationProfile();
  return (
    <CommunicationProfileContext.Provider value={profileData}>
      {children}
    </CommunicationProfileContext.Provider>
  );
};

export const useCommunicationProfileContext = () => {
  const context = useContext(CommunicationProfileContext);
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
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
      <User className="w-1/2 h-1/2 text-white" />
    </div>
  );
  
  if (!avatar || !avatar.characterPreset || imgError) {
    return <FallbackAvatar />;
  }
  
  const gender = avatar.gender || 'female';
  const preset = avatar.characterPreset;
  
  // ESTA ES LA LÍNEA CORREGIDA: Apunta directo a la carpeta 'public/avatar'
  const imgPath = `/avatar/${gender}-characters/${gender}-character-${preset}.png`;
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-emerald-400/50 ${className}`}>
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
          background: `linear-gradient(135deg, ${['#06b6d4', '#3b82f6', '#8b5cf6', '#0ea5e9'][Math.floor(Math.random() * 4)]}, transparent)`,
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

const COMMUNICATION_MODES = [
  {
    id: 'scenarios',
    title: 'Escenarios de Comunicación',
    description: 'Practica situaciones de comunicación clínica y gestora',
    icon: '🗣️',
    color: 'from-cyan-500 to-blue-500',
    features: ['Chat interactivo', 'Evaluación de estilo', 'Puntuación 0-10']
  },
  {
    id: 'roleplay',
    title: 'Role-Play Emocional',
    description: 'La IA interpreta personajes con emociones intensas',
    icon: '🎭',
    color: 'from-violet-500 to-purple-500',
    features: ['Personajes emocionales', 'Reacción dinámica', 'Feedback inmediato'],
    isNew: true
  },
  {
    id: 'commtest',
    title: 'Test de Comunicación',
    description: 'Evalúa tus 10 dimensiones comunicativas con 20 preguntas',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
    features: ['20 preguntas', '10 dimensiones', 'Gráfica radar', 'Preguntas nuevas cada vez']
  },
  {
    id: 'assertive',
    title: 'Comunicación Asertiva',
    description: 'Practica reformular frases de forma asertiva',
    icon: '💪',
    color: 'from-emerald-500 to-teal-500',
    features: ['Reformulación', 'Técnica DESC', 'Feedback inmediato']
  },
  {
    id: 'empathy',
    title: 'Evaluación de Empatía',
    description: 'Desarrolla tu empatía cognitiva, emocional y comunicativa',
    icon: '💗',
    color: 'from-rose-500 to-pink-500',
    features: ['3 tipos de empatía', 'Validación emocional', 'Límites profesionales'],
    isNew: true
  },
  {
    id: 'conflict',
    title: 'Gestión de Conflictos',
    description: 'Aprende a desescalar tensiones y negociar acuerdos',
    icon: '⚔️',
    color: 'from-amber-500 to-orange-500',
    features: ['Desescalada', 'Negociación', 'Estrategias adaptadas']
  },
  {
    id: 'analytics',
    title: 'Panel de Analítica',
    description: 'Visualiza tu evolución y perfil comunicativo',
    icon: '📈',
    color: 'from-sky-500 to-cyan-500',
    features: ['Métricas detalladas', 'Tendencias', 'Áreas críticas'],
    isNew: true
  },
  {
    id: 'mentor',
    title: 'Modo Mentor',
    description: 'Coach experto en comunicación enfermera',
    icon: '🎓',
    color: 'from-yellow-500 to-amber-500',
    features: ['Técnicas avanzadas', 'Recursos', 'Coaching personal'],
    isNew: true
  }
];

const COMMUNICATION_SCENARIOS = [
  {
    id: 'asertiva-profesional',
    title: 'Comunicación Asertiva con Profesional',
    category: 'Asertividad',
    description: 'Un compañero constantemente delega sus tareas en ti. Debes comunicar tus límites de forma asertiva.',
    difficulty: 'Intermedio',
    icon: '💪',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'conversacion-dificil',
    title: 'Conversación Difícil',
    category: 'Conversaciones Difíciles',
    description: 'Debes comunicar a una enfermera veterana que su desempeño ha bajado significativamente.',
    difficulty: 'Avanzado',
    icon: '😰',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'empatia-familia',
    title: 'Comunicación Empática con Familia',
    category: 'Empatía',
    description: 'La familia de un paciente terminal necesita información clara y apoyo emocional.',
    difficulty: 'Avanzado',
    icon: '💗',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'conflicto-profesionales',
    title: 'Conflicto entre Profesionales',
    category: 'Resolución de Conflictos',
    description: 'Dos enfermeras de tu equipo tienen un conflicto personal que afecta al trabajo.',
    difficulty: 'Avanzado',
    icon: '⚔️',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'feedback-correctivo',
    title: 'Feedback Correctivo',
    category: 'Feedback',
    description: 'Debes dar feedback a un profesional sobre un error recurrente sin generar resistencia.',
    difficulty: 'Intermedio',
    icon: '📝',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'criticas-improcedentes',
    title: 'Gestionar Críticas Improcedentes',
    category: 'Gestión de Críticas',
    description: 'Un médico te critica injustamente delante del equipo. Debes gestionar la situación.',
    difficulty: 'Experto',
    icon: '🛡️',
    color: 'from-indigo-500 to-blue-500'
  }
];

const ROLEPLAY_CHARACTERS = [
  {
    id: 'frustrado',
    name: 'Miguel',
    role: 'Enfermero Frustrado',
    emotion: 'Frustración',
    description: 'Lleva meses pidiendo cambio de turno sin respuesta',
    icon: '😤',
    color: 'from-orange-500 to-red-500',
    personality: 'Frustrado, cansado, siente que nadie le escucha',
    challenge: 'Validar su frustración sin ceder a demandas imposibles',
    prompt: `Eres Miguel, un enfermero de 38 años frustrado con la situación.
PERSONALIDAD: Llevas meses pidiendo un cambio de turno por motivos familiares. Sientes que nadie te escucha, que eres invisible. Estás al borde del burnout.
EMOCIÓN DOMINANTE: Frustración intensa
COMPORTAMIENTO: 
- Si te ignoran o minimizan: escalas, subes el tono
- Si validan tu frustración: empiezas a calmarte
- Si te dan soluciones realistas: te abres a negociar
- Frases típicas: "Siempre es lo mismo", "Nadie me hace caso", "Estoy hasta las narices"`
  },
  {
    id: 'miedoso',
    name: 'Laura',
    role: 'Enfermera con Miedo',
    emotion: 'Miedo',
    description: 'Cometió un error y teme las consecuencias',
    icon: '😨',
    color: 'from-sky-500 to-blue-500',
    personality: 'Asustada, ansiosa, evita el contacto visual',
    challenge: 'Crear un espacio seguro para que hable sin juzgar',
    prompt: `Eres Laura, una enfermera de 29 años que cometió un error.
PERSONALIDAD: Cometiste un error con una medicación. No tuvo consecuencias graves pero estás aterrorizada. Crees que te van a despedir.
EMOCIÓN DOMINANTE: Miedo intenso
COMPORTAMIENTO:
- Evitas el contacto visual, hablas bajo
- Si te confrontan duramente: te bloqueas, empiezas a llorar
- Si te dan seguridad y normalización: empiezas a explicar qué pasó
- Frases típicas: "Lo siento mucho", "No sé qué me pasó", "Por favor, no me despidan"`
  },
  {
    id: 'furioso',
    name: 'Roberto',
    role: 'Familiar Furioso',
    emotion: 'Rabia',
    description: 'Su madre lleva horas esperando y nadie le informa',
    icon: '😡',
    color: 'from-red-500 to-rose-500',
    personality: 'Furioso, exigente, amenazante',
    challenge: 'Desescalar la situación sin ceder a amenazas',
    prompt: `Eres Roberto, de 52 años, hijo de una paciente.
PERSONALIDAD: Tu madre lleva 4 horas esperando resultados y nadie te dice nada. Estás furioso. Amenazas con denunciar.
EMOCIÓN DOMINANTE: Rabia intensa
COMPORTAMIENTO:
- Llegas gritando, exigiendo hablar con el supervisor
- Si te responden defensivamente: escalas más
- Si te escuchan y validan: bajas el tono gradualmente
- Si te dan información concreta: te calmas
- Frases típicas: "Esto es inadmisible", "¿Quién es el responsable aquí?", "Voy a poner una queja"`
  },
  {
    id: 'agotada',
    name: 'Carmen',
    role: 'Compañera Agotada',
    emotion: 'Agotamiento',
    description: 'Lleva meses con sobrecarga y está al límite',
    icon: '😔',
    color: 'from-slate-500 to-gray-500',
    personality: 'Agotada, sin energía, desesperanzada',
    challenge: 'Ofrecer apoyo real sin minimizar su situación',
    prompt: `Eres Carmen, una enfermera de 45 años agotada.
PERSONALIDAD: Llevas meses cubriendo bajas, trabajando dobles turnos. No puedes más. Sientes que nadie valora tu esfuerzo.
EMOCIÓN DOMINANTE: Agotamiento profundo
COMPORTAMIENTO:
- Hablas con voz monótona, sin energía
- Si te piden más esfuerzo: te derrumbas
- Si reconocen tu esfuerzo sinceramente: empiezas a abrirte
- Si ofrecen ayuda real: muestras un poco de esperanza
- Frases típicas: "Ya no puedo más", "Da igual lo que haga", "Estoy quemada"`
  },
  {
    id: 'triste',
    name: 'Ana',
    role: 'Paciente con Tristeza',
    emotion: 'Tristeza',
    description: 'Acaba de recibir un diagnóstico difícil',
    icon: '😢',
    color: 'from-indigo-500 to-violet-500',
    personality: 'Triste, vulnerable, necesita ser escuchada',
    challenge: 'Acompañar emocionalmente sin dar falsas esperanzas',
    prompt: `Eres Ana, una paciente de 55 años.
PERSONALIDAD: Acabas de recibir un diagnóstico de enfermedad crónica. Estás devastada. Necesitas hablar pero no sabes cómo expresar lo que sientes.
EMOCIÓN DOMINANTE: Tristeza profunda
COMPORTAMIENTO:
- Hablas despacio, con pausas largas, a veces lloras
- Si te dan consejos rápidos: te cierras
- Si te escuchan en silencio: empiezas a abrirte más
- Si validan tu dolor: sientes alivio
- Frases típicas: "No sé cómo voy a poder con esto", "¿Por qué a mí?", "Tengo mucho miedo"`
  }
];

const COMMUNICATION_TEST_QUESTIONS_BANK = [
  {
    id: 1,
    dimension: 'Asertividad',
    question: 'Un compañero te pide que cubras su turno de nuevo. Ya lo has hecho 3 veces este mes. ¿Cómo respondes?',
    options: [
      { text: 'Explico que no puedo seguir cubriendo, pero ofrezco ayudarle a buscar otra solución', score: 4, style: 'asertiva' },
      { text: 'Digo que sí aunque no quiero, para evitar conflicto', score: 1, style: 'pasiva' },
      { text: 'Le digo que ya está bien, que busque a otro', score: 2, style: 'agresiva' },
      { text: 'Acepto pero luego me quejo con otros compañeros', score: 1, style: 'pasivoAgresiva' }
    ]
  },
  {
    id: 2,
    dimension: 'Asertividad',
    question: 'En una reunión de equipo, tu supervisora desestima tu propuesta sin escucharla completamente. ¿Qué haces?',
    options: [
      { text: 'Pido amablemente que me permita terminar de exponer los puntos clave antes de la decisión', score: 4, style: 'asertiva' },
      { text: 'Me callo y acepto la decisión sin discutir', score: 1, style: 'pasiva' },
      { text: 'Insisto con tono elevado que mi propuesta es mejor', score: 2, style: 'agresiva' },
      { text: 'Asiento pero después comento con otros lo injusto que fue', score: 1, style: 'pasivoAgresiva' }
    ]
  },
  {
    id: 3,
    dimension: 'Claridad',
    question: 'Debes explicar un procedimiento complejo a un paciente con bajo nivel educativo. ¿Qué haces?',
    options: [
      { text: 'Uso lenguaje sencillo, ejemplos cotidianos y compruebo que ha entendido', score: 4, style: 'empatica' },
      { text: 'Le doy la información estándar y un folleto', score: 2, style: 'formal' },
      { text: 'Le explico todo con detalle técnico para que tenga toda la información', score: 1, style: 'tecnica' },
      { text: 'Delego en un familiar para que se lo explique después', score: 1, style: 'evasiva' }
    ]
  },
  {
    id: 4,
    dimension: 'Claridad',
    question: 'Tienes que transmitir instrucciones urgentes al equipo de noche por teléfono. ¿Cómo lo haces?',
    options: [
      { text: 'Estructuro el mensaje en puntos clave, pido que me confirmen cada uno y dejo registro escrito', score: 4, style: 'clara' },
      { text: 'Les cuento todo rápidamente para no perder tiempo', score: 2, style: 'apresurada' },
      { text: 'Les envío un mensaje largo por WhatsApp con todos los detalles', score: 1, style: 'confusa' },
      { text: 'Asumo que lo entenderán y sigo con mis tareas', score: 1, style: 'negligente' }
    ]
  },
  {
    id: 5,
    dimension: 'Empatía',
    question: 'Una madre está llorando porque su hijo tiene que ser operado. ¿Cómo actúas?',
    options: [
      { text: 'Me siento a su lado, valido su miedo y le ofrezco mi presencia', score: 4, style: 'empatica' },
      { text: 'Le digo que es una operación rutinaria y que no se preocupe', score: 2, style: 'minimizadora' },
      { text: 'Le informo de los pasos del proceso para que esté tranquila', score: 2, style: 'informativa' },
      { text: 'Llamo al psicólogo de guardia', score: 1, style: 'derivadora' }
    ]
  },
  {
    id: 6,
    dimension: 'Empatía',
    question: 'Un paciente anciano se queja constantemente y pide atención continua. Tu equipo está agotado. ¿Cómo actúas?',
    options: [
      { text: 'Dedico un momento a escucharle y busco la causa real de su malestar (soledad, miedo)', score: 4, style: 'empatica' },
      { text: 'Le explico que hay otros pacientes y no podemos estar siempre con él', score: 2, style: 'limitadora' },
      { text: 'Pido al auxiliar que le atienda para descargarme', score: 1, style: 'derivadora' },
      { text: 'Le pido que intente descansar y dejarnos trabajar', score: 1, style: 'minimizadora' }
    ]
  },
  {
    id: 7,
    dimension: 'Escucha Activa',
    question: 'Un paciente te cuenta sus preocupaciones sobre el tratamiento. Mientras habla, ¿qué haces?',
    options: [
      { text: 'Mantengo contacto visual, asiento y parafraseo para confirmar que entiendo', score: 4, style: 'escuchaActiva' },
      { text: 'Escucho mientras preparo la medicación para no perder tiempo', score: 1, style: 'distraida' },
      { text: 'Le interrumpo para aclarar sus dudas rápidamente', score: 2, style: 'impaciente' },
      { text: 'Espero a que termine para darle la información que necesita', score: 2, style: 'pasiva' }
    ]
  },
  {
    id: 8,
    dimension: 'Escucha Activa',
    question: 'Una compañera viene a contarte un problema personal que afecta a su trabajo. ¿Cómo reaccionas?',
    options: [
      { text: 'Le presto atención plena, reflejo lo que dice y pregunto cómo puedo ayudarla', score: 4, style: 'escuchaActiva' },
      { text: 'La escucho mientras miro el móvil y respondo con "ya"', score: 1, style: 'distraida' },
      { text: 'Le doy consejos inmediatos basados en mi experiencia', score: 2, style: 'directiva' },
      { text: 'Le digo que ahora no puedo y que hablamos luego', score: 2, style: 'evasiva' }
    ]
  },
  {
    id: 9,
    dimension: 'Regulación Emocional',
    question: 'Un familiar te grita injustamente delante de otros pacientes. ¿Cómo reaccionas?',
    options: [
      { text: 'Mantengo la calma, le pido hablar en privado y valido su preocupación', score: 4, style: 'regulada' },
      { text: 'Me defiendo explicando que no es culpa mía', score: 2, style: 'defensiva' },
      { text: 'Me quedo callada esperando que se calme', score: 1, style: 'pasiva' },
      { text: 'Le respondo con firmeza que así no se habla', score: 2, style: 'reactiva' }
    ]
  },
  {
    id: 10,
    dimension: 'Regulación Emocional',
    question: 'Tras un turno muy duro con un fallecimiento, una compañera hace un comentario insensible. ¿Cómo respondes?',
    options: [
      { text: 'Respiro, reconozco mi malestar y le explico con calma cómo me ha afectado', score: 4, style: 'regulada' },
      { text: 'Le contesto bruscamente que no tiene ni idea', score: 2, style: 'reactiva' },
      { text: 'Me callo pero me voy llorando al baño', score: 1, style: 'reprimida' },
      { text: 'Ignoro el comentario pero me niego a hablarle el resto del día', score: 1, style: 'pasivoAgresiva' }
    ]
  },
  {
    id: 11,
    dimension: 'Comunicación de Malas Noticias',
    question: 'Debes informar a una familia de que el paciente ha empeorado significativamente. ¿Cómo lo haces?',
    options: [
      { text: 'Busco un espacio privado, soy claro pero empático, y doy espacio a sus emociones', score: 4, style: 'empatica' },
      { text: 'Doy la información de forma directa y clara para no generar falsas esperanzas', score: 2, style: 'directa' },
      { text: 'Suavizo la noticia para que no sufran tanto', score: 1, style: 'evasiva' },
      { text: 'Derivo al médico porque es su responsabilidad', score: 1, style: 'derivadora' }
    ]
  },
  {
    id: 12,
    dimension: 'Comunicación de Malas Noticias',
    question: 'Un paciente te pregunta si tiene cáncer. Aún no hay diagnóstico oficial. ¿Qué le dices?',
    options: [
      { text: 'Le explico que estamos pendientes de resultados, valido su preocupación y me comprometo a informarle', score: 4, style: 'honesta' },
      { text: 'Le digo que no se preocupe, que probablemente no sea nada', score: 1, style: 'falsaEsperanza' },
      { text: 'Le digo que eso tiene que preguntárselo al médico', score: 2, style: 'derivadora' },
      { text: 'Le doy información técnica sobre los posibles resultados', score: 2, style: 'tecnica' }
    ]
  },
  {
    id: 13,
    dimension: 'Negociación',
    question: 'Un compañero quiere el mismo día de vacaciones que tú. ¿Cómo lo gestionas?',
    options: [
      { text: 'Busco una solución donde ambos cedamos algo para llegar a un acuerdo', score: 4, style: 'colaborativa' },
      { text: 'Cedo mis vacaciones para evitar conflicto', score: 1, style: 'pasiva' },
      { text: 'Defiendo mi derecho porque lo pedí primero', score: 2, style: 'competitiva' },
      { text: 'Lo dejo en manos del supervisor', score: 2, style: 'evasiva' }
    ]
  },
  {
    id: 14,
    dimension: 'Negociación',
    question: 'La dirección quiere implementar un cambio que tu equipo rechaza. ¿Cómo medias?',
    options: [
      { text: 'Recojo las preocupaciones del equipo, las presento a dirección y busco un punto intermedio', score: 4, style: 'mediadora' },
      { text: 'Acepto lo que diga la dirección porque mandan ellos', score: 1, style: 'sumisa' },
      { text: 'Me pongo del lado del equipo y presiono a dirección', score: 2, style: 'confrontativa' },
      { text: 'Dejo que se resuelva solo entre ellos', score: 1, style: 'evasiva' }
    ]
  },
  {
    id: 15,
    dimension: 'Influencia',
    question: 'Quieres implementar un cambio en el protocolo de trabajo. ¿Cómo convences al equipo?',
    options: [
      { text: 'Presento beneficios para pacientes y equipo, escucho objeciones y adapto la propuesta', score: 4, style: 'influenciadora' },
      { text: 'Espero a que la dirección lo imponga', score: 1, style: 'pasiva' },
      { text: 'Impongo el cambio porque sé que es lo mejor', score: 1, style: 'autoritaria' },
      { text: 'Busco aliados que me apoyen y presiono juntos', score: 2, style: 'politica' }
    ]
  },
  {
    id: 16,
    dimension: 'Influencia',
    question: 'Necesitas que un médico muy ocupado preste atención a un paciente que crees prioritario. ¿Cómo actúas?',
    options: [
      { text: 'Expongo datos objetivos del paciente y las consecuencias de no atenderlo, respetando su tiempo', score: 4, style: 'persuasiva' },
      { text: 'Espero a que tenga tiempo aunque tarde', score: 1, style: 'pasiva' },
      { text: 'Le exijo que venga porque es urgente', score: 2, style: 'exigente' },
      { text: 'Busco a otro médico que esté disponible', score: 2, style: 'evasiva' }
    ]
  },
  {
    id: 17,
    dimension: 'Conversaciones Difíciles',
    question: 'Debes hablar con un compañero sobre su olor corporal que afecta al trabajo. ¿Cómo lo abordas?',
    options: [
      { text: 'En privado, con tacto, centrándome en el impacto laboral sin juzgar a la persona', score: 4, style: 'asertiva' },
      { text: 'Evito el tema, es demasiado incómodo', score: 1, style: 'evasiva' },
      { text: 'Se lo digo directamente sin rodeos', score: 2, style: 'directa' },
      { text: 'Pido a recursos humanos que lo gestionen', score: 2, style: 'derivadora' }
    ]
  },
  {
    id: 18,
    dimension: 'Conversaciones Difíciles',
    question: 'Sospechas que una compañera tiene problemas con el alcohol que afectan a su trabajo. ¿Qué haces?',
    options: [
      { text: 'Hablo con ella en privado, expresando preocupación genuina y ofreciendo apoyo, no juicio', score: 4, style: 'empatica' },
      { text: 'Informo directamente a supervisión sin hablar con ella', score: 2, style: 'delatora' },
      { text: 'No digo nada porque no quiero problemas', score: 1, style: 'evasiva' },
      { text: 'Comento con otros compañeros a ver si lo han notado', score: 1, style: 'chismosa' }
    ]
  },
  {
    id: 19,
    dimension: 'Feedback Constructivo',
    question: 'Una enfermera novel ha cometido un error por inexperiencia. ¿Cómo le das feedback?',
    options: [
      { text: 'Describo la situación, el impacto, pregunto su visión y acordamos cómo mejorar', score: 4, style: 'constructivo' },
      { text: 'Le digo lo que hizo mal para que no lo repita', score: 2, style: 'correctivo' },
      { text: 'No digo nada para no desmotivarla', score: 1, style: 'evitativo' },
      { text: 'Le explico cómo debería haberlo hecho', score: 2, style: 'instructivo' }
    ]
  },
  {
    id: 20,
    dimension: 'Feedback Constructivo',
    question: 'Quieres reconocer públicamente el buen trabajo de una enfermera pero ella es muy tímida. ¿Qué haces?',
    options: [
      { text: 'Le pregunto primero cómo prefiere recibir el reconocimiento y me adapto', score: 4, style: 'adaptado' },
      { text: 'La elogio en la reunión de equipo igualmente porque lo merece', score: 2, style: 'impositivo' },
      { text: 'No digo nada para no incomodarla', score: 1, style: 'evitativo' },
      { text: 'Le doy el feedback solo por escrito', score: 2, style: 'impersonal' }
    ]
  }
];

const getShuffledTestQuestions = () => {
  const dimensionGroups = {};
  COMMUNICATION_TEST_QUESTIONS_BANK.forEach(q => {
    if (!dimensionGroups[q.dimension]) {
      dimensionGroups[q.dimension] = [];
    }
    dimensionGroups[q.dimension].push(q);
  });

  const selectedQuestions = [];
  Object.keys(dimensionGroups).forEach(dimension => {
    const questions = dimensionGroups[dimension];
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, 2));
  });

  return shuffleQuestionOptions(selectedQuestions.sort(() => Math.random() - 0.5));
};

const ASSERTIVE_EXERCISES = [
  {
    id: 1,
    originalPhrase: "No tengo tiempo para ayudarte ahora",
    context: "Un compañero te pide ayuda cuando estás saturada",
    difficulty: 'Básico',
    hints: ['Reconoce la petición', 'Explica tu situación', 'Ofrece alternativa']
  },
  {
    id: 2,
    originalPhrase: "Siempre me toca a mí hacer las tareas difíciles",
    context: "Te asignan otra tarea compleja",
    difficulty: 'Intermedio',
    hints: ['Evita generalizaciones', 'Usa mensajes yo', 'Propón solución']
  },
  {
    id: 3,
    originalPhrase: "Esto es imposible, nunca lo vamos a conseguir",
    context: "El equipo enfrenta un objetivo ambicioso",
    difficulty: 'Intermedio',
    hints: ['Evita catastrofismo', 'Enfócate en lo controlable', 'Busca apoyo']
  },
  {
    id: 4,
    originalPhrase: "Tú siempre llegas tarde y me dejas colgada",
    context: "Un compañero llega tarde frecuentemente",
    difficulty: 'Avanzado',
    hints: ['Evita ataques personales', 'Describe conducta específica', 'Expresa impacto']
  },
  {
    id: 5,
    originalPhrase: "Me da igual, haz lo que quieras",
    context: "Desacuerdo sobre cómo organizar el trabajo",
    difficulty: 'Avanzado',
    hints: ['Expresa tu opinión', 'Muestra disposición a negociar', 'Evita pasividad']
  }
];

const MENTOR_RESOURCES = {
  techniques: [
    { name: 'Comunicación No Violenta (CNV)', author: 'Marshall Rosenberg', description: 'Observación, Sentimiento, Necesidad, Petición' },
    { name: 'Modelo SBAR', author: 'Kaiser Permanente', description: 'Situación, Antecedentes, Evaluación, Recomendación' },
    { name: 'Técnica DESC', author: 'Sharon Bower', description: 'Describir, Expresar, Sugerir, Consecuencias' },
    { name: 'Disco Rayado', author: 'Manuel J. Smith', description: 'Repetir tu posición con calma ante insistencia' },
    { name: 'Banco de Niebla', author: 'Manuel J. Smith', description: 'Aceptar parte de la crítica sin ceder totalmente' }
  ],
  readings: [
    { title: 'Comunicación No Violenta', author: 'Marshall Rosenberg', topic: 'cnv' },
    { title: 'Conversaciones Cruciales', author: 'Patterson, Grenny, McMillan', topic: 'conversaciones' },
    { title: 'Cómo Ganar Amigos e Influir sobre las Personas', author: 'Dale Carnegie', topic: 'influencia' },
    { title: 'Inteligencia Emocional', author: 'Daniel Goleman', topic: 'emocional' }
  ],
  practices: [
    { title: 'Parafraseo diario', description: 'Repite lo que escuchas antes de responder', difficulty: 'Fácil' },
    { title: 'Diario de conversaciones', description: 'Anota una conversación difícil al día y cómo la gestionaste', difficulty: 'Fácil' },
    { title: 'Práctica de feedback SBI', description: 'Da un feedback usando Situación-Comportamiento-Impacto', difficulty: 'Media' },
    { title: 'Role-play con compañero', description: 'Practica conversaciones difíciles con un colega de confianza', difficulty: 'Alta' }
  ]
};

const EMOJIS_BY_SCORE = {
  excellent: ['🎉', '🏆', '⭐', '🌟', '💫', '🚀', '👑', '💯'],
  good: ['👏', '✨', '💪', '🎯', '👍', '😊', '🌈', '🔥'],
  average: ['🤔', '📈', '💡', '🔄', '👀', '🌱', '📚', '⏳'],
  poor: ['😕', '📉', '⚠️', '🔧', '💭', '🎓', '🔍', '📝']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excepcional! Tu comunicación es ejemplar',
    '¡Brillante! Dominas el arte de comunicar',
    '¡Impresionante! Comunicación de nivel experto',
    '¡Sobresaliente! Tu equipo tiene suerte de tenerte'
  ],
  good: [
    '¡Muy bien! Comunicas con claridad',
    '¡Buen trabajo! Tu comunicación es efectiva',
    '¡Genial! Tienes buenas bases comunicativas',
    '¡Bien hecho! Sigue desarrollando tu potencial'
  ],
  average: [
    'Hay potencial, pero puedes mejorar',
    'En desarrollo, sigue practicando',
    'Base correcta, pero puedes crecer más',
    'Oportunidad de crecimiento detectada'
  ],
  poor: [
    'Es momento de trabajar tu comunicación',
    'Hay áreas importantes que desarrollar',
    'La comunicación se entrena, ¡ánimo!',
    'Identifica tus áreas de mejora'
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

const shuffleOptions = (options) => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const shuffleQuestionOptions = (questions) => {
  return questions.map(q => ({
    ...q,
    options: shuffleOptions(q.options)
  }));
};

const ModeSelector = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#3b82f6" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-3 rounded-2xl border border-cyan-500/30 mb-6">
            <MessageSquare className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-black text-white">
              Centro de <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Comunicación</span>
            </h1>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Desarrolla tus habilidades comunicativas en el entorno sanitario
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNICATION_MODES.map((mode, idx) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 ${mode.isNew ? 'border-violet-500/60 ring-1 ring-violet-400/30' : 'border-slate-600'} hover:border-cyan-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
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
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-100">{mode.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{mode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((feature, fidx) => (
                      <span key={fidx} className="text-xs bg-slate-700/80 text-cyan-300 px-2 py-1 rounded-lg">
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

const ScoreDisplay = ({ score, maxScore, feedback, communicationStyle, onContinue, additionalInfo }) => {
  const category = getScoreCategory(score, maxScore);
  const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
  const phrase = getRandomElement(PHRASES_BY_SCORE[category]);
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingParticles />
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full text-center border-2 border-cyan-500/30 shadow-2xl">
        <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
        <h2 className="text-2xl font-black text-white mb-2">{phrase}</h2>
        
        <div className="bg-slate-700/50 rounded-2xl p-6 my-6">
          <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            {score}/{maxScore}
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                category === 'excellent' ? 'bg-gradient-to-r from-cyan-400 to-blue-400' :
                category === 'good' ? 'bg-gradient-to-r from-teal-400 to-cyan-400' :
                category === 'average' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                'bg-gradient-to-r from-rose-400 to-red-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-slate-300 text-sm">{percentage}% de puntuación</p>
        </div>
        
        {communicationStyle && (
          <div className="bg-cyan-500/20 border border-cyan-500/40 rounded-xl p-4 mb-4">
            <p className="text-cyan-300 font-bold text-lg mb-1">Tu estilo detectado:</p>
            <p className="text-white text-xl font-black">{communicationStyle}</p>
          </div>
        )}
        
        <p className="text-slate-200 text-sm mb-6 leading-relaxed">{feedback}</p>
        
        {additionalInfo && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-slate-300 text-sm whitespace-pre-line">{additionalInfo}</p>
          </div>
        )}
        
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30 hover:scale-105"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const RadarChart = ({ data, labels, title }) => {
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const sides = data.length;
  
  const getPoint = (value, index) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = (value / 4) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  const getLabelPoint = (index) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = radius + 30;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  const gridLines = [0.25, 0.5, 0.75, 1].map(factor => {
    const r = factor * radius;
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      points.push({
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      });
    }
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });
  
  const dataPoints = data.map((value, index) => getPoint(value, index));
  const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 border border-cyan-500/30">
      <h3 className="text-white font-bold text-center mb-4">{title}</h3>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
        {gridLines.map((points, idx) => (
          <polygon key={idx} points={points} fill="none" stroke="#475569" strokeWidth="1" />
        ))}
        
        {[...Array(sides)].map((_, i) => {
          const end = getPoint(4, i);
          return (
            <line key={i} x1={centerX} y1={centerY} x2={end.x} y2={end.y} stroke="#475569" strokeWidth="1" />
          );
        })}
        
        <polygon points={dataPath} fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="2" />
        
        {dataPoints.map((point, idx) => (
          <circle key={idx} cx={point.x} cy={point.y} r="5" fill="#06b6d4" />
        ))}
        
        {labels.map((label, idx) => {
          const pos = getLabelPoint(idx);
          return (
            <text
              key={idx}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 text-[9px]"
            >
              {label}
            </text>
          );
        })}
      </svg>
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
  const { addSession } = useCommunicationProfileContext();

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**${scenario.title}**\n\n📋 **Categoría:** ${scenario.category}\n⚡ **Dificultad:** ${scenario.difficulty}\n\n---\n\n${scenario.description}\n\n---\n\n¿Estás listo/a para practicar tu comunicación? Escribe **"Empezar"** para comenzar el escenario.`
    }]);
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

  const parseEvaluation = (text) => {
    const scoreMatch = text.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i) || 
                       text.match(/PUNTUACIÓN:\s*(\d+)\/10/i);
    const styleMatch = text.match(/\*\*ESTILO.*?:\s*([^*\n]+)\*\*/i) ||
                       text.match(/ESTILO.*?:\s*([^\n]+)/i);
    
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const style = styleMatch ? styleMatch[1].trim() : null;
      return { score, style, feedback: text };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un simulador de comunicación para gestoras enfermeras.

ESCENARIO: "${scenario.title}"
CATEGORÍA: ${scenario.category}
DESCRIPCIÓN: ${scenario.description}

TU FUNCIÓN:
1. Cuando el usuario diga "Empezar", presenta un escenario detallado de comunicación con:
   - Contexto específico del hospital/unidad
   - Persona con la que debe comunicarse (nombre y rol)
   - El desafío comunicativo concreto
   - Diálogo inicial del interlocutor
   - Pregunta: ¿Cómo responderías?

2. Después de cada respuesta del usuario:
   - Clasifica su estilo comunicativo (Asertiva, Pasiva, Agresiva, Pasivo-agresiva, Manipuladora, Empática)
   - Muestra la reacción del interlocutor según el estilo usado
   - Da feedback sobre si el estilo es adecuado para el contexto
   - Presenta la evolución de la conversación

3. Tras 3-4 intercambios, proporciona:
   - **PUNTUACIÓN: X/10** (formato exacto)
   - **ESTILO DETECTADO: [nombre del estilo comunicativo]**
   - Feedback sobre fortalezas comunicativas
   - Áreas de mejora específicas
   - Sugerencia de reformulación más efectiva

ESTILOS A DETECTAR:
- Asertiva: clara, respetuosa, expresa necesidades sin agredir
- Pasiva: evita conflicto, no expresa necesidades
- Agresiva: impone, no respeta al otro
- Pasivo-agresiva: indirecta, sarcástica
- Manipuladora: busca control indirecto
- Empática: centrada en el otro, valida emociones

IMPORTANTE:
- Siempre en español
- Contexto de gestión enfermera en España
- Usa emojis diferentes cada vez para la puntuación
- Sé constructivo pero exigente`
        })
      });

      const data = await response.json();
      const aiResponse = data.response;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      const evaluation = parseEvaluation(aiResponse);
      if (evaluation) {
        addSession({
          type: 'scenario',
          scenarioId: scenario.id,
          score: evaluation.score,
          maxScore: 10,
          styleDetected: evaluation.style
        });
        setTimeout(() => {
          setResult(evaluation);
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    return (
      <ScoreDisplay
        score={result.score}
        maxScore={10}
        feedback={result.feedback.substring(0, 500) + '...'}
        communicationStyle={result.style}
        onContinue={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-cyan-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl shadow-lg`}>
            {scenario.icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{scenario.title}</h1>
            <p className="text-xs text-cyan-300">{scenario.category}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {msg.role === 'assistant' && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white border border-cyan-400/30'
                : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando tu comunicación...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-cyan-500/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cómo responderías?"
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const ScenarioSelector = ({ onSelectScenario, onBack, onGenerateScenario }) => {
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const generateNewScenario = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un escenario de comunicación',
          history: [],
          systemPrompt: `Genera UN escenario de comunicación para entrenamiento de gestoras enfermeras.

RESPONDE SOLO EN FORMATO JSON (sin markdown ni backticks):
{
  "title": "Título del escenario (4-6 palabras)",
  "category": "Categoría (Asertividad, Empatía, Conflictos, Feedback, Conversaciones Difíciles o Gestión de Críticas)",
  "description": "Descripción del escenario (2-3 frases). Incluye: quién está involucrado, qué situación comunicativa se presenta, y cuál es el desafío.",
  "difficulty": "Básico, Intermedio, Avanzado o Experto",
  "icon": "Un emoji que represente el escenario"
}

TIPOS DE ESCENARIOS (varía entre estos):
- Comunicación asertiva con un profesional
- Conversaciones difíciles
- Comunicación empática con pacientes/familias
- Resolución de conflictos entre profesionales
- Dar feedback correctivo sin generar resistencia
- Gestionar críticas y peticiones improcedentes

IMPORTANTE:
- Contexto español de gestión enfermera
- Escenarios realistas y desafiantes
- No repetir los predefinidos`
        })
      });

      const data = await response.json();
      let parsed;
      try {
        const cleanJson = data.response.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch {
        throw new Error('Error parsing scenario');
      }

      const newScenario = {
        id: `ai-${Date.now()}`,
        title: parsed.title,
        category: parsed.category,
        description: parsed.description,
        difficulty: parsed.difficulty,
        icon: parsed.icon || '💬',
        color: 'from-fuchsia-500 to-pink-500',
        isGenerated: true
      };

      setGeneratedScenarios(prev => [newScenario, ...prev.slice(0, 2)]);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setGenerationError('No se pudo generar el escenario. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#3b82f6" size="200px" left="80%" top="60%" delay="2s" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗣️</div>
          <h1 className="text-3xl font-black text-white mb-3">
            Escenarios de <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Comunicación</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Practica situaciones reales de comunicación clínica y gestora
          </p>
        </div>

        <button
          onClick={generateNewScenario}
          disabled={isGenerating}
          className="w-full mb-4 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30 border-2 border-dashed border-fuchsia-400/50 hover:border-fuchsia-400 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
              <span className="text-fuchsia-300 font-medium">Generando escenario...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span className="text-fuchsia-300 font-medium">Generar Escenario con IA</span>
              <span className="text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">NUEVO</span>
            </>
          )}
        </button>

        {generationError && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-300">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{generationError}</span>
          </div>
        )}

        {generatedScenarios.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-fuchsia-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Escenarios Generados por IA
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {generatedScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => onSelectScenario(scenario)}
                  className="bg-slate-800/90 backdrop-blur-xl border-2 border-fuchsia-500/50 hover:border-fuchsia-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-fuchsia-500/20 hover:scale-[1.02] relative"
                >
                  <span className="absolute top-2 right-2 text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
                      {scenario.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{scenario.title}</h3>
                      <p className="text-fuchsia-400 text-xs font-medium mb-2">{scenario.category} • {scenario.difficulty}</p>
                      <p className="text-slate-300 text-sm line-clamp-2">{scenario.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-sm font-medium text-cyan-400 mb-3">Escenarios Predefinidos</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {COMMUNICATION_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-cyan-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{scenario.title}</h3>
                  <p className="text-cyan-400 text-xs font-medium mb-2">{scenario.category} • {scenario.difficulty}</p>
                  <p className="text-slate-300 text-sm line-clamp-2">{scenario.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CommunicationTest = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [testVersion, setTestVersion] = useState(0);
  const { addSession } = useCommunicationProfileContext();
  
  const questions = useMemo(() => {
    return getShuffledTestQuestions();
  }, [testVersion]);
  
  const handleAnswer = (optionIndex) => {
    const option = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, { 
      questionId: currentQuestion, 
      score: option.score,
      dimension: questions[currentQuestion].dimension
    }];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRetakeTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTestVersion(v => v + 1);
  };
  
  if (showResult) {
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
      feedback = '¡Excelente! Demuestras habilidades comunicativas muy desarrolladas en todas las dimensiones.';
    } else if (percentage >= 60) {
      feedback = 'Buen nivel comunicativo. Tienes fortalezas pero aún puedes potenciar algunas áreas.';
    } else {
      feedback = 'Tu comunicación tiene potencial pero hay oportunidades significativas de mejora.';
    }
    
    const additionalInfo = areasToImprove.length > 0 
      ? `Áreas de mejora prioritarias:\n• ${areasToImprove.join('\n• ')}\n\nRecomendaciones:\n• Practica la escucha activa con parafraseo\n• Usa la técnica DESC para ser más asertivo/a\n• Trabaja la validación emocional antes de dar soluciones`
      : 'Mantienes un equilibrio excelente en las dimensiones comunicativas. ¡Sigue así!';

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
              title="Tu Perfil Comunicativo"
            />
            
            <div className="mt-4 bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-purple-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {totalScore}/{maxScore}
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      category === 'excellent' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                      category === 'good' ? 'bg-gradient-to-r from-teal-400 to-cyan-400' :
                      category === 'average' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                      'bg-gradient-to-r from-rose-400 to-red-400'
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:scale-105 flex items-center justify-center gap-2"
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
      <GlowingOrb color="#8b5cf6" size="250px" left="10%" top="30%" delay="0s" />
      
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
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
                className="w-full text-left bg-slate-700/50 hover:bg-purple-500/20 border-2 border-slate-600 hover:border-purple-400 rounded-xl p-4 transition-all group"
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

const AssertiveMode = ({ onBack }) => {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [generatedExercises, setGeneratedExercises] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addSession } = useCommunicationProfileContext();

  const generateNewExercise = async () => {
    setIsGenerating(true);
    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un ejercicio de asertividad',
          history: [],
          systemPrompt: `Genera UN ejercicio de reformulación asertiva para gestoras enfermeras.

RESPONDE SOLO EN FORMATO JSON (sin markdown ni backticks):
{
  "originalPhrase": "Frase no asertiva o mejorable (1 línea)",
  "context": "Contexto de la situación (1 frase)",
  "difficulty": "Básico, Intermedio o Avanzado",
  "hints": ["Pista 1", "Pista 2", "Pista 3"]
}

EJEMPLOS DE FRASES A REFORMULAR:
- Quejas pasivas o agresivas
- Negativas sin alternativa
- Generalizaciones ("siempre", "nunca")
- Ataques personales encubiertos
- Evitaciones de responsabilidad

IMPORTANTE: Contexto de gestión enfermera en España`
        })
      });

      const data = await response.json();
      const cleanJson = data.response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const newExercise = {
        id: `ai-${Date.now()}`,
        ...parsed,
        isGenerated: true
      };

      setGeneratedExercises(prev => [newExercise, ...prev.slice(0, 2)]);
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) return;
    setIsLoading(true);

    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userResponse,
          history: [],
          systemPrompt: `Eres un evaluador de comunicación asertiva para gestoras enfermeras.

EJERCICIO:
- Frase original: "${currentExercise.originalPhrase}"
- Contexto: ${currentExercise.context}
- Reformulación del usuario: "${userResponse}"

EVALÚA la reformulación y responde con:
1. **PUNTUACIÓN: X/10** (formato exacto)
2. **CLASIFICACIÓN:** (Asertiva adecuada / Asertiva incompleta / No asertiva)
3. Análisis de qué elementos asertivos incluye o le faltan
4. Sugerencia de reformulación ideal usando técnica DESC si aplica
5. Consejo breve para mejorar

CRITERIOS:
- ¿Expresa claramente la necesidad?
- ¿Es respetuosa con el otro?
- ¿Evita ataques personales?
- ¿Ofrece alternativa o solución?
- ¿Usa mensajes "yo"?

Sé constructivo y específico. Contexto español de gestión enfermera.`
        })
      });

      const data = await response.json();
      const scoreMatch = data.response.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 5;

      addSession({
        type: 'assertive',
        exerciseId: currentExercise.id,
        score: score,
        maxScore: 10
      });

      setFeedback({ text: data.response, score });
    } catch (error) {
      setFeedback({ text: 'Error al evaluar. Intenta de nuevo.', score: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  if (feedback) {
    const category = getScoreCategory(feedback.score, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);

    return (
      <div className="min-h-screen p-4 md:p-8 relative">
        <FloatingParticles />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-emerald-500/30 shadow-xl text-center">
            <div className="text-7xl mb-4">{emoji}</div>
            <div className="text-4xl font-black text-white mb-4">{feedback.score}/10</div>
            <p className="text-slate-200 text-sm mb-6 leading-relaxed whitespace-pre-line text-left">
              {feedback.text.replace(/\*\*/g, '')}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentExercise(null);
                  setFeedback(null);
                  setUserResponse('');
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Nuevo Ejercicio
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
      </div>
    );
  }

  if (currentExercise) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative">
        <FloatingParticles />
        <GlowingOrb color="#10b981" size="250px" left="10%" top="30%" delay="0s" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <button
            onClick={() => setCurrentExercise(null)}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-emerald-500/30 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl">
                💪
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Reformulación Asertiva</h2>
                <p className="text-emerald-300 text-sm">{currentExercise.difficulty}</p>
              </div>
              {currentExercise.isGenerated && (
                <span className="ml-auto text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
              )}
            </div>
            
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl p-4 mb-4">
              <p className="text-rose-300 text-sm font-medium mb-1">Frase a reformular:</p>
              <p className="text-white text-lg">"{currentExercise.originalPhrase}"</p>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
              <p className="text-slate-400 text-sm mb-1">Contexto:</p>
              <p className="text-slate-200">{currentExercise.context}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">💡 Pistas:</p>
              <div className="flex flex-wrap gap-2">
                {currentExercise.hints.map((hint, idx) => (
                  <span key={idx} className="text-xs bg-slate-700/80 text-emerald-300 px-2 py-1 rounded-lg">
                    {hint}
                  </span>
                ))}
              </div>
            </div>
            
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Escribe tu reformulación asertiva..."
              className="w-full bg-slate-700/50 border-2 border-slate-600 focus:border-emerald-500 rounded-xl p-4 text-white placeholder-slate-400 resize-none h-32 focus:outline-none"
              disabled={isLoading}
            />
            
            <button
              onClick={submitResponse}
              disabled={!userResponse.trim() || isLoading}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Evaluar Reformulación</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allExercises = [...generatedExercises, ...ASSERTIVE_EXERCISES];

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
      <FloatingParticles />
      <GlowingOrb color="#10b981" size="300px" left="5%" top="20%" delay="0s" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💪</div>
          <h1 className="text-3xl font-black text-white mb-3">
            Comunicación <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Asertiva</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Practica reformular frases de forma asertiva
          </p>
        </div>

        <button
          onClick={generateNewExercise}
          disabled={isGenerating}
          className="w-full mb-6 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30 border-2 border-dashed border-fuchsia-400/50 hover:border-fuchsia-400 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
              <span className="text-fuchsia-300 font-medium">Generando ejercicio...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              <span className="text-fuchsia-300 font-medium">Generar Ejercicio con IA</span>
            </>
          )}
        </button>
        
        <div className="grid md:grid-cols-2 gap-4">
          {allExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setCurrentExercise(exercise)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 ${exercise.isGenerated ? 'border-fuchsia-500/50 hover:border-fuchsia-400' : 'border-slate-600 hover:border-emerald-400'} rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] relative`}
            >
              {exercise.isGenerated && (
                <span className="absolute top-2 right-2 text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${
                  exercise.difficulty === 'Básico' ? 'text-green-400' :
                  exercise.difficulty === 'Intermedio' ? 'text-amber-400' :
                  'text-rose-400'
                }`}>{exercise.difficulty}</span>
              </div>
              <p className="text-white text-lg mb-2">"{exercise.originalPhrase}"</p>
              <p className="text-slate-400 text-sm">{exercise.context}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmpathyMode = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { addSession } = useCommunicationProfileContext();

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**Evaluación de Empatía** 💗\n\nVoy a presentarte una situación donde alguien necesita apoyo emocional. Tu tarea es responder de forma empática.\n\n**Se evaluará:**\n- 🧠 Empatía Cognitiva: ¿Reconoces lo que siente?\n- 💓 Empatía Emocional: ¿Conectas emocionalmente?\n- 🗣️ Empatía Comunicativa: ¿Lo transmites bien?\n\nEscribe **"Empezar"** para comenzar.`
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
    const newExchangeCount = exchangeCount + 1;
    setExchangeCount(newExchangeCount);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const isLastExchange = newExchangeCount >= 3;

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un evaluador de empatía para gestoras enfermeras.

INTERCAMBIO: ${newExchangeCount}/3

${newExchangeCount === 1 && userMessage.toLowerCase().includes('empezar') ? `
Presenta una situación emocional realista:
- Una persona (paciente, familiar o compañero) que expresa una emoción intensa
- Describe el contexto brevemente
- Haz que la persona hable en primera persona expresando cómo se siente
- Pregunta: "¿Cómo responderías a esta persona?"
` : `
Evalúa la respuesta empática del usuario:
1. ¿Reconoce las emociones? (Empatía cognitiva)
2. ¿Valida los sentimientos sin juzgar? (Empatía emocional)
3. ¿Mantiene límites profesionales? (Equilibrio)
4. ¿Lo comunica bien? (Empatía comunicativa)

Responde como la persona en la situación, reaccionando según la calidad empática:
- Si es empática: la persona se abre más
- Si es fría o da consejos rápidos: la persona se cierra

${isLastExchange ? `
OBLIGATORIO - Da evaluación final:
**PUNTUACIÓN: X/10**
**TIPO DE EMPATÍA DOMINANTE:** (Cognitiva / Emocional / Comunicativa)
**ANÁLISIS:**
- Empatía Cognitiva: X/10 (qué hizo bien/mal)
- Empatía Emocional: X/10 (qué hizo bien/mal)
- Empatía Comunicativa: X/10 (qué hizo bien/mal)
**ESTRATEGIAS DE MEJORA:** (2-3 consejos específicos)
` : ''}`}

IMPORTANTE: Siempre en español, contexto sanitario español.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      const scoreMatch = data.response.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1], 10);
        addSession({
          type: 'empathy',
          score: score,
          maxScore: 10
        });
        setTimeout(() => {
          setResult({ score, feedback: data.response });
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    return (
      <ScoreDisplay
        score={result.score}
        maxScore={10}
        feedback={result.feedback.substring(0, 600) + '...'}
        communicationStyle="Empatía"
        onContinue={() => {
          setMessages([{
            role: 'assistant',
            content: '**Nueva Evaluación de Empatía** 💗\n\nEscribe **"Empezar"** para una nueva situación.'
          }]);
          setShowResult(false);
          setResult(null);
          setExchangeCount(0);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-rose-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
            💗
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Evaluación de Empatía</h1>
            <p className="text-xs text-rose-300">{exchangeCount}/3 intercambios</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white border border-rose-400/30'
                : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-xl">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-rose-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Evaluando tu empatía...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-rose-500/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cómo responderías con empatía?"
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const ConflictMode = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [generatedScenarios, setGeneratedScenarios] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const messagesEndRef = useRef(null);
  const { addSession } = useCommunicationProfileContext();

  const DEFAULT_CONFLICT_SCENARIOS = [
    { id: 1, title: 'Conflicto de turnos', description: 'Dos enfermeras discuten por el reparto de turnos de Navidad' },
    { id: 2, title: 'Tensión interdisciplinar', description: 'Un médico cuestiona decisiones de enfermería públicamente' },
    { id: 3, title: 'Chisme y rumores', description: 'Hay rumores sobre un compañero que están afectando al equipo' }
  ];

  const generateNewScenario = async () => {
    setIsGenerating(true);
    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un escenario de conflicto',
          history: [],
          systemPrompt: `Genera UN escenario de conflicto laboral para gestoras enfermeras.

RESPONDE SOLO EN FORMATO JSON:
{
  "title": "Título del conflicto (3-5 palabras)",
  "description": "Descripción breve del conflicto (1 frase)"
}

TIPOS DE CONFLICTOS:
- Interpersonales entre profesionales
- Por recursos o carga de trabajo
- Por estilos de trabajo diferentes
- Por comunicación deficiente
- Por roles y responsabilidades

IMPORTANTE: Contexto sanitario español, realista y desafiante.`
        })
      });

      const data = await response.json();
      const cleanJson = data.response.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const newScenario = {
        id: `ai-${Date.now()}`,
        ...parsed,
        isGenerated: true
      };

      setGeneratedScenarios(prev => [newScenario, ...prev.slice(0, 2)]);
    } catch (error) {
      console.error('Error generating scenario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const startScenario = (scenario) => {
    setSelectedScenario(scenario);
    setMessages([{
      role: 'assistant',
      content: `**Gestión de Conflictos** ⚔️\n\n**Situación:** ${scenario.title}\n${scenario.description}\n\nEscribe **"Empezar"** para enfrentar este conflicto.`
    }]);
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

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const isLastExchange = newExchangeCount >= 4;

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un simulador de gestión de conflictos para gestoras enfermeras.

CONFLICTO: ${selectedScenario.title}
DESCRIPCIÓN: ${selectedScenario.description}
INTERCAMBIO: ${newExchangeCount}/4

${userMessage.toLowerCase().includes('empezar') ? `
Presenta el conflicto con detalle:
- Describe a las partes involucradas (con nombres)
- Explica qué ha pasado
- Muestra las posiciones de cada uno
- Pregunta: ¿Cómo gestionarías este conflicto?
` : `
Evalúa la respuesta de gestión del conflicto:
1. ¿Desescala o escala la tensión?
2. ¿Identifica intereses vs. posiciones?
3. ¿Busca acuerdos o impone soluciones?
4. ¿Mantiene profesionalidad?

CLASIFICA la estrategia usada:
- Colaborativa: busca ganar-ganar
- Competitiva: busca ganar a costa del otro
- Evitativa: evita el conflicto
- Compromiso: cada uno cede algo
- Acomodación: cede para mantener paz

Responde como si fueras las partes del conflicto reaccionando.

${isLastExchange ? `
OBLIGATORIO - Evaluación final:
**PUNTUACIÓN: X/10**
**ESTRATEGIA PREDOMINANTE:** [nombre de la estrategia]
**ANÁLISIS:**
- Desescalada: X/10
- Negociación: X/10
- Profesionalidad: X/10
**RECOMENDACIONES:** Consejos específicos para mejorar
` : ''}`}

IMPORTANTE: Español, contexto sanitario realista.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      const scoreMatch = data.response.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i);
      if (scoreMatch) {
        const score = parseInt(scoreMatch[1], 10);
        addSession({
          type: 'conflict',
          scenarioId: selectedScenario.id,
          score: score,
          maxScore: 10
        });
        setTimeout(() => {
          setResult({ score, feedback: data.response });
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    return (
      <ScoreDisplay
        score={result.score}
        maxScore={10}
        feedback={result.feedback.substring(0, 600) + '...'}
        communicationStyle="Gestión de Conflictos"
        onContinue={() => {
          setSelectedScenario(null);
          setMessages([]);
          setShowResult(false);
          setResult(null);
          setExchangeCount(0);
        }}
      />
    );
  }

  if (!selectedScenario) {
    const allScenarios = [...generatedScenarios, ...DEFAULT_CONFLICT_SCENARIOS];

    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#f59e0b" size="300px" left="5%" top="20%" delay="0s" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">⚔️</div>
            <h1 className="text-3xl font-black text-white mb-3">
              Gestión de <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Conflictos</span>
            </h1>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              Practica desescalar tensiones y negociar acuerdos
            </p>
          </div>

          <button
            onClick={generateNewScenario}
            disabled={isGenerating}
            className="w-full mb-6 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30 border-2 border-dashed border-fuchsia-400/50 hover:border-fuchsia-400 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
                <span className="text-fuchsia-300 font-medium">Generando conflicto...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
                <span className="text-fuchsia-300 font-medium">Generar Conflicto con IA</span>
              </>
            )}
          </button>
          
          <div className="space-y-4">
            {allScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className={`w-full bg-slate-800/90 backdrop-blur-xl border-2 ${scenario.isGenerated ? 'border-fuchsia-500/50 hover:border-fuchsia-400' : 'border-slate-600 hover:border-amber-400'} rounded-2xl p-5 text-left transition-all hover:scale-[1.01] relative`}
              >
                {scenario.isGenerated && (
                  <span className="absolute top-3 right-3 text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
                )}
                <h3 className="text-lg font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-slate-300 text-sm">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-amber-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedScenario(null)} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-xl shadow-lg">
            ⚔️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{selectedScenario.title}</h1>
            <p className="text-xs text-amber-300">{exchangeCount}/4 intercambios</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white border border-amber-400/30'
                : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando tu gestión...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-amber-500/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cómo gestionarías este conflicto?"
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const RolePlayMode = ({ onBack }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [generatedCharacters, setGeneratedCharacters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const messagesEndRef = useRef(null);
  const { addSession } = useCommunicationProfileContext();

  const generateNewCharacter = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Genera un personaje emocional',
          history: [],
          systemPrompt: `Genera UN personaje con emoción intensa para role-play de comunicación en gestión enfermera.

RESPONDE SOLO EN FORMATO JSON (sin markdown ni backticks):
{
  "name": "Nombre español",
  "role": "Rol (Enfermero/a, Familiar, Paciente, Auxiliar, etc.)",
  "emotion": "Emoción dominante (Frustración, Miedo, Rabia, Agotamiento, Tristeza, Ansiedad, Decepción)",
  "description": "Breve descripción de la situación (1 frase)",
  "icon": "Emoji que represente la emoción",
  "personality": "3-4 rasgos de personalidad",
  "challenge": "El desafío comunicativo que representa",
  "prompt": "Instrucciones de cómo actuar: emoción, frases típicas, cómo reacciona según el trato (3-4 líneas)"
}

IMPORTANTE:
- La emoción debe ser intensa y genuina
- El personaje debe ser diferente a los predefinidos
- Incluir reacciones según cómo le traten`
        })
      });

      const data = await response.json();
      let parsed;
      try {
        const cleanJson = data.response.replace(/```json\n?|\n?```/g, '').trim();
        parsed = JSON.parse(cleanJson);
      } catch {
        throw new Error('Error parsing character');
      }

      const newChar = {
        id: `ai-${Date.now()}`,
        name: parsed.name,
        role: parsed.role,
        emotion: parsed.emotion,
        description: parsed.description,
        icon: parsed.icon || '😔',
        color: 'from-fuchsia-500 to-pink-500',
        personality: parsed.personality,
        challenge: parsed.challenge,
        prompt: `Eres ${parsed.name}, ${parsed.role}.\nEMOCIÓN DOMINANTE: ${parsed.emotion}\nPERSONALIDAD: ${parsed.personality}\n${parsed.prompt}`,
        isGenerated: true
      };

      setGeneratedCharacters(prev => [newChar, ...prev.slice(0, 3)]);
    } catch (error) {
      console.error('Error generating character:', error);
      setGenerationError('No se pudo generar el personaje. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const parseEvaluation = (text) => {
    const scoreMatch = text.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i);
    const styleMatch = text.match(/\*\*ESTILO.*?:\s*([^*\n]+)\*\*/i);
    
    if (scoreMatch) {
      return { 
        score: parseInt(scoreMatch[1], 10), 
        style: styleMatch ? styleMatch[1].trim() : null, 
        feedback: text 
      };
    }
    return null;
  };

  const startConversation = (character) => {
    setSelectedCharacter(character);
    setMessages([{
      role: 'assistant',
      content: `*${character.name} se acerca a ti con expresión ${character.emotion.toLowerCase()}...*\n\n---\n\n**Contexto:** ${character.description}\n\n**Emoción:** ${character.emotion}\n\n${character.name} te mira esperando que digas algo. ¿Cómo inicias la conversación?`
    }]);
    setExchangeCount(0);
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

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const isLastExchange = newExchangeCount >= 4;

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `${selectedCharacter.prompt}

CONTEXTO: Estás hablando con el/la gestor/a enfermero/a. Este es el intercambio ${newExchangeCount} de la conversación.

INSTRUCCIONES:
- Responde SIEMPRE en primera persona como ${selectedCharacter.name}
- Tu emoción dominante es ${selectedCharacter.emotion}
- Incluye lenguaje corporal entre asteriscos (*suspira*, *evita la mirada*, *levanta la voz*, etc.)
- ADAPTA tu respuesta según el tono del usuario:
  * Si detectas dureza → Señala que necesitas que suavice el tono
  * Si detectas ambigüedad → Pide concreción
  * Si detectas falta de escucha → Recuerda que necesitas ser escuchado/a
  * Si detectas empatía → Abre más tu vulnerabilidad

${isLastExchange ? `
IMPORTANTE - ESTE ES EL ÚLTIMO INTERCAMBIO:
Al final de tu respuesta, incluye una evaluación:
**PUNTUACIÓN: X/10**
**ESTILO COMUNICATIVO DETECTADO: [nombre del estilo]**
**FEEDBACK:** 
- Qué hizo bien en la gestión emocional
- Qué podría mejorar
- Cómo se sintió el personaje con el trato recibido
` : 'Mantén la conversación abierta para más intercambios.'}`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      const evaluation = parseEvaluation(data.response);
      if (evaluation) {
        addSession({
          type: 'roleplay',
          characterId: selectedCharacter.id,
          score: evaluation.score,
          maxScore: 10,
          styleDetected: evaluation.style
        });
        setTimeout(() => {
          setResult(evaluation);
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    return (
      <ScoreDisplay
        score={result.score}
        maxScore={10}
        feedback={result.feedback.substring(0, 500) + '...'}
        communicationStyle={result.style}
        onContinue={() => {
          setSelectedCharacter(null);
          setMessages([]);
          setShowResult(false);
          setResult(null);
          setExchangeCount(0);
        }}
      />
    );
  }

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
        <FloatingParticles />
        <GlowingOrb color="#8b5cf6" size="300px" left="5%" top="20%" delay="0s" />
        <GlowingOrb color="#a855f7" size="200px" left="80%" top="60%" delay="2s" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎭</div>
            <h1 className="text-3xl font-black text-white mb-3">
              Role-Play <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Emocional</span>
            </h1>
            <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
              La IA interpreta personajes con emociones intensas. Practica tu gestión emocional.
            </p>
          </div>

          <button
            onClick={generateNewCharacter}
            disabled={isGenerating}
            className="w-full mb-4 bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30 border-2 border-dashed border-fuchsia-400/50 hover:border-fuchsia-400 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 text-fuchsia-400 animate-spin" />
                <span className="text-fuchsia-300 font-medium">Generando personaje...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
                <span className="text-fuchsia-300 font-medium">Generar Personaje con IA</span>
                <span className="text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">NUEVO</span>
              </>
            )}
          </button>

          {generationError && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-3 flex items-center gap-2 text-red-300">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{generationError}</span>
            </div>
          )}

          {generatedCharacters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-fuchsia-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Personajes Generados por IA
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {generatedCharacters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => startConversation(char)}
                    className="bg-slate-800/90 backdrop-blur-xl border-2 border-fuchsia-500/50 hover:border-fuchsia-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-fuchsia-500/20 hover:scale-[1.02] relative"
                  >
                    <span className="absolute top-2 right-2 text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${char.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl`}>
                        {char.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{char.name}</h3>
                        <p className="text-fuchsia-400 text-xs font-medium mb-1">{char.role} • {char.emotion}</p>
                        <p className="text-slate-300 text-sm mb-2">{char.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 className="text-sm font-medium text-violet-400 mb-3">Personajes Predefinidos</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ROLEPLAY_CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => startConversation(char)}
                className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-violet-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-violet-500/20 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${char.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl`}>
                    {char.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{char.name}</h3>
                    <p className="text-violet-400 text-xs font-medium mb-1">{char.role} • {char.emotion}</p>
                    <p className="text-slate-300 text-sm mb-2">{char.description}</p>
                    <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-1 rounded-lg">
                      {char.challenge}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-violet-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedCharacter(null)} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center text-xl shadow-lg`}>
            {selectedCharacter.icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{selectedCharacter.name}</h1>
            <p className="text-xs text-violet-300">{selectedCharacter.emotion} • {exchangeCount}/4 intercambios</p>
          </div>
        </div>
        {selectedCharacter.isGenerated && (
          <span className="text-xs bg-fuchsia-500/30 text-fuchsia-300 px-2 py-0.5 rounded-full">IA</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                <Theater className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white border border-violet-400/30'
                : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCharacter.color} flex items-center justify-center flex-shrink-0 shadow-xl`}>
              <Theater className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-violet-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{selectedCharacter.name} está procesando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-violet-500/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Responde a ${selectedCharacter.name}...`}
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const CommunicationAnalytics = ({ onBack }) => {
  const { profile, loading, getDominantStyles, getTrends, getCriticalAreas } = useCommunicationProfileContext();
  
  const dominantStyles = getDominantStyles();
  const trends = getTrends(10);
  const criticalAreas = getCriticalAreas();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Cargando tu perfil comunicativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-y-auto">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#0ea5e9" size="200px" left="80%" top="60%" delay="2s" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📈</div>
          <h1 className="text-3xl font-black text-white mb-3">
            Panel de <span className="bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">Analítica</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Tu evolución y perfil comunicativo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-cyan-400" />
              <span className="text-slate-300 text-sm">Sesiones Totales</span>
            </div>
            <p className="text-4xl font-black text-white">{profile?.totalSessions || 0}</p>
          </div>
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span className="text-slate-300 text-sm">Puntuación Media</span>
            </div>
            <p className="text-4xl font-black text-white">{(profile?.averageScore || 0).toFixed(0)}%</p>
          </div>
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-amber-400" />
              <span className="text-slate-300 text-sm">Estilos Dominantes</span>
            </div>
            <p className="text-lg font-bold text-white">
              {dominantStyles.length > 0 ? dominantStyles[0].style : 'Sin datos'}
            </p>
          </div>
        </div>

        {dominantStyles.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Estilos Comunicativos
            </h3>
            <div className="space-y-3">
              {dominantStyles.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-200">{s.style}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
                        style={{ width: `${Math.min(s.avgScore * 20, 100)}%` }}
                      />
                    </div>
                    <span className="text-cyan-300 text-sm">{s.count} veces</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trends.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/30 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-400" />
              Tendencia de Puntuaciones
            </h3>
            <div className="flex items-end gap-2 h-32">
              {trends.map((t, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t"
                    style={{ height: `${t.score}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-slate-400 mt-1">{t.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {criticalAreas.length > 0 && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-5 border border-rose-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Áreas de Mejora
            </h3>
            <div className="space-y-3">
              {criticalAreas.map((area, idx) => (
                <div key={idx} className="flex items-center justify-between bg-rose-500/10 rounded-xl p-3">
                  <span className="text-slate-200">{area.label}</span>
                  <span className="text-rose-400 font-bold">{area.value}/5</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!profile?.totalSessions && (
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-600 text-center">
            <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sin datos todavía</h3>
            <p className="text-slate-400">Completa ejercicios de comunicación para ver tu progreso aquí.</p>
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
  const [showResources, setShowResources] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**¡Bienvenido/a al Modo Mentor!** 🎓\n\nSoy tu coach experto en comunicación enfermera. Estoy aquí para:\n\n📚 **Enseñarte técnicas** como CNV, SBAR, DESC\n💡 **Resolver tus dudas** sobre comunicación profesional\n🎯 **Darte consejos** personalizados\n📖 **Recomendarte recursos** de aprendizaje\n\n¿En qué puedo ayudarte hoy?\n\n*Puedes preguntarme sobre cualquier aspecto de la comunicación en tu rol como gestora enfermera.*`
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
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un mentor experto en comunicación profesional para gestoras enfermeras.

TU PERFIL:
- Experto en comunicación no violenta (Marshall Rosenberg)
- Dominas el modelo SBAR, técnica DESC, y asertividad
- Conoces las teorías de Goleman sobre inteligencia emocional
- Tienes experiencia práctica en gestión sanitaria española

TU ESTILO:
- Coach empático pero exigente
- Usas ejemplos prácticos del entorno sanitario
- Cuando enseñas una técnica, la explicas paso a paso
- Ofreces ejercicios prácticos para aplicar en el día a día
- Haces preguntas reflexivas para profundizar el aprendizaje

TÉCNICAS QUE DOMINAS:
1. Comunicación No Violenta (CNV): Observación, Sentimiento, Necesidad, Petición
2. Modelo SBAR: Situación, Antecedentes, Evaluación, Recomendación
3. Técnica DESC: Describir, Expresar, Sugerir, Consecuencias
4. Disco Rayado y Banco de Niebla para asertividad
5. Escucha activa y parafraseo
6. Feedback SBI (Situación-Comportamiento-Impacto)

IMPORTANTE:
- Siempre en español
- Referencias a contexto sanitario español
- Si preguntan por una técnica, explícala con ejemplo práctico
- Termina siempre con una pregunta o ejercicio para el usuario`
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-amber-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-xl shadow-lg">
            🎓
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Modo Mentor</h1>
            <p className="text-xs text-amber-300">Coach en Comunicación Enfermera</p>
          </div>
        </div>
        <button 
          onClick={() => setShowResources(!showResources)}
          className={`p-2 rounded-xl transition-colors ${showResources ? 'bg-amber-500/30 text-amber-300' : 'hover:bg-slate-700 text-slate-400'}`}
        >
          <BookOpen className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 flex flex-col ${showResources ? 'hidden md:flex' : ''}`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
            <FloatingParticles />
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-white border border-amber-400/30'
                    : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
                }`}>
                  <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                </div>
                {msg.role === 'user' && <PlayerAvatarIcon size="md" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-xl">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3 text-amber-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Tu mentor está pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-slate-800 border-t-2 border-amber-500/50 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta a tu mentor..."
                className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {showResources && (
          <div className="w-full md:w-80 bg-slate-800/95 border-l border-slate-700 overflow-y-auto p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Recursos
            </h3>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-amber-400 mb-2">📖 Técnicas</h4>
              <div className="space-y-2">
                {MENTOR_RESOURCES.techniques.map((tech, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-white font-medium text-sm">{tech.name}</p>
                    <p className="text-slate-400 text-xs">{tech.author}</p>
                    <p className="text-slate-300 text-xs mt-1">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-amber-400 mb-2">📚 Lecturas</h4>
              <div className="space-y-2">
                {MENTOR_RESOURCES.readings.map((read, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-xl p-3">
                    <p className="text-white font-medium text-sm">{read.title}</p>
                    <p className="text-slate-400 text-xs">{read.author}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-2">🎯 Prácticas</h4>
              <div className="space-y-2">
                {MENTOR_RESOURCES.practices.map((prac, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-medium text-sm">{prac.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        prac.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-300' :
                        prac.difficulty === 'Media' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>{prac.difficulty}</span>
                    </div>
                    <p className="text-slate-300 text-xs">{prac.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CommunicationModule = ({ onBack }) => {
  const [currentMode, setCurrentMode] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleSelectMode = (modeId) => {
    setCurrentMode(modeId);
  };

  const handleBack = () => {
    if (selectedScenario) {
      setSelectedScenario(null);
    } else {
      setCurrentMode(null);
    }
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'scenarios':
        if (selectedScenario) {
          return <ScenarioChat scenario={selectedScenario} onBack={() => setSelectedScenario(null)} />;
        }
        return <ScenarioSelector onSelectScenario={setSelectedScenario} onBack={handleBack} />;
      case 'roleplay':
        return <RolePlayMode onBack={handleBack} />;
      case 'commtest':
        return <CommunicationTest onBack={handleBack} />;
      case 'assertive':
        return <AssertiveMode onBack={handleBack} />;
      case 'empathy':
        return <EmpathyMode onBack={handleBack} />;
      case 'conflict':
        return <ConflictMode onBack={handleBack} />;
      case 'analytics':
        return <CommunicationAnalytics onBack={handleBack} />;
      case 'mentor':
        return <MentorMode onBack={handleBack} />;
      default:
        return <ModeSelector onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <CommunicationProfileProvider>
      <div 
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          backgroundImage: `url(${leadershipBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-cyan-900/20 to-slate-900/95" />
        
        {!currentMode && (
          <div className="relative z-10 bg-slate-800/80 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3 flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Comunicación</h1>
              <p className="text-xs text-cyan-300">Centro de entrenamiento comunicativo</p>
            </div>
          </div>
        )}
        
        <div className="relative z-10 flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </CommunicationProfileProvider>
  );
};

export default CommunicationModule;
