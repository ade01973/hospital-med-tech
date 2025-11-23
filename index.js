import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  Activity, 
  BookOpen, 
  ChevronRight, 
  Lock, 
  MapPin, 
  Star, 
  User, 
  Users, 
  Trophy, 
  HeartPulse, 
  Brain, 
  Syringe, 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  DoorClosed,
  DoorOpen,
  Zap,
  Play,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
// Configuración extraída del archivo proporcionado
const firebaseConfig = {
  apiKey: "AIzaSyA6q0wMT-f751LgiDoyaXKkmiRWme7OHiQ",
  authDomain: "gestion-de-enfermeria-cfb69.firebaseapp.com",
  projectId: "gestion-de-enfermeria-cfb69",
  storageBucket: "gestion-de-enfermeria-cfb69.firebasestorage.app",
  messagingSenderId: "948557859012",
  appId: "1:948557859012:web:7e285c33636a6368cee191",
  measurementId: "G-94J7Y88VL5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'gestion-enfermeria-v1';

// --- DATOS DEL JUEGO (TEMARIO) ---
const NURSING_RANKS = [
  { title: "Estudiante", minScore: 0, color: "from-slate-500 to-slate-600", icon: "🎓" },
  { title: "Enfermera", minScore: 500, color: "from-emerald-500 to-teal-600", icon: "💉" },
  { title: "Referente", minScore: 1500, color: "from-cyan-500 to-blue-600", icon: "🌟" },
  { title: "Supervisora", minScore: 2500, color: "from-blue-600 to-indigo-600", icon: "📋" },
  { title: "Adjunta", minScore: 4000, color: "from-indigo-600 to-purple-600", icon: "📊" },
  { title: "Directora", minScore: 6000, color: "from-purple-600 to-fuchsia-600", icon: "👑" },
  { title: "Gerente", minScore: 8000, color: "from-fuchsia-600 to-rose-600", icon: "🏥" },
  { title: "Líder Global", minScore: 10000, color: "from-amber-400 to-orange-600", icon: "🌍" }
];

const TOPICS = [
  {
    id: 1,
    title: "Liderazgo y Estilos",
    subtitle: "Fundamentos de Influencia",
    icon: User,
    questions: [
      { q: "¿Qué estilo de liderazgo se caracteriza por la toma de decisiones unilateral sin consultar al equipo?", options: ["Democrático", "Autoritario (Autocrático)", "Laissez-faire", "Transformacional"], correct: 1 },
      { q: "¿Cuál es la principal diferencia entre un jefe y un líder?", options: ["El jefe inspira, el líder manda", "El jefe tiene autoridad formal, el líder influye", "No hay diferencia", "El líder siempre cobra más"], correct: 1 },
      { q: "El liderazgo 'Laissez-faire' se caracteriza por:", options: ["Control absoluto", "Alta participación", "Ausencia de dirección y control", "Motivación constante"], correct: 2 },
      { q: "¿Qué estilo de liderazgo es más adecuado en una situación de parada cardiorrespiratoria?", options: ["Participativo", "Autoritario", "Laissez-faire", "Coaching"], correct: 1 },
      { q: "El líder transformacional busca:", options: ["Mantener el status quo", "Intercambiar premios por trabajo", "Inspirar y motivar el cambio", "Evitar conflictos a toda costa"], correct: 2 }
    ]
  },
  {
    id: 2,
    title: "La Gestora Enfermera",
    subtitle: "Competencias Clave",
    icon: Stethoscope,
    questions: [
      { q: "¿Cuál NO es una función básica del proceso administrativo enfermero?", options: ["Planificar", "Diagnosticar clínicamente", "Organizar", "Evaluar/Controlar"], correct: 1 },
      { q: "La Supervisora de Unidad es un cargo de gestión:", options: ["Alta Dirección", "Gestión Intermedia (Mesogestión)", "Gestión Clínica (Microgestión)", "Gestión Política"], correct: 2 },
      { q: "¿Qué competencia es esencial para una gestora enfermera?", options: ["Saber canalizar vías centrales", "Inteligencia Emocional y Comunicación", "Memorizar el vademécum", "Ser la más antigua de la planta"], correct: 1 },
      { q: "La Dirección de Enfermería se encarga de:", options: ["La gestión estratégica de los cuidados del hospital", "Repartir la medicación", "Limpiar los quirófanos", "Atender las urgencias leves"], correct: 0 },
      { q: "¿Qué responsabilidad tiene la gestora respecto a los recursos materiales?", options: ["Usar los más caros siempre", "Eficiencia y uso racional", "No es su responsabilidad", "Esconderlos para que no falten"], correct: 1 }
    ]
  },
  {
    id: 3,
    title: "Trabajo en Equipo",
    subtitle: "Sinergia y Roles",
    icon: Users,
    questions: [
      { q: "¿Cuál es la diferencia clave entre un grupo y un equipo?", options: ["El número de personas", "El equipo tiene un objetivo común y sinergia", "El grupo trabaja en el mismo turno", "No hay diferencia"], correct: 1 },
      { q: "¿Qué es la sinergia en un equipo de enfermería?", options: ["Llevarse bien", "Que el resultado del equipo es superior a la suma de las partes (1+1=3)", "Trabajar rápido", "Evitar hablar durante el turno"], correct: 1 },
      { q: "Según Belbin, ¿qué son los roles de equipo?", options: ["Los cargos del contrato", "Patrones de comportamiento que adoptan los miembros", "Las tareas asignadas por la supervisora", "La antigüedad en el puesto"], correct: 1 },
      { q: "Un elemento barrera para el trabajo en equipo es:", options: ["La comunicación asertiva", "La confianza mutua", "La falta de claridad en los objetivos", "La diversidad de habilidades"], correct: 2 },
      { q: "Para fomentar el trabajo en equipo es vital:", options: ["Competir entre compañeros", "Criticar los errores públicamente", "Comunicación abierta y respeto", "Aislarse para concentrarse"], correct: 2 }
    ]
  },
  {
    id: 4,
    title: "Toma de Decisiones",
    subtitle: "Resolución de Problemas",
    icon: Brain,
    questions: [
      { q: "¿Cuál es el primer paso en el proceso de toma de decisiones?", options: ["Evaluar alternativas", "Identificar y definir el problema", "Implementar la solución", "Consultar con el gerente"], correct: 1 },
      { q: "En la matriz de Eisenhower, una tarea 'Importante pero NO Urgente' se debe:", options: ["Hacer ya", "Planificar", "Delegar", "Eliminar"], correct: 1 },
      { q: "¿Qué es el coste de oportunidad?", options: ["El dinero que cuesta decidir", "El valor de la mejor opción no seleccionada", "El tiempo perdido pensando", "El coste del material gastado"], correct: 1 },
      { q: "La toma de decisiones basada en la evidencia implica:", options: ["Hacer lo que siempre se ha hecho", "Usar la mejor investigación científica disponible", "Decidir por intuición", "Preguntar al paciente qué quiere"], correct: 1 },
      { q: "Ante una situación crítica y urgente, la toma de decisiones suele ser:", options: ["Consensuada y lenta", "Rápida y directiva", "Pospuesta", "Aleatoria"], correct: 1 }
    ]
  },
  {
    id: 5,
    title: "Gestión del Conflicto",
    subtitle: "Negociación y Mediación",
    icon: Activity,
    questions: [
      { q: "¿Es el conflicto siempre negativo en una organización?", options: ["Sí, siempre rompe el equipo", "No, puede ser una oportunidad de mejora y cambio", "Solo si hay gritos", "Sí, debe evitarse a toda costa"], correct: 1 },
      { q: "El estilo de afrontamiento 'Evitación' consiste en:", options: ["Buscar una solución media", "Ignorar el conflicto esperando que desaparezca", "Imponer mi criterio", "Cooperar al máximo"], correct: 1 },
      { q: "¿Qué es la negociación 'Ganar-Ganar'?", options: ["Yo gano, tú pierdes", "Ambas partes ceden para obtener beneficio mutuo", "El jefe decide quién gana", "Se lanza una moneda"], correct: 1 },
      { q: "En la mediación de conflictos:", options: ["El mediador decide la solución", "Un tercero neutral ayuda a las partes a encontrar solución", "Se sanciona al culpable", "Se ignora el problema"], correct: 1 },
      { q: "¿Cuál es una causa común de conflicto en enfermería?", options: ["Exceso de personal", "Ambigüedad de roles y falta de recursos", "Demasiado tiempo libre", "Salarios excesivamente altos"], correct: 1 }
    ]
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 6,
    title: `Módulo ${i + 6}`,
    subtitle: "Contenido Avanzado",
    icon: BookOpen,
    questions: Array(5).fill({
      q: "¿Pregunta pendiente de definir por el docente?",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: 0
    })
  }))
];

// --- COMPONENTES ---

const AuthScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      // Intento robusto de autenticación
      try {
        // Primero intentamos anónimo directo
        await signInAnonymously(auth);
      } catch (anonError) {
        console.warn("Fallo en login anónimo, intentando custom token si existe...", anonError);
        // Si falla y tenemos un token personalizado
        if (typeof window !== 'undefined' && window.__initial_auth_token) {
           await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
           throw anonError;
        }
      }
      
      if (auth.currentUser) {
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', auth.currentUser.uid);
        await setDoc(userRef, {
          displayName: name,
          uid: auth.currentUser.uid,
          lastActive: serverTimestamp(),
          totalScore: 0
        }, { merge: true });
      }
      
      onLogin();
    } catch (error) {
      console.error("Error auth completo:", error);
      // Mensajes de error amigables
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        alert("⚠️ ERROR DE CONFIGURACIÓN FIREBASE:\n\nEl acceso 'Anónimo' no está habilitado en tu consola de Firebase.");
      } else if (error.code === 'auth/api-key-not-valid') {
        alert("⚠️ ERROR DE CLAVE API:\n\nLa API Key no es válida.");
      } else {
        alert("Error al conectar: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 transform rotate-6 hover:rotate-12 transition-all duration-500">
          <HeartPulse className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">NURSE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">MANAGER</span></h1>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-widest font-bold">Simulador de Gestión Sanitaria</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduce tu ID de Agente..."
              className="relative w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-center font-bold tracking-wide"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {loading ? 'Iniciando Sistema...' : <>Entrar al Sistema <ChevronRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ user, userData, setView, setLevel }) => {
  const currentRank = NURSING_RANKS.slice().reverse().find(r => (userData?.totalScore || 0) >= r.minScore) || NURSING_RANKS[0];
  const nextRank = NURSING_RANKS.find(r => r.minScore > (userData?.totalScore || 0));
  
  const progressPercent = nextRank 
    ? (((userData?.totalScore || 0) - currentRank.minScore) / (nextRank.minScore - currentRank.minScore)) * 100 
    : 100;

  const scrollRef = useRef(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
      {/* Top Bar - Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentRank.color} flex items-center justify-center text-lg shadow-lg`}>
              {currentRank.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rango Actual</span>
              <span className="text-sm font-black text-white">{currentRank.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Experiencia</span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-black leading-none">{userData?.totalScore || 0}</span>
              </div>
            </div>
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-white/10 transition-colors"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
            </button>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content - Vertical "Battle Pass" Timeline */}
      <div className="pt-24 pb-24 px-4 max-w-xl mx-auto relative" ref={scrollRef}>
        
        {/* Central Line */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 bg-slate-800 transform sm:-translate-x-1/2"></div>

        <div className="space-y-12">
          {TOPICS.map((topic, index) => {
            const isUnlocked = index === 0 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
            const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
            const isCurrent = isUnlocked && !isCompleted;

            return (
              <div key={topic.id} className={`relative flex items-center sm:justify-center ${isCurrent ? 'z-10' : 'z-0'}`}>
                
                {/* Connector Dot on Line */}
                <div className={`absolute left-8 sm:left-1/2 w-4 h-4 rounded-full border-4 transform -translate-x-1/2 
                  ${isCompleted ? 'bg-emerald-500 border-emerald-900' : 
                    isCurrent ? 'bg-cyan-400 border-cyan-900 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 
                    'bg-slate-800 border-slate-950'}`}
                ></div>

                {/* Card Container */}
                <div className={`w-full pl-16 sm:pl-0 flex ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} sm:items-center sm:gap-12 sm:w-full`}>
                  
                  {/* Spacer for alignment */}
                  <div className="hidden sm:block sm:w-1/2"></div>

                  {/* The Card */}
                  <button
                    disabled={!isUnlocked || isCompleted}
                    onClick={() => {
                       setLevel(topic);
                       setView('game');
                    }}
                    className={`relative w-full sm:w-[calc(50%-3rem)] group text-left transition-all duration-300`}
                  >
                    {/* Glowing Backdrop for Current Level */}
                    {isCurrent && (
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                    )}

                    <div className={`relative rounded-2xl p-5 border transition-all duration-300
                      ${isCompleted 
                        ? 'bg-slate-900/50 border-emerald-500/30 hover:bg-slate-800/50' 
                        : isCurrent 
                          ? 'bg-slate-900 border-cyan-500 shadow-xl' 
                          : 'bg-slate-900/30 border-slate-800 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-slate-800/50 hover:border-slate-600 cursor-not-allowed'
                      }
                    `}>
                    
                      {/* Level Number Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border
                          ${isCompleted 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : isCurrent 
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>
                          Nivel {String(topic.id).padStart(2, '0')}
                         </span>
                        
                        {/* Status Icon */}
                        {isCompleted ? <ShieldCheck className="text-emerald-400 w-5 h-5" /> : 
                         isCurrent ? <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div> : 
                         <Lock className="text-slate-600 w-4 h-4" />}
                      </div>

                      <h3 className={`text-lg font-bold mb-1 leading-tight ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 font-medium">{topic.subtitle}</p>

                      {/* Action Button / Indicator */}
                      <div className="flex items-center justify-between mt-2">
                        <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                          <topic.icon size={18} className={isUnlocked ? 'text-cyan-400' : 'text-slate-600'} />
                        </div>
                        
                        {isCurrent && (
                           <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider animate-pulse">
                            Jugar <ChevronRight size={14} strokeWidth={3} />
                          </div>
                        )}
                         {isCompleted && (
                           <span className="text-emerald-500 text-xs font-bold uppercase">Completado</span>
                        )}
                      </div>
                   </div>
                  </button>

                </div>
              </div>
            );
          })}
          
          {/* End of Line */}
          <div className="flex flex-col items-center justify-center pt-8 pb-8 opacity-50">
            <div className="w-1 h-12 bg-gradient-to-b from-slate-800 to-transparent"></div>
            <p className="text-xs text-slate-600 uppercase tracking-[0.2em] font-bold mt-4">Más niveles pronto</p>
          </div>

        </div>
      </div>
    </div>
  );
};

const GameLevel = ({ topic, user, onExit, onComplete }) => {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const floors = [...topic.questions];
  const handleDoorClick = (floorIndex) => {
    if (floorIndex === currentFloor) {
      setIsDoorOpening(true);
      setTimeout(() => {
        setIsDoorOpening(false);
        setShowModal(true);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 600);
    }
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const correct = topic.questions[currentFloor].correct === optionIndex;
    setIsCorrect(correct);
    if (correct) {
      const pointsEarned = 100;
      setScore(prev => prev + pointsEarned);
      setTimeout(() => {
        setShowModal(false);
        const nextFloor = currentFloor + 1;
        
        if (nextFloor === floors.length) {
          setCompleted(true);
          setTimeout(() => onComplete(topic.id, score + pointsEarned), 500);
        } else {
          setCurrentFloor(nextFloor);
        }
       }, 1500);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative z-10">
          <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-bounce">
            <Trophy className="w-12 h-12 text-white" fill="white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">¡MISIÓN CUMPLIDA!</h2>
          <p className="text-slate-400 mb-8 font-medium">Módulo: {topic.title}</p>
          
          <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-white/5">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Puntuación Total</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              +{score}
             </p>
          </div>
          
          <button onClick={onExit} className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg">
            VOLVER AL MAPA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* HUD Superior */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center z-50 border-b border-white/10 sticky top-0">
        <button onClick={onExit} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16}/> <span className="hidden sm:inline">Abandonar</span>
        </button>
        <div className="flex flex-col items-center">
           <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Planta</span>
          <span className="text-cyan-400 font-black text-xl tracking-widest">0{currentFloor + 1} / 05</span>
        </div>
        <div className="bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg">
          <Zap size={16} className="text-yellow-400 fill-yellow-400" /> {score}
        </div>
      </div>

      {/* Escenario Vertical (Hospital Tower) */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
        <div className="max-w-md mx-auto min-h-full flex flex-col-reverse justify-start py-20 px-6 gap-12 pb-32">
          
          {floors.map((q, index) => {
            const isCurrent = index === currentFloor;
            const isCompleted = index < currentFloor;
            const isLocked = index > currentFloor;
            return (
              <div 
                key={index} 
                className={`relative transition-all duration-700 ${isCurrent ? 'scale-105 z-10' : 'opacity-40 scale-95 grayscale blur-[1px]'}`}
              >
                {/* Estructura de la Planta */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 relative shadow-2xl">
                  
                  {/* Etiqueta de Piso */}
                  <div className="absolute -left-4 top-8 bg-slate-950 text-slate-500 px-3 py-2 text-xs font-black rounded-r border-y border-r border-slate-800 shadow-md tracking-widest writing-vertical-lr transform -rotate-180">
                     PISO 0{index + 1}
                  </div>

                  {/* Interior de la Planta */}
                  <div className="bg-gradient-to-b from-slate-800 to-slate-900 h-40 rounded-xl flex items-end justify-center relative overflow-hidden border border-white/5">
                     
                    {/* Decoración de fondo */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* La Puerta */}
                    <button 
                      onClick={() => handleDoorClick(index)}
                      disabled={!isCurrent}
                      className={`relative mb-0 transition-all duration-500 group ${
                        isCurrent ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {/* Marco de puerta */}
                      <div className={`w-32 h-32 transition-colors duration-500
                         ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-950'} 
                        border-4 ${isCurrent ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-slate-700'} 
                        rounded-t-xl flex items-end justify-center relative overflow-hidden`}
                      >
                        
                         {/* Puertas físicas */}
                        <div className={`absolute inset-0 flex transition-transform duration-700 ease-in-out ${isDoorOpening || isCompleted ? 'scale-x-0 opacity-0' : 'scale-x-100'}`}>
                          <div className="w-1/2 h-full bg-slate-800 border-r border-black flex items-center justify-end pr-2 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]">
                            {isLocked && <Lock size={12} className="text-slate-600" />}
                           </div>
                          <div className="w-1/2 h-full bg-slate-800 border-l border-slate-700 flex items-center pl-2 bg-[linear-gradient(-45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]">
                            {isCurrent && !isDoorOpening && <div className="w-12 h-1 bg-red-500 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2"></div>}
                           </div>
                        </div>

                        {/* Interior de la puerta */}
                        <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/5">
                            {isCompleted ? <CheckCircle className="text-emerald-500 w-12 h-12" /> : 
                            isCurrent ? <Play className="text-cyan-400 w-12 h-12 animate-pulse fill-cyan-400/20" /> : null}
                        </div>
                      </div>
                    </button>

                    {/* Personaje (Avatar) */}
                    {isCurrent && (
                      <div className="absolute bottom-0 right-6 animate-bounce duration-1000 z-20">
                         <div className="bg-cyan-500 p-2 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                            <User className="text-white w-6 h-6" />
                         </div>
                      </div>
                    )}
                  </div>
                 </div>
              </div>
            );
          })}
          
          {/* Suelo base */}
          <div className="text-center text-slate-700 font-black text-xs mt-4 uppercase tracking-[0.5em]">Lobby Principal</div>
        </div>
      </div>

      {/* Modal Pregunta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-cyan-500/30 w-full max-w-lg rounded-2xl p-0 shadow-[0_0_50px_rgba(34,211,238,0.1)] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-slate-950 p-4 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
               <span className="text-cyan-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2 font-bold">
                  <Activity size={14} className="animate-pulse"/> Protocolo de Respuesta
               </span>
               <span className="text-slate-500 font-mono text-xs">SEC-{currentFloor + 1}</span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-8 leading-snug">
                 {topic.questions[currentFloor].q}
              </h3>

              <div className="space-y-3">
                {topic.questions[currentFloor].options.map((opt, idx) => (
                  <button
                     key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-bold relative overflow-hidden group ${
                      selectedOption === null 
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-cyan-400 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : selectedOption === idx
                          ? isCorrect 
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400'
                            : 'bg-red-950/50 border-red-500 text-red-400'
                          : idx === topic.questions[currentFloor].correct 
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-600' 
                            : 'opacity-20 border-transparent text-slate-600'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-black ${
                         selectedOption === idx ? 'border-current' : 'border-slate-600 text-slate-500 group-hover:border-cyan-400 group-hover:text-cyan-400'
                       }`}>
                         {String.fromCharCode(65 + idx)}
                       </div>
                        {opt}
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedOption !== null && (
                <div className={`mt-6 p-4 rounded-lg text-center font-black text-sm tracking-widest uppercase animate-in slide-in-from-bottom-2 ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                  {isCorrect ? ">> ACCESO CONCEDIDO <<" : ">> ERROR CRÍTICO <<"}
                  {!isCorrect && (
                     <button 
                        onClick={() => {
                            setSelectedOption(null);
                            setIsCorrect(null);
                         }}
                        className="block mx-auto mt-3 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white underline"
                    >
                        Reiniciar Simulación
                     </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Leaderboard = ({ onBack }) => {
  const [leaders, setLeaders] = useState([]);
  useEffect(() => {
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'profiles');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => users.push(doc.data()));
      users.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      setLeaders(users);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-white">
      <div className="max-w-2xl mx-auto mt-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 font-bold transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16}/> Volver al Mapa
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tighter">TOP PLAYERS</h2>
           <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">Ranking Global de Gestión</p>
        </div>

        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden backdrop-blur-md">
          <div className="overflow-y-auto max-h-[600px]">
            {leaders.length === 0 ? (
              <div className="p-12 text-center text-slate-600 font-mono text-sm">Cargando base de datos...</div>
             ) : (
              leaders.map((l, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-6 border-b border-slate-800/50 transition-all ${
                     idx === 0 ? 'bg-yellow-500/10 border-yellow-500/20' : 
                    idx === 1 ? 'bg-slate-400/10 border-slate-400/20' : 
                    idx === 2 ? 'bg-orange-500/10 border-orange-500/20' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 flex items-center justify-center font-black rounded-xl text-xl transform ${
                      idx === 0 ? 'bg-yellow-500 text-slate-950 rotate-3 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 
                      idx === 1 ? 'bg-slate-400 text-slate-950 -rotate-3' : 
                      idx === 2 ? 'bg-orange-500 text-slate-950 rotate-1' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                       <p className="font-black text-white text-lg tracking-tight">{l.displayName}</p>
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${idx < 3 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                         <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                           {NURSING_RANKS.slice().reverse().find(r => (l.totalScore || 0) >= r.minScore)?.title || "Novato"}
                         </p>
                      </div>
                    </div>
                  </div>
                   <div className="text-right">
                    <span className="block font-black text-cyan-400 text-2xl leading-none">{l.totalScore || 0}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
         </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('auth'); 
  const [currentLevel, setCurrentLevel] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setView('dashboard');
      else setView('auth');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'progress');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
      else setDoc(docRef, { totalScore: 0, completedLevels: {} });
    });
    return () => unsubscribe();
  }, [user]);

  const handleLevelComplete = async (levelId, pointsEarned) => {
    if (!user) return;
    if (userData?.completedLevels?.[levelId]) return;
    const userProgressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'data', 'progress');
    const publicProfileRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', auth.currentUser.uid);
    try {
      await setDoc(userProgressRef, {
        completedLevels: { [levelId]: true },
        totalScore: increment(pointsEarned),
        lastPlayed: serverTimestamp()
      }, { merge: true });
      await setDoc(publicProfileRef, {
        totalScore: increment(pointsEarned),
        lastActive: serverTimestamp()
      }, { merge: true });
      setView('dashboard');
    } catch (e) {
      console.error("Error saving progress:", e);
    }
  };

  if (!user) return <AuthScreen onLogin={() => {}} />;

  if (view === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        userData={userData} 
        setView={setView} 
        setLevel={setCurrentLevel} 
      />
    );
  }

  if (view === 'game' && currentLevel) {
    return (
      <GameLevel 
        topic={currentLevel} 
        user={user} 
        onExit={() => setView('dashboard')}
        onComplete={handleLevelComplete}
      />
    );
  }

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('dashboard')} />;
  }

  return <div className="flex items-center justify-center h-screen bg-slate-950 text-cyan-500 font-black animate-pulse tracking-widest uppercase text-sm">Inicializando Sistema...</div>;
}