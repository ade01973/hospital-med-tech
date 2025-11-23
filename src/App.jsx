import React, { useState, useEffect, useRef } from 'react';
import hospitalImage from './assets/hospital-leon.jpg?url';
import hospitalUniversidad from './assets/hospital-leon.jpg?url';
import elevatorLobby from './assets/elevator-lobby.png?url';
import elevatorBg from './assets/elevator-bg.jpg?url';
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
  getDoc,
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
  Cross,
  LogOut
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
      { q: "¿Cómo se define en el documento el desarrollo de motivaciones en la gestora enfermera como componente de sus competencias?", options: ["A través de sanciones y sistemas de control", "Mediante educación y autoconocimiento para enfocar energía hacia mejora continua del cuidado", "Exclusivamente mediante incentivos económicos", "Por la experiencia práctica únicamente, sin necesidad de formación adicional"], correct: 1 },
      { q: "Según González García, ¿cuál es el nivel base de la pirámide de gestión en enfermería y cuál es su función principal?", options: ["Alta dirección, formulación de políticas sanitarias", "Gestión logística, traducción de estrategias", "Gestión operativa, liderazgo directo junto a la cama del paciente y atención inmediata", "Supervisión técnica, manejo exclusivo de equipos médicos"], correct: 2 },
      { q: "¿Qué rol cumple la gestora enfermera según el documento en la influencia sobre la percepción y satisfacción del paciente?", options: ["No tiene influencia directa en la satisfacción", "Solo influye en aspectos administrativos", "Su gestión participativa y enfoque en la evaluación no solo mejora equipos sino que influye en la percepción del paciente y diseño de políticas sanitarias", "La satisfacción solo depende del personal médico"], correct: 2 },
      { q: "¿Cuáles son los tres componentes integrados en el 'core de competencias' de la gestora enfermera según el documento?", options: ["Experiencia, título académico y antigüedad", "Conocimientos, habilidades y motivaciones intrínsecas", "Solo tecnología y recursos materiales", "Únicamente la comunicación escrita"], correct: 1 },
      { q: "Según el documento, ¿cuál es el propósito principal de la 'Alta Dirección' en la pirámide de gestión de enfermería?", options: ["Supervisar tareas operativas del día a día", "Dirigir procedimientos clínicos específicos", "Liderar a nivel institucional, planificar estrategias y establecer decisiones a largo plazo", "Atender directamente a los pacientes"], correct: 2 },
      { q: "¿Cuál es el enfoque fundamental de la gestora enfermera según González García para crear ambientes de trabajo seguros?", options: ["Implementar sanciones disciplinarias", "Promover planificación y organización de servicios, trabajo en equipo y participación activa, con evaluación continua de servicios", "Garantizar máximo control centralizado", "Reducir el personal de enfermería"], correct: 1 }
    ]
  },
  {
    id: 2,
    title: "El Liderazgo",
    subtitle: "Estilos y Teorías de Liderazgo",
    icon: User,
    questions: [
      { q: "Según González García, ¿cuál es la diferencia fundamental entre liderazgo y gestión en el contexto de la enfermería contemporánea?", options: ["La gestión se asocia con 'controlar y mandar' mientras que el liderazgo implica 'liderar y desarrollar'", "No existe diferencia significativa entre ambos términos", "El liderazgo es una forma de gestión administrativa", "La gestión enfatiza la influencia positiva y motivación"], correct: 0 },
      { q: "¿Cuál es la premisa central de las teorías de rasgos de liderazgo y cuál es su limitación principal según el documento?", options: ["Los líderes poseen rasgos innatos (inteligencia, integridad, determinación) que los predisponen, pero esta teoría no explica cómo líderes con diferentes rasgos pueden ser efectivos", "Los rasgos se adquieren exclusivamente a través de la experiencia práctica", "Todos los líderes poseen exactamente los mismos rasgos", "La teoría de rasgos es la más efectiva para predecir liderazgo en todas las situaciones"], correct: 0 },
      { q: "¿Cuáles son los dos estilos prominentes dentro de las teorías conductuales y cuál es el riesgo de aplicar uno de forma demasiado rígida?", options: ["Autocrático y democrático; el riesgo es perder productividad", "Centrado en tareas y orientado a relaciones; el riesgo es crear ambiente impersonal o comprometer cumplimiento de objetivos si se desbalancea", "Transformacional y transaccional; no existen riesgos", "Situacional y delegativo; ambos son igualmente seguros"], correct: 1 },
      { q: "¿Cuál es el principio fundamental de las teorías situacionales o de contingencia y por qué son críticas en enfermería?", options: ["Existe un único estilo de liderazgo universal efectivo para todas las situaciones hospitalarias", "No hay un único estilo efectivo; el éxito depende de factores situacionales y contexto ambiental; requieren flexibilidad para adaptar enfoque en emergencias vs procedimientos rutinarios", "El liderazgo situacional elimina la necesidad de adaptabilidad", "Solo aplican en entornos administrativos, no en cuidado directo"], correct: 1 },
      { q: "¿Cuál es la diferencia esencial entre liderazgo transformacional y transaccional en términos de cómo impactan el desempeño del equipo de enfermería?", options: ["El transformacional inspira a exceder expectativas por bien mayor mediante visión compartida; el transaccional se basa en intercambio claro de recompensas/castigos con objetivos a corto plazo", "Son idénticos en su impacto en el equipo", "El transaccional es superior porque utiliza incentivos económicos", "El transformacional solo funciona en equipos pequeños"], correct: 0 },
      { q: "¿Cómo define el documento el liderazgo autocrático y cuándo es apropiado su uso en emergencias sanitarias según González García?", options: ["Es un estilo que centraliza decisiones en el líder con comunicación unidireccional; apropiado en emergencias donde requiere acción rápida y decisiva sin debate amplio", "Es el estilo más humanista y participativo del liderazgo", "Solo debe usarse en situaciones administrativas no clínicas", "No es apropiado en ningún contexto de enfermería moderna"], correct: 0 },
      { q: "¿Por qué el liderazgo democrático es especialmente valioso en la gestión de enfermería y cuál es su potencial riesgo?", options: ["Fomenta ambiente donde se valora el conocimiento de cada enfermera, involucra activamente en decisiones mejorando satisfacción y calidad del cuidado; el riesgo es perder tiempo en decisiones rápidas o con equipos poco preparados", "No tiene valor real en enfermería moderna", "Es el único estilo efectivo en todos los contextos", "Elimina completamente la necesidad de supervisión"], correct: 0 },
      { q: "¿Cuál es la característica distintiva del liderazgo Laissez-Faire y bajo qué condiciones puede fracasar significativamente en un servicio de enfermería?", options: ["Se caracteriza por mínima intervención del líder confiando en autonomía del equipo; fracasa cuando falta guía y estructura, causando confusión, inconsistencias en cuidado del paciente y tareas descuidadas", "Es un estilo que requiere máximo control centralizado", "Solo funciona con personal muy experimentado sin necesidad de intervención del líder jamás", "No tiene ningún riesgo en implementación en enfermería"], correct: 0 },
      { q: "¿Cómo evalúa y adapta el liderazgo situacional el nivel de dirección versus apoyo basándose en las características del equipo?", options: ["Aplica el mismo enfoque a todos los miembros independientemente de sus habilidades", "Evalúa la competencia y motivación de los miembros del equipo para determinar cantidad de conducta directiva (decir qué hacer) versus conducta de apoyo (escuchar y facilitar)", "Solo utiliza conducta directiva en todas las situaciones", "La edad del personal determina automaticamente la conducta aplicable"], correct: 1 },
      { q: "Según González García, ¿cuál es la estrategia recomendada para adaptar el estilo de liderazgo en diferentes contextos sanitarios y qué diferencia existe entre emergencias y cambios de procedimientos?", options: ["Mantener un único estilo invariable en todas las circunstancias", "En emergencias aplicar enfoque autocrático para decisiones rápidas y seguridad; en cambios de procedimientos o iniciativas de mejora usar democrático o transformacional para involucrar equipo y generar apropiación del cambio", "No existe necesidad de adaptar estilos según contexto", "El liderazgo transformacional solo aplica en emergencias críticas"], correct: 1 }
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
        const studentId = name.trim().toLowerCase();
        const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', studentId);
        const userProgressRef = doc(db, 'artifacts', appId, 'users', studentId, 'data', 'progress');
        
        // Verificar si el estudiante ya existe
        const docSnap = await getDoc(userRef);
        
        await setDoc(userRef, {
          displayName: name,
          studentId: studentId,
          uid: auth.currentUser.uid,
          lastActive: serverTimestamp(),
          totalScore: docSnap.exists() ? docSnap.data().totalScore : 0
        }, { merge: true });
        
        // Asegurar que existe el documento de progreso
        const progressSnap = await getDoc(userProgressRef);
        if (!progressSnap.exists()) {
          await setDoc(userProgressRef, {
            totalScore: 0,
            completedLevels: {}
          });
        }
        
        console.log("✓ Login exitoso para:", studentId);
        localStorage.setItem('studentId', studentId);
        setTimeout(() => {
          onLogin();
        }, 100);
      }
    } catch (error) {
      console.error("Error auth completo:", error);
      setLoading(false);
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
        alert("⚠️ ERROR DE CONFIGURACIÓN FIREBASE:\n\nEl acceso 'Anónimo' no está habilitado en tu consola de Firebase.");
      } else if (error.code === 'auth/api-key-not-valid') {
        alert("⚠️ ERROR DE CLAVE API:\n\nLa API Key no es válida.");
      } else {
        alert("Error al conectar: " + error.message);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${hospitalUniversidad})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-950/85 to-slate-900/90"></div>
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
                placeholder="ID de Estudiante..."
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

const WelcomeScreen = ({ onContinue, onLogout }) => {
  const handleLogout = async () => {
    localStorage.removeItem('studentId');
    await auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${elevatorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-950/85 to-slate-900/90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
      
      <button 
        onClick={handleLogout}
        className="absolute top-4 left-4 z-20 text-cyan-400 hover:text-cyan-300 flex items-center gap-2 font-bold transition-colors p-3 rounded-xl hover:bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20"
      >
        <LogOut size={24} />
      </button>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-2 tracking-tight">Bienvenid@</h1>
          <p className="text-5xl font-black text-emerald-400 mb-6">al Hospital Med-Tech</p>
          <p className="text-cyan-300/70 text-lg font-semibold">Comienza tu viaje de aprendizaje en gestión de enfermería</p>
        </div>
        
        <button 
          onClick={onContinue}
          className="relative group overflow-hidden mt-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm group-hover:blur transition-all"></div>
          <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-5 px-12 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all transform group-hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-wider text-lg border border-cyan-400/50">
            <ChevronUp size={24} /> Sube al Aprendizaje
          </div>
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, userData, setView, setLevel, onLogout }) => {
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

  const handleLogout = async () => {
    localStorage.removeItem('studentId');
    await auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div 
      className="min-h-screen font-sans relative overflow-hidden"
      style={{
        backgroundImage: `url(${elevatorBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/60"></div>
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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-wider">Estudiante</span>
              <span className="text-sm font-black text-cyan-300 mb-2">{localStorage.getItem('studentId') || 'Usuario'}</span>
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
            <button 
              onClick={handleLogout}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 flex items-center justify-center border border-red-400/50 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transform hover:scale-105"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-10 px-4 max-w-5xl mx-auto relative">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-2 tracking-tight">Bienvenid@ al Hospital</h2>
          <p className="text-2xl font-black text-emerald-400 mb-3">Med-Tech</p>
          <p className="text-cyan-300/60 font-semibold text-sm uppercase tracking-widest">Sistema de navegación vertical - Ascensor Digital</p>
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

            <button 
              onClick={() => {
                if (currentFloor >= 0) {
                  setLevel(TOPICS[currentFloor]);
                  setView('game');
                }
              }}
              disabled={currentFloor < 0}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-sm group-hover:blur transition-all"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all transform group-hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wider text-sm border border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronUp size={20} /> Sube al Aprendizaje
              </div>
            </button>
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

const GameLevel = ({ topic, user, studentId, onExit, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showDoors, setShowDoors] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const playElevatorSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      
      // First beep
      const osc1 = audioContext.createOscillator();
      osc1.connect(gainNode);
      osc1.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.15);
      
      // Second beep
      const osc2 = audioContext.createOscillator();
      osc2.connect(gainNode);
      osc2.frequency.value = 600;
      osc2.start(audioContext.currentTime + 0.2);
      osc2.stop(audioContext.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio playback not supported or blocked:", e);
    }
  };

  const speakText = (text, rate = 1) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'es-ES';
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (showDoors && isFirstLoad) {
      setIsFirstLoad(false);
      // Elevator sound + floor announcement
      playElevatorSound();
      setTimeout(() => {
        const floorText = `Planta ${currentQ + 1}, ${topic.title}`;
        speakText(floorText);
      }, 400);
    }
  }, [showDoors, isFirstLoad, currentQ, topic.title]);

  useEffect(() => {
    if (showDoors && !isFirstLoad) {
      const timer = setTimeout(() => {
        setShowDoors(false);
        // Speak room number when doors open
        setTimeout(() => {
          speakText(`Habitación ${currentQ + 1}`, 1.2);
        }, 300);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showDoors, isFirstLoad, currentQ]);

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    const correct = topic.questions[currentQ].correct === optionIndex;
    setIsCorrect(correct);
    if (correct) {
      const pointsEarned = 100;
      setScore(prev => prev + pointsEarned);
      console.log("✓ Respuesta CORRECTA, esperando 1500ms antes de avanzar");
      setTimeout(() => {
        const next = currentQ + 1;
        console.log(`Pregunta correcta #${currentQ + 1}/${topic.questions.length}`);
        if (next === topic.questions.length) {
          console.log("✓ ¡PREGUNTA 10 COMPLETADA! Mostrando Misión Cumplida");
          setIsCompleted(true);
        } else {
          console.log(`→ Avanzando a pregunta ${next}`);
          setShowDoors(true);
          setTimeout(() => {
            setCurrentQ(next);
            setSelectedOption(null);
            setIsCorrect(null);
            setShowDoors(false);
          }, 1000);
        }
      }, 1500);
    } else {
      console.log("✗ Respuesta INCORRECTA - Esperando que el usuario haga clic en el botón (NO hay auto-avance)");
    }
  };

  const handleCompletionReturn = () => {
    console.log(`🏠 Guardando progreso - Módulo: ${topic.id}, Puntos totales: ${score}, StudentID: ${studentId}`);
    console.log(`DEBUG: onComplete es ${typeof onComplete}`);
    if (onComplete) {
      onComplete(topic.id, score, studentId);
    } else {
      console.error("❌ ERROR: onComplete no está disponible");
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="fixed inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-20 text-center max-w-2xl">
          <div className="mb-12 animate-bounce">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(250,204,21,0.5)] mb-8">
              <Trophy className="w-16 h-16 text-white" fill="white" />
            </div>
          </div>

          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 mb-3 tracking-tight">
            ¡MISIÓN CUMPLIDA!
          </h1>

          <p className="text-2xl font-black text-emerald-400 mb-2">{topic.title}</p>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl p-12 my-8 shadow-[0_0_60px_rgba(6,182,212,0.2)]">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-cyan-300/60 font-bold text-sm uppercase tracking-wider mb-2">Puntos Obtenidos</p>
                <p className="text-5xl font-black text-yellow-400">{score}</p>
              </div>
              <div className="w-px h-16 bg-cyan-500/30"></div>
              <div className="text-center">
                <p className="text-cyan-300/60 font-bold text-sm uppercase tracking-wider mb-2">Preguntas Respondidas</p>
                <p className="text-5xl font-black text-cyan-400">{topic.questions.length}/10</p>
              </div>
            </div>
          </div>

          <p className="text-cyan-300/70 font-semibold text-lg mb-8">
            ¡Felicidades! Has completado todas las habitaciones del piso "{topic.title}"
          </p>

          <button
            type="button"
            onClick={() => {
              console.log("🎯 Botón 'Volver al Ascensor' presionado");
              handleCompletionReturn();
            }}
            className="relative group overflow-hidden inline-block cursor-pointer px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-wider text-lg border border-cyan-400/50"
          >
            <ChevronUp size={24} /> Volver al Ascensor
          </button>
        </div>
      </div>
    );
  }

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
                    <p className="text-xs text-red-300/60">Haz clic en el botón para continuar a la siguiente pregunta</p>
                    <button 
                      onClick={() => {
                        const next = currentQ + 1;
                        console.log(`Pregunta actual: ${currentQ + 1}, Total preguntas: ${topic.questions.length}, Siguiente: ${next}`);
                        if (next === topic.questions.length) {
                          console.log("🏆 Mostrando pantalla de Misión Cumplida");
                          setIsCompleted(true);
                        } else {
                          console.log("🚪 Mostrando pantalla de ascensor");
                          setShowDoors(true);
                          setTimeout(() => {
                            setCurrentQ(next);
                            setSelectedOption(null);
                            setIsCorrect(null);
                            setShowDoors(false);
                          }, 1000);
                        }
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
  const [isLoading, setIsLoading] = useState(true);
  const [prevUser, setPrevUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? "Usuario logueado" : "Sin usuario");
      
      // Si hubo login (usuario pasó de null a existente)
      if (!prevUser && u) {
        console.log("✓ Nuevo login detectado, ir a bienvenida");
        setView('welcome');
      }
      
      setUser(u);
      setPrevUser(u);
      setIsLoading(false);
      
      if (!u) {
        localStorage.removeItem('studentId');
        setView('auth');
      }
    });
    return () => unsubscribe();
  }, [prevUser]);

  useEffect(() => {
    if (!user) return;
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;
    const docRef = doc(db, 'artifacts', appId, 'users', studentId, 'data', 'progress');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setUserData(docSnap.data());
      else setDoc(docRef, { totalScore: 0, completedLevels: {} });
    });
    return () => unsubscribe();
  }, [user]);

  const handleLevelComplete = async (levelId, pointsEarned, studentId) => {
    console.log(`📊 handleLevelComplete llamado - Módulo ID: ${levelId}, Puntos: ${pointsEarned}, StudentID: ${studentId}`);
    
    // ✅ NAVEGAR INMEDIATAMENTE AL DASHBOARD
    console.log("✅ Navegando a dashboard INMEDIATAMENTE");
    setView('dashboard');
    
    // 🔄 GUARDAR DATOS EN BACKGROUND (sin bloquear)
    if (!user) {
      console.error("❌ No hay usuario");
      return;
    }
    if (userData?.completedLevels?.[levelId]) {
      console.log("⚠️ Módulo ya completado");
      return;
    }
    
    // Si no viene studentId en parámetro, obtener de localStorage
    let finalStudentId = studentId;
    if (!finalStudentId) {
      finalStudentId = localStorage.getItem('studentId');
      console.log(`📌 StudentID obtenido de localStorage: ${finalStudentId}`);
    }
    
    if (!finalStudentId) {
      console.error("❌ No se encontró studentId ni en parámetro ni en localStorage");
      return;
    }
    const userProgressRef = doc(db, 'artifacts', appId, 'users', finalStudentId, 'data', 'progress');
    const publicProfileRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', finalStudentId);
    
    // ✅ MANTENER TODOS LOS NIVELES COMPLETADOS PREVIOS + AGREGAR EL NUEVO
    const newCompletedLevels = {
      ...(userData?.completedLevels || {}),
      [levelId]: true
    };
    
    console.log("📊 Niveles completados:", newCompletedLevels);
    
    // Guardar en background sin esperar
    setDoc(userProgressRef, {
      completedLevels: newCompletedLevels,
      totalScore: increment(pointsEarned),
      lastPlayed: serverTimestamp()
    }, { merge: true }).catch(e => console.error("❌ Error saving user progress:", e));
    
    setDoc(publicProfileRef, {
      totalScore: increment(pointsEarned),
      lastActive: serverTimestamp()
    }, { merge: true }).catch(e => console.error("❌ Error saving public profile:", e));
    
    console.log("💾 Guardando en Firestore en background...");
  };

  if (!user) return <AuthScreen onLogin={() => setView('welcome')} />;

  if (view === 'welcome') {
    return (
      <WelcomeScreen 
        onContinue={() => setView('dashboard')}
        onLogout={() => setView('auth')}
      />
    );
  }

  if (view === 'dashboard') {
    return (
      <Dashboard 
        user={user} 
        userData={userData} 
        setView={setView} 
        setLevel={setCurrentLevel}
        onLogout={() => setView('auth')}
      />
    );
  }

  if (view === 'game' && currentLevel) {
    return (
      <GameLevel 
        topic={currentLevel} 
        user={user} 
        studentId={userData?.studentId}
        onExit={() => setView('dashboard')}
        onComplete={handleLevelComplete}
      />
    );
  }

  if (view === 'leaderboard') {
    return <Leaderboard onBack={() => setView('dashboard')} />;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white font-black text-xl">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Cargando sistema hospitalario...
      </div>
    </div>;
  }

  return <AuthScreen onLogin={() => setView('welcome')} />;
}
