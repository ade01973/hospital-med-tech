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
  User, 
  Users, 
  Trophy, 
  HeartPulse, 
  Brain, 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Zap,
  Play,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Building2,
  Ambulance,
  Cross
} from 'lucide-react';

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

const NURSING_RANKS = [
  { title: "Estudiante", minScore: 0, color: "from-gray-400 to-gray-500", icon: "🎓" },
  { title: "Enfermera", minScore: 500, color: "from-green-500 to-emerald-600", icon: "💉" },
  { title: "Referente", minScore: 1500, color: "from-blue-500 to-blue-600", icon: "🌟" },
  { title: "Supervisora", minScore: 2500, color: "from-indigo-500 to-indigo-600", icon: "📋" },
  { title: "Adjunta", minScore: 4000, color: "from-purple-500 to-purple-600", icon: "📊" },
  { title: "Directora", minScore: 6000, color: "from-pink-500 to-rose-600", icon: "👑" },
  { title: "Gerente", minScore: 8000, color: "from-red-500 to-red-600", icon: "🏥" },
  { title: "Líder Global", minScore: 10000, color: "from-amber-500 to-orange-600", icon: "🌍" }
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

const AuthScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      try {
        await signInAnonymously(auth);
      } catch (anonError) {
        console.warn("Fallo en login anónimo, intentando custom token si existe...", anonError);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.9)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.9)_2px,transparent_2px)] bg-[size:100px_100px] opacity-30"></div>
      
      <div className="absolute top-10 right-10 text-red-500 animate-pulse">
        <Cross className="w-16 h-16" fill="currentColor" />
      </div>
      
      <div className="absolute bottom-10 left-10 text-blue-400 opacity-40">
        <Building2 className="w-24 h-24" />
      </div>

      <div className="bg-white border-4 border-gray-300 rounded-lg shadow-2xl p-10 max-w-md w-full text-center relative z-10">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
          <HeartPulse className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black text-gray-800 mb-2">HOSPITAL</h1>
        <h2 className="text-3xl font-black text-green-600 mb-4">SIMULADOR</h2>
        <p className="text-gray-600 mb-8 text-sm font-semibold uppercase tracking-widest">Sistema de Capacitación</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center font-semibold"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white hover:bg-green-700 font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wide text-sm border-2 border-green-700"
          >
            {loading ? 'Accediendo...' : <>Ingresar al Hospital <ChevronRight className="w-5 h-5" /></>}
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

  const currentFloor = TOPICS.findIndex(t => {
    const isUnlocked = t.id === 1 || (userData?.completedLevels && userData.completedLevels[t.id - 1]);
    const isCompleted = userData?.completedLevels && userData.completedLevels[t.id];
    return isUnlocked && !isCompleted;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-blue-50 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40"></div>
      
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-green-600 shadow-lg px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <Cross className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold uppercase">Hospital General</span>
              <span className="text-sm font-black text-gray-800">{currentRank.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-green-600 font-bold uppercase">Puntos</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-gray-800">{userData?.totalScore || 0}</span>
              </div>
            </div>
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-10 h-10 rounded-lg bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center border-2 border-yellow-600 transition-colors shadow-md"
            >
              <Trophy className="w-5 h-5 text-yellow-900" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-4 max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 mb-2">ASCENSOR DEL HOSPITAL</h2>
          <p className="text-gray-600 font-semibold">Selecciona una planta para comenzar</p>
        </div>

        <div className="flex gap-8 justify-center items-start flex-wrap lg:flex-nowrap">
          <div className="bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 rounded-3xl p-8 shadow-2xl border-8 border-gray-300 relative min-w-[320px]">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 px-6 py-2 rounded-full border-4 border-white shadow-lg">
              <span className="text-white font-black text-sm">ASCENSOR</span>
            </div>
            
            <div className="bg-black rounded-xl p-4 mb-6 border-4 border-gray-600">
              <div className="text-center">
                <div className="text-6xl font-black text-green-400 font-mono mb-2">
                  {currentFloor >= 0 ? currentFloor + 1 : '—'}
                </div>
                <div className="text-green-400 text-xs font-bold uppercase tracking-widest">
                  {currentFloor >= 0 ? TOPICS[currentFloor].title : 'Planta Baja'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {TOPICS.slice(0, 19).map((topic, index) => {
                const isUnlocked = index === 0 || (userData?.completedLevels && userData.completedLevels[topic.id - 1]);
                const isCompleted = userData?.completedLevels && userData.completedLevels[topic.id];
                const isCurrent = currentFloor === index;

                return (
                  <button
                    key={topic.id}
                    disabled={!isUnlocked || isCompleted}
                    onClick={() => {
                      setLevel(topic);
                      setView('game');
                    }}
                    className={`h-16 rounded-lg font-black text-lg transition-all relative overflow-hidden ${
                      isCompleted 
                        ? 'bg-green-500 text-white border-2 border-green-700 cursor-default' 
                        : isCurrent 
                          ? 'bg-yellow-400 text-gray-900 border-4 border-yellow-600 shadow-lg shadow-yellow-400/50 animate-pulse' 
                          : isUnlocked
                            ? 'bg-white text-gray-800 border-2 border-gray-400 hover:bg-gray-100 hover:scale-105 cursor-pointer'
                            : 'bg-gray-600 text-gray-400 border-2 border-gray-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {!isCompleted && (isUnlocked ? topic.id : <Lock className="mx-auto" size={20} />)}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-500 transition-colors border-2 border-gray-700">
                <ChevronDown size={20} /> BAJAR
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors border-2 border-blue-800">
                <ChevronUp size={20} /> SUBIR
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-gray-300 min-w-[300px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-lg">Planta Actual</h3>
                <p className="text-sm text-gray-600 font-semibold">
                  {currentFloor >= 0 ? `Piso ${currentFloor + 1}` : 'Planta Baja'}
                </p>
              </div>
            </div>

            {currentFloor >= 0 ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white">
                  <div className="flex items-center gap-3 mb-2">
                    {React.createElement(TOPICS[currentFloor].icon, { className: "w-6 h-6" })}
                    <h4 className="font-black text-lg">{TOPICS[currentFloor].title}</h4>
                  </div>
                  <p className="text-sm opacity-90 font-medium">{TOPICS[currentFloor].subtitle}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-600 uppercase">Progreso</span>
                    <span className="text-xs font-bold text-green-600">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {nextRank && (
                    <p className="text-xs text-gray-600 mt-2 font-semibold">
                      Siguiente rango: <span className="font-black text-gray-800">{nextRank.title}</span> ({nextRank.minScore} pts)
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setLevel(TOPICS[currentFloor]);
                    setView('game');
                  }}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-green-800"
                >
                  ¡COMENZAR EVALUACIÓN!
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Todas las plantas completadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameLevel = ({ topic, user, onExit, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showDoors, setShowDoors] = useState(true);

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const correct = topic.questions[currentQ].correct === optionIndex;
    setIsCorrect(correct);
    if (correct) {
      const pointsEarned = 100;
      setScore(prev => prev + pointsEarned);
      setTimeout(() => {
        const next = currentQ + 1;
        if (next === topic.questions.length) {
          onComplete(topic.id, score + pointsEarned);
        } else {
          setShowDoors(true);
          setTimeout(() => {
            setShowDoors(false);
            setCurrentQ(next);
            setSelectedOption(null);
            setIsCorrect(null);
          }, 800);
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-green-600 shadow-lg px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={onExit} className="text-gray-600 hover:text-gray-800 flex items-center gap-2 font-bold transition-colors">
            <ArrowLeft size={20}/> <span>Salir</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 uppercase">Sala</span>
            <span className="text-2xl font-black text-green-600">{currentQ + 1} / {topic.questions.length}</span>
          </div>
          <div className="bg-yellow-400 border-2 border-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-black flex items-center gap-2 shadow-md">
            <Zap size={18} className="text-yellow-900 fill-yellow-900" /> {score}
          </div>
        </div>
      </div>

      <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto relative">
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-gray-300 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 border-b-4 border-green-800">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg">
                <topic.icon className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-1">{topic.title}</h2>
                <p className="text-green-100 font-semibold">{topic.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
                {topic.questions[currentQ].q}
              </h3>
            </div>

            <div className="grid gap-4">
              {topic.questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`text-left p-5 rounded-xl border-2 transition-all font-semibold relative overflow-hidden ${
                    selectedOption === null 
                      ? 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-green-500 hover:shadow-lg'
                      : selectedOption === idx
                        ? isCorrect 
                          ? 'bg-green-100 border-green-600 text-green-800'
                          : 'bg-red-100 border-red-600 text-red-800'
                        : idx === topic.questions[currentQ].correct 
                          ? 'bg-green-50 border-green-400 text-green-700' 
                          : 'opacity-40 border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg font-black ${
                      selectedOption === idx 
                        ? isCorrect 
                          ? 'border-green-600 bg-green-600 text-white' 
                          : 'border-red-600 bg-red-600 text-white'
                        : 'border-gray-400 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1">{opt}</span>
                    {selectedOption === idx && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {selectedOption === idx && !isCorrect && <AlertCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              ))}
            </div>
            
            {selectedOption !== null && (
              <div className={`mt-6 p-5 rounded-xl text-center font-black text-lg border-2 ${
                isCorrect 
                  ? 'bg-green-100 text-green-800 border-green-600' 
                  : 'bg-red-100 text-red-800 border-red-600'
              }`}>
                {isCorrect ? "✓ RESPUESTA CORRECTA - +100 pts" : "✗ RESPUESTA INCORRECTA - Intenta de nuevo"}
                {!isCorrect && (
                  <button 
                    onClick={() => {
                      setSelectedOption(null);
                      setIsCorrect(null);
                    }}
                    className="block mx-auto mt-3 text-sm uppercase text-red-700 hover:text-red-900 underline font-bold"
                  >
                    Intentar nuevamente
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDoors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex gap-2 mb-4">
              <div className="w-32 h-64 bg-gray-700 border-4 border-gray-800 rounded-lg animate-slide-left"></div>
              <div className="w-32 h-64 bg-gray-700 border-4 border-gray-800 rounded-lg animate-slide-right"></div>
            </div>
            <p className="text-white font-black text-2xl">Pasando a la siguiente sala...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-green-50 p-4 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:50px_50px] opacity-40"></div>
      
      <div className="max-w-3xl mx-auto mt-10 relative">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-8 font-bold transition-colors">
          <ArrowLeft size={20}/> Volver al Hospital
        </button>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-yellow-400 px-8 py-4 rounded-2xl border-4 border-yellow-600 shadow-xl mb-4">
            <Trophy className="w-10 h-10 text-yellow-900" />
            <h2 className="text-4xl font-black text-gray-900">RANKING</h2>
          </div>
          <p className="text-gray-600 font-bold uppercase tracking-wide">Top Profesionales del Hospital</p>
        </div>

        <div className="bg-white rounded-2xl border-4 border-gray-300 overflow-hidden shadow-2xl">
          {leaders.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-semibold">Cargando datos...</div>
          ) : (
            leaders.map((l, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-6 border-b-2 border-gray-200 transition-all ${
                  idx === 0 ? 'bg-yellow-50' : 
                  idx === 1 ? 'bg-gray-50' : 
                  idx === 2 ? 'bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 flex items-center justify-center font-black rounded-xl text-2xl border-4 ${
                    idx === 0 ? 'bg-yellow-400 text-gray-900 border-yellow-600' : 
                    idx === 1 ? 'bg-gray-300 text-gray-900 border-gray-500' : 
                    idx === 2 ? 'bg-orange-400 text-gray-900 border-orange-600' : 'bg-white text-gray-600 border-gray-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-black text-gray-800 text-xl">{l.displayName}</p>
                    <p className="text-sm text-gray-600 font-semibold">
                      {NURSING_RANKS.slice().reverse().find(r => (l.totalScore || 0) >= r.minScore)?.title || "Novato"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-green-600 text-3xl">{l.totalScore || 0}</span>
                  <span className="text-xs text-gray-500 uppercase font-bold">puntos</span>
                </div>
              </div>
            ))
          )}
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

  return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800 font-black text-xl">Cargando sistema hospitalario...</div>;
}
