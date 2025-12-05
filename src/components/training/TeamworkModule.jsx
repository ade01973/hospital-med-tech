import React, { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { ArrowLeft, Send, Bot, User, Users, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Target, Home, Trophy, Sparkles, Crown, TrendingUp, BarChart3, Flame, RefreshCw, ChevronDown, AlertTriangle, Theater, LineChart, BookOpen, Layers, UserCircle, MessageCircle, Settings, Lightbulb, GraduationCap, Heart, Shield, Volume2, Brain, Handshake, UserPlus, Scale, Flag, Users2 } from 'lucide-react';
import { db, auth } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
    scenarioTypes: {
      cargaDesigual: 0,
      coordinacionExperiencia: 0,
      conflictoPrioridades: 0,
      eventoAdverso: 0,
      multidisciplinar: 0,
      emergencia: 0,
      nuevoProtocolo: 0
    },
    scenarioTypesCounts: {
      cargaDesigual: 0,
      coordinacionExperiencia: 0,
      conflictoPrioridades: 0,
      eventoAdverso: 0,
      multidisciplinar: 0,
      emergencia: 0,
      nuevoProtocolo: 0
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
    
    if (sessionData.score !== undefined) {
      const prevTotal = (updatedProfile.averageScore || 0) * ((updatedProfile.totalSessions || 1) - 1);
      updatedProfile.averageScore = (prevTotal + sessionData.score) / updatedProfile.totalSessions;
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
        updatedProfile.styles[styleKey] = ((prevAvg * (count - 1)) + sessionData.score) / count;
      }
    }

    if (sessionData.scenarioType) {
      const typeKey = sessionData.scenarioType;
      if (updatedProfile.scenarioTypes[typeKey] !== undefined) {
        updatedProfile.scenarioTypesCounts[typeKey] = (updatedProfile.scenarioTypesCounts[typeKey] || 0) + 1;
        const count = updatedProfile.scenarioTypesCounts[typeKey];
        const prevAvg = updatedProfile.scenarioTypes[typeKey] || 0;
        updatedProfile.scenarioTypes[typeKey] = ((prevAvg * (count - 1)) + sessionData.score) / count;
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
      score: s.score || 0,
      type: s.type,
      style: s.styleDetected
    }));
  }, [profile]);

  return {
    profile,
    loading,
    addSession,
    getDominantStyles,
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
      getDominantStyles: () => [],
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
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
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
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-teal-400/50 ${className}`}>
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
          background: `linear-gradient(135deg, ${['#14b8a6', '#10b981', '#0d9488', '#059669'][Math.floor(Math.random() * 4)]}, transparent)`,
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
    title: 'Simulador de Escenarios',
    description: 'Practica situaciones reales de equipos clínicos',
    icon: '🎭',
    color: 'from-teal-500 to-emerald-500',
    features: ['7 tipos de escenarios', 'Evaluación IA', 'Puntuación 0-10'],
    isNew: true
  },
  {
    id: 'styleDetection',
    title: 'Detección de Estilo',
    description: 'Descubre tu estilo colaborativo en el equipo',
    icon: '🔍',
    color: 'from-emerald-500 to-green-500',
    features: ['8 estilos', 'Análisis contextual', 'Feedback personalizado'],
    isNew: true
  }
];

const SCENARIO_TYPES = [
  {
    id: 'cargaDesigual',
    title: 'Reparto Desigual de Cargas',
    description: 'Gestiona la distribución inequitativa de trabajo en el turno',
    icon: '⚖️',
    color: 'from-amber-500 to-orange-500',
    difficulty: 'Intermedio'
  },
  {
    id: 'coordinacionExperiencia',
    title: 'Coordinación por Experiencia',
    description: 'Coordina enfermeras con diferentes niveles de experiencia',
    icon: '👥',
    color: 'from-blue-500 to-indigo-500',
    difficulty: 'Intermedio'
  },
  {
    id: 'conflictoPrioridades',
    title: 'Conflicto de Prioridades',
    description: 'Resuelve conflictos entre profesionales por prioridades asistenciales',
    icon: '⚔️',
    color: 'from-rose-500 to-pink-500',
    difficulty: 'Avanzado'
  },
  {
    id: 'eventoAdverso',
    title: 'Evento Adverso',
    description: 'Lidera el trabajo en equipo durante un incidente crítico',
    icon: '🚨',
    color: 'from-red-500 to-rose-500',
    difficulty: 'Experto'
  },
  {
    id: 'multidisciplinar',
    title: 'Equipo Multidisciplinar',
    description: 'Comunícate con médicos, fisios, celadores y otros profesionales',
    icon: '🏥',
    color: 'from-purple-500 to-violet-500',
    difficulty: 'Avanzado'
  },
  {
    id: 'emergencia',
    title: 'Respuesta a Emergencias',
    description: 'Coordina una respuesta de equipo ante una emergencia',
    icon: '🆘',
    color: 'from-orange-500 to-red-500',
    difficulty: 'Experto'
  },
  {
    id: 'nuevoProtocolo',
    title: 'Nuevo Protocolo',
    description: 'Introduce un nuevo protocolo en la unidad con resistencias',
    icon: '📋',
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'Intermedio'
  }
];

const COLLABORATIVE_STYLES = [
  { id: 'colaborativo', name: 'Colaborativo', icon: '🤝', description: 'Busca soluciones win-win que satisfagan a todos' },
  { id: 'competitivo', name: 'Competitivo', icon: '🏆', description: 'Prioriza sus objetivos sobre los del grupo' },
  { id: 'evitativo', name: 'Evitativo', icon: '🚫', description: 'Evita el conflicto y posterga decisiones' },
  { id: 'acomodativo', name: 'Acomodativo', icon: '🙏', description: 'Cede para mantener la armonía del grupo' },
  { id: 'compromiso', name: 'Compromiso', icon: '🤲', description: 'Busca soluciones intermedias rápidas' },
  { id: 'coordinador', name: 'Coordinador', icon: '📋', description: 'Organiza y distribuye tareas eficientemente' },
  { id: 'liderFacilitador', name: 'Líder Facilitador', icon: '🌟', description: 'Guía al equipo empoderando a los demás' },
  { id: 'miembroPasivo', name: 'Miembro Pasivo', icon: '😶', description: 'Participa poco y sigue instrucciones' }
];

const EMOJIS_BY_SCORE = {
  excellent: ['🌟', '🏆', '👑', '🎯', '💎', '🔥', '⭐', '🥇'],
  good: ['😊', '👍', '💪', '🎉', '✨', '🙌', '👏', '🌈'],
  average: ['👀', '🤔', '💭', '📈', '🎯', '💡', '🔄', '📊'],
  needsWork: ['💪', '📚', '🌱', '🔧', '🎯', '⬆️', '🚀', '💫']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excelente trabajo en equipo!',
    '¡Eres un/a líder colaborativo/a nato/a!',
    '¡Tu capacidad de coordinación es excepcional!',
    '¡El equipo ideal te querría siempre!',
    '¡Dominas el arte del trabajo colectivo!'
  ],
  good: [
    '¡Buen trabajo colaborativo!',
    'Demuestras habilidades sólidas de equipo',
    '¡Vas por muy buen camino!',
    'Tu aporte al equipo es valioso',
    '¡Sigue potenciando tu colaboración!'
  ],
  average: [
    'Hay potencial, pero puedes mejorar',
    'Algunas áreas necesitan más práctica',
    'Estás en el camino correcto',
    'Con práctica serás más efectivo/a',
    'Identificamos oportunidades de mejora'
  ],
  needsWork: [
    'Necesitas desarrollar más estas habilidades',
    'El trabajo en equipo requiere práctica',
    'Hay mucho margen de mejora',
    'Enfócate en las áreas críticas',
    'No te rindas, la práctica hace al maestro'
  ]
};

const getScoreCategory = (score) => {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'needsWork';
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ScenarioSimulator = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateScenario = async (scenarioType) => {
    setIsGeneratingScenario(true);
    setSelectedScenario(scenarioType);
    setMessages([]);
    setScenarioComplete(false);
    setEvaluation(null);
    setExchangeCount(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera un escenario de trabajo en equipo tipo: ${scenarioType.title}`,
          history: [],
          systemPrompt: `Eres un simulador de escenarios de trabajo en equipo para gestoras enfermeras.

TIPO DE ESCENARIO: ${scenarioType.title}
DESCRIPCIÓN: ${scenarioType.description}
DIFICULTAD: ${scenarioType.difficulty}

GENERA un escenario realista y detallado con:
1. CONTEXTO: Describe la unidad, el turno, y los profesionales involucrados (nombres y roles)
2. SITUACIÓN: El problema o desafío específico de trabajo en equipo
3. TENSIÓN: Los intereses contrapuestos o dificultades
4. TU ROL: El papel que asume el usuario (gestora/supervisora)

FORMATO:
- Máximo 150 palabras
- Lenguaje directo y situacional
- Termina con una pregunta directa: "¿Cómo actuarías?"

NO des opciones múltiples. Deja que el usuario responda libremente.
Responde SOLO en español.`
        })
      });

      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([{ 
        role: 'assistant', 
        content: '❌ Error al generar el escenario. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsGeneratingScenario(false);
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

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const shouldEvaluate = newExchangeCount >= 3;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: shouldEvaluate ? 
            `Eres un evaluador experto en trabajo en equipo sanitario.

El usuario ha respondido a un escenario de trabajo en equipo. Es momento de DAR LA EVALUACIÓN FINAL.

ANALIZA su respuesta considerando:
1. COORDINACIÓN: ¿Organiza eficazmente al equipo?
2. COMUNICACIÓN: ¿Se comunica de forma clara y respetuosa?
3. LIDERAZGO: ¿Toma decisiones y guía al equipo?
4. RESOLUCIÓN: ¿Aborda el problema de forma constructiva?
5. COHESIÓN: ¿Fomenta la unión del equipo?

RESPONDE EXACTAMENTE EN ESTE FORMATO JSON (sin markdown ni backticks):
{
  "puntuacion": [número del 0 al 10],
  "estiloDetectado": "[uno de: Colaborativo, Competitivo, Evitativo, Acomodativo, Compromiso, Coordinador, Líder Facilitador, Miembro Pasivo]",
  "estiloAdecuado": [true o false],
  "analisisEstilo": "[Explica por qué el estilo es o no adecuado para esta situación, máximo 2 frases]",
  "fortalezas": ["fortaleza1", "fortaleza2"],
  "areasDeMemora": ["area1", "area2"],
  "feedbackGeneral": "[Feedback constructivo de 2-3 frases]",
  "consejo": "[Un consejo práctico específico]"
}` :
            `Eres un simulador de escenarios de trabajo en equipo para gestoras enfermeras.

Continúa el escenario reaccionando a la respuesta del usuario de forma realista.
- Si la respuesta es buena: Los personajes reaccionan positivamente pero puede surgir un nuevo desafío menor
- Si la respuesta es regular: Los personajes muestran dudas o resistencia parcial
- Si la respuesta es mala: Los personajes reaccionan negativamente y la tensión aumenta

IMPORTANTE:
- Mantén el rol de los personajes del escenario
- Responde en máximo 100 palabras
- Termina con una nueva situación o pregunta para que el usuario siga interactuando
- No evalúes todavía, solo continúa la simulación
- Responde SOLO en español`
        })
      });

      const data = await response.json();
      
      if (shouldEvaluate) {
        try {
          const evalData = JSON.parse(data.response.replace(/```json\n?|\n?```/g, '').trim());
          setEvaluation(evalData);
          setScenarioComplete(true);
          
          addSession({
            type: 'scenario',
            scenarioType: selectedScenario.id,
            scenarioTitle: selectedScenario.title,
            score: evalData.puntuacion,
            styleDetected: evalData.estiloDetectado,
            styleAdequate: evalData.estiloAdecuado
          });
        } catch (parseError) {
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

  const handleNewScenario = () => {
    setSelectedScenario(null);
    setMessages([]);
    setScenarioComplete(false);
    setEvaluation(null);
    setExchangeCount(0);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  if (scenarioComplete && evaluation) {
    const category = getScoreCategory(evaluation.puntuacion);
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

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-teal-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{emoji}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-2">{phrase}</h2>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {evaluation.puntuacion}/10
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      category === 'excellent' ? 'bg-gradient-to-r from-teal-400 to-emerald-400' :
                      category === 'good' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                      category === 'average' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                      'bg-gradient-to-r from-rose-400 to-red-400'
                    }`}
                    style={{ width: `${evaluation.puntuacion * 10}%` }}
                  />
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${
                evaluation.estiloAdecuado 
                  ? 'bg-emerald-500/20 border border-emerald-500/40' 
                  : 'bg-amber-500/20 border border-amber-500/40'
              }`}>
                <span className="text-lg">
                  {COLLABORATIVE_STYLES.find(s => s.name === evaluation.estiloDetectado)?.icon || '🤝'}
                </span>
                <span className={`font-bold ${evaluation.estiloAdecuado ? 'text-emerald-300' : 'text-amber-300'}`}>
                  Estilo: {evaluation.estiloDetectado}
                </span>
                {evaluation.estiloAdecuado ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <p className="text-slate-300 text-sm mb-3">{evaluation.analisisEstilo}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <h4 className="text-emerald-400 font-bold text-xs mb-2 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Fortalezas
                  </h4>
                  <ul className="text-slate-300 text-xs space-y-1">
                    {evaluation.fortalezas?.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <h4 className="text-amber-400 font-bold text-xs mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> A Mejorar
                  </h4>
                  <ul className="text-slate-300 text-xs space-y-1">
                    {evaluation.areasDeMemora?.map((a, i) => (
                      <li key={i}>• {a}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-3 text-left max-h-28 overflow-y-auto">
                <p className="text-slate-200 text-sm mb-2">{evaluation.feedbackGeneral}</p>
                <p className="text-teal-300 text-xs">💡 {evaluation.consejo}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleNewScenario}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Nuevo Escenario
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

  if (!selectedScenario) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative">
        <FloatingParticles />
        <GlowingOrb color="#14b8a6" size="300px" left="5%" top="20%" delay="0s" />
        <GlowingOrb color="#10b981" size="200px" left="80%" top="60%" delay="2s" />
        
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
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
              Simulador de Escenarios
            </h1>
            <p className="text-slate-400">Selecciona un tipo de situación para practicar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIO_TYPES.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => generateScenario(scenario)}
                className={`bg-gradient-to-br ${scenario.color} p-[2px] rounded-2xl transition-all hover:scale-[1.02] group`}
              >
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 h-full">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{scenario.icon}</div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition-colors">
                        {scenario.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">{scenario.description}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        scenario.difficulty === 'Experto' ? 'bg-red-500/20 text-red-300' :
                        scenario.difficulty === 'Avanzado' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-green-500/20 text-green-300'
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
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-teal-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-teal-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleNewScenario} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 bg-gradient-to-br ${selectedScenario.color} rounded-xl flex items-center justify-center shadow-lg`}>
            <span className="text-xl">{selectedScenario.icon}</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">{selectedScenario.title}</h1>
            <p className="text-xs text-teal-300">Interacción {exchangeCount}/3</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-700/50 px-3 py-1 rounded-full">
            <span className={`text-xs font-medium ${
              selectedScenario.difficulty === 'Experto' ? 'text-red-300' :
              selectedScenario.difficulty === 'Avanzado' ? 'text-amber-300' :
              'text-green-300'
            }`}>
              {selectedScenario.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isGeneratingScenario ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-teal-400 mx-auto mb-4" />
              <p className="text-teal-300">Generando escenario...</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className={`w-8 h-8 bg-gradient-to-br ${selectedScenario.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-100'
              }`}>
                <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
              </div>
              {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 bg-gradient-to-br ${selectedScenario.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-teal-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Procesando respuesta...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-teal-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe cómo actuarías..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            disabled={isLoading || isGeneratingScenario}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isGeneratingScenario}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-teal-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {exchangeCount >= 2 && !scenarioComplete && (
          <p className="text-center text-xs text-amber-300 mt-2">
            ⚡ Próxima respuesta = Evaluación final
          </p>
        )}
      </div>
    </div>
  );
};

const StyleDetection = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [styleResult, setStyleResult] = useState(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef(null);
  const { addSession } = useTeamworkProfileContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startAnalysis = async () => {
    setIsStarted(true);
    setIsLoading(true);
    setExchangeCount(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Inicia el análisis de mi estilo colaborativo',
          history: [],
          systemPrompt: `Eres un experto en dinámicas de equipo y estilos de colaboración.

Tu objetivo es DETECTAR el estilo colaborativo del usuario mediante preguntas situacionales.

ESTILOS A DETECTAR:
1. Colaborativo: Busca soluciones win-win
2. Competitivo: Prioriza sus objetivos
3. Evitativo: Evita el conflicto
4. Acomodativo: Cede para mantener armonía
5. Compromiso: Busca soluciones intermedias
6. Coordinador: Organiza y distribuye tareas
7. Líder Facilitador: Guía empoderando
8. Miembro Pasivo: Sigue instrucciones

COMIENZA presentándote brevemente (1 frase) y luego plantea UNA situación de trabajo en equipo sanitario.

FORMATO de la situación:
- Contexto breve y realista
- Un dilema o decisión de equipo
- Pregunta directa: "¿Qué harías tú?"

Máximo 80 palabras total. No des opciones múltiples.`
        })
      });

      const data = await response.json();
      setMessages([{ role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([{ 
        role: 'assistant', 
        content: '❌ Error al iniciar. Por favor, intenta de nuevo.' 
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

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const shouldAnalyze = newExchangeCount >= 4;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: shouldAnalyze ?
            `Eres un experto en estilos colaborativos. Has observado las respuestas del usuario a varias situaciones.

ANALIZA su estilo y responde EN FORMATO JSON (sin markdown ni backticks):
{
  "estiloPrincipal": "[Colaborativo/Competitivo/Evitativo/Acomodativo/Compromiso/Coordinador/Líder Facilitador/Miembro Pasivo]",
  "estiloSecundario": "[otro estilo que también muestra]",
  "puntuacion": [0-10 según efectividad del estilo],
  "caracteristicas": ["característica1", "característica2", "característica3"],
  "fortalezas": ["fortaleza1", "fortaleza2"],
  "riesgos": ["riesgo1", "riesgo2"],
  "situacionesIdeales": "[En qué situaciones este estilo funciona mejor]",
  "situacionesEvitar": "[En qué situaciones debería adaptar su estilo]",
  "consejo": "[Consejo personalizado de 2 frases]"
}` :
            `Eres un experto en estilos colaborativos analizando al usuario.

Has recibido la respuesta del usuario. Ahora:
1. Comenta BREVEMENTE su respuesta (1 frase neutral, sin juzgar)
2. Plantea UNA NUEVA situación diferente de trabajo en equipo

La nueva situación debe explorar otro aspecto del trabajo en equipo:
- Si antes era sobre conflicto, ahora sobre coordinación
- Si antes era sobre liderazgo, ahora sobre seguimiento
- Varía los contextos: urgencias, reuniones, turnos, etc.

Máximo 80 palabras. Termina con "¿Qué harías?"`
        })
      });

      const data = await response.json();
      
      if (shouldAnalyze) {
        try {
          const result = JSON.parse(data.response.replace(/```json\n?|\n?```/g, '').trim());
          setStyleResult(result);
          setAnalysisComplete(true);
          
          addSession({
            type: 'styleDetection',
            score: result.puntuacion,
            styleDetected: result.estiloPrincipal
          });
        } catch (parseError) {
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

  const handleRestart = () => {
    setMessages([]);
    setIsStarted(false);
    setAnalysisComplete(false);
    setStyleResult(null);
    setExchangeCount(0);
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  if (analysisComplete && styleResult) {
    const category = getScoreCategory(styleResult.puntuacion);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    const phrase = getRandomElement(PHRASES_BY_SCORE[category]);
    const styleInfo = COLLABORATIVE_STYLES.find(s => s.name === styleResult.estiloPrincipal) || COLLABORATIVE_STYLES[0];

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

            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-5 md:p-6 text-center border-2 border-emerald-500/30 shadow-2xl">
              <div className="text-5xl mb-2">{styleInfo.icon}</div>
              <h2 className="text-lg md:text-xl font-black text-white mb-1">Tu Estilo: {styleResult.estiloPrincipal}</h2>
              <p className="text-slate-400 text-sm mb-3">{styleInfo.description}</p>
              
              <div className="bg-slate-700/50 rounded-2xl p-3 my-3">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">
                  {styleResult.puntuacion}/10
                </div>
                <p className="text-slate-300 text-xs">Efectividad del estilo</p>
              </div>

              {styleResult.estiloSecundario && (
                <p className="text-slate-400 text-sm mb-3">
                  También muestras rasgos de: <span className="text-emerald-300 font-medium">{styleResult.estiloSecundario}</span>
                </p>
              )}

              <div className="grid grid-cols-1 gap-3 mb-3 text-left">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                  <h4 className="text-emerald-400 font-bold text-xs mb-2">✅ Fortalezas</h4>
                  <ul className="text-slate-300 text-xs space-y-1">
                    {styleResult.fortalezas?.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <h4 className="text-amber-400 font-bold text-xs mb-2">⚠️ Riesgos</h4>
                  <ul className="text-slate-300 text-xs space-y-1">
                    {styleResult.riesgos?.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-3 text-left max-h-32 overflow-y-auto">
                <p className="text-emerald-300 text-xs mb-2">
                  <strong>👍 Ideal para:</strong> {styleResult.situacionesIdeales}
                </p>
                <p className="text-amber-300 text-xs mb-2">
                  <strong>👎 Cuidado en:</strong> {styleResult.situacionesEvitar}
                </p>
                <p className="text-slate-200 text-xs">
                  💡 {styleResult.consejo}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 p-4 z-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Repetir Análisis
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

  if (!isStarted) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative flex items-center justify-center">
        <FloatingParticles />
        <GlowingOrb color="#10b981" size="300px" left="10%" top="30%" delay="0s" />
        <GlowingOrb color="#059669" size="200px" left="75%" top="50%" delay="1.5s" />
        
        <div className="max-w-lg mx-auto relative z-10 text-center">
          <button
            onClick={onBack}
            className="absolute left-0 top-0 flex items-center gap-2 text-slate-200 hover:text-white transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="mt-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
              Detección de Estilo Colaborativo
            </h1>
            <p className="text-slate-400 mb-6">
              Responde a 4 situaciones y descubre cuál es tu estilo de participación en equipos
            </p>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {COLLABORATIVE_STYLES.slice(0, 8).map((style) => (
                <div key={style.id} className="bg-slate-800/50 rounded-xl p-2 text-center">
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <p className="text-[10px] text-slate-400">{style.name}</p>
                </div>
              ))}
            </div>

            <button
              onClick={startAnalysis}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105 flex items-center justify-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Comenzar Análisis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/10 to-slate-900 z-50 flex flex-col">
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={handleRestart} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">🔍</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Detección de Estilo</h1>
            <p className="text-xs text-emerald-300">Situación {exchangeCount}/4</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`w-3 h-3 rounded-full ${
              n <= exchangeCount ? 'bg-emerald-400' : 'bg-slate-600'
            }`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && <PlayerAvatarIcon size="sm" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{exchangeCount >= 3 ? 'Analizando tu estilo...' : 'Preparando situación...'}</span>
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
            placeholder="Describe cómo actuarías..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {exchangeCount >= 3 && !analysisComplete && (
          <p className="text-center text-xs text-amber-300 mt-2">
            ⚡ Próxima respuesta = Análisis final de tu estilo
          </p>
        )}
      </div>
    </div>
  );
};

const ModeCard = ({ mode, onClick }) => (
  <button
    onClick={onClick}
    className={`relative bg-gradient-to-br ${mode.color} p-[2px] rounded-2xl transition-all duration-300 hover:scale-[1.02] group w-full`}
  >
    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {mode.isNew && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
          NUEVO
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl transform group-hover:scale-110 transition-transform">
            {mode.icon}
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
              {mode.title}
            </h3>
            <p className="text-slate-400 text-sm">{mode.description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mode.features.map((feature, idx) => (
            <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  </button>
);

const TeamworkModule = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState(null);
  const profileData = useTeamworkProfile();

  const renderActiveMode = () => {
    switch (activeMode) {
      case 'scenarios':
        return (
          <TeamworkProfileContext.Provider value={profileData}>
            <ScenarioSimulator onBack={() => setActiveMode(null)} />
          </TeamworkProfileContext.Provider>
        );
      case 'styleDetection':
        return (
          <TeamworkProfileContext.Provider value={profileData}>
            <StyleDetection onBack={() => setActiveMode(null)} />
          </TeamworkProfileContext.Provider>
        );
      default:
        return null;
    }
  };

  if (activeMode) {
    return renderActiveMode();
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-teal-950/20 to-slate-950 overflow-auto">
      <FloatingParticles />
      <GlowingOrb color="#14b8a6" size="400px" left="-10%" top="20%" delay="0s" />
      <GlowingOrb color="#10b981" size="300px" left="80%" top="60%" delay="2s" />
      
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Hub</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl mb-4 shadow-2xl shadow-teal-500/30">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Trabajo en <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Equipo</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Desarrolla habilidades de colaboración y coordinación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {TEAMWORK_MODES.map((mode) => (
              <ModeCard
                key={mode.id}
                mode={mode}
                onClick={() => setActiveMode(mode.id)}
              />
            ))}
          </div>

          {profileData.profile && profileData.profile.totalSessions > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-teal-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Tu Progreso
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-black text-teal-400">{profileData.profile.totalSessions}</div>
                  <div className="text-xs text-slate-400">Sesiones</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">{profileData.profile.averageScore?.toFixed(1) || '0'}</div>
                  <div className="text-xs text-slate-400">Puntuación media</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-green-400">
                    {profileData.getDominantStyles()[0]?.style || '-'}
                  </div>
                  <div className="text-xs text-slate-400">Estilo dominante</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamworkModule;
