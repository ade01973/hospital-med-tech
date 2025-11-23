import React, { useState, useEffect, useRef } from 'react';
import hospitalImage from './assets/hospital-leon.jpg?url';
import elevatorLobby from './assets/elevator-lobby.png?url';
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
    title: "La Gestora Enfermera",
    subtitle: "Competencias Clave",
    icon: Stethoscope,
    questions: [
      { q: "Según González García (2019), ¿cuál es la transición fundamental en el paradigma del rol de la gestora enfermera contemporánea?", options: ["Del cuidado clínico a la administración de recursos", "Del 'controlar y mandar' al 'liderar y desarrollar'", "De la supervisión hospitalaria a la gestión política", "De la atención individual al trabajo multidisciplinar"], correct: 1 },
      { q: "¿Cuál de los siguientes elementos NO forma parte del 'core de competencias' clave de la gestora enfermera según el modelo integral presentado?", options: ["Toma de decisiones basada en datos cuantitativos y cualitativos", "Gestión de relaciones interpersonales y dinámicas de equipos", "Capacidad de realizar intervenciones clínicas complejas", "Liderazgo ético con habilidad para gestionar conflictos"], correct: 2 },
      { q: "En la pirámide de gestión en enfermería, ¿cuál es la característica distintiva de la 'Gestión Logística o Intermedia'?", options: ["Liderazgo operativo directo junto a la cama del paciente", "Implementación de protocolos y traducción de estrategias de alta dirección", "Formulación de políticas sanitarias y dirección institucional", "Supervisión exclusiva de procesos clínicos de enfermería"], correct: 1 },
      { q: "¿Cuál es la diferencia fundamental entre cómo se concebía históricamente la gestión enfermera frente al enfoque holístico contemporáneo?", options: ["La histórica era más tecnológica; la contemporánea es más humanista", "La histórica enfatizaba control y jerarquía; la contemporánea promueve inspiración y empoderamiento", "No hay diferencia significativa, solo cambios de terminología", "La histórica era más eficiente; la contemporánea es más participativa pero menos efectiva"], correct: 1 },
      { q: "¿Cómo se define en el documento el desarrollo de motivaciones en la gestora enfermera como componente de sus competencias?", options: ["A través de sanciones y sistemas de control", "Mediante educación y autoconocimiento para enfocar energía hacia mejora continua del cuidado", "Exclusivamente mediante incentivos económicos", "Por la experiencia práctica únicamente, sin necesidad de formación adicional"], correct: 1 }
    ]
  },
  {
    id: 2,
    title: "El Liderazgo",
    subtitle: "Estilos y Teorías de Liderazgo",
    icon: User,
    questions: [
      { q: "Según el documento, ¿cuál es la diferencia fundamental entre liderazgo y gestión en el contexto de enfermería?", options: ["La gestión se asocia con administración de recursos e implementación de procesos, mientras que el liderazgo abarca influencia positiva, motivación y guía hacia práctica excepcional", "El liderazgo solo se aplica en situaciones de crisis", "La gestión es más importante que el liderazgo", "No hay diferencia entre ambos conceptos"], correct: 0 },
      { q: "¿Cuál es la premisa fundamental de las teorías de rasgos de liderazgo según González García?", options: ["El liderazgo se aprende exclusivamente en la práctica", "Los líderes nacen, no se hacen; los rasgos intrínsecos como inteligencia, determinación e integridad predisponen al liderazgo", "Solo la experiencia determina el liderazgo efectivo", "El liderazgo es imposible de predecir"], correct: 1 },
      { q: "¿Cuál es la diferencia clave entre liderazgo centrado en tareas y liderazgo orientado a relaciones en enfermería?", options: ["El centrado en tareas primordia eficiencia pero puede comprometer satisfacción laboral; el orientado a relaciones construye espíritu de equipo pero podría comprometer efectividad si no se equilibra", "Ambos son idénticos", "El orientado a relaciones es siempre superior", "El centrado en tareas es una forma de liderazgo democrático"], correct: 0 },
      { q: "¿Cuál es el principio central de las teorías situacionales o de contingencia del liderazgo?", options: ["Existe un único estilo de liderazgo efectivo para todas las situaciones", "No hay un único estilo efectivo; el éxito depende de factores situacionales, cualidades del equipo y contexto ambiental, requiriendo flexibilidad y adaptabilidad", "El liderazgo autocrático es siempre correcto", "La edad del líder determina su estilo"], correct: 1 },
      { q: "¿Cuál es la principal característica que distingue al liderazgo transformacional del transaccional?", options: ["El transformacional inspira a exceder límites propios por bien mayor con visión y confianza; el transaccional se basa en intercambio claro (recompensas/castigos) y objetivos a corto plazo", "Ambos son idénticos en resultados", "El transaccional es más efectivo siempre", "El transformacional no utiliza recompensas"], correct: 0 },
      { q: "¿Cuál es la principal desventaja del liderazgo autocrático en la gestión de enfermería según el documento?", options: ["Aumenta demasiado la eficiencia", "Puede inhibir desarrollo profesional al limitar ejercicio de juicio clínico, afectar moral del equipo y satisfacción laboral, aumentando rotación de personal", "Inspira demasiado al equipo", "No existe desventaja alguna"], correct: 1 },
      { q: "En la gestión de enfermería, ¿cuándo es especialmente valioso el liderazgo democrático según González García?", options: ["Solo en emergencias médicas", "Por su capacidad de fomentar ambiente donde se valora conocimiento de cada enfermera, involucrar activamente en decisiones, aumentar satisfacción y generar soluciones creativas mejorando calidad del cuidado", "Nunca es valioso", "Solo con personal nuevo"], correct: 1 },
      { q: "¿Cuál es el principal riesgo de aplicar liderazgo Laissez-Faire inadecuadamente en enfermería?", options: ["Aumentar demasiada supervision", "La falta de guía y estructura puede llevar a confusión, inconsistencias en atención al paciente, tareas descuidadas y requiere que líder sea atento para intervenir cuando sea necesario", "Incrementar la eficiencia", "Nada, siempre es beneficioso"], correct: 1 },
      { q: "¿Cómo evalúa el liderazgo situacional la necesidad de dirección y apoyo en un equipo de enfermería?", options: ["Solo por la edad de los miembros", "Evaluando competencia y motivación de miembros del equipo para determinar cantidad de conducta directiva (decir qué hacer) vs conducta de apoyo (escuchar y facilitar)", "Sin evaluar nada", "Solo por antigüedad laboral"], correct: 1 },
      { q: "¿Cuál es el criterio principal para adaptar el estilo de liderazgo a diferentes contextos según el documento?", options: ["Siempre usar liderazgo autocrático", "En emergencias usar enfoque autocrático para decisiones rápidas y seguridad; en cambios procedimentales usar democrático o transformacional para involucrar y motivar al equipo según necesidad situacional", "Nunca cambiar de estilo", "El género del líder determina el estilo"], correct: 1 }
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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${elevatorLobby})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-blue-950/80 to-slate-900/85"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
      
      <div className="absolute top-10 right-10 text-cyan-400 animate-pulse">
        <Cross className="w-16 h-16 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" fill="currentColor" />
      </div>
      
      <div className="absolute bottom-10 left-10 text-blue-400/20">
        <Building2 className="w-32 h-32" />
      </div>

      <div className="bg-slate-900/40 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.2)] p-10 max-w-md w-full text-center relative z-10">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
        
        <div className="relative">
          <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
            <HeartPulse className="w-14 h-14 text-white relative z-10 drop-shadow-lg" strokeWidth={2.5} />
          </div>
          
          <div className="mb-8">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-2 tracking-tight">MED-TECH</h1>
            <h2 className="text-2xl font-black text-emerald-400 mb-3 tracking-wider">HOSPITAL</h2>
            <p className="text-cyan-300/70 text-xs font-bold uppercase tracking-[0.3em]">Sistema de Capacitación Avanzada</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ID de Personal Médico..."
                className="relative w-full px-6 py-4 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl text-white placeholder-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-center font-semibold shadow-inner"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="relative w-full group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm group-hover:blur transition-all"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all transform group-hover:-translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-wider text-sm border border-cyan-400/50">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>VERIFICANDO ACCESO</span>
                  </>
                ) : (
                  <>
                    <span>ACCESO AL SISTEMA</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] px-4 py-3">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Cross className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider">MED-TECH HOSPITAL</span>
              <span className="text-sm font-black text-cyan-400">{currentRank.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider">Puntuación</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{userData?.totalScore || 0}</span>
                <span className="text-xs text-cyan-400/60 font-bold">PTS</span>
              </div>
            </div>
            <button 
              onClick={() => setView('leaderboard')} 
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 flex items-center justify-center border border-yellow-500/50 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transform hover:scale-105"
            >
              <Trophy className="w-5 h-5 text-yellow-950" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-10 px-4 max-w-5xl mx-auto relative">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-3 tracking-tight">ASCENSOR DIGITAL</h2>
          <p className="text-cyan-300/60 font-semibold text-sm uppercase tracking-widest">Sistema de navegación vertical</p>
        </div>

        <div className="flex gap-8 justify-center items-start flex-wrap lg:flex-nowrap">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 pt-10 shadow-[0_0_60px_rgba(6,182,212,0.15)] border border-cyan-500/20 relative min-w-[340px]">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
            
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-full border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] z-20">
              <span className="text-white font-black text-xs uppercase tracking-wider">Panel de Control</span>
            </div>
            
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-cyan-500/30 shadow-[inset_0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              <div className="text-center relative z-10">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-cyan-600 font-mono mb-2 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                  {currentFloor >= 0 ? String(currentFloor + 1).padStart(2, '0') : '--'}
                </div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                  {currentFloor >= 0 ? TOPICS[currentFloor].title : 'Nivel Base'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
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
                    className={`h-16 rounded-xl font-black text-lg transition-all relative overflow-hidden group ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border border-emerald-400/50 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                        : isCurrent 
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-2 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse scale-105' 
                          : isUnlocked
                            ? 'bg-slate-800/50 backdrop-blur-sm text-cyan-400 border border-cyan-500/30 hover:bg-slate-700/50 hover:border-cyan-400 hover:scale-105 cursor-pointer hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-800/30 text-slate-600 border border-slate-700/30 cursor-not-allowed opacity-40'
                    }`}
                  >
                    {isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-white drop-shadow-lg" />
                      </div>
                    )}
                    {!isCompleted && (isUnlocked ? (
                      <span className="relative z-10">{topic.id}</span>
                    ) : (
                      <Lock className="mx-auto" size={20} />
                    ))}
                    {isUnlocked && !isCompleted && (
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 relative z-10">
              <button className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-slate-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-300 transition-all">
                <ChevronDown size={20} /> BAJAR
              </button>
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-400/50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <ChevronUp size={20} /> SUBIR
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.15)] border border-cyan-500/20 min-w-[320px] relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-500/20 relative z-10">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-cyan-400 text-lg">Nivel Actual</h3>
                <p className="text-sm text-cyan-300/60 font-semibold uppercase tracking-wider">
                  {currentFloor >= 0 ? `Piso ${String(currentFloor + 1).padStart(2, '0')}` : 'Nivel Base'}
                </p>
              </div>
            </div>

            {currentFloor >= 0 ? (
              <div className="space-y-4 relative z-10">
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm p-5 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    {React.createElement(TOPICS[currentFloor].icon, { className: "w-7 h-7 text-cyan-400" })}
                    <h4 className="font-black text-white text-lg">{TOPICS[currentFloor].title}</h4>
                  </div>
                  <p className="text-sm text-cyan-300/70 font-medium">{TOPICS[currentFloor].subtitle}</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">Progreso Carrera</span>
                    <span className="text-xs font-black text-cyan-400">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-slate-900/80 rounded-full h-3 overflow-hidden border border-slate-700/50 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {nextRank && (
                    <p className="text-xs text-cyan-300/60 mt-3 font-semibold">
                      Próximo rango: <span className="font-black text-cyan-400">{nextRank.title}</span> 
                      <span className="text-cyan-500/70"> ({nextRank.minScore} pts)</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setLevel(TOPICS[currentFloor]);
                    setView('game');
                  }}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm group-hover:blur transition-all"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all transform group-hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wider text-sm border border-cyan-400/50">
                    <Play className="w-5 h-5" fill="currentColor" />
                    <span>INICIAR EVALUACIÓN</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50">
                  <AlertCircle className="w-10 h-10 text-slate-600" />
                </div>
                <p className="text-cyan-300/60 font-semibold">Todos los niveles completados</p>
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

  useEffect(() => {
    if (showDoors) {
      const timer = setTimeout(() => {
        setShowDoors(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showDoors]);

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
            setCurrentQ(next);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowDoors(false);
          }, 1000);
        }
      }, 1500);
    }
  };

  return (
    <div 
      className="min-h-screen font-sans relative overflow-hidden"
      style={{
        backgroundImage: `url(${hospitalImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-blue-950/60 to-slate-900/70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-800/40 via-slate-800/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800/40 via-slate-800/20 to-transparent"></div>
        
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-800/30 via-slate-900/10 to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-800/30 via-slate-900/10 to-transparent"></div>
        
        <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        <div className="absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"></div>
        
        <div className="absolute top-1/4 left-16 w-40 h-1 bg-gradient-to-r from-cyan-400/0 via-cyan-500/30 to-cyan-400/0 rounded-full blur-md"></div>
        <div className="absolute top-1/3 right-16 w-40 h-1 bg-gradient-to-r from-blue-400/0 via-blue-500/25 to-blue-400/0 rounded-full blur-md"></div>
        
        <div className="absolute top-16 left-1/4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)] animate-pulse"></div>
        <div className="absolute top-24 right-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-cyan-500/50 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        
        <div className="absolute bottom-28 left-1/4 w-24 h-0.5 bg-gradient-to-r from-slate-700/30 via-slate-600/40 to-slate-700/30 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-0.5 bg-gradient-to-r from-slate-700/30 via-slate-600/40 to-slate-700/30 rounded-full"></div>
      </div>
      
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-cyan-500 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-500 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] px-4 py-3">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={onExit} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 font-bold transition-colors">
            <ArrowLeft size={20}/> <span>Salir</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-wider">Pregunta</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{currentQ + 1} / {topic.questions.length}</span>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 border border-yellow-500/50 text-yellow-950 px-4 py-2 rounded-xl font-black flex items-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            <Zap size={18} className="fill-current" /> {score}
          </div>
        </div>
      </div>

      <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto relative">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] border border-cyan-500/20 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm p-6 border-b border-cyan-500/30 relative">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                {React.createElement(topic.icon, { className: "w-8 h-8 text-white" })}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white mb-1">{topic.title}</h2>
                <p className="text-cyan-300/70 font-semibold">{topic.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-cyan-500/10 backdrop-blur-sm border-l-4 border-cyan-400 p-6 rounded-2xl mb-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
              <h3 className="text-xl font-bold text-white leading-relaxed">
                {topic.questions[currentQ].q}
              </h3>
            </div>

            <div className="grid gap-4">
              {topic.questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`text-left p-5 rounded-2xl border transition-all font-semibold relative overflow-hidden group ${
                    selectedOption === null 
                      ? 'bg-slate-800/50 backdrop-blur-sm border-cyan-500/30 text-white hover:bg-slate-700/50 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : selectedOption === idx
                        ? isCorrect 
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'bg-red-500/20 border-red-400 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                        : idx === topic.questions[currentQ].correct 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400/70' 
                          : 'opacity-30 border-slate-700/30 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-black ${
                      selectedOption === idx 
                        ? isCorrect 
                          ? 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                          : 'border-red-400 bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'border-cyan-500/40 text-cyan-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1">{opt}</span>
                    {selectedOption === idx && isCorrect && <CheckCircle className="w-6 h-6 text-emerald-400" />}
                    {selectedOption === idx && !isCorrect && <AlertCircle className="w-6 h-6 text-red-400" />}
                  </div>
                  {selectedOption === null && (
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  )}
                </button>
              ))}
            </div>
            
            {selectedOption !== null && (
              <div className={`mt-6 p-6 rounded-2xl text-center font-black border backdrop-blur-sm ${
                isCorrect 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                  : 'bg-red-500/20 text-red-300 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
              }`}>
                <div className="text-lg mb-4">{isCorrect ? "✓ RESPUESTA CORRECTA +100 PTS" : "✗ RESPUESTA INCORRECTA"}</div>
                {!isCorrect && (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-red-300/80">La respuesta correcta es la opción marcada arriba.</p>
                    <button 
                      onClick={() => {
                        setShowDoors(true);
                        setTimeout(() => {
                          const next = currentQ + 1;
                          if (next === topic.questions.length) {
                            onComplete(topic.id, score);
                          } else {
                            setCurrentQ(next);
                            setSelectedOption(null);
                            setIsCorrect(null);
                            setShowDoors(false);
                          }
                        }, 1000);
                      }}
                      className="mx-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all transform hover:scale-105 uppercase tracking-wider text-sm border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    >
                      ➜ Pasar a la siguiente habitación
                    </button>
                  </div>
                )}
                {isCorrect && (
                  <div className="mt-4">
                    <p className="text-sm text-emerald-300/80">Avanzando a la siguiente pregunta...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDoors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl animate-fade-in">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-12">
              <p className="text-cyan-300/40 text-sm uppercase tracking-[0.2em] font-bold mb-2">Hospital Digital</p>
              <p className="text-cyan-300 font-black text-2xl uppercase tracking-wider">Accediendo a Sala...</p>
            </div>

            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/30 to-transparent blur-2xl rounded-full w-96 h-80"></div>
              
              <div className="relative">
                <div className="w-72 h-80 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-3xl border-8 border-slate-300 shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-blue-400/10"></div>
                  
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  </div>
                  
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-cyan-400/0 rounded-full blur-md"></div>
                  
                  <div className="h-full w-full flex items-center justify-center relative">
                    <div className="text-4xl text-slate-400 font-black">⌬</div>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent rounded-full"></div>
                </div>

                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-slate-400 to-slate-300 rounded-lg shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-lg"></div>
                </div>

                <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-gradient-to-r from-slate-300 to-slate-400 rounded-lg shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-lg"></div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-door-open">
                <div className="absolute left-0 w-36 h-80 bg-gradient-to-r from-slate-100 to-transparent rounded-r-3xl shadow-xl"></div>
                <div className="absolute right-0 w-36 h-80 bg-gradient-to-l from-slate-100 to-transparent rounded-l-3xl shadow-xl"></div>
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
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
