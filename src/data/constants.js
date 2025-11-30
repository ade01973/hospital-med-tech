import {
  Activity,
  BookOpen,
  User,
  Users,
  Brain,
  Stethoscope,
  MessageSquare,
  Zap,
  Target,
  Clock,
  BarChart3,
  Lightbulb,
  Shield,
  TrendingUp,
  Heart,
  ShieldCheck,
  Eye,
} from "lucide-react";

// 🔄 BALANCED XP CURVE (Exponencial suave)
// Cálculo realista: ~500-800 XP por nivel (10 preguntas + misiones)
// 8 TIERS DE ENFERMERÍA CON COLORES CYAN-BLUE GRADIENTS
// - Estudiante → Enfermera: 2000 XP (~3-4 días)
// - Enfermera → Referente: 3000 XP (~5 días)
// - Escala exponencial para rangos más altos (2-3 semanas para máximo)
// - Últimos 3 escalones requieren puntajes muy altos (casi perfecto)
export const NURSING_RANKS = [
  {
    title: "Estudiante",
    minScore: 0,
    color: "from-slate-400 to-slate-500",
    icon: "🎓",
    league: null,
  },
  {
    title: "Enfermera",
    minScore: 2000,
    color: "from-cyan-400 to-blue-500",
    icon: "💉",
    league: "BRONCE",
  },
  {
    title: "Enfermera Referente",
    minScore: 5000,
    color: "from-cyan-500 to-blue-600",
    icon: "🌟",
    league: "BRONCE",
  },
  {
    title: "Jefa de Unidad",
    minScore: 10000,
    color: "from-cyan-600 to-blue-700",
    icon: "📋",
    league: "PLATA",
  },
  {
    title: "Jefa de Area",
    minScore: 18000,
    color: "from-blue-600 to-cyan-700",
    icon: "📊",
    league: "PLATA",
  },
  {
    title: "Subdirectora de Enfermeria",
    minScore: 35000,
    color: "from-blue-700 to-cyan-600",
    icon: "👑",
    league: "ORO",
  },
  {
    title: "Directora de Enfermeria",
    minScore: 65000,
    color: "from-cyan-500 to-blue-800",
    icon: "🏥",
    league: "PLATINO",
  },
  {
    title: "Gerenta",
    minScore: 100000,
    color: "from-blue-900 to-cyan-700",
    icon: "💎",
    league: "LEYENDA",
  },
];

// 🏆 SISTEMA DE LIGAS (5 ligas competitivas)
export const LEAGUE_SYSTEM = {
  BRONCE: {
    name: "🥉 LIGA BRONCE",
    color: "from-amber-700 to-orange-700",
    icon: "🥉",
    ranks: ["Estudiante", "Enfermera", "Enfermera Referente"],
    rewards: {
      first: { xp: 500, badge: "🥇 Campeón Bronce", title: "Campeón Bronce" },
      second: { xp: 300, badge: "🥈", title: "Subcampeón" },
      third: { xp: 150, badge: "🥉", title: "Tercer Puesto" },
    },
  },
  PLATA: {
    name: "🥈 LIGA PLATA",
    color: "from-slate-300 to-slate-500",
    icon: "🥈",
    ranks: ["Jefa de Unidad", "Jefa de Area"],
    rewards: {
      first: { xp: 800, badge: "🥇 Campeón Plata", title: "Campeón Plata" },
      second: { xp: 500, badge: "🥈", title: "Subcampeón" },
      third: { xp: 200, badge: "🥉", title: "Tercer Puesto" },
    },
  },
  ORO: {
    name: "🥇 LIGA ORO",
    color: "from-yellow-500 to-yellow-600",
    icon: "🥇",
    ranks: ["Subdirectora de Enfermeria"],
    rewards: {
      first: { xp: 1200, badge: "🥇 Campeón Oro", title: "Campeón Oro" },
      second: { xp: 700, badge: "🥈", title: "Subcampeón" },
      third: { xp: 300, badge: "🥉", title: "Tercer Puesto" },
    },
  },
  PLATINO: {
    name: "💎 LIGA PLATINO",
    color: "from-cyan-400 to-blue-400",
    icon: "💎",
    ranks: ["Directora de Enfermeria"],
    rewards: {
      first: {
        xp: 1500,
        badge: "🥇 Campeón Platino",
        title: "Campeón Platino",
      },
      second: { xp: 900, badge: "🥈", title: "Subcampeón" },
      third: { xp: 400, badge: "🥉", title: "Tercer Puesto" },
    },
  },
  LEYENDA: {
    name: "⭐ LIGA LEYENDA",
    color: "from-purple-500 to-pink-500",
    icon: "⭐",
    ranks: ["Gerenta"],
    rewards: {
      first: {
        xp: 2000,
        badge: "👑 Leyenda Suprema",
        title: "Leyenda Suprema",
      },
      second: { xp: 1200, badge: "🥈", title: "Leyenda Elite" },
      third: { xp: 600, badge: "🥉", title: "Leyenda" },
    },
  },
};

// 🔥 DAILY STREAK SYSTEM - Milestones y configuración
export const STREAK_MILESTONES = [
  {
    days: 7,
    name: "🔥 Semana Ardiente",
    coinBonus: 100,
    description: "7 días de racha consecutivos"
  },
  {
    days: 30,
    name: "🌟 Maestro del Mes",
    coinBonus: 500,
    description: "30 días de racha consecutivos"
  },
  {
    days: 100,
    name: "👑 Leyenda Viva",
    coinBonus: 2000,
    description: "100 días de racha consecutivos"
  }
];

export const STREAK_CONFIG = {
  FREEZE_COST: 50,
  RESET_HOURS: 24,
  FREEZE_LIMIT_PER_MONTH: 1
};

// 🏆 LEADERBOARD TIERS SYSTEM (FASE 2)
export const LEADERBOARD_TIERS = {
  BRONZE: { name: "🥉 BRONCE", color: "from-amber-700 to-orange-700", minScore: 0, icon: "🥉" },
  SILVER: { name: "🥈 PLATA", color: "from-slate-300 to-slate-500", minScore: 5000, icon: "🥈" },
  GOLD: { name: "🥇 ORO", color: "from-yellow-500 to-yellow-600", minScore: 15000, icon: "🥇" },
  PLATINUM: { name: "💎 PLATINO", color: "from-cyan-400 to-blue-400", minScore: 35000, icon: "💎" },
  DIAMOND: { name: "💠 DIAMANTE", color: "from-purple-500 to-pink-500", minScore: 70000, icon: "💠" }
};

export const LEADERBOARD_CONFIG = {
  TOP_PLAYERS_LIMIT: 50,
  WEEKLY_RESET_DAY: 1, // Monday
  FRIEND_MAX: 20
};

// 👥 TEAM CHALLENGES SYSTEM (FASE 3)
export const TEAM_CONFIG = {
  MIN_TEAM_SIZE: 2,
  MAX_TEAM_SIZE: 4,
  TEAM_HEALTH_POOL: 100,
  QUEST_DIFFICULTIES: {
    EASY: { name: "Fácil", xpMultiplier: 1, coinMultiplier: 1, timeLimit: 120 },
    NORMAL: { name: "Normal", xpMultiplier: 1.5, coinMultiplier: 1.5, timeLimit: 90 },
    HARD: { name: "Difícil", xpMultiplier: 2, coinMultiplier: 2, timeLimit: 60 }
  },
  TEAM_ACHIEVEMENTS: [
    { id: 1, name: "Primer Equipo", description: "Crear tu primer equipo", reward: 50 },
    { id: 2, name: "Dúo Dinámico", description: "Completar 5 quests en duo", reward: 200 },
    { id: 3, name: "Cuádruple Amenaza", description: "Completa un quest con 4 jugadores", reward: 500 },
    { id: 4, name: "Cazador de Bosses", description: "Vencer 10 bosses en equipo", reward: 1000 }
  ]
};

export const BOSS_BATTLES = [
  { id: 1, name: "🧟 Zombi Hospitalario", health: 200, damage: 15, rewards: { xp: 300, coins: 150 } },
  { id: 2, name: "👹 Demonio de Datos", health: 250, damage: 20, rewards: { xp: 400, coins: 200 } },
  { id: 3, name: "🐉 Dragón Administrativo", health: 350, damage: 25, rewards: { xp: 600, coins: 300 } }
];

// 🎮 Ejemplo de nombres ficticios para demo
export const DEMO_PLAYER_NAMES = [
  "Dr. García",
  "Dra. López",
  "Enfermero Martín",
  "Supervisora Alba",
  "Coordinador Pérez",
  "Directora Carmen",
  "Dr. Ruiz",
  "Enfermera Sofia",
  "Gestor Rafael",
  "Coordinadora Teresa",
];

export const TOPICS = [
  {
    id: 1,
    title: "La Gestora Enfermera",
    subtitle: "Niveles de gestión y competencias",
    icon: "👩‍⚕️",
    questions: [
      {
        q: "Según el paradigma moderno presentado, ¿cuál es la principal diferencia en el rol de la gestora enfermera respecto al enfoque histórico?",
        options: [
          "Ha aumentado su poder autoritario",
          "Ha evolucionado de 'controlar y mandar' a 'liderar y desarrollar'",
          "Ha disminuido su responsabilidad",
          "Es exactamente igual que antes",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál de los siguientes NO es un nivel de gestión en enfermería según la estructura organizativa mencionada?",
        options: [
          "Gestión Operativa",
          "Gestión Logística o Intermedia",
          "Alta Dirección",
          "Gestión Ejecutiva Global",
        ],
        correct: 3,
      },
      {
        q: "La Gestión Operativa en enfermería se caracteriza principalmente por:",
        options: [
          "Formular estrategias institucionales",
          "Liderar la atención directa al paciente junto a la cama",
          "Coordinar entre departamentos",
          "Establecer políticas sanitarias",
        ],
        correct: 1,
      },
      {
        q: "¿Qué responsabilidad específica tiene la Gestión Intermedia (Logística) en relación a la Alta Dirección?",
        options: [
          "Reemplazar sus decisiones",
          "Traducir y transmitir las estrategias hacia los niveles operativos",
          "Hacer lo opuesto",
          "No tiene relación directa",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es el aspecto MÁS crítico que diferencia a la gestora enfermera moderna de un simple administrador?",
        options: [
          "La antigüedad en el puesto",
          "La capacidad de inspirar, colaborar y empoderar a través del liderazgo transformacional",
          "El número de tareas que realiza",
          "La capacidad de controlar costos",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el propósito principal de que la gestora enfermera cree 'ambientes de trabajo seguros y saludables'?",
        options: [
          "Aumentar el número de empleados",
          "Promover el trabajo en equipo y mejorar la calidad asistencial",
          "Reducir costos operativos",
          "Cumplir normativa laboral",
        ],
        correct: 1,
      },
      {
        q: "La evaluación continua de los servicios prestados por la gestora enfermera está orientada principalmente a:",
        options: [
          "Garantizar que la atención se alinee con estándares de excelencia",
          "Castigar errores",
          "Documentar fallos",
          "Justificar presupuestos",
        ],
        correct: 0,
      },
      {
        q: "¿Qué aspecto hace que la gestión en enfermería 'trascienda la mera administración de recursos'?",
        options: [
          "El tamaño del presupuesto",
          "La cantidad de personal disponible",
          "La capacidad de influir, motivar y promover excelencia mediante liderazgo ético",
          "El uso de tecnología avanzada",
        ],
        correct: 2,
      },
      {
        q: "Según González García (2019), ¿cuáles son los pilares fundamentales sobre los que descansa el rol de la gestora enfermera?",
        options: [
          "Únicamente tareas operativas",
          "Planificación, organización de servicios, ambientes seguros, participación y evaluación",
          "Solo planificación estratégica",
          "Autoridad y control únicamente",
        ],
        correct: 1,
      },
      {
        q: "¿Por qué se describe la gestión enfermera como un 'acto de equilibrio delicado y dinámico'?",
        options: [
          "Porque requiere conocimiento, habilidad, pasión, empatía y compromiso con valores fundamentales",
          "Porque es impredecible",
          "Porque es muy fácil",
          "Porque no tiene estabilidad",
        ],
        correct: 0,
      },
      {
        q: "¿Qué implica la gestión en enfermería?",
        options: [
          "Liderazgo, toma de decisiones basada en evidencia, y promoción de la calidad asistencial",
          "Únicamente la administración de recursos materiales",
          "Supervisión de tareas sin implicar liderazgo",
          "Exclusivamente el desarrollo de estrategias financieras",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es una competencia clave de la gestora enfermera?",
        options: [
          "Habilidades de comunicación efectiva",
          "Capacidades matemáticas avanzadas",
          "Conocimientos de ingeniería",
          "Expertise en tecnologías de la información",
        ],
        correct: 0,
      },
      {
        q: "¿Qué nivel de gestión se encarga de la planificación y atención directa junto al paciente?",
        options: [
          "Gestión operativa",
          "Alta dirección",
          "Gestión logística",
          "Gestión estratégica",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el rol de la gestión logística en enfermería?",
        options: [
          "Coordinar distintas áreas dentro de la organización para lograr metas comunes",
          "Tratar directamente con los pacientes",
          "Realizar tareas administrativas básicas",
          "Desarrollar el currículum educativo para enfermeras",
        ],
        correct: 0,
      },
      {
        q: "¿Qué representa la alta dirección en la estructura de gestión de enfermería?",
        options: [
          "Liderazgo institucional y desarrollo de estrategias organizacionales",
          "Supervisión de la atención directa al paciente",
          "Gestión de recursos materiales exclusivamente",
          "Entrenamiento y desarrollo profesional de enfermeras",
        ],
        correct: 0,
      },
      {
        q: "¿Qué refleja la transición de un enfoque de controlar y mandar a liderar y desarrollar?",
        options: [
          "Una evolución en el rol de la gestora enfermera hacia un liderazgo más colaborativo",
          "Un decrecimiento en la calidad de la atención",
          "La necesidad de reducir costos operativos",
          "La disminución de responsabilidades de la gestora enfermera",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo se puede mejorar la toma de decisiones en la gestión de enfermería?",
        options: [
          "Evaluando tanto datos cuantitativos como cualitativos",
          "Ignorando los datos cuantitativos",
          "Basándose únicamente en la intuición",
          "Evitando la retroalimentación del equipo de enfermería",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de las siguientes NO es una competencia de la gestora enfermera?",
        options: [
          "Gestión de redes sociales",
          "Liderazgo ético",
          "Sensibilidad cultural",
          "Comunicación efectiva",
        ],
        correct: 0,
      },
      {
        q: "¿Qué es fundamental para el desarrollo profesional continuo de la gestora enfermera?",
        options: [
          "Formación académica y experiencia práctica",
          "Concentrarse únicamente en tareas administrativas",
          "Evitar la participación en foros profesionales",
          "Mantenerse aislado de las innovaciones en el campo",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo impacta la gestora enfermera en la satisfacción del paciente?",
        options: [
          "Influyendo en la percepción del paciente a través de la calidad de la atención recibida",
          "Limitando la comunicación directa con los pacientes",
          "Reduciendo el número de personal de enfermería",
          "Aumentando exclusivamente los recursos materiales",
        ],
        correct: 0,
      },
      {
        q: "En el contexto de la gestión de enfermería, ¿qué importancia tiene la gestión de relaciones?",
        options: [
          "Es clave para entender las dinámicas entre individuos y equipos",
          "Se centra en las relaciones con proveedores externos únicamente",
          "Tiene poca relevancia en la práctica diaria",
          "Solo es aplicable a la gestión financiera",
        ],
        correct: 0,
      },
      {
        q: "¿Qué caracteriza el liderazgo en la gestión de enfermería?",
        options: [
          "La capacidad de gestionar conflictos y fomentar la colaboración",
          "Evitar tomar decisiones difíciles",
          "Mantener una estructura jerárquica rígida",
          "Centrarse exclusivamente en las tareas administrativas",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo se desarrollan y mejoran las competencias de una gestora enfermera?",
        options: [
          "A través de la experiencia práctica y la formación continua",
          "Ignorando el feedback de colegas y pacientes",
          "Manteniendo una perspectiva estrecha y resistiéndose al cambio",
          "Concentrándose solo en la administración de recursos materiales",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el propósito de la evaluación continua en la gestión de servicios de enfermería?",
        options: [
          "Garantizar que la organización y los pacientes alcancen resultados óptimos",
          "Reducir los costos operativos al mínimo",
          "Limitar la participación del personal en la toma de decisiones",
          "Evitar el desarrollo profesional del equipo de enfermería",
        ],
        correct: 0,
      },
      {
        q: "¿Qué NO es un aspecto de la gestión operativa en enfermería?",
        options: [
          "Desarrollar políticas sanitarias a nivel nacional",
          "Liderar y planificar la atención de enfermería",
          "Asegurar la ejecución eficaz de los procesos asistenciales",
          "Gestionar los recursos a su disposición",
        ],
        correct: 0,
      },
      {
        q: "¿Qué implica la alta dirección en la gestión de enfermería?",
        options: [
          "Dirigir y establecer estrategias a nivel organizacional",
          "Trabajar exclusivamente con tareas administrativas básicas",
          "Limitar el desarrollo profesional continuo",
          "Evitar la colaboración con otros departamentos",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo afecta el liderazgo transformacional de la gestora enfermera al equipo de enfermería?",
        options: [
          "Inspirando y guiando hacia la mejora continua e innovación",
          "Reduciendo la motivación y el compromiso del equipo",
          "Manteniendo una distancia profesional estricta",
          "Concentrándose en tareas sin considerar el bienestar del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué estrategia NO es utilizada por la gestora enfermera para mejorar la calidad asistencial?",
        options: [
          "Limitación del desarrollo profesional del personal de enfermería",
          "Promoción de un ambiente de trabajo colaborativo",
          "Toma de decisiones basada en evidencia",
          "Fomento de la seguridad del paciente",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el resultado de una gestión eficaz en enfermería según el documento?",
        options: [
          "Armonización de los aspectos técnicos y humanísticos de la atención",
          "Aumento de la burocracia en los procesos de atención",
          "Disminución de la importancia del liderazgo",
          "Enfoque exclusivo en la eficiencia operativa sin considerar la calidad",
        ],
        correct: 0,
      },
      {
        q: "¿Qué importancia tiene la comunicación asertiva en la gestión de enfermería?",
        options: [
          "Facilita un intercambio fluido de información y comprensión empática",
          "Se limita a la comunicación escrita",
          "No es relevante para la gestión de conflictos",
          "Es menos importante que la gestión de recursos materiales",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el impacto de la gestora enfermera en el diseño de políticas sanitarias?",
        options: [
          "Contribuye al diseño y reforma de los sistemas de salud para afrontar futuros retos",
          "Ninguno, ya que no participa en procesos externos",
          "Es relevante solo en el contexto de atención directa al paciente",
          "Se centra en la reducción de la autonomía del personal de enfermería",
        ],
        correct: 0,
      },
      {
        q: "¿Qué NO forma parte del proceso continuo de mejora de competencias de la gestora enfermera?",
        options: [
          "Evitar la retroalimentación y el mentorazgo",
          "Participación en programas de liderazgo",
          "Búsqueda activa de desarrollo profesional",
          "Reflexión crítica sobre la práctica propia",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de las siguientes es una responsabilidad de la gestora enfermera en la alta dirección?",
        options: [
          "Desarrollo de estrategias de cuidados y planificación",
          "Atención directa y personalizada a cada paciente",
          "Realización de tareas administrativas menores",
          "Supervisión directa de todas las intervenciones de enfermería",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el efecto de una gestión enfermera orientada a la participación y la evaluación?",
        options: [
          "Mejora la dinámica de los equipos de enfermería e influye en la satisfacción del paciente",
          "Disminuye la eficiencia en la atención al paciente",
          "Aumenta la dependencia de la tecnología en la atención",
          "Restringe la comunicación dentro del equipo de enfermería",
        ],
        correct: 0,
      },
      {
        q: "¿Qué se considera esencial para la toma de decisiones informadas en la gestión de enfermería?",
        options: [
          "Integración de conocimientos, habilidades y motivaciones intrínsecas",
          "Exclusividad en el uso de datos cualitativos",
          "Dependencia de decisiones externas sin análisis interno",
          "Enfoque en la intuición más que en la evidencia",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 2,
    title: "Liderazgo",
    subtitle: "Estilos de liderazgo",
    icon: "🎯",
    questions: [
      {
        q: "Según las teorías de rasgos de liderazgo, ¿cuál es la premisa fundamental sobre cómo se adquiere el liderazgo?",
        options: [
          "El liderazgo es una habilidad aprendida exclusivamente",
          "Los líderes nacen con ciertos atributos innatos que predisponen al liderazgo",
          "El liderazgo depende únicamente del contexto",
          "Todos nacen con los mismos rasgos de liderazgo",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la diferencia fundamental entre liderazgo centrado en tareas y liderazgo orientado a relaciones?",
        options: [
          "El primero enfatiza la realización de objetivos; el segundo enfatiza el bienestar del equipo",
          "No hay diferencia real",
          "El primero es más efectivo siempre",
          "El segundo es más rápido en resultados",
        ],
        correct: 0,
      },
      {
        q: "En el contexto de la enfermería, un liderazgo demasiado centrado en tareas puede resultar en:",
        options: [
          "Mayor satisfacción laboral",
          "Ambiente de trabajo más personal",
          "Disminución de satisfacción laboral y ambiente impersonal si no se atienden necesidades emocionales",
          "Mejor retención de personal",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es el principio fundamental de las teorías situacionales o de contingencia?",
        options: [
          "Las situaciones nunca afectan el resultado",
          "El éxito del liderazgo depende de factores situacionales y requiere flexibilidad adaptativa",
          "El liderazgo es independiente del contexto",
          "Existe un único estilo de liderazgo efectivo para todas las situaciones",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la diferencia crítica entre liderazgo transformacional y transaccional?",
        options: [
          "Transformacional inspira cambio y excepcionalidad; transaccional usa recompensas/castigos por tareas",
          "No hay diferencia significativa",
          "Transaccional es más efectivo en enfermería",
          "Transformacional solo usa castigos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuándo es ESPECIALMENTE apropiado aplicar un liderazgo autocrático en enfermería?",
        options: [
          "Solo en reuniones administrativas",
          "En emergencias que requieren decisiones rápidas y precisas",
          "Nunca es apropiado",
          "En la mayoría de situaciones",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el riesgo principal de un liderazgo democrático si se aplica inadecuadamente en enfermería?",
        options: [
          "Puede comprometer la efectividad en situaciones que requieren decisiones rápidas",
          "Es demasiado eficiente",
          "Mejora siempre la retención",
          "Reduce la comunicación",
        ],
        correct: 0,
      },
      {
        q: "El liderazgo Laissez-Faire es más efectivo cuando los miembros del equipo son:",
        options: [
          "Desinteresados en el trabajo",
          "Altamente experimentados, motivados y capaces de autogestión",
          "Nuevos en la organización",
          "Inexpertos y necesitan supervisión",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la relación entre la definición de liderazgo en enfermería y la función de influencia?",
        options: [
          "La influencia y el liderazgo son términos sinónimos sin matices",
          "El liderazgo es el proceso de influir en otros para alcanzar un objetivo común en cuidados",
          "La influencia es lo opuesto al liderazgo",
          "El liderazgo NO implica influencia",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la conclusión clave sobre la aplicación de estilos de liderazgo en la práctica moderna de enfermería?",
        options: [
          "La mayoría de líderes encuentran equilibrio entre estilos, ajustándose a las necesidades del equipo y contexto",
          "Usar un solo estilo siempre",
          "Los estilos nunca se deben mezclar",
          "No importa qué estilo se use",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el propósito principal del liderazgo transformacional en enfermería?",
        options: [
          "Mantener el status quo",
          "Inspirar y motivar a los miembros del equipo hacia objetivos comunes",
          "Implementar sistemas de control estrictos",
          "Reducir la autonomía del personal",
        ],
        correct: 1,
      },
      {
        q: "¿Qué característica define a un líder efectivo en el entorno sanitario?",
        options: [
          "Autoritarismo",
          "Capacidad de comunicación y escucha activa",
          "Toma de decisiones unilateral",
          "Evitación de conflictos",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la diferencia entre liderazgo y gestión en enfermería?",
        options: [
          "No hay diferencia significativa",
          "El liderazgo se centra en las personas y la visión; la gestión en procesos y recursos",
          "La gestión es más importante que el liderazgo",
          "El liderazgo solo aplica a directores",
        ],
        correct: 1,
      },
      {
        q: "¿Qué estilo de liderazgo fomenta la participación activa del equipo en la toma de decisiones?",
        options: [
          "Autocrático",
          "Democrático o participativo",
          "Laissez-faire",
          "Transaccional",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es un componente clave de la inteligencia emocional en liderazgo?",
        options: [
          "Suprimir emociones",
          "Reconocer y gestionar las propias emociones y las de los demás",
          "Evitar interacciones emocionales",
          "Priorizar la lógica sobre las emociones siempre",
        ],
        correct: 1,
      },
      {
        q: "¿Qué técnica es fundamental para resolver conflictos en un equipo de enfermería?",
        options: [
          "Ignorar el problema",
          "Escucha activa y negociación colaborativa",
          "Imponer soluciones",
          "Evitar la confrontación",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el objetivo principal de la delegación efectiva en enfermería?",
        options: [
          "Reducir la carga de trabajo del líder",
          "Empoderar al equipo y optimizar recursos",
          "Evitar responsabilidades",
          "Controlar todas las tareas",
        ],
        correct: 1,
      },
      {
        q: "¿Qué habilidad es esencial para un líder en situaciones de crisis?",
        options: [
          "Evitar tomar decisiones rápidas",
          "Mantener la calma y tomar decisiones informadas bajo presión",
          "Delegar toda la responsabilidad",
          "Esperar instrucciones superiores",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo puede un líder fomentar la innovación en su equipo?",
        options: [
          "Castigar los errores",
          "Crear un ambiente seguro para experimentar y aprender",
          "Mantener procedimientos rígidos",
          "Limitar la creatividad",
        ],
        correct: 1,
      },
      {
        q: "¿Qué es el liderazgo situacional?",
        options: [
          "Aplicar un solo estilo de liderazgo",
          "Adaptar el estilo de liderazgo según las necesidades del equipo y la situación",
          "Evitar cambios en el estilo de liderazgo",
          "Seguir siempre el mismo protocolo",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la importancia de la comunicación no verbal en el liderazgo?",
        options: [
          "Es irrelevante",
          "Refuerza o contradice el mensaje verbal y afecta la percepción del equipo",
          "Solo importa en presentaciones formales",
          "No tiene impacto en el liderazgo",
        ],
        correct: 1,
      },
      {
        q: "¿Qué papel juega la mentoría en el desarrollo de líderes en enfermería?",
        options: [
          "Es innecesaria",
          "Facilita el aprendizaje y el crecimiento profesional",
          "Solo beneficia al mentor",
          "Retrasa el desarrollo",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo puede un líder promover la resiliencia en su equipo?",
        options: [
          "Evitar hablar de dificultades",
          "Fomentar el apoyo mutuo y estrategias de afrontamiento",
          "Minimizar los desafíos",
          "Ignorar el bienestar emocional",
        ],
        correct: 1,
      },
      {
        q: "¿Qué es la visión compartida en un equipo de enfermería?",
        options: [
          "Objetivos individuales",
          "Una meta común que inspira y guía al equipo",
          "Directrices impuestas",
          "Estrategias a corto plazo",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo influye el liderazgo en la satisfacción laboral del personal de enfermería?",
        options: [
          "No tiene impacto",
          "Un liderazgo positivo aumenta la motivación y redución del burnout",
          "Solo depende del salario",
          "Es irrelevante",
        ],
        correct: 1,
      },
      {
        q: "¿Qué estrategia puede utilizar un líder para manejar la resistencia al cambio?",
        options: [
          "Imponer el cambio sin explicación",
          "Comunicar claramente los beneficios e involucrar al equipo en el proceso",
          "Ignorar las preocupaciones",
          "Castigar la resistencia",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el rol del feedback en el liderazgo efectivo?",
        options: [
          "Es opcional",
          "Mejora el desempeño y fortalece las relaciones",
          "Solo se da cuando hay errores",
          "No es necesario",
        ],
        correct: 1,
      },
      {
        q: "¿Qué significa liderar con el ejemplo en enfermería?",
        options: [
          "Delegar todas las tareas",
          "Demostrar los valores y comportamientos que se esperan del equipo",
          "Evitar involucrarse en las tareas",
          "Solo dar órdenes",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo puede un líder fomentar el trabajo en equipo?",
        options: [
          "Promover la competencia interna",
          "Crear espacios de colaboración y reconocer logros colectivos",
          "Enfocarse solo en rendimiento individual",
          "Evitar reuniones de equipo",
        ],
        correct: 1,
      },
      {
        q: "¿Qué habilidad de liderazgo es crucial para la gestión del tiempo?",
        options: [
          "Procrastinación",
          "Priorización y organización efectiva",
          "Multitarea excesiva",
          "Evitar planificación",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo contribuye el liderazgo al desarrollo profesional continuo en enfermería?",
        options: [
          "No tiene relación",
          "Fomenta la formación continua y oportunidades de crecimiento",
          "Solo beneficia al líder",
          "Limita el aprendizaje",
        ],
        correct: 1,
      },
      {
        q: "¿Qué importancia tiene la ética en el liderazgo de enfermería?",
        options: [
          "Es secundaria",
          "Es fundamental para la confianza y la toma de decisiones correctas",
          "Solo aplica en dilemas complejos",
          "No es relevante",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo puede un líder identificar y desarrollar el potencial de su equipo?",
        options: [
          "Ignorar las fortalezas individuales",
          "Observar, evaluar y ofrecer oportunidades de desarrollo personalizado",
          "Tratar a todos por igual sin distinción",
          "Enfocarse solo en debilidades",
        ],
        correct: 1,
      },
      {
        q: "¿Qué desafío común enfrenta el liderazgo en enfermería?",
        options: [
          "Exceso de recursos",
          "Equilibrar las demandas asistenciales con la gestión y el bienestar del equipo",
          "Falta de responsabilidades",
          "Ausencia de cambios",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el principal enfoque del liderazgo en enfermería?",
        options: [
          "Influencia positiva y motivación hacia la excelencia en el cuidado de los pacientes",
          "Administración de recursos financieros",
          "Implementación de procesos administrativos rigurosos",
          "Supervisión directa de todas las actividades clínicas",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo se adapta el liderazgo situacional en la gestión de enfermería?",
        options: [
          "Ajustando el estilo de liderazgo según las necesidades del equipo y la situación",
          "Aplicando un único estilo de liderazgo en todas las situaciones",
          "Centrándose exclusivamente en el liderazgo transaccional",
          "Ignorando las dinámicas del equipo y el entorno de trabajo",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es una ventaja del liderazgo autocrático en enfermería?",
        options: [
          "Eficaz en situaciones de emergencia por su rapidez en la toma de decisiones",
          "Fomenta la creatividad del equipo",
          "Reduce la moral del equipo a largo plazo",
          "Promueve un alto nivel de participación del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué caracteriza al liderazgo democrático?",
        options: [
          "Inclusión del equipo en el proceso de toma de decisiones",
          "Toma de decisiones sin consultar al equipo",
          "Delegación completa de responsabilidades",
          "Enfoque exclusivo en la ejecución de tareas",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo afecta el liderazgo Laissez-Faire a la gestión de enfermería?",
        options: [
          "Promueve la autonomía y potencialmente la innovación",
          "Garantiza la ejecución rápida de tareas",
          "Mejora la eficiencia en situaciones de crisis",
          "Aumenta la dependencia del equipo en el líder",
        ],
        correct: 0,
      },
      {
        q: "¿Qué busca el liderazgo transformacional en su equipo?",
        options: [
          "Exceder sus propias expectativas y trabajar por un bien mayor",
          "Adherencia estricta a las normas sin cuestionar",
          "Cumplimiento de tareas con mínima interacción",
          "Independencia total del liderazgo",
        ],
        correct: 0,
      },
      {
        q: "¿En qué se basa principalmente el liderazgo transaccional?",
        options: [
          "Claridad de roles y uso de recompensas y sanciones",
          "Fomento de la autonomía sin directrices claras",
          "Participación activa de todos en la toma de decisiones",
          "Desarrollo personal y profesional sin objetivos específicos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es un desafío potencial del liderazgo Laissez-Faire?",
        options: [
          "Posibilidad de confusión y falta de dirección",
          "Excesiva dependencia en el líder para la toma de decisiones",
          "Demasiada rigidez en los procedimientos operativos",
          "Limitación en la creatividad y la innovación del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué elemento NO es característico del liderazgo situacional?",
        options: [
          "Un único estilo de liderazgo aplicado en todas las situaciones",
          "Evaluación constante del contexto para adaptar el estilo de liderazgo",
          "Flexibilidad y adaptabilidad según las necesidades del equipo",
          "Balance entre conductas directivas y de apoyo",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo contribuye el liderazgo democrático a la gestión de enfermería?",
        options: [
          "Fomentando la colaboración y aumentando la satisfacción del equipo",
          "Simplificando los procesos de toma de decisiones",
          "Acelerando las respuestas en situaciones de emergencia",
          "Limitando la participación del equipo en decisiones importantes",
        ],
        correct: 0,
      },
      {
        q: "¿Qué resultado puede tener un liderazgo autocrático aplicado de manera prolongada?",
        options: [
          "Alta rotación de personal debido a la disminución de la satisfacción laboral",
          "Aumento de la creatividad y la innovación en el equipo",
          "Mejora continua en la satisfacción y la motivación del equipo",
          "Desarrollo profesional y personal significativo de los miembros del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué define principalmente al liderazgo en el contexto de la enfermería?",
        options: [
          "La capacidad para inspirar y guiar al equipo hacia objetivos comunes",
          "La posición jerárquica y el poder",
          "El seguimiento estricto de protocolos y procedimientos",
          "La gestión de la documentación y el registro de pacientes",
        ],
        correct: 0,
      },
      {
        q: "¿Por qué es vital un liderazgo fuerte en la enfermería?",
        options: [
          "Para afrontar retos como la mejora de la calidad del cuidado y la gestión de recursos",
          "Para reducir los costos operativos exclusivamente",
          "Para limitar la participación del personal en la toma de decisiones",
          "Para aumentar la carga de trabajo del personal de enfermería",
        ],
        correct: 0,
      },
      {
        q: "Según las teorías clásicas, ¿qué postulan las teorías de rasgos sobre el liderazgo?",
        options: [
          "Los líderes nacen con ciertos atributos que predisponen al liderazgo",
          "El liderazgo se basa únicamente en la experiencia y el aprendizaje",
          "Los líderes son efectivos solo si tienen conocimientos técnicos avanzados",
          "El liderazgo es exclusivo de quienes ocupan altos cargos administrativos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es una característica del liderazgo centrado en las tareas?",
        options: [
          "Enfocarse en la planificación y ejecución de tareas específicas",
          "Priorizar el bienestar emocional del equipo sobre las metas organizacionales",
          "Fomentar un ambiente de trabajo relacional y de apoyo mutuo",
          "Delegar todas las decisiones importantes al equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué estilo de liderazgo se enfoca en el apoyo y desarrollo de los miembros del equipo?",
        options: [
          "Liderazgo orientado a las relaciones",
          "Liderazgo autocrático",
          "Liderazgo centrado en las tareas",
          "Liderazgo transaccional",
        ],
        correct: 0,
      },
      {
        q: "¿Qué implica el liderazgo transformacional?",
        options: [
          "Inspirar y motivar al equipo para exceder sus expectativas",
          "Mantener la estructura organizativa sin cambios",
          "Implementar recompensas y castigos para lograr objetivos",
          "Delegar todas las responsabilidades importantes",
        ],
        correct: 0,
      },
      {
        q: "¿En qué se centra el liderazgo transaccional?",
        options: [
          "En la claridad de las tareas y el uso de recompensas y castigos",
          "En la creatividad y la innovación sin límites",
          "En evitar cualquier forma de dirección o control",
          "En la toma de decisiones compartida en todas las situaciones",
        ],
        correct: 0,
      },
      {
        q: "¿Qué tipo de liderazgo es más adecuado en situaciones que requieren decisiones rápidas?",
        options: [
          "Liderazgo autocrático",
          "Liderazgo democrático",
          "Liderazgo Laissez-Faire",
          "Liderazgo transformacional",
        ],
        correct: 0,
      },
      {
        q: "¿Qué estrategia es clave para el liderazgo transformacional?",
        options: [
          "Inspirar al equipo hacia una visión compartida de excelencia",
          "Imposición de objetivos sin considerar las opiniones del equipo",
          "Delegación de todas las tareas para promover la autonomía",
          "Mantenimiento de una estructura jerárquica estricta",
        ],
        correct: 0,
      },
      {
        q: "¿Qué factor es crucial para el éxito del liderazgo situacional?",
        options: [
          "Capacidad del líder para ajustar su enfoque según las necesidades del equipo",
          "Aplicación de un estilo de liderazgo constante",
          "Enfoque exclusivo en el desarrollo profesional del equipo",
          "Aislamiento del líder del resto del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué beneficio principal ofrece el liderazgo democrático en la enfermería?",
        options: [
          "Mayor compromiso del equipo mediante la participación en la toma de decisiones",
          "Decisiones rápidas sin consulta",
          "Implementación inmediata de cambios sin resistencia",
          "Reducción de la necesidad de supervisión del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es un potencial riesgo del liderazgo autocrático en la gestión de enfermería?",
        options: [
          "Disminución de la moral y la satisfacción laboral",
          "Excesiva dependencia del equipo en el liderazgo para la innovación",
          "Aumento de la autonomía y la motivación del equipo",
          "Mejora de la comunicación y relaciones dentro del equipo",
        ],
        correct: 0,
      },
      {
        q: "¿Qué estilo de liderazgo fomenta la autonomía y la toma de decisiones independiente?",
        options: [
          "Liderazgo Laissez-Faire",
          "Liderazgo transformacional",
          "Liderazgo transaccional",
          "Liderazgo situacional",
        ],
        correct: 0,
      },
      {
        q: "¿En qué se diferencia el liderazgo transaccional del transformacional?",
        options: [
          "El transaccional se basa en recompensas y castigos, mientras que el transformacional inspira y motiva",
          "El transaccional se enfoca en la innovación, mientras que el transformacional en las recompensas",
          "El transaccional promueve la autonomía, mientras que el transformacional la dirección clara",
          "No hay diferencias significativas entre ambos estilos",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 3,
    title: "Competencias Digitales",
    subtitle: "IA y escenarios futuros",
    icon: "🤖",
    questions: [
      {
        q: "¿Cuál es la definición más precisa de competencias digitales en enfermería según el contexto académico?",
        options: [
          "Solo la capacidad de usar email y programas básicos",
          "Conjunto de habilidades para utilizar efectivamente TIC incluyendo datos electrónicos, telemedicina, seguridad y herramientas de IA",
          "La capacidad exclusiva de programar sistemas de salud",
          "El conocimiento de las redes sociales",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la distinción fundamental entre IA débil (estrecha) y IA fuerte (general)?",
        options: [
          "No hay diferencia real entre ambas",
          "IA débil realiza tareas específicas; IA fuerte posee capacidades cognitivas similares a humanos",
          "La IA débil es más costosa que la fuerte",
          "La IA fuerte solo se usa en laboratorios",
        ],
        correct: 1,
      },
      {
        q: "En el contexto de diagnóstico asistido por IA en enfermería, ¿cuál es el principal beneficio de los algoritmos de IA en imágenes médicas?",
        options: [
          "Aumentar el tiempo de consulta",
          "Detectar patrones no evidentes al ojo humano para diagnósticos más rápidos y precisos",
          "Reducir únicamente costos operativos",
          "Reemplazar completamente al profesional sanitario",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el propósito principal de la gestión de grandes volúmenes de datos de salud mediante IA?",
        options: [
          "Analizar datos para extraer información que guíe el cuidado, identificar tendencias y predecir resultados",
          "Almacenar información sin procesar",
          "Solo crear copias de seguridad",
          "Difundir información del paciente",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la diferencia crítica entre Sistemas EHR y plataformas de telemedicina en términos de competencias digitales requeridas?",
        options: [
          "La telemedicina es obsoleta",
          "EHR gestiona registros electrónicos; telemedicina facilita consultas virtuales y monitoreo remoto",
          "Ambos solo sirven para almacenar datos",
          "Son exactamente lo mismo",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son los principios éticos fundamentales que las enfermeras deben comprender al usar sistemas de IA?",
        options: [
          "Autonomía del paciente, beneficencia, no maleficencia y justicia",
          "Solo la eficiencia económica",
          "Únicamente la velocidad de procesamiento",
          "La ganancia institucional",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la responsabilidad principal de las enfermeras en equipos multidisciplinares de desarrollo de IA?",
        options: [
          "Programar algoritmos",
          "Aportar experiencia clínica, perspectiva del paciente, y guiar desarrollo de herramientas clínicamente relevantes y centradas en el paciente",
          "Solo ejecutar órdenes técnicas",
          "Reemplazar a ingenieros",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las barreras técnicas más significativas para la adopción de IA en salud mencionadas en el documento?",
        options: [
          "Los hospitales no quieren cambiar",
          "Falta de interoperabilidad entre sistemas y necesidad de infraestructuras robustas de datos",
          "La resistencia de los pacientes",
          "Falta de dinero solamente",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el rol crítico de las enfermeras en la fase de evaluación de herramientas de IA según el documento?",
        options: [
          "Probar en entornos reales, evaluar usabilidad/eficacia/seguridad, monitorear resultados y sugerir mejoras basadas en retroalimentación",
          "No participan en evaluación",
          "Solo observar desde lejos",
          "Reportar problemas técnicos al departamento IT",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la conclusión principal sobre el futuro de la enfermería en la era digital según el documento?",
        options: [
          "Las enfermeras deben ser líderes en transformación digital, integrando tecnología con cuidado humano centrado en el paciente",
          "La tecnología reemplazará a las enfermeras",
          "La enfermería permanecerá sin cambios",
          "Solo los ingenieros importan en salud digital",
        ],
        correct: 0,
      },
      {
        q: "¿Qué promete la transformación digital en el cuidado de la salud?",
        options: [
          "Mejora de eficiencia y personalización de la experiencia del paciente.",
          "Reducción de personal en la salud.",
          "Aumento de la carga de trabajo para los enfermeros.",
          "Disminución de la importancia de las competencias digitales.",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de las siguientes afirmaciones sobre la inteligencia artificial (IA) fuerte es correcta?",
        options: [
          "Posee capacidades cognitivas humanas y puede, en teoría, realizar cualquier tarea intelectual como un ser humano.",
          "Está diseñada para tareas específicas como la clasificación de imágenes o el reconocimiento de voz.",
          "Es la IA más utilizada actualmente en la práctica clínica.",
          "Se basa exclusivamente en reglas predefinidas sin capacidad de aprendizaje.",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de los siguientes enunciados define con mayor precisión la competencia digital en el ámbito enfermero?",
        options: [
          "El conjunto de habilidades y conocimientos necesarios para utilizar TICs de forma efectiva y ética en el cuidado de la salud, mejorando la calidad y seguridad del paciente.",
          "La capacidad exclusiva de manejar software administrativo en el hospital.",
          "La habilidad para acceder a internet desde cualquier dispositivo móvil.",
          "El conocimiento sobre redes sociales y su uso profesional.",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de las siguientes opciones describe con mayor precisión la competencia digital en enfermería?",
        options: [
          "Es el conjunto de habilidades y conocimientos necesarios para utilizar efectivamente las tecnologías de la información y comunicación en el contexto del cuidado de la salud.",
          "Es la habilidad de usar redes sociales para comunicarse con pacientes.",
          "Se refiere a la automatización total de las tareas asistenciales por parte de sistemas informáticos.",
          "Es el dominio exclusivo de software estadístico avanzado para investigación.",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo se define la competencia digital en enfermería?",
        options: [
          "Habilidades para usar TIC en cuidado de salud.",
          "Exclusivamente la habilidad para programar en IA.",
          "Capacidad para evitar el uso de tecnología.",
          "Enfoque en el uso de dispositivos manuales.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué enfoque educativo se recomienda para asegurar el desarrollo de competencias digitales en enfermería?",
        options: [
          "Participación en formación continua, redes profesionales y proyectos de innovación tecnológica.",
          "Restricción del aprendizaje digital al periodo universitario inicial.",
          "Acceso exclusivo a formación presencial sin contenidos digitales.",
          "Fomento de prácticas clínicas tradicionales sin intervención tecnológica.",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el impacto potencial de la IA en la calidad y eficiencia del cuidado enfermero?",
        options: [
          "Mejorar la precisión diagnóstica, personalizar tratamientos y liberar tiempo para la atención directa al paciente.",
          "Reducir la necesidad de formación profesional continua.",
          "Generar mayor burocracia sin beneficio clínico.",
          "Impedir el acceso de los pacientes a información relevante.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué escenario representa un desafío técnico para la adopción de IA en enfermería?",
        options: [
          "La falta de interoperabilidad entre sistemas y la necesidad de infraestructuras de datos robustas.",
          "La presencia de equipos multidisciplinares en el ámbito sanitario.",
          "El incremento de la formación digital entre los profesionales.",
          "El uso de registros electrónicos de salud compatibles entre centros.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué representa la integración de tecnología digital en enfermería?",
        options: [
          "Desafíos y oportunidades para mejorar el cuidado.",
          "Un reto sin beneficios claros.",
          "Un movimiento hacia la reducción del contacto humano.",
          "Exclusivamente un aumento en la carga de trabajo.",
        ],
        correct: 0,
      },
      {
        q: "El reto ético fundamental en la integración de IA en salud radica en:",
        options: [
          "Asegurar la privacidad, la autonomía del paciente y el uso transparente y explicable de los algoritmos.",
          "Reducir los costes operativos y el tiempo de consulta.",
          "Automatizar todos los procesos clínicos sin supervisión profesional.",
          "Imponer un modelo único de atención estandarizada.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué papel pueden desempeñar las enfermeras en la evaluación de nuevas soluciones de IA en salud?",
        options: [
          "Evaluar la usabilidad, eficacia y seguridad de la tecnología, monitorizar resultados y sugerir mejoras basadas en la experiencia clínica.",
          "Prohibir la utilización de cualquier tecnología que no hayan creado personalmente.",
          "Desentenderse de la formación continua en nuevas tecnologías.",
          "Limitarse a la recogida pasiva de datos sin intervención.",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el papel de la enfermería en el equipo multidisciplinar de IA?",
        options: [
          "Colaborar en el desarrollo de soluciones tecnológicas.",
          "Solamente ejecutar órdenes médicas.",
          "Mantenerse al margen del desarrollo tecnológico.",
          "Enfocarse únicamente en tareas administrativas.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué estrategia favorece el desarrollo profesional continuo en competencias digitales en enfermería?",
        options: [
          "Participación en proyectos de innovación, formación formal e informal y colaboración en redes profesionales.",
          "Exclusiva autoformación autodidacta sin actualización externa.",
          "Desconexión temporal de la tecnología para evitar estrés digital.",
          "Asistencia solo a cursos de ofimática básica.",
        ],
        correct: 0,
      },
      {
        q: "Entre los desafíos éticos en la adopción de IA en enfermería, se incluye:",
        options: [
          "Garantizar la privacidad y seguridad de la información, evitar sesgos y mantener la confianza en la IA.",
          "Evitar la formación continua en competencias digitales.",
          "Favorecer la transparencia de todos los algoritmos aunque no sean de salud.",
          "Priorizar la automatización sobre la autonomía del paciente.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué es esencial para la adopción de IA en enfermería?",
        options: [
          "Formación en competencias digitales y colaboración.",
          "Evitar cualquier cambio en la práctica actual.",
          "Incorporarse a equipos de innovación tecnológica.",
          "Competir con especialistas en tecnología.",
        ],
        correct: 0,
      },

      {
        q: "En transformación digital, ¿qué papel es clave para las enfermeras?",
        options: [
          "Ser líderes en la integración tecnológica, facilitadoras del cambio y participantes activas en la toma de decisiones.",
          "Ser usuarias pasivas de tecnología.",
          "Ejecutoras de tareas sin participar en innovación.",
          "Centrarse solo en tareas tradicionales.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué ventaja aporta la IA al análisis de datos clínicos?",
        options: [
          "Detectar patrones clínicos no evidentes para el ojo humano.",
          "Aumentar la burocracia del personal de enfermería.",
          "Sustituir el juicio clínico.",
          "Reducir la personalización de cuidados.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué aspecto es crítico en la gestión de datos de pacientes?",
        options: [
          "Protección de la privacidad y seguridad.",
          "Uso de papel y lápiz.",
          "Almacenamiento físico de archivos.",
          "Comunicación exclusiva por email.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué desafío técnico dificulta la implementación de IA?",
        options: [
          "Falta de interoperabilidad entre plataformas digitales.",
          "Sobrecualificación del personal asistencial.",
          "Exceso de formación continua.",
          "Redundancia de diagnósticos.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué tipo de tecnología ha transformado la práctica clínica?",
        options: [
          "Sistemas de registros electrónicos de salud.",
          "Dispositivos manuales de registro.",
          "Sistemas analógicos de comunicación.",
          "Herramientas manuales diagnósticas.",
        ],
        correct: 0,
      },
      {
        q: "¿Qué competencia permite evaluar sistemas de IA clínicos?",
        options: [
          "Conocimiento ético, técnico y clínico de sistemas de inteligencia artificial.",
          "Programación de algoritmos predictivos.",
          "Software de gestión financiera.",
          "Conocimiento de redes sociales.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué diferencia existe entre IA débil y fuerte?",
        options: [
          "La débil realiza tareas específicas; la fuerte tendría capacidades cognitivas humanas generales.",
          "La IA fuerte se usa actualmente en hospitales.",
          "La débil no puede analizar imágenes.",
          "Ambas se usan indistintamente.",
        ],
        correct: 0,
      },

      {
        q: "¿Por qué es fundamental que las enfermeras desarrollen competencias digitales?",
        options: [
          "Para garantizar uso seguro y eficiente de tecnología en beneficio del paciente.",
          "Para delegar decisiones clínicas a sistemas automatizados.",
          "Para programar IA desde cero.",
          "Solo para cumplir requisitos legales.",
        ],
        correct: 0,
      },

      {
        q: "¿Cómo pueden las enfermeras liderar la transformación digital?",
        options: [
          "Abogando por tecnologías que mejoren el cuidado del paciente.",
          "Evitando cualquier nueva tecnología.",
          "Manteniendo prácticas obsoletas.",
          "Reduciendo la colaboración interdisciplinar.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué importancia tiene la colaboración interdisciplinar en IA?",
        options: [
          "Es clave para diseñar soluciones centradas en el paciente.",
          "No tiene relevancia.",
          "Debe evitarse.",
          "Reduce la eficacia del cuidado.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué desafío representa la privacidad de datos en la era digital?",
        options: [
          "Asegurar la confidencialidad y seguridad de la información del paciente.",
          "Facilitar el acceso indiscriminado a los datos.",
          "Ignorar regulaciones.",
          "Centrarse solo en almacenamiento físico.",
        ],
        correct: 0,
      },

      {
        q: "¿Cuál es el impacto de la IA en el diagnóstico?",
        options: [
          "Mejora la precisión en interpretación de imágenes médicas.",
          "Disminuye la confiabilidad diagnóstica.",
          "Elimina revisión humana.",
          "Reduce inversión tecnológica.",
        ],
        correct: 0,
      },

      {
        q: "¿Qué se requiere para integrar IA efectivamente en enfermería?",
        options: [
          "Capacitación en competencias digitales y éticas.",
          "Rechazo a tecnología.",
          "Dependencia total de IA.",
          "Solo tareas clínicas básicas.",
        ],
        correct: 0,
      },

      {
        q: "¿Cómo se relaciona el liderazgo enfermero con IA?",
        options: [
          "Guiando la adopción ética y efectiva de tecnologías para mejorar el cuidado.",
          "Manteniendo perspectiva tradicional.",
          "Delegando responsabilidades tecnológicas.",
          "Ignorando tendencias digitales.",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: 4,
    title: "Gestión de la Comunicación",
    subtitle: "Efectiva y asertiva",
    icon: "💬",
    questions: [
      {
        q: "Según el documento, ¿cuál es el propósito fundamental de la comunicación en el contexto sanitario?",
        options: [
          "Facilitar la toma de decisiones, el tratamiento y el cuidado de los pacientes",
          "Aumentar la duración de las consultas",
          "Realizar más burocracia",
          "Reducir el tiempo de atención",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de los siguientes NO es un elemento básico del proceso de comunicación efectiva?",
        options: [
          "La retroalimentación (feedback) que completa el ciclo comunicativo",
          "La motivación personal del emisor",
          "La decodificación del mensaje por parte del receptor",
          "El canal por el cual se envía el mensaje",
        ],
        correct: 1,
      },
      {
        q: "En la comunicación efectiva de la gestión enfermera, ¿cuáles son los tres pilares fundamentales?",
        options: [
          "Rapidez, cantidad y eficiencia",
          "Escucha activa, empatía y claridad",
          "Autoridad, control y supervisión",
          "Tecnología, automatización y estadísticas",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la diferencia fundamental entre comunicación horizontal y vertical en equipos sanitarios?",
        options: [
          "La horizontal ocurre entre niveles jerárquicos diferentes; la vertical entre colegas del mismo nivel",
          "La vertical facilita innovación y creatividad; la horizontal transmite órdenes",
          "La horizontal es entre profesionales del mismo nivel; la vertical entre diferentes niveles jerárquicos",
          "No existe diferencia real entre ambas formas",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es el rol diferenciador de los líderes informales respecto a los formales?",
        options: [
          "Los formales ocupan jerarquía y delegan tareas; los informales influyen sin puesto oficial basándose en experiencia",
          "Los informales tienen más poder de decisión",
          "No existe diferencia funcional real",
          "Los líderes informales solo trabajan con pacientes",
        ],
        correct: 0,
      },
      {
        q: "En el desarrollo de un plan de comunicación efectivo, ¿cuál es el segundo paso fundamental después de definir objetivos?",
        options: [
          "Implementar inmediatamente el plan",
          "Identificar la audiencia definiendo sus necesidades y expectativas",
          "Evaluar los resultados",
          "Capacitar al personal",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el propósito principal de implementar la inteligencia artificial (IA) en la comunicación sanitaria según el documento?",
        options: [
          "Reemplazar completamente a los enfermeros",
          "Identificar errores en la comunicación y sugerir mejoras, junto con análisis de datos para toma de decisiones",
          "Reducir costos únicamente",
          "Solo para traducción de idiomas",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo se define la realidad aumentada (RA) en el contexto de formación de enfermería?",
        options: [
          "Una herramienta virtual para diagnósticos finales",
          "Herramienta invaluable para formación con simulaciones realistas que mejoran comprensión y habilidades clínicas",
          "Un dispositivo que reemplaza la práctica clínica",
          "Solo un entretenimiento educativo",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son los desafíos clave que presentan las nuevas tecnologías en comunicación sanitaria?",
        options: [
          "Ninguno, las nuevas tecnologías resuelven todos los problemas",
          "Rápida evolución requiere actualización constante, integración en procesos y formación continua",
          "Solo la resistencia de los pacientes",
          "La tecnología es fácil de implementar sin capacitación",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es la conclusión principal sobre la comunicación efectiva en la gestión de enfermería según el documento?",
        options: [
          "No tiene importancia en la gestión moderna",
          "Es un pilar fundamental que mejora calidad asistencial, seguridad del paciente y crea ambiente laboral colaborativo",
          "Solo es importante para administrativos",
          "La tecnología reemplaza la necesidad de comunicación humana",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el objetivo principal de la comunicación en el contexto sanitario?",
        options: [
          "Informar sobre las políticas del hospital",
          "Facilitar la toma de decisiones y el cuidado de los pacientes",
          "Organizar eventos sociales entre el personal",
          "Reducir la carga de trabajo del personal de enfermería"
        ],
        correct: 1
      },
      {
        q: "Una innovación tecnológica emergente en la comunicación de gestión de enfermería es:",
        options: [
          "La realidad aumentada para formación del personal",
          "El uso de fax para enviar informes médicos",
          "Pizarras de corcho para anuncios",
          "Agenda de papel para citas"
        ],
        correct: 0
      },
      {
        q: "¿Qué desafío representa la integración de nuevas tecnologías en la comunicación de enfermería?",
        options: [
          "La necesidad de formación continua",
          "Reducir el uso de tecnología para ahorrar costes",
          "Mantener métodos de comunicación obsoletos",
          "La prohibición completa de herramientas digitales"
        ],
        correct: 0
      },
      {
        q: "Para desarrollar un plan de comunicación efectivo en enfermería, es fundamental:",
        options: [
          "Concentrarse en la transmisión de información técnica compleja",
          "Evitar el uso de canales digitales modernos",
          "Identificar objetivos claros y definir la audiencia adecuadamente",
          "Limitar el feedback para acelerar el proceso"
        ],
        correct: 2
      },
      {
        q: "La mejora continua del plan de comunicación se logra a través de:",
        options: [
          "Recopilación y análisis de feedback",
          "Mantener el plan estático sin cambios",
          "Ignorar las sugerencias del equipo",
          "Centrarse únicamente en la comunicación ascendente"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO contribuye a una comunicación efectiva en gestión de enfermería?",
        options: [
          "Escucha activa",
          "Empatía",
          "Uso excesivo de jerga médica complicada",
          "Claridad en el mensaje"
        ],
        correct: 2
      },
      {
        q: "¿Cómo impactan las tecnologías emergentes como la IA en la comunicación de enfermería?",
        options: [
          "Mejorando diagnósticos y facilitando la atención personalizada",
          "Disminuyendo la interacción directa con los pacientes",
          "Complicando los procedimientos de comunicación",
          "Limitando el acceso a información vital"
        ],
        correct: 0
      },
      {
        q: "Una barrera para la comunicación efectiva en la gestión de enfermería podría ser:",
        options: [
          "Falta de tiempo para comunicaciones detalladas",
          "Exceso de feedback por parte del equipo",
          "Uso de plataformas de comunicación modernas",
          "Claridad excesiva en los mensajes transmitidos"
        ],
        correct: 0
      },
      {
        q: "¿Qué rol juega la comunicación grupal en la gestión sanitaria?",
        options: [
          "Facilita la toma de decisiones y discusión de casos clínicos",
          "Reduce la necesidad de liderazgo efectivo",
          "Aumenta la confusión y malentendidos",
          "Disminuye la eficiencia del equipo"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un elemento crucial en la decodificación de mensajes en la comunicación sanitaria?",
        options: [
          "La edad del receptor",
          "El nivel educativo o experiencias previas del receptor",
          "La preferencia por canales digitales",
          "La velocidad de transmisión del mensaje"
        ],
        correct: 1
      },
      {
        q: "¿Qué estrategia NO mejora la comunicación vertical ascendente?",
        options: [
          "Promover una cultura de feedback",
          "Limitar las reuniones periódicas con el equipo",
          "Utilizar herramientas de comunicación como el correo electrónico",
          "Incentivar la participación del equipo en la toma de decisiones"
        ],
        correct: 1
      },
      {
        q: "¿Qué papel juega la comunicación efectiva en los equipos de enfermería?",
        options: [
          "Solo se utiliza para transmitir información administrativa",
          "Es esencial para comprender y satisfacer las necesidades de los pacientes",
          "Se limita a la documentación del cuidado del paciente",
          "Reduce la necesidad de reuniones de equipo"
        ],
        correct: 1
      },
      {
        q: "¿Qué beneficio aporta la comunicación horizontal en los equipos de salud?",
        options: [
          "Mejora la coordinación y eficiencia del equipo",
          "Centraliza la toma de decisiones",
          "Disminuye la necesidad de liderazgo",
          "Incrementa la dependencia de la comunicación digital"
        ],
        correct: 0
      },
      {
        q: "¿Cómo pueden las enfermeras mejorar su comunicación interpersonal con los pacientes?",
        options: [
          "Utilizando un lenguaje claro y adaptado al paciente",
          "Empleando terminología técnica para demostrar conocimiento",
          "Limitando el tiempo dedicado a cada paciente",
          "Evitando el feedback para acelerar las consultas"
        ],
        correct: 0
      },
      {
        q: "La efectividad de un plan de comunicación se mide por:",
        options: [
          "La cantidad de información transmitida",
          "El nivel de comprensión y acción resultante",
          "La rapidez en la transmisión del mensaje",
          "El uso de canales de comunicación digital"
        ],
        correct: 1
      },
      {
        q: "¿Qué NO es una función de los líderes en la comunicación de equipos de salud?",
        options: [
          "Establecer una visión compartida",
          "Motivar al equipo",
          "Ignorar el feedback para mantener la autoridad",
          "Resolver conflictos efectivamente"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es un desafío futuro para la comunicación en la gestión de enfermería?",
        options: [
          "Adaptación y formación continua en nuevas tecnologías",
          "Reducción del uso de tecnología",
          "Volver exclusivamente a la comunicación cara a cara",
          "Mantener métodos tradicionales sin cambios"
        ],
        correct: 0
      },
      {
        q: "¿Cómo evolucionará la comunicación en la gestión de enfermería con futuras innovaciones?",
        options: [
          "Reemplazo total del personal por tecnología",
          "Disminución de la importancia de habilidades comunicativas",
          "Integración de IA y realidad aumentada para mejorar eficacia y personalización",
          "Retorno a métodos menos tecnológicos"
        ],
        correct: 2
      },
      {
        q: "¿Cuál de los siguientes NO es un elemento fundamental de la comunicación?",
        options: [
          "Emisor",
          "Receptor",
          "Canal",
          "Obstáculo insuperable"
        ],
        correct: 3
      },
      {
        q: "¿Qué tipo de comunicación se da entre enfermera y paciente?",
        options: [
          "Comunicación Interpersonal",
          "Comunicación Grupal",
          "Comunicación Organizacional",
          "Comunicación Masiva"
        ],
        correct: 0
      },
      {
        q: "La escucha activa en la gestión de enfermería implica:",
        options: [
          "Evitar interrupciones y realizar preguntas aclaratorias",
          "Dar instrucciones sin solicitar feedback",
          "Usar tecnicismos para impresionar al interlocutor",
          "Hablar más que escuchar"
        ],
        correct: 0
      },
      {
        q: "¿Qué tecnología ha transformado significativamente la comunicación en la gestión de enfermería?",
        options: [
          "Sistemas de Registro Electrónico de Salud (EHR)",
          "Pizarras blancas en salas de espera",
          "Teléfonos fijos",
          "Radios bidireccionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué es la comunicación vertical en la gestión de enfermería?",
        options: [
          "Comunicación entre diferentes niveles jerárquicos",
          "Diálogo entre enfermeras del mismo rango",
          "Conversaciones informales",
          "Comunicación exclusivamente digital"
        ],
        correct: 0
      },
      {
        q: "Una estrategia efectiva para mejorar la comunicación vertical es:",
        options: [
          "Realizar reuniones periódicas con el equipo",
          "Limitar la comunicación a memos escritos",
          "Evitar el feedback para no generar conflictos",
          "Usar jerga compleja para impresionar"
        ],
        correct: 0
      },
      {
        q: "¿Cómo influye el liderazgo en la comunicación dentro de los equipos de salud?",
        options: [
          "Fomentando una comunicación abierta y transparente",
          "Prohibiendo discusiones grupales",
          "Ignorando el feedback del equipo",
          "Centrándose solo en comunicación descendente"
        ],
        correct: 0
      },
      {
        q: "Según los estudios mencionados en el documento, ¿cuál fue el hallazgo principal de la AHRQ sobre la relación entre clima laboral positivo y resultados sanitarios?",
        options: [
          "Los hospitales con clima positivo tenían menores tasas de mortalidad, readmisión y complicaciones",
          "No existe relación comprobada entre clima y resultados",
          "El clima laboral solo afecta la productividad",
          "Los pacientes no notan diferencia en el ambiente",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la diferencia fundamental entre motivación intrínseca y extrínseca en el contexto del clima laboral de enfermería?",
        options: [
          "La intrínseca proviene del propio trabajo; la extrínseca de factores externos como salario y recompensas",
          "Son exactamente lo mismo",
          "La intrínseca es menos importante",
          "No aplica en sanidad",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son los tres pilares del liderazgo positivo que impactan directamente el clima laboral?",
        options: [
          "Poder, autoridad y control exclusivamente",
          "Comunicación clara, confianza y apoyo al personal",
          "Solo supervisión y evaluación",
          "Tecnología y procesos administrativos",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es la razón específica por la que una carga de trabajo excesiva es perjudicial para el clima laboral en enfermería?",
        options: [
          "Porque reduce el tiempo de descanso",
          "Porque genera estrés y burnout en los profesionales, afectando el bienestar físico y mental",
          "Por el costo operativo",
          "Porque aumenta el número de reuniones",
        ],
        correct: 3,
      },
      {
        q: "Según el modelo presentado, ¿cuál es la diferencia crítica entre los factores que influyen en satisfacción laboral?",
        options: [
          "El contenido del trabajo es más importante que las oportunidades de desarrollo",
          "El contenido, las condiciones y las oportunidades de desarrollo son factores interconectados que influyen en la satisfacción",
          "Solo el salario importa",
          "Las relaciones personales no tienen relevancia",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el propósito específico de las 'rondas regulares' mencionadas como ejemplo de liderazgo positivo sanitario?",
        options: [
          "Inspeccionar el trabajo del personal",
          "Hablar con el personal y conocer sus necesidades, mostrando interés genuino",
          "Verificar cumplimiento de horarios",
          "Recopilar información para evaluaciones negativas",
        ],
        correct: 1,
      },
      {
        q: "En el contexto del documento, ¿cómo se define específicamente la 'cultura de seguridad' como componente del clima laboral?",
        options: [
          "Un protocolo escrito para prevenir errores",
          "La cultura en la que se reconocen y se toman medidas para prevenir los errores de los profesionales sanitarios",
          "Una auditoría externa de calidad",
          "Un departamento de control de calidad",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es la interconexión fundamental entre el compromiso del personal y la calidad del cuidado al paciente según el documento?",
        options: [
          "No existe relación comprobada",
          "El personal comprometido es más productivo, tiene menos absentismo y proporciona mejor atención con mayor seguridad",
          "Solo afecta estadísticas administrativas",
          "Es relevante solo para hospitales privados",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son las particularidades específicas del clima laboral en el contexto sanitario que lo diferencian de otros sectores?",
        options: [
          "No hay diferencias con otros sectores",
          "Alta intensidad, necesidad de trabajo en equipo, exposición a estrés, contacto con dolor y sufrimiento",
          "Solo la falta de recursos",
          "Mayor flexibilidad de horarios",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el rol específico de la autonomía y responsabilidad en la motivación intrínseca del personal de enfermería según las estrategias presentadas?",
        options: [
          "Disminuye la motivación porque genera incertidumbre",
          "Aumenta el sentido de competencia y autonomía, lo que incrementa la motivación intrínseca y el enganche",
          "Solo es importante para cargos directivos",
          "Reduce la calidad del trabajo",
        ],
        correct: 1,
  },
    ],
  },
      {
        id: 5,
        title: "Clima Laboral",
        subtitle: "Bienestar, liderazgo y motivación",
        icon: "⚡",
        questions: [
          {
            q: "¿Cómo afecta la carga de trabajo equitativa al clima laboral?",
            options: [
              "Reduce el estrés y previene el burnout",
              "Aumenta la competitividad entre colegas",
              "Disminuye la eficiencia del equipo",
              "Genera conflictos de programación"
            ],
            correct: 0
          },
          {
            q: "¿Cómo impacta un liderazgo positivo en el clima laboral?",
            options: [
              "Mediante comunicación clara y apoyo al personal",
              "A través de la imposición de reglas estrictas",
              "Limitando la participación del personal en decisiones",
              "Reduciendo las oportunidades de desarrollo profesional"
            ],
            correct: 0
          },
          {
            q: "¿Cómo se define el clima laboral?",
            options: [
              "Por el nivel de salario del personal",
              "Como el conjunto de percepciones compartidas sobre el entorno de trabajo",
              "A través de la estructura física del lugar de trabajo",
              "Mediante las políticas de contratación de personal"
            ],
            correct: 1
          },
          {
            q: "¿Cuál de los siguientes es un desafío que afecta negativamente el clima laboral en la enfermería?",
            options: [
              "Alta carga de trabajo y presión asistencial",
              "Exceso de recursos y equipos",
              "Comunicación ineficaz entre pacientes",
              "Reconocimiento excesivo del personal"
            ],
            correct: 0
          },
          {
            q: "¿Cuál es el impacto de un liderazgo transformacional en el clima laboral?",
            options: [
              "Mejora la moral y la eficiencia del equipo",
              "Aumenta la dependencia del personal hacia el líder",
              "Reduce la comunicación entre los miembros del equipo",
              "Limita el desarrollo profesional del personal"
            ],
            correct: 0
          },
          {
            q: "¿Cuál es un beneficio directo de un clima laboral positivo en enfermería?",
            options: [
              "Reducción del estrés y el burnout",
              "Aumento en el número de pacientes",
              "Disminución de la necesidad de trabajo en equipo",
              "Incremento en la duración de los turnos laborales"
            ],
            correct: 0
          },
          {
            q: "¿Cuál es un indicador clave para evaluar el clima laboral?",
            options: [
              "Nivel de satisfacción del personal",
              "Número de pacientes por enfermera",
              "Costos operativos del departamento de enfermería",
              "Tasa de ocupación del hospital"
            ],
            correct: 0
          },
          {
            q: "¿Cuál es un método para evaluar el clima laboral?",
            options: [
              "Encuestas de clima laboral",
              "Evaluación del rendimiento financiero",
              "Análisis de la competencia",
              "Revisión de la historia clínica de los pacientes"
            ],
            correct: 0
          },
          {
            q: "¿Cuál es una estrategia NO recomendada para fomentar el compromiso del personal?",
            options: [
              "Involucrar al personal en la toma de decisiones",
              "Ignorar el feedback del personal",
              "Definir una visión clara y compartida",
              "Fomentar la participación en actividades sociales"
            ],
            correct: 1
          },
          {
            q: "¿Qué aspecto de las condiciones de trabajo es crucial para un clima laboral positivo?",
            options: [
              "Seguridad y ergonomía del entorno de trabajo",
              "Decoración de la oficina",
              "Ubicación geográfica de la institución",
              "Políticas de vestimenta"
            ],
            correct: 0
          },
          {
            q: "¿Qué beneficio directo tiene la comunicación efectiva en el clima laboral de enfermería?",
            options: [
              "Mejora el trabajo en equipo y la cooperación",
              "Aumenta las habilidades técnicas del personal",
              "Reduce la necesidad de supervisión",
              "Elimina completamente los errores médicos"
            ],
            correct: 0
          },
          {
            q: "¿Qué caracteriza a un programa de formación en liderazgo efectivo para enfermería?",
            options: [
              "Desarrollo de habilidades de comunicación y toma de decisiones",
              "Enfoque exclusivo en habilidades clínicas",
              "Limitación al aprendizaje autodidacta",
              "Concentración en la gestión financiera"
            ],
            correct: 0
          },
          {
            q: "¿Qué componente NO es principal del clima laboral?",
            options: [
              "Liderazgo",
              "Ubicación geográfica del hospital",
              "Comunicación",
              "Carga de trabajo"
            ],
            correct: 1
          },
          {
            q: "¿Qué efecto tiene el reconocimiento del trabajo bien hecho sobre el personal de enfermería?",
            options: [
              "Aumenta la motivación y el compromiso",
              "Disminuye la importancia del trabajo en equipo",
              "Genera competencia negativa entre los empleados",
              "Reduce la comunicación interna"
            ],
            correct: 0
          },
          {
            q: "¿Qué efecto tiene un clima laboral positivo en el entorno sanitario?",
            options: [
              "Aumento en la carga de trabajo del personal",
              "Mejora de la satisfacción y bienestar del personal",
              "Disminución de la colaboración entre el personal",
              "Aumento de los conflictos interpersonales"
            ],
            correct: 1
          },
          {
            q: "¿Qué estilo de liderazgo se caracteriza por inspirar y motivar al personal?",
            options: [
              "Liderazgo transformacional",
              "Liderazgo autocrático",
              "Liderazgo laissez-faire",
              "Liderazgo burocrático"
            ],
            correct: 0
          },
          {
            q: "¿Qué estrategia es efectiva para fomentar la motivación intrínseca en el personal de enfermería?",
            options: [
              "Ofrecer oportunidades de desarrollo profesional",
              "Limitar las responsabilidades del personal",
              "Reducir la autonomía en el trabajo",
              "Aumentar las horas de trabajo"
            ],
            correct: 0
          },
          {
            q: "¿Qué estrategia NO mejora la comunicación en el entorno de enfermería?",
            options: [
              "Implementación de un buzón de sugerencias",
              "Restricción de reuniones periódicas",
              "Uso de plataformas de comunicación interna",
              "Realización de programas de formación en comunicación"
            ],
            correct: 1
          },
          {
            q: "¿Qué factor NO es considerado al evaluar el clima laboral?",
            options: [
              "Estilo de liderazgo",
              "Comunicación",
              "Preferencias de color en la decoración",
              "Relaciones interpersonales"
            ],
            correct: 2
          },
          {
            q: "¿Qué NO es un componente del clima laboral?",
            options: [
              "Reconocimiento",
              "Carga de trabajo",
              "Distancia al lugar de trabajo",
              "Liderazgo"
            ],
            correct: 2
          },
          {
            q: "¿Qué NO se considera una estrategia efectiva para mejorar el clima laboral?",
            options: [
              "Reconocimiento del trabajo bien hecho",
              "Ignorar las sugerencias del personal",
              "Promoción de la salud y bienestar del personal",
              "Fomento de la flexibilidad laboral y conciliación familiar"
            ],
            correct: 1
          },
          {
            q: "¿Qué NO se considera una técnica efectiva de resolución de conflictos?",
            options: [
              "Comunicación efectiva",
              "Evitar el conflicto a toda costa",
              "Identificar intereses de las partes involucradas",
              "Buscar soluciones creativas"
            ],
            correct: 1
          },
          {
            q: "¿Qué relación existe entre el clima laboral y la calidad del cuidado al paciente según estudios?",
            options: [
              "Ninguna relación significativa",
              "Hospitales con clima laboral positivo tienen menores tasas de mortalidad y complicaciones",
              "Clima laboral negativo mejora la eficiencia",
              "Clima laboral positivo aumenta los errores médicos"
            ],
            correct: 1
          },
          {
            q: "¿Qué tendencia está mejorando la colaboración en el clima laboral de enfermería?",
            options: [
              "Uso de tecnologías para comunicación interna",
              "Definir una visión clara y compartida",
              "Limitación al aprendizaje autodidacta",
              "Reduce la comunicación interna"
            ],
            correct: 0
          },
          {
            q: "En el contexto de la enfermería, ¿qué significa una cultura de seguridad dentro del clima laboral?",
            options: [
              "Reconocimiento de y medidas preventivas contra errores médicos",
              "Seguridad en las instalaciones físicas",
              "Políticas de seguridad informática",
              "Programas de seguridad personal fuera del trabajo"
            ],
            correct: 0
          },
        ],
      },
  {
    id: 6,
    title: "La Gestión del Conflicto",
    subtitle: "Negociación y mediación",
    icon: "⚔️",
    questions: [
      {
        q: "Según la definición presentada en el documento, ¿cuál es el elemento fundamental de cualquier conflicto?",
        options: [
          "La presencia de agresión física",
          "La percepción de incompatibilidad entre objetivos, intereses o valores",
          "La falta de dinero",
          "La ausencia de comunicación escrita",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál de los siguientes NO es un tipo de conflicto clasificado en el ámbito sanitario según el documento?",
        options: [
          "Conflicto interpersonal",
          "Conflicto intrapersonal",
          "Conflicto organizacional",
          "Conflicto meteorológico",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es identificada como la causa MÁS común de conflicto en el ámbito de la enfermería?",
        options: [
          "La competencia por recursos limitados",
          "La falta de comunicación",
          "Las diferencias de horarios",
          "El exceso de personal disponible",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las CINCO fases del conflicto descritas en el documento en su orden correcto?",
        options: [
          "Resolución, crisis, escalada, percepción, desescalada",
          "Percepción, escalada, crisis, desescalada y resolución",
          "Escalada, percepción, desescalada, crisis, resolución",
          "Crisis, resolución, percepción, escalada, desescalada",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuál es la característica DEFINITORIA del estilo colaborativo de resolución de conflictos?",
        options: [
          "Busca ganar a toda costa sin importar la relación",
          "Evita el conflicto sin enfrentar a la otra parte",
          "Busca encontrar una solución que satisfaga a todas las partes siendo asertivo y cooperativo",
          "Cede ante todas las demandas de la otra parte",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la diferencia crítica entre mediación y arbitraje como técnicas de resolución de conflictos según el documento?",
        options: [
          "El mediador toma decisiones vinculantes; el árbitro solo facilita la comunicación",
          "El arbitraje es más lento que la mediación",
          "El mediador facilita comunicación sin decidir; el árbitro toma decisión vinculante tras analizar la información",
          "Ambas técnicas son exactamente iguales",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la razón específica por la que los conflictos no resueltos son especialmente preocupantes en enfermería?",
        options: [
          "Aumentan los costos administrativos",
          "Pueden comprometer la seguridad y el cuidado del paciente, siendo lo más importante",
          "Crean conflictos con los familiares",
          "Disminuyen el número de horas trabajadas",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las habilidades fundamentales que una enfermera DEBE desarrollar para gestionar eficazmente conflictos según el documento?",
        options: [
          "Autoridad absoluta y capacidad de sanción",
          "Autoconocimiento, empatía, comunicación efectiva, escucha activa y asertividad",
          "Solo experiencia en el puesto",
          "Capacidad de imponer decisiones",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuál es el factor principal que afecta la percepción del conflicto en su primera fase?",
        options: [
          "El salario del personal",
          "Las experiencias pasadas, expectativas y emociones",
          "El horario de trabajo",
          "El tamaño del hospital",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la implicación más grave de que un conflicto escale hacia la fase de crisis según las consecuencias descritas?",
        options: [
          "Disminuye la comunicación formal",
          "El conflicto se vuelve más intenso y difícil de controlar, pudiendo generar agresión física, sabotaje o abandono",
          "Se requiere más dinero en el presupuesto",
          "Los pacientes se quejan más de lo usual",
        ],
        correct: 1,
      },
        {
          q: "¿Qué se define como conflicto?",
          options: [
            "Una cooperación entre dos o más partes para alcanzar un objetivo común",
            "Una situación en la que dos o más partes perciben que sus objetivos, intereses o valores son incompatibles",
            "Una discusión informal entre colegas sobre temas no relacionados con el trabajo",
            "Un acuerdo entre dos partes sin la necesidad de mediación"
          ],
          correct: 1
        },
        {
          q: "¿Cuál es una causa común de conflicto en el ámbito sanitario?",
          options: [
            "Exceso de comunicación",
            "Claridad en roles y responsabilidades",
            "Falta de comunicación",
            "Abundancia de recursos"
          ],
          correct: 2
        },
        {
          q: "¿Qué tipo de conflicto se da entre diferentes departamentos de un centro sanitario?",
          options: [
            "Conflictos interpersonales",
            "Conflictos intrapersonales",
            "Conflictos organizacionales",
            "Conflictos éticos"
          ],
          correct: 2
        },
        {
          q: "¿Qué consecuencia puede tener un conflicto no resuelto?",
          options: [
            "Mejora de la moral y satisfacción laboral",
            "Disminución de la productividad",
            "Aumento de la claridad en roles y responsabilidades",
            "Mejora en la seguridad del paciente"
          ],
          correct: 1
        },
        {
          q: "¿Qué fase del conflicto implica la percepción de incompatibilidad entre las partes?",
          options: [
            "Escalada",
            "Crisis",
            "Percepción",
            "Desescalada"
          ],
          correct: 2
        },
        {
          q: "¿Qué estrategia es recomendada durante la fase de percepción del conflicto?",
          options: [
            "Separar a las partes",
            "Comunicarse con la otra parte para aclarar la situación",
            "Buscar ayuda de un tercero imparcial",
            "Establecer un canal de comunicación cerrado"
          ],
          correct: 1
        },
        {
          q: "¿Cuál es un estilo de resolución de conflictos?",
          options: [
            "Estilo competitivo",
            "Estilo independiente",
            "Estilo dependiente",
            "Estilo introvertido"
          ],
          correct: 0
        },
        {
          q: "¿Qué estilo de resolución de conflictos busca evitarlo a toda costa?",
          options: [
            "Estilo competitivo",
            "Estilo complaciente",
            "Estilo colaborativo",
            "Estilo evasivo"
          ],
          correct: 3
        },
        {
          q: "¿Cuál es el estilo más efectivo para la resolución de conflictos a largo plazo?",
          options: [
            "Estilo competitivo",
            "Estilo complaciente",
            "Estilo evasivo",
            "Estilo colaborativo"
          ],
          correct: 3
        },
        {
          q: "¿Qué técnica de gestión del conflicto implica un acuerdo mutuo entre las partes?",
          options: [
            "Arbitraje",
            "Negociación",
            "Mediación",
            "Conciliación"
          ],
          correct: 1
        },
        {
          q: "¿En qué proceso un tercero neutral ayuda a las partes a llegar a un acuerdo, sin proponer soluciones?",
          options: [
            "Arbitraje",
            "Mediación",
            "Conciliación",
            "Negociación"
          ],
          correct: 1
        },
        {
          q: "¿Qué habilidad implica ser capaz de expresar sus necesidades y deseos de forma clara y directa?",
          options: [
            "Escucha activa",
            "Flexibilidad",
            "Asertividad",
            "Tolerancia a la frustración"
          ],
          correct: 2
        },
        {
          q: "¿Qué se recomienda hacer para prevenir el conflicto?",
          options: [
            "Evitar toda comunicación",
            "Comunicación clara y efectiva",
            "Ignorar las señales de conflicto",
            "Promover la competencia entre colegas"
          ],
          correct: 1
        },
        {
          q: "¿Qué estrategia NO es recomendada para la gestión efectiva del conflicto?",
          options: [
            "Mantener la calma",
            "Concentrarse en las personas, no en los problemas",
            "Utilizar técnicas de comunicación efectiva",
            "Practicar la escucha activa"
          ],
          correct: 1
        },
        {
          q: "¿Qué fase del conflicto es crítica y representa el punto más álgido?",
          options: [
            "Percepción",
            "Escalada",
            "Crisis",
            "Resolución"
          ],
          correct: 2
        },
        {
          q: "¿Cuál es una causa del conflicto en el ámbito de la enfermería?",
          options: [
            "Sobrecarga de trabajo",
            "Exceso de recursos",
            "Comunicación excesiva",
            "Claridad excesiva en roles y responsabilidades"
          ],
          correct: 0
        },
        {
          q: "¿Cuál es una consecuencia del conflicto no resuelto en el ámbito sanitario?",
          options: [
            "Errores de asistencia sanitaria",
            "Mejora en la calidad de la atención al paciente",
            "Aumento de la moral entre los profesionales",
            "Disminución del estrés y la fatiga"
          ],
          correct: 0
        },
        {
          q: "¿Qué habilidad para la gestión del conflicto implica entender los sentimientos y necesidades de la otra persona?",
          options: [
            "Autoconocimiento",
            "Empatía",
            "Flexibilidad",
            "Toma de decisiones"
          ],
          correct: 1
        },
        {
          q: "¿Cuál de las siguientes NO es una técnica para la gestión del conflicto?",
          options: [
            "Arbitraje",
            "Negociación",
            "Competencia",
            "Mediación"
          ],
          correct: 2
        },
        {
          q: "¿Qué factor NO afecta la elección del estilo adecuado de resolución de conflictos?",
          options: [
            "La naturaleza del conflicto",
            "El color favorito de las personas involucradas",
            "Las características de las personas involucradas",
            "El contexto del conflicto"
          ],
          correct: 1
        },
        {
          q: "¿Qué se debe fomentar para prevenir conflictos según el texto?",
          options: [
            "Trabajo en equipo",
            "Competencia individual",
            "Aislamiento de los empleados",
            "Políticas y procedimientos ambiguos"
          ],
          correct: 0
        },
        {
          q: "¿Cuál es el primer paso en la gestión del conflicto según el texto?",
          options: [
            "Escalar el conflicto",
            "Identificar los primeros signos de conflicto",
            "Implementar un sistema de resolución de quejas inmediatamente",
            "Buscar ayuda de un tercero imparcial"
          ],
          correct: 1
        },
        {
          q: "¿Qué estilo de resolución de conflictos implica ceder ante las demandas de la otra parte para evitar el conflicto?",
          options: [
            "Estilo competitivo",
            "Estilo complaciente",
            "Estilo colaborativo",
            "Estilo evasivo"
          ],
          correct: 1
        },
        {
          q: "¿Qué recomendación NO se incluye para la prevención del conflicto?",
          options: [
            "Sea claro y directo en su comunicación",
            "Escuche atentamente el punto de vista de la otra persona",
            "Ignore las señales tempranas de conflicto",
            "Sea respetuoso y tolerante con las diferencias"
          ],
          correct: 2
        },
        {
          q: "¿Qué fase del conflicto implica buscar soluciones y negociar de buena fe?",
          options: [
            "Crisis",
            "Desescalada",
            "Percepción",
            "Resolución"
          ],
          correct: 3
        },
      {
        q: "Según la definición presentada en el documento, ¿cuál es la esencia fundamental de la motivación?",
        options: [
          "La fuerza interna que impulsa a las personas a actuar y persistir para alcanzar un objetivo",
          "La capacidad de trabajar más horas",
          "El dinero que recibe una persona",
          "La obediencia a la autoridad",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la correcta secuencia jerárquica de las cinco necesidades según Maslow aplicada a enfermería?",
        options: [
          "Fisiológicas, seguridad, afiliación, estima, autorrealización",
          "Autorrealización, estima, afiliación, seguridad, fisiológicas",
          "Seguridad, fisiológicas, afiliación, estima, autorrealización",
          "Estima, autorrealización, fisiológicas, seguridad, afiliación",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la distinción crítica entre factores de higiene y factores motivacionales según la teoría de Herzberg?",
        options: [
          "Los factores de higiene previenen insatisfacción; los motivacionales generan satisfacción activa",
          "Los factores de higiene generan satisfacción; los motivacionales previenen insatisfacción",
          "No hay diferencia entre ambos tipos",
          "Los factores motivacionales son menos importantes que los de higiene",
        ],
        correct: 0,
      },
      {
        q: "Según la Teoría X de McGregor, ¿cuál es la premisa fundamental sobre la naturaleza del trabajador?",
        options: [
          "Las personas son responsables y buscan la autorrealización",
          "Las personas son perezosas y evitan el trabajo, requiriendo supervisión y control",
          "Las personas son indiferentes al trabajo",
          "Las personas trabajan solo por dinero",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la diferencia crítica entre factores intrínsecos y extrínsecos en la motivación de enfermería?",
        options: [
          "Los intrínsecos provienen de autorrealización personal; los extrínsecos de condiciones externas como salario",
          "Los extrínsecos son más importantes que los intrínsecos",
          "Ambos son exactamente iguales",
          "Los intrínsecos dependen del salario",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuáles son los TRES estilos de liderazgo más efectivos para lograr motivación en equipos de enfermería?",
        options: [
          "Autoritario, autocrático y burocrático",
          "Transformacional, participativo y situacional",
          "Permisivo, delegativo y complaciente",
          "Coercitivo, directivo y correctivo",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el impacto específico de las diferentes formas de reconocimiento en la motivación del personal de enfermería según las estrategias descritas?",
        options: [
          "El reconocimiento público es la única forma efectiva",
          "Desde agradecimiento verbal hasta premios y oportunidades de desarrollo, todas impactan significativamente",
          "El reconocimiento tiene poco impacto en motivación",
          "Solo los premios económicos motivan",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es el papel crítico de un entorno laboral positivo en la motivación de enfermería?",
        options: [
          "No tiene relación con motivación",
          "Un clima de confianza, respeto, colaboración, buena comunicación y recursos adecuados son cruciales para mantener motivación",
          "Solo afecta la productividad",
          "Es menos importante que el salario",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la implicación fundamental de que la motivación y el desempeño están directamente relacionados con la calidad del cuidado al paciente?",
        options: [
          "No existe relación comprobada",
          "Personal motivado es más eficiente, comprometido y proporciona mejor atención; desmotivado compromete seguridad del paciente",
          "La calidad depende solo del equipamiento",
          "El paciente no nota diferencia en motivación del personal",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las estrategias CLAVE que los líderes de enfermería deben implementar para mantener motivación durante cambios organizacionales?",
        options: [
          "Imponer cambios sin explicación",
          "Comunicar claramente, explicar beneficios, mantener confianza y apoyar al equipo durante la transición",
          "Amenazar con despidos",
          "Ignorar la resistencia del personal",
        ],
        correct: 2,
  },
    ],
  },
  {
    id: 7,
    title: "Motivación en Enfermería",
    subtitle: "Teorías, factores y estrategias",
    icon: "✨",
    questions: [
      {
        q: "¿Qué es la motivación según la definición proporcionada?",
        options: [
          "Un objetivo externo que se impone a las personas",
          "Una fuerza interna que impulsa a las personas a actuar y persistir en sus acciones para alcanzar un objetivo",
          "Una teoría psicológica que solo se aplica en el ámbito laboral",
          "Un conjunto de técnicas de gestión empresarial"
        ],
        correct: 1
      },
      {
        q: "¿Cuál de las siguientes teorías no fue mencionada en el texto?",
        options: [
          "Teoría de las necesidades de Maslow",
          "Teoría de los dos factores de Herzberg",
          "Teoría de la disonancia cognitiva",
          "Teorías X e Y de McGregor"
        ],
        correct: 2
      },
      {
        q: "¿Por qué es crucial la motivación en los equipos de enfermería?",
        options: [
          "Porque reduce los costos operativos del hospital",
          "Porque incrementa el número de pacientes atendidos",
          "Porque mejora la calidad del servicio de atención a la salud",
          "Porque elimina la necesidad de supervisión"
        ],
        correct: 2
      },
      {
        q: "Según Maslow, ¿cuál es la necesidad más básica?",
        options: [
          "Necesidades de estima",
          "Necesidades fisiológicas",
          "Necesidades de autorrealización",
          "Necesidades de afiliación"
        ],
        correct: 1
      },
      {
        q: "¿Qué diferencia principal establece Herzberg en su teoría?",
        options: [
          "Entre necesidades personales y profesionales",
          "Entre motivación intrínseca y extrínseca",
          "Entre factores motivadores y de higiene",
          "Entre liderazgo autocrático y democrático"
        ],
        correct: 2
      },
      {
        q: "¿Qué visión tiene la Teoría Y de McGregor sobre las personas?",
        options: [
          "Las personas son irresponsables y buscan evitar el trabajo",
          "Las personas son responsables y buscan la autorrealización",
          "Las personas necesitan ser estrictamente controladas",
          "Las personas trabajan mejor bajo presión"
        ],
        correct: 1
      },
      {
        q: "¿Cuál de los siguientes es un factor intrínseco que influye en la motivación del personal de enfermería?",
        options: [
          "Salario",
          "Seguridad laboral",
          "Sentimiento de logro",
          "Relaciones con los compañeros"
        ],
        correct: 2
      },
      {
        q: "¿Qué aspecto NO es considerado un factor extrínseco de motivación?",
        options: [
          "Autonomía",
          "Condiciones de trabajo",
          "Liderazgo",
          "Oportunidades de desarrollo profesional"
        ],
        correct: 0
      },
      {
        q: "Según la teoría de Herzberg, ¿qué factor es considerado motivacional?",
        options: [
          "Salario",
          "Seguridad laboral",
          "Reconocimiento",
          "Ambiente físico del trabajo"
        ],
        correct: 2
      },
      {
        q: "¿Qué estrategia de motivación implica el reconocimiento del trabajo bien hecho?",
        options: [
          "Establecimiento de objetivos",
          "Reconocimiento",
          "Gestión del cambio",
          "Liderazgo situacional"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es la importancia de la comunicación efectiva en la motivación de equipos de enfermería?",
        options: [
          "Permite establecer horarios flexibles",
          "Ayuda a mantener una comunicación clara y abierta",
          "Facilita la gestión financiera del equipo",
          "Incrementa el salario del personal"
        ],
        correct: 1
      },
      {
        q: "¿Qué permite el establecimiento de objetivos en un equipo de enfermería?",
        options: [
          "Aumentar el salario base del equipo",
          "Fomentar la participación y compromiso del personal",
          "Reducir el número de pacientes por enfermera",
          "Eliminar la necesidad de capacitación continua"
        ],
        correct: 1
      },
      {
        q: "¿Qué NO es un consejo para líderes de equipos de enfermería según el texto?",
        options: [
          "Ignorar el feedback del equipo",
          "Fomentar un ambiente de trabajo positivo",
          "Brindar oportunidades de desarrollo profesional",
          "Mantener una comunicación clara y abierta"
        ],
        correct: 0
      },
      {
        q: "¿Cómo se describe la Teoría X de McGregor en el texto?",
        options: [
          "Las personas son creativas y buscan el trabajo en equipo",
          "Las personas son perezosas y evitan el trabajo",
          "Las personas prefieren ser lideradas que liderar",
          "Las personas son naturalmente competitivas"
        ],
        correct: 1
      },
      {
        q: "¿Qué aspecto es fundamental para mantener la motivación durante los cambios según el texto?",
        options: [
          "Reducir el número de cambios",
          "Mantener una comunicación abierta y honesta",
          "Aumentar el salario durante los cambios",
          "Evitar la participación del personal en el cambio"
        ],
        correct: 1
      },
      {
        q: "¿Qué NO se considera un factor intrínseco según el texto?",
        options: [
          "Condiciones de trabajo",
          "Sentido de pertenencia",
          "Reconocimiento",
          "Autonomía"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de estos no es un beneficio de un equipo de enfermería motivado mencionado en el texto?",
        options: [
          "Mayor número de vacaciones",
          "Mejor desempeño",
          "Reducción del estrés y el burnout",
          "Mejora en la calidad de la atención al paciente"
        ],
        correct: 0
      },
      {
        q: "¿Qué teoría propone niveles de necesidades desde las más básicas hasta las más complejas?",
        options: [
          "Teoría de los dos factores de Herzberg",
          "Teorías X e Y de McGregor",
          "Teoría de Maslow sobre las Necesidades",
          "Teoría de la disonancia cognitiva"
        ],
        correct: 2
      },
      {
        q: "¿Qué estrategia de motivación enfatiza el equilibrio entre la vida laboral y personal?",
        options: [
          "Flexibilidad en los horarios de trabajo",
          "Incremento de salario",
          "Reducción de la carga laboral",
          "Capacitación técnica"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un enfoque incorrecto según la teoría X e Y de McGregor para motivar a los equipos de enfermería?",
        options: [
          "Fomentar la autonomía y la responsabilidad",
          "Adoptar un liderazgo participativo",
          "Considerar que las personas son perezosas por naturaleza",
          "Crear un clima de trabajo positivo"
        ],
        correct: 2
      },
      {
        q: "¿Qué no es considerado un factor extrínseco que influye en la motivación?",
        options: [
          "Sentimiento de logro",
          "Condiciones de trabajo",
          "Oportunidades de desarrollo profesional",
          "Liderazgo"
        ],
        correct: 0
      },
      {
        q: "¿Qué acción no es recomendada para gestionar el cambio en la motivación del personal de enfermería?",
        options: [
          "Limitar la participación del personal en el proceso de cambio",
          "Brindar apoyo y capacitación",
          "Manejar las emociones del personal",
          "Involucrar al personal en el proceso de cambio"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el propósito de ofrecer reconocimiento y recompensas según el texto?",
        options: [
          "Disminuir la carga laboral",
          "Mostrar al personal que su trabajo es valorado",
          "Aumentar la competitividad entre los empleados",
          "Reducir los costos de formación"
        ],
        correct: 1
      },
      {
        q: "¿Qué no se menciona como un aspecto del buen ambiente de trabajo para motivar al personal de enfermería?",
        options: [
          "Competitividad entre colegas",
          "Clima de confianza, respeto y colaboración",
          "Buena comunicación y apoyo entre compañeros",
          "Recursos y herramientas adecuados para realizar el trabajo"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un principio del liderazgo transformacional aplicado a la enfermería según el texto?",
        options: [
          "Promover la competencia interna",
          "Ignorar el desarrollo profesional",
          "Inspirar al equipo a alcanzar objetivos desafiantes",
          "Centralizar la toma de decisiones"
        ],
        correct: 2
      },
    ],
  },
  {
    id: 8,
    title: "Trabajo en Equipo",
    subtitle: "Colaboración e interdependencia",
    icon: "🤝",
    questions: [
      {
        q: "Según la definición presentada en el documento, ¿cuál es el elemento esencial que diferencia el trabajo en equipo de otras formas de organización?",
        options: [
          "El esfuerzo colaborativo de personas con diferentes habilidades trabajando interdependientemente para un objetivo común",
          "Que todos trabajen en el mismo turno",
          "Que tengan el mismo salario",
          "Que compartan el mismo despacho",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la diferencia crítica entre un grupo de trabajo y un equipo según las características presentadas en la tabla del documento?",
        options: [
          "El grupo tiene baja colaboración e interdependencia individual; el equipo tiene alta colaboración e interdependencia compartida",
          "Los grupos trabajan más horas",
          "Los equipos son más grandes",
          "No existe diferencia significativa",
        ],
        correct: 1,
      },
      {
        q: "Según el modelo de desarrollo de equipos de Tuckman descrito en el documento, ¿cuál es la característica distintiva de la etapa de Tormenta (Storming)?",
        options: [
          "Los miembros aprenden a trabajar juntos efectivamente",
          "Los miembros expresan opiniones e ideas que pueden generar conflictos; es crucial aprender a manejarlos",
          "El equipo funciona de manera eficiente",
          "Los miembros se conocen por primera vez",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el propósito fundamental de la etapa de Normalización (Norming) en el desarrollo de un equipo de enfermería?",
        options: [
          "Disolver el equipo tras completar la tarea",
          "Establecer procedimientos estándar, mejores prácticas y roles claros donde se aprecia la fortaleza de cada miembro",
          "Expresar conflictos abiertamente",
          "Mejorar la eficiencia administrativa",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son los TRES atributos clave que caracterizan un equipo de trabajo eficaz en enfermería?",
        options: [
          "Centralización, competencia individual, jerarquía rígida",
          "Comunicación efectiva, confianza y respeto mutuo, liderazgo compartido",
          "Rapidez en decisiones, ausencia de conflictos, uniformidad de opiniones",
          "Control externo, autoridad única, responsabilidad individual",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es el impacto específico de una comunicación efectiva en el contexto dinámico y estresante de los servicios de salud?",
        options: [
          "Reduce la autonomía del personal",
          "Previene errores, facilita coordinación de tareas y asegura seguridad del paciente",
          "Disminuye la velocidad de respuesta",
          "No tiene impacto medible",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuál es la función crítica de la confianza y el respeto mutuo en la dinámica de un equipo de enfermería?",
        options: [
          "Permiten que miembros se sientan seguros compartiendo ideas, expresando preocupaciones y admitiendo errores sin temor a crítica",
          "Aumentan la carga de trabajo",
          "Reducen la responsabilidad individual",
          "Disminuyen la comunicación formal",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la ventaja fundamental del liderazgo compartido en un equipo de enfermería según las características descritas?",
        options: [
          "Un único líder toma todas las decisiones",
          "Diferentes individuos asumen liderazgo según sus fortalezas, experiencia y conocimientos específicos, promoviendo participación activa",
          "Elimina la necesidad de coordinación",
          "Reduce la responsabilidad colectiva",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la razón por la que la toma de decisiones consensuada, aunque requiere más tiempo, produce resultados más sostenibles?",
        options: [
          "Es más rápida que otros métodos",
          "Refleja el compromiso colectivo del equipo y es aceptada por todos los miembros",
          "Reduce la participación del equipo",
          "No requiere consideración de opiniones",
        ],
        correct: 2,
      },
      {
        q: "Según el análisis de barreras para el trabajo en equipo presentado en el documento, ¿cuál es la consecuencia más grave de la falta de liderazgo en un equipo de enfermería?",
        options: [
          "Mejora la comunicación interna",
          "Crea incertidumbre, falta de dirección y disminuye la cohesión, comprometiendo la efectividad del equipo",
          "Acelera la toma de decisiones",
          "Aumenta la confianza entre miembros",
        ],
        correct: 3,
      },
          {
            q: "¿Qué define al trabajo en equipo en el contexto de la enfermería?",
            options: [
              "Competencia entre profesionales",
              "Esfuerzo colaborativo para alcanzar un objetivo común",
              "Trabajo individual sin interacción",
              "Seguimiento de órdenes sin aportación personal"
            ],
            correct: 1
          },
          {
            q: "¿Cuál es una característica clave de un equipo de trabajo eficaz?",
            options: [
              "Comunicación ineficaz",
              "Falta de respeto mutuo",
              "Liderazgo compartido",
              "Evitación de conflictos"
            ],
            correct: 2
          },
          {
            q: "¿Qué diferencia principal hay entre un grupo de trabajo y un equipo?",
            options: [
              "Un equipo tiene baja colaboración",
              "Un grupo de trabajo tiene alta interdependencia",
              "Un equipo tiene compromiso alto",
              "Un grupo de trabajo tiene responsabilidad compartida"
            ],
            correct: 2
          },
          {
            q: "Según el modelo de Tuckman, ¿cuál es la primera etapa en el desarrollo de un equipo?",
            options: [
              "Formación",
              "Tormenta",
              "Normalización",
              "Desempeño"
            ],
            correct: 0
          },
          {
            q: "¿Qué etapa del desarrollo de un equipo implica el inicio de conflictos por expresión de ideas?",
            options: [
              "Formación",
              "Tormenta",
              "Normalización",
              "Desempeño"
            ],
            correct: 1
          },
          {
            q: "Durante la etapa de 'Desempeño', ¿cómo operan los miembros del equipo?",
            options: [
              "Con alta dependencia",
              "Con comunicación limitada",
              "De manera eficiente y efectiva",
              "Con objetivos individuales"
            ],
            correct: 2
          },
          {
            q: "¿Qué beneficio trae el trabajo en equipo a los pacientes?",
            options: [
              "Reducción de la calidad de atención",
              "Mejora de la calidad de la atención",
              "Aumento de errores médicos",
              "Disminución de la seguridad del paciente"
            ],
            correct: 1
          },
          {
            q: "¿Cuál es una habilidad clave para el trabajo en equipo en enfermería?",
            options: [
              "Comunicación efectiva",
              "Liderazgo autoritario",
              "Trabajo en silos",
              "Evitación de feedback"
            ],
            correct: 0
          },
          {
            q: "¿Cómo se describe el liderazgo compartido en un equipo de enfermería eficaz?",
            options: [
              "Un único líder toma todas las decisiones",
              "Las responsabilidades de liderazgo se distribuyen entre miembros",
              "Falta de liderazgo",
              "Liderazgo basado en la antigüedad"
            ],
            correct: 1
          },
          {
            q: "¿Qué estrategia es fundamental para fomentar el trabajo en equipo?",
            options: [
              "Promover la competencia entre miembros",
              "Limitar la comunicación",
              "Crear un ambiente de trabajo positivo",
              "Definir objetivos contradictorios"
            ],
            correct: 2
          },
          {
            q: "¿Qué representa la toma de decisiones consensuada en un equipo?",
            options: [
              "Decisiones tomadas únicamente por el líder",
              "Ignorar las opiniones de los miembros",
              "Acuerdos aceptados y apoyados por todos los miembros",
              "Decisiones rápidas sin discusión"
            ],
            correct: 2
          },
          {
            q: "¿Cuál es una barrera común para el trabajo en equipo en enfermería?",
            options: [
              "Comunicación efectiva",
              "Falta de comunicación",
              "Demasiada confianza",
              "Uniformidad de personalidades"
            ],
            correct: 1
          },
          {
            q: "¿Cómo se puede superar la falta de confianza en un equipo de enfermería?",
            options: [
              "Ignorando los conflictos",
              "Fomentando experiencias compartidas de fiabilidad",
              "Estableciendo un liderazgo autoritario",
              "Reduciendo la comunicación"
            ],
            correct: 1
          },
          {
            q: "¿Qué importancia tiene el liderazgo compartido en un equipo de enfermería?",
            options: [
              "Disminuye la participación de los miembros",
              "Limita la diversidad de habilidades",
              "Mejora la toma de decisiones y fomenta la innovación",
              "Aumenta la dependencia de un único líder"
            ],
            correct: 2
          },
          {
            q: "¿Qué etapa del modelo de Tuckman se enfoca en establecer normas y roles del equipo?",
            options: [
              "Formación",
              "Tormenta",
              "Normalización",
              "Desempeño"
            ],
            correct: 2
          },
          {
            q: "¿Qué beneficio aporta el trabajo en equipo a los profesionales de la salud?",
            options: [
              "Aumento del estrés",
              "Mayor satisfacción laboral",
              "Disminución de la colaboración",
              "Reducción de oportunidades de aprendizaje"
            ],
            correct: 1
          },
          {
            q: "¿Cuál es un ejemplo de cómo el trabajo en equipo beneficia a los pacientes?",
            options: [
              "Atención fragmentada",
              "Cuidados paliativos integrales",
              "Aumento de errores de medicación",
              "Disminución de la comunicación entre profesionales"
            ],
            correct: 1
          },
          {
            q: "¿Cómo se diferencia un equipo de un grupo de trabajo en términos de liderazgo?",
            options: [
              "Liderazgo centralizado en el grupo de trabajo",
              "Liderazgo compartido en el equipo",
              "Falta de liderazgo en ambos",
              "Liderazgo autoritario en el equipo"
            ],
            correct: 1
          },
          {
            q: "¿Qué rol juega la flexibilidad y adaptabilidad en un equipo de enfermería?",
            options: [
              "Limita la capacidad de respuesta del equipo",
              "Es fundamental para adaptarse a nuevas situaciones",
              "Reduce la eficiencia del equipo",
              "Aumenta la dependencia de protocolos rígidos"
            ],
            correct: 1
          },
          {
            q: "¿Qué estrategia ayuda a definir la dirección del equipo de enfermería?",
            options: [
              "Evitar establecer objetivos",
              "Definir objetivos comunes y roles claros",
              "Promover objetivos individuales",
              "Mantener los roles ambiguos"
            ],
            correct: 1
          },
          {
            q: "¿Cómo afecta la falta de liderazgo al trabajo en equipo en enfermería?",
            options: [
              "Mejora automáticamente la colaboración",
              "Conduce a una dirección confusa y moral baja",
              "Aumenta la eficacia del equipo",
              "Fomenta el liderazgo compartido"
            ],
            correct: 1
          },
          {
            q: "¿Qué característica no es deseable en un equipo de trabajo eficaz?",
            options: [
              "Comunicación efectiva",
              "Confianza y respeto mutuo",
              "Liderazgo compartido",
              "Evitación de conflictos"
            ],
            correct: 3
          },
          {
            q: "¿Qué representa la etapa de 'Disolución' en el modelo de Tuckman?",
            options: [
              "Inicio del trabajo en equipo",
              "Generación de conflictos",
              "El equipo se disuelve tras completar su tarea",
              "Establecimiento de normas y roles"
            ],
            correct: 2
          },
          {
            q: "¿Qué importancia tiene celebrar los éxitos del equipo?",
            options: [
              "Disminuye la moral del equipo",
              "Aumenta la competencia interna",
              "Fortalece el espíritu de equipo y aumenta la moral",
              "Reduce la eficiencia del equipo"
            ],
            correct: 2
          },
          {
            q: "¿Cuál es una barrera para el trabajo en equipo que implica diferencias entre miembros?",
            options: [
              "Comunicación excesiva",
              "Demasiada confianza",
              "Diferencias de personalidad o valores",
              "Liderazgo compartido eficaz"
            ],
            correct: 2
          },
        ],
      },
  {
    id: 9,
    title: "Imagen Digital de la Enfermera",
    subtitle: "Presencia y reputación online",
    icon: "📱",
    questions: [
      {
        q: "Según el documento, ¿cuál es el impacto fundamental de una imagen digital positiva en la profesión enfermera?",
        options: [
          "Genera confianza en pacientes, facilita oportunidades laborales y desarrolla carrera profesional; puede conseguir formación, investigación y liderazgo",
          "Permite ganar dinero en redes sociales",
          "Requiere que todos los enfermeros tengan presencia online",
          "No tiene ningún impacto en la carrera profesional",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la composición fundamental de la identidad digital según el documento?",
        options: [
          "Solo la foto de perfil",
          "Nombre, foto de perfil, biografía, publicaciones y actividad en redes",
          "Únicamente el número de seguidores",
          "Solo la información profesional",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son los CINCO principios clave de la comunicación digital efectiva en enfermería?",
        options: [
          "Claridad, precisión, relevancia, concreción y corrección",
          "Rapidez, popularidad, entretenimiento, diversión y creatividad",
          "Brevedad, anonimato, confidencialidad, formalidad y silencio",
          "Autoridad, dominación, control, poder y autoreferencia",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es la diferencia crítica entre un sitio web personal y las redes sociales como herramientas de proyección profesional?",
        options: [
          "El sitio web permite presentar formación, experiencia, visión, valores y servicios de forma completa y controlada; las redes son más breves e inmediatas",
          "Las redes sociales son mejores porque permiten más interacción",
          "Un sitio web es innecesario si tienes redes sociales",
          "No existe diferencia funcional entre ambas herramientas",
        ],
        correct: 0,
      },
      {
        q: "Según el análisis del documento sobre aspectos positivos de la presencia enfermera en redes, ¿cuál es el beneficio más relevante para la profesión?",
        options: [
          "Proyectar una imagen experta y profesional que genera confianza en la población hacia las enfermeras",
          "Aumentar el número de me gusta",
          "Tener más amigos online",
          "Poder criticar a otros profesionales",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los objetivos específicos que una enfermera debe definir al construir su imagen digital según el documento?",
        options: [
          "Ganar premios y reconocimiento personal",
          "Visibilidad, reputación, networking, oportunidades laborales y conectar con público específico",
          "Solo promoción económica",
          "Entretenimiento y diversión",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es el propósito fundamental de crear una marca personal coherente en el entorno digital?",
        options: [
          "Diferenciarse como profesional único; definir valor diferencial, identidad visual, contenido de calidad, consistencia y autenticidad",
          "Copiar a otros profesionales exitosos",
          "Ser lo más polémico posible para generar atención",
          "Mantener máximo secreto sobre la actividad profesional",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los requisitos CRÍTICOS para el cuidado ético del contenido que una enfermera publica según el documento?",
        options: [
          "Comprobar información, respetar privacidad de pacientes, evitar autopromoción excesiva, no publicar contenido inapropiado u ofensivo",
          "Publicar todo sin revisar",
          "Compartir casos clínicos detallados con nombres de pacientes",
          "Maximizar autopromoción y venta de servicios",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la función específica de las redes sociales profesionales como LinkedIn versus las redes generalistas?",
        options: [
          "LinkedIn permite conectar profesionales, compartir experiencia laboral, curriculum y publicaciones; redes generalistas tienen audiencia más amplia",
          "Todas las redes son idénticas en función",
          "LinkedIn no es útil para enfermeras",
          "Las redes generalistas son más profesionales que LinkedIn",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los retos críticos que enfrenta una enfermera en la construcción de su imagen digital según los aspectos a mejorar descritos?",
        options: [
          "Alto nivel de competencia, necesidad de actualización permanente, protección de privacidad y combate contra estereotipos de género",
          "No hay ningún reto importante",
          "Solo mantener muchos seguidores",
          "La única dificultad es tener una foto bonita",
        ],
        correct: 0,
      },
      {
        q: "¿Qué impacto tiene la imagen digital en la comunicación y el desarrollo profesional actual?",
        options: [
          "Impacto significativo",
          "Ninguno",
          "Impacto negativo",
          "Solo afecta a las redes sociales"
        ],
        correct: 0
      },
      {
        q: "¿Por qué es relevante la imagen digital para las enfermeras?",
        options: [
          "Afecta la confianza de los pacientes",
          "No es relevante",
          "Solo para fines personales",
          "Solo afecta la búsqueda de empleo"
        ],
        correct: 0
      },
      {
        q: "¿Cómo puede una enfermera generar confianza en sus pacientes a través de su imagen digital?",
        options: [
          "Teniendo una presencia online profesional y positiva",
          "Publicando contenido personal",
          "Ignorando las redes sociales",
          "Usando únicamente LinkedIn"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa la identidad digital de una enfermera?",
        options: [
          "Su presencia en redes sociales, publicaciones y actividad online",
          "Solo su currículum vitae",
          "Únicamente su perfil de LinkedIn",
          "Sus interacciones personales offline"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una herramienta clave para construir una imagen digital positiva según el texto?",
        options: [
          "Las redes sociales y plataformas profesionales",
          "Evitar todas las redes sociales",
          "Publicar exclusivamente contenido de entretenimiento",
          "No interactuar con otros profesionales online"
        ],
        correct: 0
      },
      {
        q: "¿Qué se recomienda para mantener una imagen digital profesional y ética?",
        options: [
          "Comprobar la información y respetar la privacidad de los pacientes",
          "Publicar cualquier tipo de contenido",
          "No verificar la información antes de compartirla",
          "Usar un tono confrontativo en las interacciones online"
        ],
        correct: 0
      },
      {
        q: "¿Cómo puede influir la presencia digital de una enfermera en la percepción pública de la profesión?",
        options: [
          "Puede aumentar la visibilidad y conocimiento sobre la enfermería",
          "No tiene influencia",
          "Solo influencia negativa",
          "Disminuye la confianza en la profesión"
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto es crucial al construir una imagen digital profesional?",
        options: [
          "Comunicación digital efectiva",
          "Ignorar las críticas constructivas",
          "Limitar la presencia online a una sola plataforma",
          "Evitar compartir logros profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué deben evitar las enfermeras al usar redes sociales profesionales?",
        options: [
          "Publicar contenido inapropiado u ofensivo",
          "Conectar con otros profesionales",
          "Compartir conocimientos y experiencias",
          "Promocionar su marca personal"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un desafío significativo de la imagen digital en enfermería?",
        options: [
          "La desinformación y las fake news",
          "Usar demasiadas redes sociales",
          "Tener una presencia digital positiva",
          "Evitar toda presencia online"
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia NO es recomendada para construir una imagen digital positiva?",
        options: [
          "Crear contenido de baja calidad",
          "Definir una marca personal clara",
          "Ser auténtico online",
          "Interactuar con otros profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué beneficio proporciona una buena imagen digital a las enfermeras en su carrera profesional?",
        options: [
          "Aumenta las oportunidades de formación e investigación",
          "Limita las oportunidades laborales",
          "Disminuye la visibilidad profesional",
          "Reduce la confianza de los pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Qué herramienta NO es mencionada como útil para la gestión de la imagen digital en enfermería?",
        options: [
          "Ninguna de las anteriores",
          "LinkedIn",
          "Canva",
          "Facebook"
        ],
        correct: 0
      },
      {
        q: "¿Qué acción es fundamental para enfrentar los retos de la imagen digital en enfermería?",
        options: [
          "Desarrollar una red de apoyo online",
          "Ignorar los desafíos",
          "Publicar contenido sin verificar",
          "Limitar la interacción con otros profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el principal objetivo al definir la audiencia objetivo de la imagen digital de una enfermera?",
        options: [
          "Mejorar la visibilidad y reputación online",
          "Ignorar las necesidades del público",
          "Aumentar la confusión sobre la enfermería",
          "Reducir la interacción con el público"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO es una práctica recomendada para la construcción de una imagen digital profesional?",
        options: [
          "Publicar información no verificada",
          "Claridad en los mensajes",
          "Mantener una ortografía y gramática impecables",
          "Respetar y ser cordial en las interacciones online"
        ],
        correct: 0
      },
      {
        q: "¿Cómo pueden las enfermeras promover una representación más diversa e inclusiva en línea?",
        options: [
          "Denunciando la discriminación y el sexismo",
          "Manteniendo los estereotipos existentes",
          "Ignorando los sesgos de género",
          "Limitando su presencia en redes sociales"
        ],
        correct: 0
      },
      {
        q: "¿Qué elemento NO es parte de la identidad digital según el texto?",
        options: [
          "Dirección física",
          "Nombre",
          "Foto de perfil",
          "Biografía"
        ],
        correct: 0
      },
      {
        q: "¿Qué beneficio ofrece el sitio web personal para las enfermeras?",
        options: [
          "Diferenciarse de la competencia",
          "Disminuir su credibilidad profesional",
          "Limitar su visibilidad online",
          "Aumentar los estereotipos"
        ],
        correct: 0
      },
      {
        q: "¿Qué consejo NO se da para enfrentar el ciberacoso?",
        options: [
          "Publicar contenido provocativo",
          "Ignorar a los trolls",
          "Bloquear a los usuarios acosadores",
          "Denunciar el acoso a las plataformas"
        ],
        correct: 0
      },
      {
        q: "¿Qué factor NO se menciona como parte de la construcción de una marca personal coherente?",
        options: [
          "Ser inconsistente en las plataformas",
          "Desarrollar una identidad visual",
          "Definir el valor diferencial",
          "Crear contenido de calidad"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO es un aspecto a mejorar en la imagen digital en enfermería?",
        options: [
          "Reducir la visibilidad online",
          "Combatir estereotipos de género",
          "Aumentar la presencia en puestos de liderazgo",
          "Mostrar la diversidad de la profesión"
        ],
        correct: 0
      },
      {
        q: "¿Cómo pueden las enfermeras aumentar su visibilidad profesional según el texto?",
        options: [
          "Participando activamente en redes sociales y plataformas online",
          "Limitando su participación en eventos online",
          "Usando una única red social",
          "No compartiendo logros o experiencias"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO se sugiere para gestionar efectivamente la imagen digital en enfermería?",
        options: [
          "Ignorar el feedback negativo",
          "Publicar contenido regularmente",
          "Interactuar con seguidores",
          "Mantenerse actualizado con tendencias digitales"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un beneficio directo de una imagen digital positiva para las enfermeras en el ámbito laboral?",
        options: [
          "Acceso a mejores oportunidades laborales",
          "Disminución de ofertas de trabajo",
          "Menor visibilidad en búsquedas de empleo",
          "Aumento de la competencia profesional"
        ],
        correct: 0
      },
    ],
  },
  {
    id: 10,
    title: "Toma de Decisiones",
    subtitle: "Proceso y herramientas críticas",
    icon: "🧠",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de la toma de decisiones en enfermería?",
        options: [
          "Proceso complejo y continuo que implica seleccionar la mejor opción entre alternativas, considerando evidencia científica, valores del paciente, recursos disponibles y juicio profesional",
          "Elegir rápidamente sin pensar",
          "Seguir siempre las órdenes del médico",
          "Solo tomar decisiones urgentes",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son las TRES categorías de factores que influyen en la toma de decisiones según el documento?",
        options: [
          "Solo factores del paciente",
          "Factores individuales, del entorno y del paciente",
          "Solo factores administrativos",
          "Factores económicos únicamente",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la CORRECTA secuencia de las cinco fases del proceso de toma de decisiones?",
        options: [
          "Identificación, análisis, planificación, ejecución y evaluación",
          "Evaluación, identificación, análisis, planificación, ejecución",
          "Análisis, identificación, ejecución, planificación, evaluación",
          "Planificación, identificación, ejecución, análisis, evaluación",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los CUATRO modelos principales de toma de decisiones descritos en el documento?",
        options: [
          "Racional, intuitiva, basada en evidencia y en equipo",
          "Solo racional",
          "Solo intuitiva",
          "Autoritaria, democrática, consultiva y autocrática",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es el rol CRÍTICO del pensamiento crítico en el proceso de toma de decisiones?",
        options: [
          "No tiene importancia",
          "Es esencial; permite evaluar información, identificar problemas, generar soluciones creativas y tomar decisiones bien fundamentadas",
          "Solo se usa en emergencias",
          "Es solo para estudiantes",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son las características DEFINITORIAS de las situaciones complejas en enfermería según el documento?",
        options: [
          "Siempre son urgentes",
          "Incertidumbre, ambigüedad, falta de información, múltiples factores y presión temporal",
          "Solo falta de dinero",
          "Problemas con el personal",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las PRINCIPALES herramientas disponibles para apoyar la toma de decisiones?",
        options: [
          "Solo intuición",
          "Escalas valoración, guías clínicas, protocolos, sistemas información, software análisis datos y técnicas resolución problemas",
          "Solo experiencia",
          "Nada, solo juicio profesional",
        ],
        correct: 2,
      },
      {
        q: "¿Cuál es el impacto específico de los factores del entorno en la toma de decisiones según el análisis del documento?",
        options: [
          "No influyen en absoluto",
          "Recursos disponibles, tiempo, presión asistencial y protocolos afectan significativamente la calidad decisiones",
          "Solo influye el dinero",
          "La ubicación geográfica es lo único importante",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuál es la razón fundamental por la que el trabajo en equipo y colaboración son ESENCIALES en situaciones complejas?",
        options: [
          "Para pasar el tiempo",
          "Proporciona perspectivas múltiples, apoyo mutuo y genera soluciones innovadoras imposibles para una persona sola",
          "Es simplemente reglamentario",
          "Para evitar responsabilidades",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son las estrategias CLAVE que una enfermera debe aplicar para tomar decisiones efectivas en situaciones complejas?",
        options: [
          "Decidir rápido sin información",
          "Recopilar máxima información, consultar profesionales, usar herramientas apoyo, considerar valores paciente, conocer sesgos propios, tomar decisiones provisionales reviables",
          "Actuar solo",
          "Ignorar la información nueva",
        ],
        correct: 1,
      },
      {
        q: "¿Qué es la toma de decisiones en enfermería?",
        options: [
          "Elegir el mejor vendaje para una herida",
          "Proceso de selección de la mejor opción entre alternativas para cuidado de calidad",
          "Decidir si un paciente necesita ser intubado",
          "Administrar medicamentos prescritos"
        ],
        correct: 1
      },
      {
        q: "¿Qué impacto tienen las decisiones de las enfermeras?",
        options: [
          "Cambian los protocolos hospitalarios",
          "Afectan la administración del hospital",
          "Impactan la salud y bienestar de los pacientes",
          "Modifican las leyes de salud"
        ],
        correct: 2
      },
      {
        q: "¿Qué factor NO se considera en la toma de decisiones en enfermería?",
        options: [
          "Evidencia científica",
          "Valores del paciente",
          "Color favorito del paciente",
          "Recursos disponibles"
        ],
        correct: 2
      },
      {
        q: "¿Qué modelo asume que las enfermeras toman decisiones de forma racional?",
        options: [
          "Modelo de toma de decisiones racional",
          "Modelo de toma de decisiones intuitiva",
          "Modelo de toma de decisiones basada en la evidencia",
          "Modelo de toma de decisiones en equipo"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es la primera fase del proceso de toma de decisiones en enfermería?",
        options: [
          "Análisis de datos",
          "Planificación",
          "Ejecución",
          "Identificación del problema"
        ],
        correct: 3
      },
      {
        q: "¿Qué herramienta permite a las enfermeras medir la gravedad de un problema?",
        options: [
          "Guías de práctica clínica",
          "Protocolos",
          "Sistemas de información",
          "Escalas de valoración"
        ],
        correct: 3
      },
      {
        q: "¿Cuál es un factor individual que influye en la toma de decisiones en enfermería?",
        options: [
          "Recursos disponibles",
          "Presión asistencial",
          "Conocimiento",
          "Protocolos y normas"
        ],
        correct: 2
      },
      {
        q: "¿Qué característica NO describe una situación compleja en enfermería?",
        options: [
          "Incertidumbre",
          "Claridad de información",
          "Ambigüedad",
          "Múltiples factores a considerar"
        ],
        correct: 1
      },
      {
        q: "¿Qué nivel de decisiones incluye la asignación de personal?",
        options: [
          "Decisiones simples",
          "Decisiones estratégicas",
          "Decisiones operativas",
          "Decisiones inciertas"
        ],
        correct: 2
      },
      {
        q: "¿Qué técnica implica preguntar '¿Por qué?' repetidamente hasta llegar a la raíz de un problema?",
        options: [
          "Brainstorming",
          "Diagrama de flujo",
          "Método de los Cinco Porqués",
          "Matriz de decisión"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es un objetivo de la mejora continua de la calidad y seguridad del paciente?",
        options: [
          "Aumentar los ingresos del hospital",
          "Reducir errores e incidentes",
          "Cambiar la misión del hospital",
          "Aumentar la carga de trabajo"
        ],
        correct: 1
      },
      {
        q: "¿Qué herramienta es útil para identificar factores internos y externos en la toma de decisiones?",
        options: [
          "Análisis DAFO",
          "Protocolos",
          "Escalas de valoración",
          "Software de Gestión de Datos"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO es un factor del entorno que influye en la toma de decisiones en enfermería?",
        options: [
          "Valores culturales y religiosos del paciente",
          "Recursos disponibles",
          "Tiempo",
          "Presión asistencial"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un beneficio del trabajo en equipo y la colaboración en la toma de decisiones?",
        options: [
          "Reducción de la diversidad de conocimientos",
          "Soluciones innovadoras",
          "Aumento del estrés laboral",
          "Disminución del apoyo mutuo"
        ],
        correct: 1
      },
      {
        q: "¿Qué aplicación de las tecnologías de la información NO se menciona en el contexto de la toma de decisiones en enfermería?",
        options: [
          "Videojuegos para entrenamiento",
          "Sistemas de información clínica",
          "Bases de datos de evidencia científica",
          "Herramientas de apoyo a la toma de decisiones"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de los siguientes NO es un factor del paciente que influye en la toma de decisiones en enfermería?",
        options: [
          "Preferencias y deseos del paciente",
          "Valores culturales y religiosos del paciente",
          "Marca favorita de ropa del paciente",
          "Estado de salud del paciente"
        ],
        correct: 2
      },
      {
        q: "¿Qué modelo reconoce que las enfermeras toman decisiones basadas en su intuición?",
        options: [
          "Modelo de toma de decisiones racional",
          "Modelo de toma de decisiones intuitiva",
          "Modelo de toma de decisiones basada en la evidencia",
          "Modelo de toma de decisiones en equipo"
        ],
        correct: 1
      },
      {
        q: "¿Cuál fase NO es parte del proceso de toma de decisiones en enfermería?",
        options: [
          "Reflexión",
          "Análisis de datos",
          "Planificación",
          "Evaluación"
        ],
        correct: 0
      },
      {
        q: "¿Cuál herramienta NO es mencionada como apoyo para la toma de decisiones?",
        options: [
          "Guías de práctica clínica",
          "Enciclopedias médicas impresas",
          "Protocolos",
          "Software de Gestión de Datos"
        ],
        correct: 1
      },
      {
        q: "¿Qué esencial NO es parte de la toma de decisiones de la gestora enfermera?",
        options: [
          "Mejora de la cafetería del hospital",
          "Definición de la misión, visión y valores del servicio de enfermería",
          "Planificación de recursos humanos y materiales",
          "Desarrollo de políticas y procedimientos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál estrategia NO se recomienda para la toma de decisiones en situaciones complejas?",
        options: [
          "Ignorar los valores y preferencias del paciente",
          "Recopilar la mayor cantidad de información posible",
          "Consultar con otros profesionales de la salud",
          "Utilizar herramientas de apoyo a la toma de decisiones"
        ],
        correct: 0
      },
      {
        q: "¿Qué NO se considera un factor que afecta la toma de decisiones en enfermería?",
        options: [
          "Color de las paredes en el hospital",
          "Conocimiento",
          "Experiencia",
          "Valores personales y profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué beneficio NO se asocia con el análisis DAFO en la toma de decisiones?",
        options: [
          "Identificación de nuevas tendencias de moda",
          "Identificación de debilidades",
          "Reconocimiento de amenazas",
          "Aprovechamiento de oportunidades"
        ],
        correct: 0
      },
      {
        q: "¿Cuál no es un tipo de decisión en el contexto de la enfermería?",
        options: [
          "Decisiones de color",
          "Decisiones simples",
          "Decisiones complejas",
          "Decisiones urgentes"
        ],
        correct: 0
      },
      {
        q: "¿Qué modelo enfatiza la importancia de utilizar la mejor evidencia científica disponible?",
        options: [
          "Modelo de toma de decisiones racional",
          "Modelo de toma de decisiones intuitiva",
          "Modelo de toma de decisiones basada en la evidencia",
          "Modelo de toma de decisiones en equipo"
        ],
        correct: 2
      },
    ],
  },
  {
    id: 11,
    title: "Planificación y Gestión del Tiempo",
    subtitle: "Procesos y metodologías estratégicas",
    icon: "⏱️",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de la planificación?",
        options: [
          "Hacer listas de tareas sin orden",
          "Proceso de establecer objetivos y metas, desarrollando plan de acción para alcanzarlos; herramienta esencial para éxito personal, profesional y social",
          "Solo para empresas grandes",
          "Una tarea administrativa innecesaria",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los TRES tipos principales de planificación organizacional descritos en el documento?",
        options: [
          "Personal, familiar y social",
          "Estratégica, táctica y operativa",
          "Rápida, media y lenta",
          "Financiera, legal y administrativa",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es la diferencia crítica entre planificación estratégica y planificación táctica?",
        options: [
          "Estratégica define dirección a largo plazo basada en análisis FODA; táctica traduce objetivos estratégicos en planes de acción específicos a corto plazo",
          "No hay diferencia",
          "Táctica es más importante",
          "Estratégica es solo teórica",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es el propósito fundamental de la planificación operativa en contexto de enfermería?",
        options: [
          "Establecer visión empresarial",
          "Desarrollar detalles de implementación día a día; gestión tareas, priorización, seguimiento operaciones",
          "Solo para reuniones",
          "Prevenir cambios organizacionales",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son los CUATRO pasos clave del método ABC para planificación?",
        options: [
          "Identificar tareas, clasificar A-B-C, priorizar A, planificar B-C y revisar regularmente",
          "Solo hacer lista",
          "Ignorar importancia",
          "Hacer todo a la vez",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la estructura fundamental de la matriz de Eisenhower según el documento?",
        options: [
          "Tres cuadrantes",
          "Cuatro cuadrantes basados en importancia y urgencia para clasificar tareas",
          "Solo dos opciones",
          "Cinco niveles de prioridad",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es el propósito CRÍTICO del análisis DAFO en planificación estratégica?",
        options: [
          "Decorar reportes",
          "Diagnóstico situación actual identificando factores internos (fortalezas-debilidades) y externos (oportunidades-amenazas) que afectan éxito",
          "Solo cumplimiento",
          "Marketing",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las herramientas PRINCIPALES para la planificación táctica según el documento?",
        options: [
          "Solo reuniones verbales",
          "Diagramas flujo, diagramas Gantt, PERT, CPM para visualizar cronogramas y ruta crítica",
          "Intuición personal",
          "Secretaría",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la función crítica de las herramientas software en la planificación?",
        options: [
          "Complicar procesos",
          "Mejoran eficiencia ofreciendo calendarios, gestión tareas, seguimiento progreso, comunicación y colaboración",
          "No sirven",
          "Solo para reportes bonitos",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los CUATRO beneficios esenciales de una planificación eficaz según el análisis del documento?",
        options: [
          "Ser más lento",
          "Ser más productivo, alcanzar objetivos rápido/eficiente, reducir estrés/ansiedad, mejorar calidad vida",
          "Causas aburrimiento",
          "Reduce capacidad",
        ],
        correct: 0,
      },
      {
        q: "¿Qué es la planificación?",
        options: [
          "Un proceso de solución de problemas",
          "Una herramienta para el éxito en cualquier ámbito de la vida",
          "Una metodología de evaluación",
          "Un sistema de control de calidad"
        ],
        correct: 1
      },
      {
        q: "¿Cuál de los siguientes no es un beneficio de la planificación eficaz?",
        options: [
          "Ser más productivos",
          "Reducir el estrés y la ansiedad",
          "Aumentar el estrés",
          "Mejorar nuestra calidad de vida"
        ],
        correct: 2
      },
      {
        q: "¿Qué tipo de planificación se utiliza para establecer objetivos personales?",
        options: [
          "Planificación empresarial",
          "Planificación financiera",
          "Planificación personal",
          "Planificación de proyectos"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es el primer paso en la planificación según los principios básicos?",
        options: [
          "Identificación de recursos",
          "Establecimiento de objetivos y metas",
          "Desarrollo de un plan de acción",
          "Seguimiento y evaluación del plan"
        ],
        correct: 1
      },
      {
        q: "¿Qué herramienta se utiliza para realizar un diagnóstico de la situación actual de una organización en la planificación estratégica?",
        options: [
          "Matriz BCG",
          "Cuadro de Mando Integral",
          "Análisis FODA",
          "Diagramas de Gantt"
        ],
        correct: 2
      },
      {
        q: "¿Qué representa el Cuadrante 1 en la matriz de Eisenhower?",
        options: [
          "Importante y urgente",
          "Importante, pero no urgente",
          "No importante, pero urgente",
          "No importante ni urgente"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes es una herramienta visual que permite organizar ideas y conceptos de forma jerárquica?",
        options: [
          "Diagramas de flujo",
          "Mapas mentales",
          "Matriz de decisiones",
          "Listas de tareas"
        ],
        correct: 1
      },
      {
        q: "¿Qué metodología de planificación se centra en el corto plazo y en la asignación de recursos para alcanzar los objetivos?",
        options: [
          "Planificación estratégica",
          "Planificación táctica",
          "Planificación operativa",
          "Planificación por proyectos"
        ],
        correct: 1
      },
      {
        q: "¿Qué técnica se utiliza para determinar la ruta crítica de un proyecto?",
        options: [
          "PERT",
          "CPM",
          "Diagramas de Gantt",
          "Análisis FODA"
        ],
        correct: 1
      },
      {
        q: "¿Qué categoría en el método ABC incluye tareas que son importantes para el éxito a largo plazo pero no urgentes?",
        options: [
          "A",
          "B",
          "C",
          "Ninguna de las anteriores"
        ],
        correct: 1
      },
      {
        q: "¿Qué tipo de planificación se enfoca en el día a día de las operaciones de la organización?",
        options: [
          "Planificación táctica",
          "Planificación operativa",
          "Planificación estratégica",
          "Planificación por proyectos"
        ],
        correct: 1
      },
      {
        q: "¿Qué herramienta ayuda a tomar decisiones de forma racional y sistemática?",
        options: [
          "Diagramas de flujo",
          "Mapas mentales",
          "Matriz de decisiones",
          "Software de planificación"
        ],
        correct: 2
      },
      {
        q: "¿En qué se basa el análisis FODA?",
        options: [
          "Identificación de factores internos y externos que pueden afectar el éxito de la organización",
          "Clasificación de productos o servicios",
          "Traducción de la visión en indicadores de desempeño",
          "Visualización del cronograma de un proyecto"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un ejemplo del Cuadrante 3 de la matriz de Eisenhower?",
        options: [
          "Planificar la estrategia a largo plazo",
          "Hacer ejercicio regularmente",
          "Responder correos no importantes",
          "Aprender un nuevo idioma"
        ],
        correct: 2
      },
      {
        q: "¿Qué tipo de planificación gestiona las finanzas de una organización?",
        options: [
          "Planificación personal",
          "Planificación de proyectos",
          "Planificación empresarial",
          "Planificación financiera"
        ],
        correct: 3
      },
      {
        q: "¿Qué metodología permite analizar la cartera de productos o servicios?",
        options: [
          "Análisis FODA",
          "Matriz BCG",
          "Cuadro de Mando Integral",
          "Diagramas de Gantt"
        ],
        correct: 1
      },
      {
        q: "¿Qué ventaja ofrece el software de planificación?",
        options: [
          "Reduce la eficacia del proceso",
          "Limita la comunicación",
          "Mejora la eficiencia del proceso de planificación",
          "Aumenta la dependencia de recursos materiales"
        ],
        correct: 2
      },
      {
        q: "¿Cuál NO es una metodología de planificación mencionada en el texto?",
        options: [
          "Planificación estratégica",
          "Planificación reactiva",
          "Planificación táctica",
          "Planificación operativa"
        ],
        correct: 1
      },
      {
        q: "¿Qué herramienta permite visualizar el cronograma de un proyecto?",
        options: [
          "Diagramas de Gantt",
          "PERT",
          "CPM",
          "Mapas mentales"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa el análisis FODA en la planificación estratégica?",
        options: [
          "Una técnica de gestión del tiempo",
          "Un método para determinar la ruta crítica",
          "Una herramienta para realizar un diagnóstico",
          "Un software de planificación"
        ],
        correct: 2
      },
      {
        q: "¿Qué criterio NO se aplica a las metas de planificación?",
        options: [
          "Específicas",
          "Medibles",
          "Inalcanzables",
          "Con plazo determinado"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es el propósito de la planificación operativa?",
        options: [
          "Definir la dirección a largo plazo",
          "Traducir objetivos estratégicos en planes concretos",
          "Desarrollar detalles para implementar planes tácticos",
          "Gestionar proyectos específicos"
        ],
        correct: 2
      },
      {
        q: "¿Qué metodología se utiliza para definir la estrategia y objetivos de una empresa?",
        options: [
          "Planificación personal",
          "Planificación empresarial",
          "Planificación de proyectos",
          "Planificación financiera"
        ],
        correct: 1
      },
      {
        q: "¿Qué técnica permite optimizar la planificación de proyectos complejos?",
        options: [
          "Diagramas de Gantt",
          "PERT",
          "Matriz BCG",
          "Análisis FODA"
        ],
        correct: 1
      },
      {
        q: "¿Qué planificación se basa en analizar el entorno interno y externo?",
        options: [
          "Planificación táctica",
          "Planificación operativa",
          "Planificación estratégica",
          "Planificación por proyectos"
        ],
        correct: 2
      },
    ],
  },
  {
    id: 12,
        title: "Gestión por Procesos",
        subtitle: "Mapas, indicadores y mejora continua",
        icon: "📊",
        questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de la gestión por procesos?",
        options: [
          "Solo una tarea administrativa",
          "Metodología sistemática de identificación, diseño, implementación y mejora continua de procesos; enfoque orientado a eficiencia, eficacia y satisfacción de clientes",
          "Un sistema solo de calidad",
          "Una herramienta de control únicamente",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las CINCO características clave de la gestión por procesos según el documento?",
        options: [
          "Autoritarismo, secreto, aislamiento, rigidez, ignorancia",
          "Enfoque cliente, orientación eficiencia, mejora continua, enfoque sistémico, trabajo equipo",
          "Solo rapidez",
          "Solo economía",
        ],
        correct: 3,
      },
      {
        q: "Según la tabla del documento, ¿cuál es la diferencia CRÍTICA en estructura entre gestión tradicional y gestión por procesos?",
        options: [
          "No hay diferencia",
          "Tradicional: jerárquica; por procesos: plana; tradicional enfoque funcional; procesos enfoque horizontal",
          "Ambas son iguales",
          "Procesos es más jerárquica",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los TRES tipos principales de procesos en gestión por procesos según el documento?",
        options: [
          "Rápidos, medios, lentos",
          "Asistenciales, apoyo, estratégicos",
          "Públicos, privados, externos",
          "Simples, complejos, intermedios",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre procesos asistenciales y procesos de apoyo?",
        options: [
          "No existe diferencia",
          "Asistenciales: directamente con paciente e impacto calidad; apoyo: no directos con paciente pero necesarios para procesos asistenciales",
          "Todos son iguales",
          "Apoyo es menos importante",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CINCO pasos para implementación de gestión por procesos en servicios enfermería?",
        options: [
          "Solo planificar",
          "Identificar, analizar, rediseñar, implementar, evaluar y mejorar continuamente",
          "Nada específico",
          "Cambiar todo de golpe",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son los CINCO criterios fundamentales para identificar procesos?",
        options: [
          "Solo opinion",
          "Objetivo, inicio-fin, entradas-salidas, clientes, frecuencia",
          "Nada importante",
          "Solo documentos",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las CUATRO técnicas principales para la identificación de procesos según el documento?",
        options: [
          "Solo observar",
          "Análisis documentación, observación directa, entrevistas, cuestionarios",
          "Nada",
          "Solo preguntar",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es el rol FUNDAMENTAL de la gestora enfermera en implementación de gestión por procesos?",
        options: [
          "No tiene rol importante",
          "Liderar cambio, diseñar/implementar procesos, evaluar/mejorar, formar equipo, comunicar gestión procesos",
          "Solo supervisar",
          "Solo documentar",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CINCO beneficios esenciales de la gestión por procesos en ámbito sanitario según el documento?",
        options: [
          "Menos beneficios",
          "Mejora calidad atención, mayor eficiencia, mejor coordinación profesionales, mayor satisfacción profesionales, mejora seguridad paciente",
          "Solo economía",
          "Menos trabajo",
        ],
        correct: 3,
      },
      {
        q: "¿Qué busca optimizar la gestión por procesos en una organización?",
        options: [
          "El número de empleados",
          "La cultura organizacional",
          "El uso de los recursos y la satisfacción de los clientes",
          "La estructura jerárquica"
        ],
        correct: 2
      },
      {
        q: "¿Cuál de las siguientes afirmaciones caracteriza mejor la diferencia estructural entre la gestión tradicional y la gestión por procesos?",
        options: [
          "La gestión tradicional tiene una estructura jerárquica, mientras que la gestión por procesos presenta una estructura plana.",
          "La gestión tradicional promueve la mejora continua, a diferencia de la gestión por procesos.",
          "La gestión por procesos reduce la coordinación entre unidades organizativas.",
          "La gestión tradicional se basa en procesos horizontales y sistémicos."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el primer paso esencial para implementar la gestión por procesos en los servicios de enfermería?",
        options: [
          "Identificar los procesos existentes dentro del servicio.",
          "Contratar personal experto en mapas de procesos.",
          "Estandarizar los protocolos clínicos.",
          "Reorganizar las estructuras departamentales jerárquicas."
        ],
        correct: 0
      },
      {
        q: "¿Qué proceso se clasifica como estratégico dentro de los servicios de enfermería?",
        options: [
          "La planificación estratégica de la unidad de cuidados.",
          "La administración de medicación intravenosa.",
          "El registro de constantes vitales.",
          "La gestión del cambio de turno."
        ],
        correct: 0
      },
      {
        q: "¿Cómo se clasifican los procesos directamente relacionados con la atención al paciente?",
        options: [
          "Procesos de apoyo",
          "Procesos asistenciales",
          "Procesos estratégicos",
          "Procesos administrativos"
        ],
        correct: 1
      },
      {
        q: "¿Qué tipo de proceso incluye actividades como lavandería, farmacia o mantenimiento?",
        options: [
          "Procesos de apoyo",
          "Procesos asistenciales",
          "Procesos estratégicos",
          "Procesos de mejora continua"
        ],
        correct: 0
      },
      {
        q: "¿Qué característica NO corresponde a la gestión por procesos?",
        options: [
          "Estructura organizativa basada en departamentos independientes",
          "Orientación al cliente",
          "Mejora continua",
          "Trabajo en equipo"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de los siguientes es un criterio para la identificación de procesos?",
        options: [
          "La complejidad tecnológica",
          "La cantidad de empleados involucrados",
          "El objetivo del proceso",
          "La ubicación geográfica de la organización"
        ],
        correct: 2
      },
      {
        q: "¿Qué criterio permite diferenciar un proceso desde su inicio hasta su fin de forma estructurada?",
        options: [
          "Inicio y fin",
          "Rentabilidad financiera",
          "Nivel jerárquico del responsable",
          "Participación del paciente en su ejecución"
        ],
        correct: 0
      },
      {
        q: "¿Qué proceso de enfermería implica la recogida de datos sobre el paciente?",
        options: [
          "Planificación de cuidados",
          "Ejecución de cuidados",
          "Valoración del paciente",
          "Registro de la información"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es una técnica gráfica que permite representar visualmente los pasos de un proceso en secuencia lógica?",
        options: [
          "Diagrama de flujo",
          "Análisis DAFO",
          "Informe de calidad",
          "Manual operativo"
        ],
        correct: 0
      },
      {
        q: "¿Qué herramienta se utiliza para representar gráficamente todos los procesos de una organización?",
        options: [
          "Mapa de procesos",
          "Cuadro de mando integral",
          "Análisis DAFO",
          "Histograma de frecuencias"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa un mapa de procesos?",
        options: [
          "Una secuencia de tareas",
          "Un análisis financiero",
          "Todos los procesos de una organización",
          "La estructura organizacional"
        ],
        correct: 2
      },
      {
        q: "¿Qué técnica se utiliza para la identificación de procesos mediante la observación directa del entorno laboral?",
        options: [
          "Observación directa",
          "Benchmarking",
          "Cuadro de mando integral",
          "Diagrama de Ishikawa"
        ],
        correct: 0
      },
      {
        q: "¿Qué técnica se utiliza para la identificación de procesos mediante la revisión de documentación existente?",
        options: [
          "Observación directa",
          "Entrevistas",
          "Análisis de la documentación",
          "Cuestionarios"
        ],
        correct: 2
      },
      {
        q: "¿Qué implica el rediseño de un proceso según los principios de gestión por procesos?",
        options: [
          "Modificar su estructura para mejorar su eficiencia y eficacia",
          "Sustituir al personal implicado",
          "Interrumpir temporalmente los servicios",
          "Incluir exclusivamente tecnología en la atención"
        ],
        correct: 0
      },
      {
        q: "¿Qué se debe definir en la fase de planificación del ciclo de mejora continua?",
        options: [
          "Los recursos financieros",
          "Los competidores",
          "El problema",
          "Los proveedores"
        ],
        correct: 2
      },
      {
        q: "¿Qué acción se realiza en la fase de 'Hacer' del ciclo de mejora continua?",
        options: [
          "Definir el problema",
          "Implementar el plan de acción",
          "Estandarizar las mejoras",
          "Identificar lecciones aprendidas"
        ],
        correct: 1
      },
      {
        q: "¿Qué fase del ciclo de mejora continua implica analizar los datos obtenidos tras implementar una acción?",
        options: [
          "Verificar",
          "Planificar",
          "Actuar",
          "Controlar"
        ],
        correct: 0
      },
      {
        q: "¿Qué elemento del ciclo de mejora busca estandarizar mejoras y continuar el ciclo?",
        options: [
          "Actuar",
          "Planificar",
          "Hacer",
          "Evaluar"
        ],
        correct: 0
      },
      {
        q: "¿Qué se busca mejorar con la gestión por procesos en el ámbito sanitario?",
        options: [
          "La calidad de la atención al paciente",
          "El marketing de servicios",
          "La gestión de inventarios",
          "La formación académica"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un indicador clave para evaluar la calidad de un proceso?",
        options: [
          "Indicador de calidad",
          "Protocolo de actuación",
          "Hoja de ruta",
          "Grado académico del personal"
        ],
        correct: 0
      },
    ],
  },
  {
    id: 13,
    title: "Marketing Sanitario",
    subtitle: "Estrategias de valor y experiencia del paciente",
    icon: "🎯",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de Marketing Sanitario en contexto sistema sanitario español?",
        options: [
          "Solo publicidad de medicinas",
          "Conjunto de estrategias orientadas a promover salud, prevención, informar sobre servicios, mejorar accesibilidad y fomentar participación pacientes",
          "Vender servicios médicos",
          "Marketing comercial tradicional",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las CINCO funciones CLAVE del Marketing Sanitario según el documento?",
        options: [
          "Solo publicidad",
          "Promover salud/prevención, informar sobre servicios, mejorar accesibilidad/calidad, fomentar participación pacientes, educación",
          "Marketing de lujo",
          "Solo ganancias",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre Marketing y Publicidad en contexto sanitario?",
        options: [
          "No hay diferencia",
          "Marketing: enfoque integral bidireccional; Publicidad: herramienta unidireccional que comunica mensajes",
          "Son exactamente iguales",
          "Marketing es más barato",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CINCO elementos clave de la propuesta de valor del Marketing Sanitario?",
        options: [
          "Solo precios bajos",
          "Foco paciente, comunicación eficaz, construcción relaciones, promoción salud pública, eficiencia y rentabilidad",
          "Solo tecnología",
          "Menos costos",
        ],
        correct: 0,
      },
      {
        q: "Según la evolución histórica documentada, ¿cuál es el enfoque del Marketing Sanitario en la actualidad?",
        options: [
          "Años 50-60: publicidad productos",
          "Años 2000: online; Actualidad: marketing centrado paciente, experiencia paciente, marketing digital",
          "Solo promoción hospitales",
          "Publicidad masiva",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los CUATRO criterios principales de segmentación de mercados en ámbito sanitario?",
        options: [
          "Solo por precio",
          "Demográficos, geográficos, psicográficos, criterios relacionados salud",
          "Solo edad",
          "Por ubicación únicamente",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las características definitorias del PACIENTE EMPODERADO en contexto actual?",
        options: [
          "Pasivo, sin información",
          "Mayor acceso información, participación decisiones, responsabilidad en autocuidado, acceso tecnologías",
          "Dependiente del médico",
          "Sin derechos",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las CINCO características de la atención sanitaria que busca el paciente actual?",
        options: [
          "Solo barata",
          "Accesible, calidad, eficiente, personalizada, humana",
          "Rápida nomás",
          "Sin importancia",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las TRES razones por las que Marketing Sanitario cobra mayor importancia actual?",
        options: [
          "Solo economía",
          "Aumento competencia sector, mayor empoderamiento paciente, evolución TIC",
          "Menos razones",
          "Sin importancia",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CINCO objetivos fundamentales del Marketing Sanitario en contexto sistema sanitario español?",
        options: [
          "Solo vender",
          "Promover eficiencia/sostenibilidad, garantizar equidad acceso, responder necesidades ciudadanos, mejorar posicionamiento, satisfacción",
          "Marketing tradicional",
          "Sin objetivos",
        ],
        correct: 1,
      },
      {
        q: "¿Qué busca promover el Marketing Sanitario en el contexto del sistema sanitario español?",
        options: [
          "La salud y prevención de enfermedades",
          "La venta de medicamentos",
          "Únicamente la promoción de la vacunación",
          "La mercantilización de la salud"
        ],
        correct: 0
      },
      {
        q: "¿Cuál fue el foco del Marketing Sanitario en España durante los años 70-80?",
        options: [
          "Promoción de hospitales y clínicas",
          "Publicidad de productos farmacéuticos",
          "Marketing relacional",
          "Implementación del marketing online"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa una mayor exigencia de los pacientes en el sistema sanitario español actual?",
        options: [
          "Demanda de información y atención personalizada",
          "Menor uso de tecnología",
          "Menos campañas de concienciación",
          "Disminución de la competencia"
        ],
        correct: 0
      },
      {
        q: "¿Qué diferencia principal existe entre Marketing y Publicidad según el texto?",
        options: [
          "El marketing implica un enfoque integral y comunicación bidireccional",
          "La publicidad no utiliza canales de comunicación",
          "El marketing solo se enfoca en la promoción de vacunas",
          "La publicidad es más importante que el marketing"
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia de marketing online es utilizada en el sector salud?",
        options: [
          "Marketing en buscadores (SEO y SEM)",
          "Marketing en videojuegos",
          "Marketing exclusivo en apps de mensajería",
          "Solo panfletos digitales"
        ],
        correct: 0
      },
      {
        q: "¿Qué objetivo tiene el marketing de contenidos en el sector salud?",
        options: [
          "Educar a los pacientes sobre su salud",
          "Disminuir la comunicación con los pacientes",
          "Evitar la creación de contenido relevante",
          "Limitar el acceso a información"
        ],
        correct: 0
      },
      {
        q: "¿Qué elemento es clave en la comunicación sanitaria para ser efectiva?",
        options: [
          "Claridad",
          "Complejidad del mensaje",
          "Uso exclusivo de jerga médica",
          "Información irrelevante"
        ],
        correct: 0
      },
      {
        q: "¿Qué permite una marca sanitaria sólida según el texto?",
        options: [
          "Atraer nuevos pacientes",
          "Disminuir la confianza en la organización",
          "Aumentar la competencia",
          "Reducir la fidelización"
        ],
        correct: 0
      },
      {
        q: "¿Qué funcionalidad destaca un CRM en el ámbito sanitario?",
        options: [
          "Mejorar la atención al paciente",
          "Disminuir la eficiencia del marketing",
          "Evitar la personalización del servicio",
          "Reducir la base de datos de pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Qué se busca con la segmentación de mercados en el ámbito sanitario?",
        options: [
          "Adaptar estrategias a necesidades específicas",
          "Generalizar la atención a todos los pacientes",
          "Disminuir la calidad sanitaria",
          "Ignorar diferencias entre grupos"
        ],
        correct: 0
      },
      {
        q: "¿Qué criterio de segmentación está relacionado con el estilo de vida?",
        options: [
          "Psicográficos",
          "Demográficos",
          "Geográficos",
          "Culinarios"
        ],
        correct: 0
      },
      {
        q: "¿Qué criterio de segmentación demográfico se utiliza en el ámbito sanitario?",
        options: [
          "Edad",
          "Color favorito",
          "Marca de coche",
          "Tipo de música preferida"
        ],
        correct: 0
      },
      {
        q: "¿En qué década se enfocó el Marketing Sanitario en la fidelización de pacientes?",
        options: [
          "Años 90",
          "Años 50-60",
          "Años 70-80",
          "Años 2000"
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto NO se menciona como parte de la importancia del Marketing Sanitario en la actualidad?",
        options: [
          "Reducir el número de servicios ofrecidos",
          "Atraer nuevos pacientes",
          "Fidelizar pacientes actuales",
          "Mejorar la imagen y posicionamiento"
        ],
        correct: 0
      },
      {
        q: "¿Qué diferencia existe entre Marketing y Publicidad?",
        options: [
          "La publicidad es una herramienta del marketing con mensajes unidireccionales",
          "El marketing se enfoca solo en el precio",
          "La publicidad no utiliza canales digitales",
          "El marketing no incluye la promoción"
        ],
        correct: 0
      },
      {
        q: "¿Qué importancia tiene la propuesta de valor en el Marketing Sanitario?",
        options: [
          "Diferenciarlo del marketing tradicional",
          "Hacerlo idéntico al marketing de moda",
          "Disminuir la confianza del sistema",
          "Aumentar costes innecesariamente"
        ],
        correct: 0
      },
      {
        q: "¿Qué se espera lograr con una experiencia del paciente positiva?",
        options: [
          "Mayor satisfacción del paciente",
          "Aumento de quejas",
          "Disminución de la fidelidad",
          "Reducción de la calidad asistencial"
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia de marketing offline se utiliza en el sector salud?",
        options: [
          "Publicidad en medios tradicionales",
          "Uso exclusivo de blogs",
          "Marketing solo en streaming",
          "Ignorar eventos y ferias"
        ],
        correct: 0
      },
      {
        q: "¿Qué busca el marketing de contenidos?",
        options: [
          "Educar a los pacientes sobre su salud",
          "Reducir la transparencia",
          "Limitar contenidos educativos",
          "Promover información no verificada"
        ],
        correct: 0
      },
      {
        q: "¿Por qué es importante la comunicación eficaz en el ámbito sanitario?",
        options: [
          "Para generar confianza en la organización",
          "Para reducir la claridad de la información",
          "Para evitar el diálogo",
          "Para disminuir la fidelización"
        ],
        correct: 0
      },
      {
        q: "¿Qué factor ha intensificado la competencia en el sector salud?",
        options: [
          "Proliferación de clínicas privadas y seguros",
          "Disminución del marketing digital",
          "Menor demanda asistencial",
          "Reducción del empoderamiento del paciente"
        ],
        correct: 0
      },
      {
        q: "¿Qué caracteriza al paciente empoderado en la actualidad?",
        options: [
          "Mayor participación en la toma de decisiones",
          "Menor necesidad de información",
          "Preferencia por atención no personalizada",
          "Desinterés en el autocuidado"
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto es clave para mejorar la experiencia del paciente según el texto?",
        options: [
          "Centrarse en sus necesidades",
          "Ignorar sus necesidades",
          "Limitar la comunicación",
          "Aumentar tiempos de espera"
        ],
        correct: 0
      },
    ],
  },
  {
    id: 14,
    title: "Gestión del Cambio",
    subtitle: "Modelos, resistencia y liderazgo transformacional",
    icon: "💡",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de gestión del cambio?",
        options: [
          "Solo implementar nuevas reglas",
          "Proceso planificado y sistemático que busca implementar modificaciones para mejorar funcionamiento y alcanzar objetivos estratégicos",
          "Cambio sin planeación",
          "Cambio rápido sin análisis",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las TRES fases principales del modelo de Lewin según el documento?",
        options: [
          "Inicio, medio, fin",
          "Descongelación, cambio, recongelación",
          "Análisis, decisión, ejecución",
          "Planificación, acción, cierre",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las OCHO etapas del modelo de Kotter?",
        options: [
          "Menos etapas",
          "Urgencia, coalición, visión, comunicación, empoderamiento, victorias, consolidación, anclaje cultural",
          "Tres etapas",
          "Cinco etapas",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las CINCO etapas del modelo de Kübler-Ross adaptado para cambio organizacional?",
        options: [
          "Dos etapas",
          "Negación, ira, negociación, depresión, aceptación",
          "Ocho etapas",
          "Tres etapas",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre cambio incremental y cambio radical?",
        options: [
          "No hay diferencia",
          "Incremental: pequeño y gradual; Radical: profundo y significativo/disruptivo",
          "Ambos iguales",
          "Radical es más lento",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las TRES etapas del modelo de Bridges para transición?",
        options: [
          "Cuatro etapas",
          "Fin de antiguo, zona neutral, comienzo nuevo",
          "Inicio, medio, fin",
          "Planificación, ejecución, cierre",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuál es la definición y rol fundamental de un agente de cambio?",
        options: [
          "Solo ejecutor de órdenes",
          "Persona que facilita/impulsa proceso cambio; identifica necesidad, comunica, planifica, ejecuta, evalúa",
          "Observador pasivo",
          "Solo crítico",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los CINCO tipos principales de agentes de cambio según el documento?",
        options: [
          "Solo líderes formales",
          "Líderes formales, informales, expertos, innovadores, campeones cambio",
          "Dos tipos",
          "Tres tipos",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las SEIS habilidades y características clave de un agente de cambio efectivo?",
        options: [
          "Una habilidad",
          "Comunicación, liderazgo, gestión proyectos, resolución problemas, adaptación, flexibilidad, paciencia",
          "Tres habilidades",
          "Solo liderazgo",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son las CUATRO principales CAUSAS de resistencia al cambio según los factores individuales, grupales y organizacionales?",
        options: [
          "Solo una causa",
          "Miedo incertidumbre, falta información, pérdida poder, hábitos establecidos; cultural, conflictos interés, recursos limitados",
          "Sin causas",
          "Desconocidas",
        ],
        correct: 0,
      },
      {
        q: "¿Qué busca implementar la gestión del cambio en una organización?",
        options: [
          "Cambios en la estructura física",
          "Mejoras en el funcionamiento y alcance de objetivos estratégicos",
          "Reducción de personal",
          "Aumento de productos o servicios"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es la importancia de la gestión del cambio en los servicios de enfermería?",
        options: [
          "Reducir el número de empleados",
          "Incrementar costos operativos",
          "Mejorar la calidad de atención al paciente",
          "Disminuir los servicios ofrecidos"
        ],
        correct: 2
      },
      {
        q: "¿Qué tipo de cambio se refiere a modificaciones pequeñas y graduales?",
        options: [
          "Cambio radical",
          "Cambio incremental",
          "Cambio estructural",
          "Cambio organizacional"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es un ejemplo de cambio radical en enfermería?",
        options: [
          "Modificar el sistema de organización del trabajo",
          "Implementar un nuevo protocolo",
          "Reestructurar la prestación de cuidados",
          "Introducir una nueva tecnología"
        ],
        correct: 2
      },
      {
        q: "Según el modelo de Lewin, ¿cuál es la primera etapa del proceso de cambio?",
        options: [
          "Cambio",
          "Descongelación",
          "Recongelación",
          "Evaluación"
        ],
        correct: 1
      },
      {
        q: "¿Qué etapa del modelo de Kotter implica crear un sentido de urgencia?",
        options: [
          "Formar una coalición poderosa",
          "Crear una visión clara",
          "Crear un sentido de urgencia",
          "Empoderar a los empleados"
        ],
        correct: 2
      },
      {
        q: "En el modelo de Kübler-Ross, ¿cuál es la primera etapa ante el cambio?",
        options: [
          "Negación",
          "Ira",
          "Negociación",
          "Depresión"
        ],
        correct: 0
      },
      {
        q: "¿Qué modelo describe la transición en tres etapas dentro del cambio?",
        options: [
          "Modelo de Lewin",
          "Modelo de Kotter",
          "Modelo de Kübler-Ross",
          "Modelo de Bridges"
        ],
        correct: 3
      },
      {
        q: "¿Cuál es la fase inicial del proceso de cambio según el texto?",
        options: [
          "Cambio",
          "Descongelación",
          "Recongelación",
          "Planificación"
        ],
        correct: 1
      },
      {
        q: "¿Quién puede ser un agente de cambio en una organización?",
        options: [
          "Solo gerentes",
          "Solo líderes formales",
          "Cualquier miembro con influencia",
          "Solo consultores externos"
        ],
        correct: 2
      },
      {
        q: "¿Qué característica es esencial para un agente de cambio?",
        options: [
          "Resistir al cambio",
          "Habilidades de comunicación efectiva",
          "Preferir rutinas establecidas",
          "Evitar el liderazgo"
        ],
        correct: 1
      },
      {
        q: "¿Qué habilidad necesita un agente de cambio para planificar e implementar cambios?",
        options: [
          "Gestión de proyectos",
          "Mantener todo sin cambios",
          "Evitar conflictos",
          "Incapacidad de adaptación"
        ],
        correct: 0
      },
      {
        q: "¿Qué factor individual influye en el proceso de cambio?",
        options: [
          "Estructura de la organización",
          "Clima organizacional",
          "Actitud hacia el cambio",
          "Cultura del grupo"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es un factor grupal que afecta al cambio?",
        options: [
          "Percepción del cambio",
          "Cultura del grupo",
          "Estructura organizativa",
          "Recursos disponibles"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es un factor organizacional que influye en el cambio?",
        options: [
          "Capacidad individual de adaptación",
          "Liderazgo",
          "Normas del grupo",
          "Actitud hacia el cambio"
        ],
        correct: 1
      },
      {
        q: "¿Qué causa común de resistencia al cambio se relaciona con la percepción de perder poder?",
        options: [
          "Falta de información",
          "Pérdida de poder o control",
          "Hábitos y rutinas",
          "Presión social"
        ],
        correct: 1
      },
      {
        q: "¿Qué estrategia implica involucrar a las personas para superar la resistencia al cambio?",
        options: [
          "Coerción",
          "Participación",
          "Limitar comunicación",
          "Aumentar la presión"
        ],
        correct: 1
      },
      {
        q: "¿Qué factor grupal puede dificultar el cambio?",
        options: [
          "Liderazgo efectivo",
          "Comunicación interna",
          "Conflicto dentro del grupo",
          "Estructura organizacional"
        ],
        correct: 2
      },
      {
        q: "¿Qué estrategia es efectiva para superar la resistencia al cambio?",
        options: [
          "Limitar la comunicación",
          "Ignorar participación",
          "Comunicación efectiva",
          "Aumentar la presión"
        ],
        correct: 2
      },
      {
        q: "¿Qué tipo de cambio se adapta a nuevas necesidades sin ser disruptivo?",
        options: [
          "Cambio estructural",
          "Cambio radical",
          "Cambio incremental",
          "Cambio estratégico"
        ],
        correct: 2
      },
      {
        q: "¿Qué modelo de gestión del cambio consta de ocho etapas?",
        options: [
          "Lewin",
          "Kotter",
          "Kübler-Ross",
          "Bridges"
        ],
        correct: 1
      },
      {
        q: "¿Qué fase del modelo de Lewin estabiliza el cambio?",
        options: [
          "Descongelación",
          "Cambio",
          "Recongelación",
          "Evaluación"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es una responsabilidad del líder del cambio?",
        options: [
          "Evitar cambios",
          "Comunicar la visión del cambio",
          "Mantener prácticas actuales",
          "Desalentar participación"
        ],
        correct: 1
      },
      {
        q: "¿Qué rol tiene el líder en la gestión del cambio?",
        options: [
          "Mantener todo igual",
          "Superar resistencia al cambio",
          "Desalentar innovación",
          "Comunicar poca información"
        ],
        correct: 1
      },
    ],
  },
  {
    id: 15,
    title: "Gestión de la Innovación",
    subtitle: "Procesos, liderazgo y competencias enfermeras",
    icon: "⚡",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de innovación en enfermería?",
        options: [
          "Solo nuevas tecnologías",
          "Introducción nuevos conocimientos, ideas, procesos, productos/servicios que mejoran calidad atención y resultados paciente",
          "Cambios administrativos",
          "Cambios cosmética",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CUATRO beneficios principales de la innovación para mejora calidad cuidados según el documento?",
        options: [
          "Solo eficiencia",
          "Mejora eficiencia/eficacia, seguridad paciente, satisfacción paciente, promueve salud/bienestar",
          "Beneficios económicos",
          "Menos beneficios",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son los CUATRO principales RETOS Y DESAFÍOS de la innovación en enfermería?",
        options: [
          "Sin retos",
          "Falta recursos, cultura organizacional no favorable, falta formación, resistencia cambio",
          "Solo desafíos tecnológicos",
          "Retos políticos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son las CUATRO FASES del proceso de innovación según el documento?",
        options: [
          "Dos fases",
          "Identificación necesidades, generación ideas, planificación/implementación, evaluación/difusión",
          "Una fase",
          "Tres fases",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son las TRES metodologías para GENERAR IDEAS Y SOLUCIONES en innovación?",
        options: [
          "Solo lluvia ideas",
          "Brainstorming, mapas mentales, análisis FODA",
          "Reuniones formales",
          "Decisiones directivas",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CUATRO FACTORES CLAVE para el éxito de la innovación en enfermería según el documento?",
        options: [
          "Un factor",
          "Cultura organizacional favorable, liderazgo apoyo, recursos humanos/financieros, gestión conocimiento/aprendizaje",
          "Solo recursos",
          "Solo liderazgo",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO COMPETENCIAS Y HABILIDADES CLAVE para innovar en enfermería?",
        options: [
          "Una habilidad",
          "Pensamiento crítico, resolución problemas, comunicación efectiva, trabajo equipo, liderazgo",
          "Solo comunicación",
          "Solo liderazgo",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son las CINCO PARTICIPACIONES de la gestora enfermera en proceso innovación según el documento?",
        options: [
          "Una participación",
          "Identificar necesidades, generar ideas, planificar/implementar, evaluar, difundir innovación",
          "Ejecutar nomás",
          "Supervisar",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son los TRES COMPONENTES de CULTURA ORGANIZACIONAL FAVORABLE A INNOVACIÓN?",
        options: [
          "Uno",
          "Valora creatividad/toma riesgos, apoya aprendizaje/desarrollo, celebra éxito y aprende errores",
          "Control rígido",
          "Solo tecnología",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son las TRES ESTRATEGIAS PRINCIPALES para FOMENTAR INNOVACIÓN en enfermería según documento?",
        options: [
          "Una estrategia",
          "Programas formación/desarrollo profesional, unidades innovación y gestión cambio, sistemas apoyo investigación",
          "Solo capacitación",
          "Solo unidades innovación",
        ],
        correct: 1,
      },
      {
        q: "¿Qué define la innovación en enfermería?",
        options: [
          "La implementación de políticas de gestión tradicionales",
          "La introducción de nuevos conocimientos para mejorar la calidad de atención",
          "El aumento en el número de enfermeras en el sector",
          "La reducción de costos operativos en el hospital"
        ],
        correct: 1
      },
      {
        q: "¿Por qué es importante la innovación en enfermería?",
        options: [
          "Para aumentar el número de pacientes atendidos",
          "Para mejorar la eficiencia y eficacia de la atención",
          "Para reducir el número de enfermeras necesarias",
          "Para incrementar los ingresos del hospital"
        ],
        correct: 1
      },
      {
        q: "¿Qué reto enfrenta la innovación en enfermería debido a la falta de recursos?",
        options: [
          "Imposibilidad de realizar cambios en las políticas internas",
          "Dificultad en la implementación de innovaciones",
          "Reducción del personal de enfermería",
          "Disminución de la calidad de la atención"
        ],
        correct: 1
      },
      {
        q: "¿Cómo puede afectar la cultura organizacional a la innovación en enfermería?",
        options: [
          "Promoviendo la competencia entre enfermeras",
          "Dificultando el cambio por falta de apoyo",
          "Aumentando la eficacia de los tratamientos",
          "Reduciendo los costos de capacitación"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es el primer paso en el proceso de innovación en enfermería?",
        options: [
          "Planificación e implementación de la innovación",
          "Identificación de necesidades y oportunidades",
          "Evaluación y difusión de la innovación",
          "Generación de ideas y soluciones"
        ],
        correct: 1
      },
      {
        q: "¿Qué estrategia se utiliza para generar ideas innovadoras en enfermería?",
        options: [
          "Análisis de costos",
          "Brainstorming",
          "Evaluación de desempeño",
          "Auditorías internas"
        ],
        correct: 1
      },
      {
        q: "¿Qué papel juega el liderazgo en la innovación de enfermería?",
        options: [
          "Mantener el status quo",
          "Fomentar una cultura resistente al cambio",
          "Fomentar la innovación y el cambio",
          "Reducir los presupuestos para innovación"
        ],
        correct: 2
      },
      {
        q: "¿Qué recurso es crucial para la implementación de la innovación en enfermería?",
        options: [
          "Recursos humanos y financieros",
          "Políticas gubernamentales restrictivas",
          "Manuales de procedimientos tradicionales",
          "Equipos médicos obsoletos"
        ],
        correct: 0
      },
      {
        q: "¿Cómo contribuye la gestión del conocimiento a la innovación en enfermería?",
        options: [
          "Limitando el acceso a información nueva",
          "Promoviendo el aprendizaje continuo",
          "Manteniendo prácticas obsoletas",
          "Reduciendo la colaboración entre enfermeras"
        ],
        correct: 1
      },
      {
        q: "¿Cuál es una competencia clave para la enfermera innovadora?",
        options: [
          "Aversión al riesgo",
          "Comunicación efectiva",
          "Conformidad con las normas existentes",
          "Independencia total del equipo"
        ],
        correct: 1
      },
      {
        q: "¿Qué estrategia de formación es esencial para fomentar la innovación en enfermería?",
        options: [
          "Cursos sobre prácticas tradicionales",
          "Talleres sobre pensamiento creativo",
          "Seminarios sobre legislación antigua",
          "Conferencias sobre historia de la enfermería"
        ],
        correct: 1
      },
      {
        q: "¿Qué función tienen las unidades de innovación y gestión del cambio en enfermería?",
        options: [
          "Prevenir cualquier cambio en las prácticas",
          "Apoyar y gestionar la implementación de innovaciones",
          "Mantener únicamente las tecnologías existentes",
          "Desalentar la participación en proyectos de innovación"
        ],
        correct: 1
      },
      {
        q: "¿Cómo se pueden compartir conocimientos y experiencias en enfermería para fomentar la innovación?",
        options: [
          "A través de redes de colaboración y conocimiento compartido",
          "Manteniendo la información en silos departamentales",
          "Evitando el uso de tecnologías de la información",
          "Limitando la comunicación entre enfermeras"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un desafío común al implementar la innovación en enfermería?",
        options: [
          "Exceso de recursos financieros",
          "Demasiado apoyo de la administración",
          "Resistencia al cambio",
          "Falta de pacientes para cuidar"
        ],
        correct: 2
      },
      {
        q: "¿Qué aspecto de la cultura organizacional es vital para la innovación en enfermería?",
        options: [
          "Evitar el riesgo a toda costa",
          "Valorar la creatividad y la toma de riesgos",
          "Priorizar la adherencia estricta a las normas",
          "Desalentar el desarrollo profesional"
        ],
        correct: 1
      },
      {
        q: "¿Cómo se identifican las necesidades y oportunidades de innovación en enfermería?",
        options: [
          "A través del análisis de datos y la observación de la práctica",
          "Ignorando las sugerencias de pacientes y personal médico",
          "Manteniendo prácticas antiguas sin revisión",
          "Evitando la implementación de nuevas tecnologías"
        ],
        correct: 0
      },
      {
        q: "¿Qué papel desempeñan los recursos financieros en la innovación de enfermería?",
        options: [
          "Ninguno, ya que la innovación es siempre gratuita",
          "Limitar el alcance de proyectos innovadores",
          "Facilitar la implementación de innovaciones",
          "Desalentar la búsqueda de soluciones creativas"
        ],
        correct: 2
      },
      {
        q: "¿Qué es crucial evaluar en la fase de evaluación de la innovación en enfermería?",
        options: [
          "La eficacia de la innovación",
          "La popularidad de la innovación entre el personal administrativo",
          "El costo de revertir la innovación",
          "La opinión de expertos externos únicamente"
        ],
        correct: 0
      },
      {
        q: "¿Qué enfoque de liderazgo es necesario para la innovación en enfermería?",
        options: [
          "Un enfoque pasivo y reaccionario",
          "Un enfoque centrado en la penalización del fallo",
          "Un enfoque visionario y proactivo",
          "Un enfoque que evite el cambio"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es el impacto de la innovación en la seguridad del paciente en enfermería?",
        options: [
          "Ninguno, la seguridad del paciente no se ve afectada",
          "Reduce los errores médicos y mejora la seguridad",
          "Aumenta los riesgos y los errores médicos",
          "Complica los procedimientos existentes"
        ],
        correct: 1
      },
      {
        q: "¿Qué formación es valiosa para enfermeras que buscan innovar?",
        options: [
          "Solo formación en procedimientos estándar",
          "Formación en habilidades de innovación y pensamiento crítico",
          "Exclusivamente formación teórica sin prácticas",
          "Formación que desalienta cuestionar prácticas existentes"
        ],
        correct: 1
      },
      {
        q: "¿Cómo afecta la innovación la satisfacción del paciente?",
        options: [
          "No tiene impacto",
          "Disminuye la satisfacción por cambios constantes",
          "Mejora la experiencia y satisfacción del paciente",
          "Aumenta únicamente la carga de trabajo"
        ],
        correct: 2
      },
      {
        q: "¿Qué papel desempeña la tecnología en la innovación en enfermería?",
        options: [
          "Complica los procesos",
          "Reduce la interacción humana",
          "Facilita el acceso a información y apoya la colaboración",
          "Desalienta la innovación"
        ],
        correct: 2
      },
      {
        q: "¿Por qué es importante el aprendizaje continuo en innovación de enfermería?",
        options: [
          "No es importante",
          "Fomenta prácticas obsoletas",
          "Promueve la actualización sobre innovaciones",
          "Desalienta la participación del personal"
        ],
        correct: 2
      },
      {
        q: "¿Qué estrategia puede superar la resistencia al cambio en la innovación de enfermería?",
        options: [
          "Ignorar opiniones contrarias",
          "Fomentar una cultura de apertura y experimentación",
          "Castigar la resistencia",
          "Limitar la comunicación"
        ],
        correct: 1
      },
    ],
  },
  {
    id: 16,
    title: "La Carga de Cuidados",
    subtitle: "Medición, factores e impacto en enfermería",
    icon: "❤️",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de carga de cuidados enfermera?",
        options: [
          "Cantidad trabajo físico, emocional y mental que exige atención pacientes",
          "Solo tareas administrativas",
          "Cansancio general",
          "Estrés laboral nomás",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los TRES TIPOS PRINCIPALES de carga de cuidados según el documento?",
        options: [
          "Dos tipos",
          "Carga física, emocional, mental",
          "Solo carga mental",
          "Carga administrativa",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS del PACIENTE que influyen en carga cuidados?",
        options: [
          "Una característica",
          "Edad, diagnóstico, dependencia, agudeza proceso, comorbilidades y necesidades especiales",
          "Solo edad",
          "Solo diagnóstico",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CINCO FACTORES de CARACTERÍSTICAS ENFERMERA que influyen en gestión carga?",
        options: [
          "Uno",
          "Experiencia, formación, habilidades, capacidades, nivel estrés",
          "Solo experiencia",
          "Solo formación",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son los CUATRO FACTORES del ENTORNO TRABAJO que afectan carga cuidados?",
        options: [
          "Tipo unidad, ratio enfermera-paciente, recursos disponibles, clima laboral y cultura organizacional",
          "Solo ratio",
          "Uno",
          "Dos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los CUATRO INSTRUMENTOS DE MEDICIÓN principales según el documento?",
        options: [
          "Uno",
          "Escalas valoración (NAS, WOCN, Aiken), cuestionarios, diarios trabajo",
          "Solo escalas",
          "Solo cuestionarios",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de la PARRILLA MONTESINOS?",
        options: [
          "Dos",
          "Evalúa ABVD, valora independencia leve/moderada/grave, sencilla uso, válida fiable, múltiples contextos",
          "Una",
          "Tres",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las SEIS CONSECUENCIAS PRINCIPALES de carga cuidados para la ENFERMERA según documento?",
        options: [
          "Cuatro",
          "Agotamiento físico/mental, estrés laboral, deterioro salud, disminución satisfacción, absentismo, deterioro vida",
          "Dos",
          "Una",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO CONSECUENCIAS de carga cuidados para CALIDAD cuidados pacientes?",
        options: [
          "Errores medicación, infecciones, caídas pacientes, disminución intimidad, deterioro relación terapéutica",
          "Una",
          "Dos",
          "Tres",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los TRES NIVELES DE ESTRATEGIAS gestión carga cuidados según el documento?",
        options: [
          "Uno",
          "Individual (autocuidado, resiliencia), organizativo (recursos, clima), político (legislación, políticas sanitarias)",
          "Dos",
          "Solo individual",
        ],
        correct: 1,
      },
      {
        q: "¿Qué es la carga de cuidados en la enfermería?",
        options: [
          "La cantidad de trabajo físico, emocional y mental que exige la atención a los pacientes",
          "La satisfacción del paciente tras recibir atención",
          "El salario de la enfermera basado en sus horas de trabajo",
          "La cantidad de medicamentos administrados a los pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de los siguientes es un ejemplo de tarea física en la carga de cuidados?",
        options: [
          "Realizar maniobras de RCP",
          "Tomar decisiones críticas",
          "Escuchar las preocupaciones de los pacientes",
          "Planificar los cuidados de los pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Qué factor no incrementa la carga de cuidados de una enfermera?",
        options: [
          "Un bajo número de pacientes asignados",
          "Un entorno de trabajo estresante",
          "Pacientes con enfermedades leves",
          "La complejidad de los pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Cómo afecta la experiencia de la enfermera en la gestión de la carga de cuidados?",
        options: [
          "Aumenta la eficiencia en la gestión de la carga de cuidados",
          "Disminuye la eficiencia en la gestión de la carga de cuidados",
          "No tiene ningún efecto sobre la carga de cuidados",
          "Reduce la cantidad de cuidados que necesita el paciente"
        ],
        correct: 0
      },
      {
        q: "¿Qué tipo de carga se refiere al esfuerzo físico necesario en la atención a los pacientes?",
        options: [
          "Carga física",
          "Carga mental",
          "Carga emocional",
          "Carga administrativa"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes es una estrategia para gestionar la carga de cuidados a nivel individual?",
        options: [
          "Desarrollar estrategias de afrontamiento del estrés",
          "Aumentar el ratio enfermera-paciente",
          "Reducir el salario de las enfermeras",
          "Ignorar el estrés laboral"
        ],
        correct: 0
      },
      {
        q: "¿Qué instrumento se utiliza para medir objetivamente la carga de cuidados?",
        options: [
          "Escala de Carga de Trabajo de Nursing Activities Score (NAS)",
          "Encuestas de opinión pública",
          "Gráficos de humor semanal",
          "Listas de verificación de tareas domésticas"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una consecuencia del alto nivel de carga de cuidados en las enfermeras?",
        options: [
          "Aumento del riesgo de burnout",
          "Mejora automática de la calidad de los cuidados",
          "Reducción de los costes operativos",
          "Aumento de la satisfacción laboral"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un factor que no se considera al calcular la carga de trabajo de las enfermeras?",
        options: [
          "La opinión pública sobre la enfermería",
          "El número de pacientes",
          "La complejidad de los cuidados requeridos",
          "La cantidad de recursos disponibles"
        ],
        correct: 0
      },
      {
        q: "¿Qué método no se menciona como forma de calcular la carga de trabajo?",
        options: [
          "Método de evaluación por pares",
          "Método de unidades de trabajo",
          "Método de los ratios enfermera-paciente",
          "Método de la simulación"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes no es una limitación en la medición de la carga de cuidados?",
        options: [
          "Uniformidad en la percepción de la carga entre todas las enfermeras",
          "Dificultad para obtener datos precisos",
          "Subjetividad de las escalas de valoración",
          "Falta de consenso sobre los métodos de medición"
        ],
        correct: 0
      },
      {
        q: "¿Qué impacto tiene la carga de cuidados en la calidad de los cuidados al paciente?",
        options: [
          "Aumento del riesgo de errores de medicación",
          "Aumento de la eficacia de los medicamentos",
          "Mejora de la comunicación paciente-enfermera",
          "Reducción de los costes de atención médica"
        ],
        correct: 0
      },
      {
        q: "¿Qué no se considera una intervención a nivel organizativo para gestionar la carga de cuidados?",
        options: [
          "Reducción del salario de las enfermeras",
          "Mejora de la organización del trabajo",
          "Adecuación de la plantilla de enfermeras",
          "Implementación de tecnologías de la información y la comunicación"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una estrategia a nivel político para gestionar la carga de cuidados?",
        options: [
          "Aprobación de leyes que regulen la carga de trabajo de las enfermeras",
          "Ignorar las demandas de las enfermeras",
          "Reducción de la inversión en salud",
          "Aumento de la carga de trabajo sin proporcionar apoyo"
        ],
        correct: 0
      },
      {
        q: "¿Cómo contribuye el autocuidado en la gestión de la carga de cuidados por parte de las enfermeras?",
        options: [
          "Ayuda a las enfermeras a mantener su bienestar físico, mental y emocional",
          "No tiene ningún impacto",
          "Aumenta la carga de trabajo",
          "Disminuye la eficacia de la atención al paciente"
        ],
        correct: 0
      },
      {
        q: "¿Qué no es un componente de la carga emocional en la enfermería?",
        options: [
          "La realización de tareas administrativas",
          "La resolución de problemas",
          "El manejo del duelo de los pacientes",
          "El apoyo a pacientes con ansiedad"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes no es una característica del paciente que afecta la carga de cuidados?",
        options: [
          "Su ocupación",
          "Su nivel de ingresos",
          "El nivel de dependencia",
          "La agudeza del proceso"
        ],
        correct: 0
      },
      {
        q: "¿Qué factor relacionado con la enfermera disminuye su capacidad para gestionar la carga de cuidados?",
        options: [
          "Alto nivel de estrés",
          "Mayor experiencia",
          "Formación específica en gestión de cuidados",
          "Habilidades técnicas avanzadas"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes no es una consecuencia para la organización sanitaria debido a una alta carga de cuidados?",
        options: [
          "Mejora en la satisfacción del paciente",
          "Aumento de los costes",
          "Deterioro de la imagen de la organización",
          "Dificultades para atraer y retener personal"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de los siguientes no es un tipo de instrumento para medir la carga de cuidados?",
        options: [
          "Encuestas de satisfacción del paciente",
          "Escalas de valoración",
          "Cuestionarios",
          "Diarios de trabajo"
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto del entorno de trabajo no se menciona como factor que influye en la carga de cuidados?",
        options: [
          "Decoración de la unidad",
          "Tipo de unidad",
          "Ratio enfermera-paciente",
          "Recursos disponibles"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una intervención a nivel individual para gestionar la carga de cuidados que no se menciona?",
        options: [
          "Incremento de las horas de trabajo sin descanso",
          "Capacitación en técnicas de gestión del tiempo",
          "Fomento de hábitos saludables",
          "Desarrollo de competencias específicas"
        ],
        correct: 0
      },
      {
        q: "¿Qué no se considera una estrategia de afrontamiento del estrés para las enfermeras?",
        options: [
          "Aumentar el número de pacientes a su cargo",
          "Técnicas de relajación",
          "Programas de apoyo psicológico",
          "Fomento de hábitos saludables"
        ],
        correct: 0
      },
      {
        q: "¿Cuál no es un efecto del alto nivel de carga de cuidados en las enfermeras?",
        options: [
          "Aumento de la longevidad",
          "Agotamiento físico y mental",
          "Estrés laboral",
          "Deterioro de la salud física y mental"
        ],
        correct: 0
      },
    ],
  },
  {
    id: 17,
    title: "Los Sistemas de Salud",
    subtitle: "Estructura, financiación y modelos internacionales",
    icon: "🛡️",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de sistema de salud?",
        options: [
          "Solo hospitales",
          "Conjunto elementos interrelacionados que organizan provisión servicios salud a población",
          "Administración pública",
          "Seguros médicos",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CINCO ELEMENTOS CLAVE que integran un sistema de salud?",
        options: [
          "Dos elementos",
          "Recursos humanos, financieros, físicos, organización, objetivo mejora salud",
          "Solo recursos",
          "Solo financiación",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO FUNCIONES PRINCIPALES de sistemas de salud?",
        options: [
          "Una función",
          "Provisión servicios, protección financiera, promoción salud, investigación/desarrollo, regulación",
          "Dos funciones",
          "Tres funciones",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CUATRO SISTEMAS SALUD INTERNACIONALES analizados según el documento?",
        options: [
          "Dos",
          "NHS Reino Unido, Bismarck Alemania, Beveridge Canadá, Seguro Social EEUU",
          "Uno",
          "Cinco",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son las TRES características definitorias del SISTEMA NHS REINO UNIDO?",
        options: [
          "Una",
          "Financiación pública, centralizado, cobertura universal gratuita, impuestos, tiempos espera largos",
          "Dos",
          "Mixta",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los TRES NIVELES ESTRUCTURALES del Sistema Nacional Salud español?",
        options: [
          "Dos",
          "Central (Ministerio), autonómico (CCAA servicios), local (Áreas/Centros salud)",
          "Uno",
          "Cuatro",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son las TRES PRESTACIONES PRINCIPALES del SNS español?",
        options: [
          "Una",
          "Atención primaria, atención especializada, atención sociosanitaria, salud pública",
          "Dos",
          "Solo atención primaria",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las DOS PROPIEDADES FUNDAMENTALES de un BIEN PÚBLICO según documento?",
        options: [
          "Una propiedad",
          "No exclusividad y no rivalidad; imposible excluir, no reduce cantidad disponible",
          "Rivalidad solo",
          "Exclusividad solo",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuáles son los TRES FALLOS DEL MERCADO en provisión salud?",
        options: [
          "Uno",
          "Inequidad (sin recursos no acceso), ineficiencia (exceso/infraprovisión), falta innovación mercado",
          "Dos",
          "Ninguno",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CUATRO PRINCIPALES DESAFÍOS de sistemas salud contemporáneos según documento?",
        options: [
          "Dos",
          "Envejecimiento población, aumento enfermedades crónicas, tecnología, sostenibilidad financiera",
          "Uno",
          "Tres",
        ],
        correct: 1,
      },
      {
        q: "¿Qué es un sistema de salud?",
        options: [
          "Un conjunto de elementos interrelacionados que organizan la provisión de servicios de salud a una población",
          "Un servicio médico ofrecido por hospitales privados únicamente",
          "Una colección de políticas de salud pública a nivel nacional",
          "Una estructura dedicada solo a la atención médica de emergencia"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el objetivo principal de un sistema de salud?",
        options: [
          "Mejorar la salud de la población mediante promoción, prevención, tratamiento y rehabilitación",
          "Aumentar el beneficio económico de los proveedores de salud",
          "Centralizar todos los servicios bajo una única administración",
          "Promover solo la atención especializada"
        ],
        correct: 0
      },
      {
        q: "¿Cuáles son las principales funciones de los sistemas de salud?",
        options: [
          "Promoción de la salud, protección financiera y regulación",
          "Provisión de entretenimiento a la población",
          "Gestión de calidad del aire",
          "Financiación de campañas políticas"
        ],
        correct: 0
      },
      {
        q: "¿Cómo se clasifican los sistemas de salud según su financiación?",
        options: [
          "Públicos, privados y mixtos",
          "Solo por impuestos",
          "Por donaciones exclusivamente",
          "Exclusivamente por cuotas de usuarios"
        ],
        correct: 0
      },
      {
        q: "¿Qué caracteriza al NHS del Reino Unido?",
        options: [
          "Cobertura universal gratuita para todos los residentes",
          "Financiación privada descentralizada",
          "Cobertura basada en seguros sociales obligatorios",
          "Atención basada únicamente en el modelo biopsicosocial"
        ],
        correct: 0
      },
      {
        q: "¿Cómo se financia principalmente el Sistema Nacional de Salud español?",
        options: [
          "Mediante impuestos generales",
          "Solo por copagos",
          "De forma exclusivamente privada",
          "A través de donaciones voluntarias"
        ],
        correct: 0
      },
      {
        q: "¿Qué nivel del SNS español planifica y desarrolla políticas de salud pública?",
        options: [
          "Nivel central",
          "Nivel local",
          "Nivel autonómico",
          "Organizaciones no gubernamentales"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa un bien público?",
        options: [
          "Un bien no excluible y no rival",
          "Un bien que se provee solo en el sector privado",
          "Un producto que se consume una sola vez",
          "Un bien exclusivamente propiedad del Estado"
        ],
        correct: 0
      },
      {
        q: "¿Qué nivel del SNS español asume la gestión directa de los servicios de salud en su territorio?",
        options: [
          "Nivel autonómico",
          "Nivel central",
          "Organizaciones internacionales",
          "Nivel local"
        ],
        correct: 0
      },
      {
        q: "¿Qué fallo del mercado se identifica en la provisión de salud?",
        options: [
          "Inequidad en el acceso a la atención",
          "Exceso de oferta",
          "Sobreinversión tecnológica",
          "Eficiencia óptima en la distribución de recursos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una función clave de los sistemas de salud?",
        options: [
          "Garantizar acceso sin dificultades económicas",
          "Promover competencia entre proveedores",
          "Aumentar precios para mejorar calidad",
          "Limitar la I+D en medicina"
        ],
        correct: 0
      },
      {
        q: "¿Qué característica comparten los sistemas públicos como el NHS británico y el modelo Beveridge en Canadá?",
        options: [
          "Cobertura universal gratuita",
          "Acceso según capacidad de pago",
          "Predominio de seguros privados",
          "Tiempos de espera muy cortos"
        ],
        correct: 0
      },
      {
        q: "¿Qué reto común enfrentan los sistemas de salud a nivel mundial?",
        options: [
          "Aumento de enfermedades crónicas",
          "Disminución de demanda asistencial",
          "Reducción global de costes",
          "Exceso de profesionales sanitarios"
        ],
        correct: 0
      },
      {
        q: "¿Qué nivel del SNS gestiona atención primaria y salud pública en un área geográfica concreta?",
        options: [
          "Nivel local",
          "Nivel central",
          "Nivel autonómico",
          "Organizaciones no gubernamentales"
        ],
        correct: 0
      },
      {
        q: "¿Qué fallo del mercado justifica la intervención del Estado?",
        options: [
          "Inequidad en el acceso",
          "Competencia perfecta",
          "Asignación eficiente",
          "Información totalmente transparente"
        ],
        correct: 0
      },
      {
        q: "¿Qué es una Zona Básica de Salud?",
        options: [
          "Una unidad territorial con uno o varios centros de salud",
          "Un hospital especializado",
          "Una división administrativa financiera",
          "Un servicio de atención exclusiva privada"
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia mejora la sostenibilidad de los sistemas de salud?",
        options: [
          "Gestión eficiente de recursos",
          "Reducir inversión en promoción de salud",
          "Limitar acceso a atención primaria",
          "Restringir cobertura sanitaria"
        ],
        correct: 0
      },
      {
        q: "¿Qué es una externalidad positiva en el ámbito de la salud?",
        options: [
          "Reducción de transmisión de enfermedades gracias a buena salud poblacional",
          "Competencia entre hospitales",
          "Aumento de costes por tecnología avanzada",
          "Acceso exclusivo a tratamientos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una fuente de financiación complementaria del SNS español?",
        options: [
          "Copagos de algunos servicios",
          "Inversiones en bolsa",
          "Financiación exclusiva privada",
          "Donaciones no monetarias"
        ],
        correct: 0
      },
      {
        q: "¿Cómo se denomina la atención médica básica y preventiva del SNS?",
        options: [
          "Atención primaria",
          "Atención especializada",
          "Atención sociosanitaria",
          "Salud pública"
        ],
        correct: 0
      },
      {
        q: "¿Qué modelo integra aspectos biológicos, psicológicos y sociales?",
        options: [
          "Modelo biopsicosocial",
          "Modelo biomédico",
          "Modelo de financiación pública",
          "Modelo descentralizado"
        ],
        correct: 0
      },
      {
        q: "¿Qué desafío generan los avances tecnológicos en los sistemas de salud?",
        options: [
          "Aumento de los costes",
          "Reducción de calidad diagnóstica",
          "Menor demanda asistencial",
          "Exceso de profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia ayuda a afrontar el envejecimiento poblacional?",
        options: [
          "Promoción de la salud y prevención",
          "Reducir inversión en atención a mayores",
          "Centralizar totalmente el sistema",
          "Disminuir cobertura pública"
        ],
        correct: 0
      },
    ],
  },

  {
    id: 18,
    title: "La Administración como Ciencia",
    subtitle: "Orígenes, enfoques y escuelas administrativas",
    icon: "📖",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de administración?",
        options: [
          "Solo gestión de dinero",
          "Proceso planificar, organizar, dirigir y controlar recursos humanos, materiales, financieros para alcanzar objetivos",
          "Supervisión de personal",
          "Cumplimiento normativo",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CINCO BENEFICIOS PRINCIPALES de administración en enfermería según documento?",
        options: [
          "Uno",
          "Optimizar recursos, mejorar coordinación, motivar personal, promover investigación, garantizar calidad",
          "Dos",
          "Tres",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿quién es considerado PADRE de la ADMINISTRACIÓN CIENTÍFICA?",
        options: [
          "Henri Fayol",
          "Frederick Winslow Taylor con 'Principios Administración Científica' 1911; propuso división trabajo, especialización, estudio tiempos/movimientos",
          "Frank Gilbreth",
          "Max Weber",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las SEIS FUNCIONES BÁSICAS de administración según HENRI FAYOL según documento?",
        options: [
          "Cuatro",
          "Previsión, organización, dirección, coordinación, control, mando",
          "Dos",
          "Ocho",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál fue la contribución PRINCIPAL de Frank y Lillian Gilbreth?",
        options: [
          "División trabajo",
          "Técnica micromovimientos: filmar/analizar movimientos trabajador para eliminar innecesarios",
          "Especialización",
          "Incentivos",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los TRES ENFOQUES PRINCIPALES de administración según documento?",
        options: [
          "Dos",
          "Clásico (estructura eficiencia), neoclásico (factor humano), humanista (desarrollo personal ambiente)",
          "Uno",
          "Cuatro",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre TEORÍA X y TEORÍA Y de McGregor?",
        options: [
          "No hay diferencia",
          "Teoría X: trabajadores perezosos necesitan control; Teoría Y: responsables, motivación interna",
          "X es mejor",
          "Y es antigua",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CINCO NIVELES JERÁRQUICOS de necesidades según TEORÍA HUMANISTA en documento?",
        options: [
          "Tres",
          "Fisiológicas, seguridad, sociales, estima, autorrealización",
          "Dos",
          "Cuatro",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuál fue la contribución de FLORENCE NIGHTINGALE a administración enfermería?",
        options: [
          "Medicina solo",
          "Desarrolló sistema gestión hospitalaria que mejoró higiene/calidad en hospitales militares Guerra Crimea",
          "Teoría enfermería",
          "Cuidados paliativos",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CUATRO PRINCIPIOS FUNDAMENTALES de administración aplicables a enfermería según documento?",
        options: [
          "Dos",
          "Planificación, organización, dirección, control",
          "Uno",
          "Cinco",
        ],
        correct: 1,
      },
      {
        q: "¿Qué define la administración en el contexto de la enfermería?",
        options: [
          "El proceso de planificar, organizar, dirigir y controlar recursos para lograr objetivos específicos.",
          "La gestión exclusiva de personal médico.",
          "El desarrollo de medicamentos y tratamientos nuevos.",
          "La capacitación exclusiva de enfermeros en técnicas médicas."
        ],
        correct: 0
      },
      {
        q: "¿Cuál fue uno de los primeros antecedentes de la práctica administrativa en la historia?",
        options: [
          "El Antiguo Egipto y la construcción de las pirámides.",
          "La Revolución Francesa.",
          "La fundación de la Compañía de las Indias Orientales.",
          "El inicio de la Revolución Industrial."
        ],
        correct: 0
      },
      {
        q: "¿Qué teoría se basa en la idea de que los trabajadores son seres sociales que buscan satisfacción en su trabajo?",
        options: [
          "Teoría de las relaciones humanas.",
          "Teoría del proceso administrativo.",
          "Teoría clásica.",
          "Teoría de la organización formal."
        ],
        correct: 0
      },
      {
        q: "¿En qué se centra principalmente el enfoque humanista de la administración?",
        options: [
          "El desarrollo personal de los trabajadores.",
          "La eficiencia y especialización del trabajo.",
          "La estructura formal de la organización.",
          "La aplicación de métodos científicos en la gestión."
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto es fundamental para la eficacia y la eficiencia de los servicios de enfermería según el documento?",
        options: [
          "La administración.",
          "La tecnología exclusivamente.",
          "La especialización en una sola área.",
          "El trabajo en solitario del personal."
        ],
        correct: 0
      },
      {
        q: "¿Qué teoría destaca la importancia de las necesidades fisiológicas, de seguridad, sociales, de estima y de autorrealización?",
        options: [
          "Teoría de las necesidades humanas.",
          "Teoría del proceso administrativo.",
          "Teoría de la organización formal.",
          "Teoría de las relaciones humanas."
        ],
        correct: 0
      },
      {
        q: "¿Qué enfoque de la administración considera a la organización como un sistema formal compuesto por partes interrelacionadas?",
        options: [
          "Enfoque clásico.",
          "Enfoque humanista.",
          "Enfoque neoclásico.",
          "Enfoque de la contingencia."
        ],
        correct: 0
      },
      {
        q: "¿Quiénes desarrollaron la técnica de los micromovimientos?",
        options: [
          "Frank y Lillian Gilbreth.",
          "Frederick Winslow Taylor y Henri Fayol.",
          "Douglas McGregor.",
          "Sócrates y Platón."
        ],
        correct: 0
      },
      {
        q: "¿Cuál de los siguientes no es un principio de la administración científica de Taylor?",
        options: [
          "Desarrollo de relaciones personales estrechas entre trabajadores y supervisores.",
          "División del trabajo.",
          "Estudio de tiempos y movimientos.",
          "Establecimiento de sistemas de incentivos."
        ],
        correct: 0
      },
      {
        q: "¿En qué se basa la Teoría del comportamiento organizacional?",
        options: [
          "En las ciencias del comportamiento.",
          "En las ciencias naturales.",
          "En la teoría matemática.",
          "En la teoría económica."
        ],
        correct: 0
      },
      {
        q: "¿Cuál fue una contribución principal de Frederick Winslow Taylor?",
        options: [
          "La administración científica y el estudio de tiempos y movimientos.",
          "La teoría de las necesidades humanas.",
          "La teoría del comportamiento organizacional.",
          "La teoría X e Y de McGregor."
        ],
        correct: 0
      },
      {
        q: "¿Qué función administrativa implica motivar al personal, delegar tareas y resolver conflictos?",
        options: [
          "Dirección.",
          "Planificación.",
          "Organización.",
          "Control."
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes es una función administrativa definida por Henri Fayol?",
        options: [
          "Coordinación.",
          "Motivación.",
          "Capacitación.",
          "Innovación."
        ],
        correct: 0
      },
      {
        q: "¿Qué reto enfrenta la administración de enfermería debido al envejecimiento poblacional?",
        options: [
          "Aumento de la demanda de servicios de enfermería.",
          "Reducción de la demanda.",
          "Disminución de la complejidad de la atención.",
          "Menor necesidad de tecnología."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el principal objetivo de aplicar principios de administración en enfermería?",
        options: [
          "Brindar una atención de calidad a los pacientes.",
          "Disminuir el personal necesario.",
          "Aumentar las ganancias institucionales.",
          "Reducir el uso de tecnología."
        ],
        correct: 0
      },
      {
        q: "¿Cuál de estos no es un precursor directo de la administración?",
        options: [
          "La Revolución Francesa.",
          "El Antiguo Egipto.",
          "La antigua Grecia.",
          "La Edad Media."
        ],
        correct: 0
      },
      {
        q: "¿Qué desafío no se menciona entre los retos actuales de la administración en enfermería?",
        options: [
          "Aumento de la eficacia de los tratamientos médicos.",
          "Escasez de recursos.",
          "Cambios tecnológicos.",
          "Aumento de la complejidad de los pacientes."
        ],
        correct: 0
      },
      {
        q: "¿Qué enfoque de administración se centra en el factor humano y las relaciones en la organización?",
        options: [
          "Enfoque neoclásico.",
          "Enfoque clásico.",
          "Enfoque científico.",
          "Enfoque de contingencia."
        ],
        correct: 0
      },
      {
        q: "¿Quién es considerado el padre de la administración científica?",
        options: [
          "Frederick Winslow Taylor.",
          "Henri Fayol.",
          "Douglas McGregor.",
          "Frank y Lillian Gilbreth."
        ],
        correct: 0
      },
      {
        q: "¿Qué principio administrativo implica establecer objetivos y determinar acciones?",
        options: [
          "Planificación.",
          "Organización.",
          "Dirección.",
          "Control."
        ],
        correct: 0
      },
      {
        q: "¿Qué enfoque administrativo propone las teorías X e Y?",
        options: [
          "Enfoque humanista.",
          "Enfoque clásico.",
          "Enfoque neoclásico.",
          "Enfoque científico."
        ],
        correct: 0
      },
      {
        q: "¿Quién desarrolló la teoría clásica de la administración?",
        options: [
          "Henri Fayol.",
          "Frederick Winslow Taylor.",
          "Douglas McGregor.",
          "Frank y Lillian Gilbreth."
        ],
        correct: 0
      },
      {
        q: "¿Cuál de estos NO es un principio aplicable a la administración en enfermería?",
        options: [
          "Desarrollo de nuevos medicamentos.",
          "Motivación del personal.",
          "Planificación de recursos materiales.",
          "Evaluación de la calidad asistencial."
        ],
        correct: 0
      },
    ],
  },
  {
    id: 19,
    title: "La Calidad",
    subtitle: "Modelos, dimensiones e implementación en enfermería",
    icon: "✅",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de CALIDAD en contexto sanitario?",
        options: [
          "Solo costo",
          "Grado en que servicios satisfacen necesidades usuarios en resultados (salud) y procesos (personalizado, eficiente, seguro)",
          "Rapidez",
          "Tecnología",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las SIETE DIMENSIONES CLAVE de la CALIDAD en enfermería según el documento?",
        options: [
          "Tres",
          "Seguridad, eficacia, eficiencia, satisfacción, oportunidad, equidad, accesibilidad",
          "Cuatro",
          "Dos",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es la definición del MODELO DE DONABEDIAN y sus TRES DIMENSIONES?",
        options: [
          "Dos dimensiones",
          "Modelo 1980 que evalúa: estructura (recursos), proceso (actividades), resultado (impacto salud)",
          "Cuatro dimensiones",
          "Una dimensión",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los SEIS CRITERIOS PRINCIPALES del MODELO EFQM según el documento?",
        options: [
          "Tres",
          "Liderazgo, planificación estratégica, gestión personas, recursos/procesos, satisfacción cliente, resultados",
          "Dos",
          "Cuatro",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuáles son los CINCO MODELOS DE CALIDAD MODERNOS analizados?",
        options: [
          "Dos",
          "EFQM, Seis Sigma, Lean Healthcare, mejora continua, modelo de Donabedian",
          "Tres",
          "Uno",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las CINCO FASES DE IMPLEMENTACIÓN de modelos calidad según documento?",
        options: [
          "Tres",
          "Planificación, diseño, desarrollo, evaluación, mejora",
          "Dos",
          "Cuatro",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son los TRES TIPOS DE INDICADORES de calidad?",
        options: [
          "Uno",
          "Indicadores estructura (recursos), proceso (actividades), resultado (impacto)",
          "Dos",
          "Cuatro",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los CUATRO MÉTODOS PRINCIPALES DE EVALUACIÓN de calidad según documento?",
        options: [
          "Dos",
          "Auditorías, encuestas satisfacción, grupos focales, observación directa",
          "Uno",
          "Tres",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son los CUATRO PRINCIPALES RETOS Y DESAFÍOS para calidad enfermería actual?",
        options: [
          "Dos",
          "Envejecimiento población, enfermedades crónicas, avances tecnológicos, restricciones económicas",
          "Uno",
          "Tres",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son las CINCO TENDENCIAS PRINCIPALES en gestión calidad según documento?",
        options: [
          "Tres",
          "Enfoque paciente, seguridad paciente, mejora continua, trabajo equipo, uso TIC",
          "Dos",
          "Cuatro",
        ],
        correct: 0,
      },
      {
        q: "¿Cómo afecta el envejecimiento de la población a la calidad en enfermería?",
        options: [
          "Reducción en la demanda de servicios de enfermería",
          "Aumento de la demanda y complejidad de la atención sanitaria",
          "Menor necesidad de actualización profesional",
          "Disminución de la utilización de tecnología en la atención"
        ],
        correct: 1
      },
      {
        q: "¿Cómo se define la calidad en el contexto sanitario?",
        options: [
          "La cantidad de servicios de salud proporcionados",
          "La rapidez con la que se brindan los servicios de salud",
          "El costo de los servicios de salud proporcionados",
          "El grado en que los servicios de salud satisfacen las necesidades de los usuarios en términos de resultados y procesos"
        ],
        correct: 3
      },
      {
        q: "¿Cuál de las siguientes fases NO pertenece al proceso de implementación de modelos de calidad en enfermería?",
        options: [
          "Planificación",
          "Diseño",
          "Desarrollo",
          "Promoción"
        ],
        correct: 3
      },
      {
        q: "¿Cuál de las siguientes tendencias NO se menciona como parte de la gestión de la calidad en el documento?",
        options: [
          "Enfoque en el paciente",
          "Seguridad del paciente",
          "Uso de las tecnologías de la información",
          "Reducción de la formación continua del personal"
        ],
        correct: 3
      },
      {
        q: "¿Cuál de los siguientes modelos de calidad se enfoca en la estructura, proceso y resultado?",
        options: [
          "Modelo Lean Healthcare",
          "Modelo de Seis Sigma",
          "Modelo de la Excelencia (EFQM)",
          "Modelo de Donabedian"
        ],
        correct: 3
      },
      {
        q: "¿Cuál de los siguientes NO es un recurso necesario para la implementación de modelos de calidad en enfermería?",
        options: [
          "Personal capacitado",
          "Fondos para capacitación",
          "Equipos e infraestructura adecuada",
          "Libros de autoayuda para el personal"
        ],
        correct: 3
      },
      {
        q: "¿Cuál es el principal enfoque del Modelo Lean Healthcare?",
        options: [
          "Aumentar la cantidad de personal",
          "Implementar sistemas de recompensas",
          "Eliminar el despilfarro en los procesos",
          "Reducir la participación del paciente en su cuidado"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es un beneficio de la calidad para la sostenibilidad del sistema sanitario?",
        options: [
          "Aumentar los costes operativos",
          "Limitar el acceso a la atención sanitaria",
          "Reducir la satisfacción del paciente",
          "Mejorar la eficiencia"
        ],
        correct: 3
      },
      {
        q: "¿Cuál es un método de evaluación de la calidad en enfermería?",
        options: [
          "Evaluaciones psicológicas del personal",
          "Análisis de la competencia",
          "Auditorías",
          "Encuestas de clima laboral"
        ],
        correct: 2
      },
      {
        q: "¿Cuál es una dimensión de la calidad en enfermería?",
        options: [
          "Publicidad",
          "Marketing",
          "Ventas",
          "Seguridad"
        ],
        correct: 3
      },
      {
        q: "¿Qué busca lograr la eficacia dentro de las dimensiones de la calidad en enfermería?",
        options: [
          "Minimizar el uso de recursos",
          "Asegurar la rapidez en la atención",
          "Promover la publicidad del hospital",
          "Lograr los mejores resultados posibles con los recursos disponibles"
        ],
        correct: 3
      },
      {
        q: "¿Qué caracteriza al Modelo de Ishikawa en la gestión de la calidad en enfermería?",
        options: [
          "Su enfoque en la motivación del personal",
          "La implementación de tecnología de vanguardia",
          "La reducción de costos en la atención al paciente",
          "Identificación de las causas de problemas en los procesos de atención"
        ],
        correct: 3
      },
      {
        q: "¿Qué criterio NO es evaluado por el Modelo de la Excelencia (EFQM)?",
        options: [
          "Liderazgo",
          "Resultados en los empleados",
          "Satisfacción del cliente",
          "Competencia de los empleados en deportes"
        ],
        correct: 3
      },
      {
        q: "¿Qué enfoque de calidad se centra en la mejora continua de la calidad de la atención al paciente?",
        options: [
          "Enfoque tradicional",
          "Modelo de Seis Sigma",
          "Modelo de la Excelencia (EFQM)",
          "Modelo de mejora continua"
        ],
        correct: 3
      },
      {
        q: "¿Qué estrategia de mejora continua implica la implicación del paciente en la evaluación de la atención recibida?",
        options: [
          "Seguridad del paciente",
          "Trabajo en equipo",
          "Uso de las tecnologías de la información",
          "Enfoque en el paciente"
        ],
        correct: 3
      },
      {
        q: "¿Qué estrategia NO se recomienda para superar la resistencia al cambio en la implementación de modelos de calidad?",
        options: [
          "Comunicación efectiva",
          "Capacitación adecuada del personal",
          "Involucramiento de la dirección",
          "Aislamiento de los opositores"
        ],
        correct: 3
      },
      {
        q: "¿Qué indicador mide el impacto de la atención en la salud del paciente?",
        options: [
          "Indicadores de estructura",
          "Indicadores de proceso",
          "Indicadores de resultado",
          "Indicadores de eficacia"
        ],
        correct: 2
      },
      {
        q: "¿Qué modelo mejora eficiencia y calidad eliminando despilfarro?",
        options: [
          "Modelo de Donabedian",
          "Modelo de la Excelencia (EFQM)",
          "Modelo de Seis Sigma",
          "Modelo Lean Healthcare"
        ],
        correct: 3
      },
      {
        q: "¿Qué reto surge por el aumento de enfermedades crónicas?",
        options: [
          "Reducción de la necesidad de atención",
          "Disminución de demanda de enfermeras especializadas",
          "Menor uso de tecnología",
          "Mayor necesidad de seguimiento y tratamiento a largo plazo"
        ],
        correct: 3
      },
      {
        q: "¿Qué papel desempeñan las enfermeras en la implementación de modelos de calidad?",
        options: [
          "Únicamente proporcionar atención directa",
          "Mantener registros financieros",
          "Gestionar recursos materiales",
          "Participar en la selección, capacitación e implementación del modelo"
        ],
        correct: 3
      },
      {
        q: "¿Qué tipo de indicadores mide las actividades que se realizan para brindar la atención al paciente?",
        options: [
          "Indicadores de estructura",
          "Indicadores de proceso",
          "Indicadores de resultado",
          "Indicadores de eficacia"
        ],
        correct: 1
      },
      {
        q: "En el contexto de los modelos de calidad en enfermería, ¿qué busca minimizar el Modelo de Seis Sigma?",
        options: [
          "La inversión en educación continua",
          "La colaboración interdepartamental",
          "El uso de tecnologías de la información",
          "La variabilidad en los procesos"
        ],
        correct: 3
      },
      {
        q: "En la implementación de modelos de calidad en enfermería, ¿cuál es la primera fase?",
        options: [
          "Diseño",
          "Planificación",
          "Desarrollo",
          "Evaluación"
        ],
        correct: 1
      },
    ],
  },  
  {
    id: 20,
    title: "Dirección Estratégica",
    subtitle: "Planificación, visión y herramientas estratégicas",
    icon: "🎯",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de Dirección Estratégica?",
        options: [
          "Gestión diaria",
          "Proceso sistemático continuo que define objetivos largo plazo, establece estrategias, asigna recursos, evalúa progreso",
          "Control operacional",
          "Supervisión personal",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los CUATRO BENEFICIOS PRINCIPALES de Dirección Estratégica en enfermería según documento?",
        options: [
          "Uno",
          "Liderar cambio, mejorar calidad cuidados, gestionar recursos eficientemente, responder necesidades pacientes",
          "Dos",
          "Tres",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuáles son las CUATRO FASES del PROCESO DE PLANIFICACIÓN ESTRATÉGICA?",
        options: [
          "Dos",
          "Análisis estratégico, formulación estrategia, implementación, evaluación/control",
          "Una",
          "Tres",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los TRES HERRAMIENTAS PRINCIPALES de planificación estratégica según el documento?",
        options: [
          "Una",
          "Análisis DAFO, Matriz BCG, Cinco Fuerzas Porter",
          "Dos",
          "Cuatro",
        ],
        correct: 2,
      },
      {
        q: "Según el documento, ¿cuál es la definición del MODELO DE CINCO FUERZAS DE PORTER?",
        options: [
          "Solo competencia",
          "Herramienta analiza competencia: nuevos competidores, poder proveedores, poder clientes, productos sustitutivos, rivalidad",
          "Análisis interno",
          "Estudios mercado",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son los TRES ELEMENTOS CLAVE de Dirección Estratégica: VISIÓN, MISIÓN Y VALORES según documento?",
        options: [
          "Dos elementos",
          "Visión (imagen futuro deseado), misión (razón ser organización), valores (principios comportamiento)",
          "Uno",
          "Cuatro",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de los OBJETIVOS ESTRATÉGICOS?",
        options: [
          "Tres",
          "Específicos, medibles, alcanzables, relevantes, temporales (SMART)",
          "Dos",
          "Cuatro",
        ],
        correct: 3,
      },
      {
        q: "¿Cuáles son los DOS TIPOS DE INDICADORES DESEMPEÑO según el documento?",
        options: [
          "Uno",
          "Indicadores resultados (impacto actividades), indicadores procesos (eficiencia procesos)",
          "Tres",
          "Cuatro",
        ],
        correct: 0,
      },
      {
        q: "Según el documento, ¿cuáles son las RESPONSABILIDADES DEL LÍDER en implementación de estrategia?",
        options: [
          "Delegación total",
          "Comunicar visión/estrategia, motivar empleados, gestionar cambio, superar resistencias",
          "Solo supervisión",
          "Sin responsabilidad",
        ],
        correct: 1,
      },
      {
        q: "¿Cuáles son las CINCO APLICACIONES de TIC en gestión enfermería según el documento?",
        options: [
          "Dos",
          "Documentación clínica, comunicación profesionales, planificación cuidados, administración medicamentos, educación/investigación",
          "Uno",
          "Tres",
        ],
        correct: 2,
      },
      {
        q: "¿Qué define la Dirección Estratégica?",
        options: [
          "Un proceso sistemático y continuo que permite a una organización definir sus objetivos y asignar recursos eficientemente.",
          "Un proceso para aumentar los salarios del personal de enfermería.",
          "Un procedimiento para reducir el número de empleados en una organización.",
          "Una técnica exclusiva para el manejo de pacientes en entornos de enfermería."
        ],
        correct: 0
      },
      {
        q: "¿Por qué es importante la Dirección Estratégica en Enfermería?",
        options: [
          "Porque permite liderar el cambio, mejorar la calidad de los cuidados y gestionar eficientemente los recursos.",
          "Solo porque mejora la imagen pública de la organización.",
          "Únicamente para incrementar los ingresos de los hospitales.",
          "Solo para reducir los costos operativos."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es la primera fase en el Proceso de Planificación Estratégica en Enfermería?",
        options: [
          "Análisis Estratégico.",
          "Implementación de la Estrategia.",
          "Evaluación y Control de la Estrategia.",
          "Formulación de la Estrategia."
        ],
        correct: 0
      },
      {
        q: "¿Qué herramienta permite identificar fortalezas, debilidades, oportunidades y amenazas?",
        options: [
          "Análisis DAFO.",
          "Modelo de las Cinco Fuerzas de Porter.",
          "Matriz BCG.",
          "Plan de Negocios."
        ],
        correct: 0
      },
      {
        q: "¿Qué representa la visión en Dirección Estratégica?",
        options: [
          "Una imagen del futuro que la organización desea alcanzar.",
          "Los problemas actuales de la organización.",
          "La cantidad de empleados en la organización.",
          "Las tácticas de marketing de la organización."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una característica esencial de los objetivos estratégicos?",
        options: [
          "Ser específicos y medibles.",
          "Ser ambiguos.",
          "Ser irrealizables.",
          "No tener un plazo definido."
        ],
        correct: 0
      },
      {
        q: "¿Qué tipo de indicadores miden el impacto final de las actividades?",
        options: [
          "Indicadores de resultados.",
          "Indicadores de procesos.",
          "Indicadores financieros.",
          "Indicadores cualitativos."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el papel del líder en la implementación de la estrategia?",
        options: [
          "Comunicar la visión y motivar a los empleados.",
          "Mantener el status quo.",
          "Reducir los salarios del personal.",
          "Ignorar el feedback de los empleados."
        ],
        correct: 0
      },
      {
        q: "¿Qué herramienta clasifica unidades estratégicas según crecimiento y participación?",
        options: [
          "Matriz BCG.",
          "Análisis DAFO.",
          "Modelo de las Cinco Fuerzas de Porter.",
          "Estudio de mercado."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un ejemplo de un objetivo estratégico en enfermería?",
        options: [
          "Reducir la tasa de infecciones en el hospital en un 50% en los próximos 3 años.",
          "Aumentar el número de cafeterías en los hospitales.",
          "Disminuir el uso de tecnología en los cuidados de enfermería.",
          "Incrementar el número de reuniones administrativas."
        ],
        correct: 0
      },
      {
        q: "¿Qué estrategia facilita la gestión del cambio?",
        options: [
          "Comunicación clara y transparente.",
          "Ignorar preocupaciones del personal.",
          "Recompensas financieras indiscriminadas.",
          "Aumentar la carga de trabajo."
        ],
        correct: 0
      },
      {
        q: "¿Qué implica la planificación de la plantilla?",
        options: [
          "Determinar el número y tipo de empleados necesarios para alcanzar los objetivos.",
          "Reducir el personal al mínimo indispensable.",
          "Incrementar personal sin considerar necesidades.",
          "Contratar basándose solo en recomendaciones."
        ],
        correct: 0
      },
      {
        q: "¿Cómo pueden las TIC mejorar la gestión de enfermería?",
        options: [
          "Facilitando la comunicación entre profesionales y mejorando la administración de medicamentos.",
          "Sustituyendo completamente el juicio clínico.",
          "Limitando el acceso a la información del paciente.",
          "Reduciendo la importancia de la investigación."
        ],
        correct: 0
      },
      {
        q: "¿Qué representa la misión en Dirección Estratégica?",
        options: [
          "La razón de ser de la organización: qué hace y para quién.",
          "Los beneficios anuales esperados.",
          "La competencia principal de la organización.",
          "Una lista de servicios ofrecidos."
        ],
        correct: 0
      },
      {
        q: "¿Qué valor puede guiar el comportamiento en una organización de enfermería?",
        options: [
          "Profesionalismo.",
          "Competitividad extrema.",
          "Secretismo.",
          "Autonomía aislada."
        ],
        correct: 0
      },
      {
        q: "¿Qué herramienta analiza la competencia del sector?",
        options: [
          "Modelo de las Cinco Fuerzas de Porter.",
          "Análisis PESTEL.",
          "Análisis DAFO.",
          "Matriz BCG."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un indicador de procesos?",
        options: [
          "Tiempo de espera para recibir atención médica.",
          "Satisfacción del paciente.",
          "Tasa de mortalidad.",
          "Número de procedimientos realizados."
        ],
        correct: 0
      },
      {
        q: "¿Qué método ayuda a superar resistencias al cambio?",
        options: [
          "Comunicación clara y participación del personal.",
          "Ignorar opiniones contrarias.",
          "Aplicar cambios sin aviso.",
          "Aumentar la carga de trabajo."
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto financiero es clave?",
        options: [
          "Presupuesto y control de costes.",
          "Inversiones especulativas.",
          "Reducción generalizada de salarios.",
          "Apuestas financieras."
        ],
        correct: 0
      },
      {
        q: "¿Cómo contribuyen las TIC a la educación en enfermería?",
        options: [
          "Facilitando el acceso a recursos educativos y la investigación.",
          "Sustituyendo la formación práctica.",
          "Reduciendo el tiempo de estudio.",
          "Limitando interacción docente."
        ],
        correct: 0
      },
      {
        q: "¿Qué característica NO es esencial en los objetivos estratégicos?",
        options: [
          "Ser inalcanzables para motivar.",
          "Ser específicos y medibles.",
          "Ser relevantes para misión y visión.",
          "Tener un plazo definido."
        ],
        correct: 0
      },
      {
        q: "¿Qué importancia tiene la visión?",
        options: [
          "Guía la toma de decisiones y motiva a los empleados.",
          "Define penalizaciones por bajo rendimiento.",
          "Establece salarios.",
          "Limita la innovación."
        ],
        correct: 0
      },
      {
        q: "¿Qué se evalúa en la fase de evaluación y control?",
        options: [
          "El progreso hacia los objetivos estratégicos.",
          "La efectividad del marketing.",
          "Productividad individual exclusivamente.",
          "Las preferencias del personal."
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el rol del desarrollo profesional?",
        options: [
          "Mejorar habilidades y conocimientos para lograr los objetivos.",
          "Reducir costes de formación.",
          "Motivar solo mediante incentivos financieros.",
          "Mantener estructuras rígidas."
        ],
        correct: 0
      },
      {
        q: "¿Para qué sirve la matriz BCG en enfermería?",
        options: [
          "Clasificar servicios según demanda y eficiencia.",
          "Identificar personal redundante.",
          "Elegir ubicaciones de clínicas.",
          "Determinar precios de servicios."
        ],
        correct: 0
      },
    ],
  },
  {
    id: 21,
    title: "Seguridad del Paciente",
    subtitle: "Gestión del riesgo, eventos adversos y cultura de seguridad",
    icon: "🛡️",
    questions: [
      {
        q: "Según el documento, ¿cuál es la definición fundamental de SEGURIDAD DEL PACIENTE?",
        options: [
          "Reducción riesgo daño a mínimo aceptable; ausencia errores, eventos adversos, cultura seguridad",
          "Ausencia total de riesgo",
          "Cumplimiento normativo",
          "Responsabilidad médicos",
        ],
        correct: 0,
      },
      {
        q: "¿Cuáles son los CUATRO BENEFICIOS PRINCIPALES de Seguridad Paciente según documento?",
        options: [
          "Uno",
          "Protege pacientes, mejora calidad, reduce costes, promueve confianza",
          "Dos",
          "Tres",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO FASES del PROCESO GESTIÓN RIESGO SANITARIO?",
        options: [
          "Tres",
          "Identificación, valoración/análisis, priorización, intervención/control, evaluación/seguimiento",
          "Dos",
          "Cuatro",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son los CUATRO HERRAMIENTAS principales de Gestión Riesgos según el documento?",
        options: [
          "Análisis DAFO, Árbol fallos, AMFE, Listas verificación",
          "Una",
          "Dos",
          "Tres",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de CULTURA SEGURIDAD PACIENTE?",
        options: [
          "Dos",
          "Compromiso dirección, comunicación abierta, trabajo equipo, aprendizaje continuo, justa cultura",
          "Una",
          "Tres",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la DEFINICIÓN y CLASIFICACIÓN de EVENTO ADVERSO según el documento?",
        options: [
          "Mejora esperada",
          "Incidente causa daño paciente no relacionado enfermedad; clasificado por gravedad (leve/moderado/grave), intencionalidad, prevenibilidad",
          "Resultado exitoso",
          "Evolución natural",
        ],
        correct: 1,
      },
      {
        q: "Según el documento, ¿cuáles son las TRES CAUSAS PRINCIPALES de EVENTOS ADVERSOS?",
        options: [
          "Una causa",
          "Errores humanos, fallos sistemas, factores ambientales",
          "Dos",
          "Cuatro",
        ],
        correct: 2,
      },
      {
        q: "¿Cuáles son las CUATRO CONSECUENCIAS PRINCIPALES de Eventos Adversos según documento?",
        options: [
          "Daño paciente, aumento costes, disminución satisfacción, daño imagen centro sanitario",
          "Una",
          "Dos",
          "Tres",
        ],
        correct: 3,
      },
      {
        q: "Según el documento, ¿cuáles son los CINCO PASOS para IMPLEMENTACIÓN CULTURA SEGURIDAD?",
        options: [
          "Dos",
          "Política seguridad, formación profesionales, sistema notificación, auditorías, esfuerzo sostenido",
          "Uno",
          "Tres",
        ],
        correct: 0,
      },
      {
        q: "¿Cuál es la IMPORTANCIA de NOTIFICACIÓN Y ANÁLISIS de EVENTOS ADVERSOS según documento?",
        options: [
          "Sin importancia",
          "Notificación obligatoria permite identificar riesgos; análisis identifica causas y prevención futura mejorando seguridad",
          "Solo administrativo",
          "Castigo profesionales",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo se clasifica un evento adverso como 'No prevenible'?",
        options: [
          "Cuando no se puede evitar con las medidas de seguridad actuales",
          "Cuando ocurre debido a una negligencia médica",
          "Cuando el paciente ignora las recomendaciones médicas",
          "Cuando se debe exclusivamente a un error de diagnóstico"
        ],
        correct: 0
      },
      {
        q: "¿Cómo se clasifican los eventos adversos según su intencionalidad?",
        options: [
          "Accidentales e intencionales",
          "Leves y graves",
          "Preventivos y no preventivos",
          "Humanos y sistémicos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes NO es una característica de una cultura de seguridad del paciente?",
        options: [
          "Aumento de la competencia entre profesionales",
          "Compromiso de la dirección",
          "Comunicación abierta",
          "Aprendizaje continuo"
        ],
        correct: 0
      },
      {
        q: "¿Cuál de las siguientes NO es una fase del Proceso de Gestión del Riesgo Sanitario?",
        options: [
          "Evaluación de la competencia del personal",
          "Identificación de riesgos",
          "Valoración y análisis de riesgos",
          "Intervención y control de riesgos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el papel de las auditorías en la seguridad del paciente?",
        options: [
          "Evaluar el cumplimiento de las normas de seguridad",
          "Reducir el tiempo dedicado a cada paciente",
          "Incrementar el número de procedimientos invasivos",
          "Disminuir la comunicación entre el personal sanitario"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el primer paso en el proceso de gestión del riesgo sanitario?",
        options: [
          "Identificación de riesgos",
          "Evaluación y seguimiento",
          "Priorización de riesgos",
          "Intervención y control de riesgos"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es el propósito de las listas de verificación en la seguridad del paciente?",
        options: [
          "Asegurar que se completen los pasos críticos en un proceso",
          "Reducir los costes operativos del hospital",
          "Incrementar la velocidad de los diagnósticos",
          "Reducir el tiempo de las visitas de los pacientes"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es un objetivo fundamental de la Gestión del Riesgo Sanitario?",
        options: [
          "Seguridad del Paciente",
          "Reducir los costos operativos del centro sanitario",
          "Aumentar la eficiencia en el uso de los medicamentos",
          "Mejorar la comunicación entre el personal"
        ],
        correct: 0
      },
      {
        q: "¿Cuál es una consecuencia directa de los eventos adversos?",
        options: [
          "Incremento en los costos de la atención sanitaria",
          "Mejora en la eficiencia del personal sanitario",
          "Aumento en la satisfacción laboral del personal",
          "Reducción de la demanda de servicios sanitarios"
        ],
        correct: 0
      },
      {
        q: "¿Qué aspecto NO se asocia directamente con la importancia de la cultura de seguridad?",
        options: [
          "Aumento de los costos asociados a los errores y eventos adversos",
          "Reducción de la tasa de errores y eventos adversos",
          "Mejora de la calidad de la atención sanitaria",
          "Aumento de la satisfacción de los profesionales"
        ],
        correct: 0
      },
      {
        q: "¿Qué objetivo tiene la farmacovigilancia?",
        options: [
          "Prevenir los efectos adversos de los medicamentos",
          "Aumentar las ventas de medicamentos",
          "Promover el uso de medicamentos genéricos",
          "Reducir el tiempo de desarrollo de nuevos medicamentos"
        ],
        correct: 0
      },
      {
        q: "¿Qué permite la farmacovigilancia?",
        options: [
          "Identificar y prevenir los efectos adversos de los medicamentos",
          "Mejorar las habilidades de comunicación del personal sanitario",
          "Incrementar las ventas de medicamentos",
          "Reducir los costos de formación del personal"
        ],
        correct: 0
      },
      {
        q: "¿Qué permite la notificación de eventos adversos?",
        options: [
          "Identificar riesgos y tomar medidas preventivas",
          "Incrementar la rentabilidad del hospital",
          "Reducir la necesidad de formación continua del personal",
          "Disminuir la cantidad de medicamentos necesarios"
        ],
        correct: 0
      },
      {
        q: "¿Qué proceso evalúa si un centro sanitario cumple con los estándares de calidad y seguridad establecidos?",
        options: [
          "Acreditación de centros sanitarios",
          "Implementación de una cultura de seguridad",
          "Formación en seguridad del paciente",
          "Farmacovigilancia"
        ],
        correct: 0
      },
      {
        q: "¿Qué representa el análisis DAFO en la gestión de riesgos?",
        options: [
          "Una técnica para identificar fortalezas, debilidades, oportunidades y amenazas",
          "Una técnica para la reanimación cardiopulmonar",
          "Una herramienta de comunicación interna",
          "Una metodología para la detección rápida de enfermedades"
        ],
        correct: 0
      },
      {
        q: "¿Qué se define como la reducción del riesgo de daño asociado a la asistencia sanitaria a un mínimo aceptable?",
        options: [
          "Seguridad del Paciente",
          "Gestión del Riesgo Sanitario",
          "Cultura de Seguridad del Paciente",
          "Protocolos de práctica clínica"
        ],
        correct: 0
      },
      {
        q: "¿Qué se utiliza para asegurar que se siguen los pasos correctos en un proceso?",
        options: [
          "Listas de verificación",
          "Protocolos y guías de práctica clínica",
          "Acreditación de centros sanitarios",
          "Auditorías"
        ],
        correct: 0
      },
    ],
  },
  {
    id: 22,
    title: "El Mirador de la Gestión",
    subtitle: "Síntesis integrada de competencias sanitarias",
    icon: "👁️",
    questions: [
      {
        q: "Integrando liderazgo y seguridad del paciente, ¿cómo debe el líder enfermero transformar eventos adversos en oportunidades de mejora?",
        options: [
          "Culpabilizando individual",
          "Fomentando justa cultura, aprendizaje continuo, análisis de causas raíz sin blame para mejorar sistemas",
          "Ocultándolos",
          "Despidiendo personal",
        ],
        correct: 1,
      },
      {
        q: "¿Cuál es la relación crítica entre competencias digitales, calidad y seguridad del paciente en gestión moderna?",
        options: [
          "Sin relación",
          "IA y datos mejoran diagnóstico/prevención eventos adversos; sistemas EHR integran seguridad en procesos; TIC facilitan monitoreo",
          "Solo costos",
          "Tecnología irrelevante",
        ],
        correct: 1,
      },
      {
        q: "Combinando dirección estratégica con trabajo en equipo, ¿cómo debe gestionar una enfermera la resistencia al cambio?",
        options: [
          "Imponer decisiones",
          "Comunicar visión clara, involucrar equipo en decisiones, entrenar, reconocer esfuerzos, adaptar según feedback",
          "Ignorarla",
          "Amenazar con consecuencias",
        ],
        correct: 1,
      },
      {
        q: "Integrando gestión de conflictos, comunicación y motivación, ¿cuál es la estrategia efectiva ante desacuerdos en equipo sanitario?",
        options: [
          "Decidir sin consultar",
          "Escuchar perspectivas, identificar intereses comunes, buscar soluciones win-win, mantener relaciones, celebrar resolución",
          "Imponer mayoría",
          "Separar equipos",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo integran las competencias de liderazgo, innovación y gestión de cambio en la implementación de nuevos protocolos?",
        options: [
          "Los nuevos protocolos nunca funcionan",
          "Líder inspira confianza, innova procesos, comunica beneficios, facilita capacitación, monitorea impacto, refuerza logros",
          "Solo enfermeras ejecutan",
          "Cambio muy lento",
        ],
        correct: 1,
      },
      {
        q: "Combinando calidad, seguridad y gestión de riesgos, ¿cuál es el propósito de la Parrilla Montesinos y herramientas AMFE?",
        options: [
          "Documentación administrativa",
          "Evaluar dependencia/necesidades cuidados y prevenir fallos identificando causas para mejorar seguridad paciente",
          "Complicar procesos",
          "Sin propósito claro",
        ],
        correct: 1,
      },
      {
        q: "Integrando marketing sanitario, clima laboral y satisfacción, ¿cómo contribuye la imagen del profesional enfermero al posicionamiento?",
        options: [
          "No contribuye",
          "Profesionalismo digital, ética, excelencia en cuidados genera confianza, satisfacción paciente y reputación institucional",
          "Irrelevante para pacientes",
          "Solo importa dinero",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo se integran los modelos de Donabedian (estructura/proceso/resultado) con dirección estratégica y sistemas de salud?",
        options: [
          "No se integran",
          "Estructura define recursos estratégicos, procesos ejecutan estrategia asegurando calidad, resultados validan modelo sanitario",
          "Solo administrativo",
          "Conceptos aislados",
        ],
        correct: 1,
      },
      {
        q: "Combinando planificación del tiempo, productividad y carga de cuidados, ¿cuál es el equilibrio crítico en gestión enfermería?",
        options: [
          "Más horas siempre",
          "Optimizar procesos, evitar desperdicio, monitorear carga, asegurar autocuidado staff para prevenir burnout y mantener calidad",
          "Ignorar carga personal",
          "Trabajar indefinidamente",
        ],
        correct: 1,
      },
      {
        q: "Integrando toma de decisiones, ética y seguridad del paciente, ¿cuál es el proceso DAFO aplicado a decisiones sanitarias críticas?",
        options: [
          "Decidir rápido sin análisis",
          "Analizar fortalezas/debilidades de opciones, oportunidades/amenazas contexto, elegir considerando impacto ético y seguridad",
          "Ignorar análisis",
          "Basarse solo en intuición",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo integran las teorías de motivación (Maslow, Herzberg) con cultura organizacional y retención de personal?",
        options: [
          "Motivación no importa",
          "Satisfacer necesidades progresivas, proporcionar higiene+motivadores, crear ambiente positivo retiene talento y mejora calidad",
          "Solo dinero motiva",
          "La cultura es secundaria",
        ],
        correct: 1,
      },
      {
        q: "Combinando competencias digitales, sistemas sanitarios y acceso equitativo, ¿cuál es el desafío de la telemedicina?",
        options: [
          "La telemedicina es obsoleta",
          "Garantizar acceso digital equitativo, proteger privacidad datos, integrar en sistemas sanitarios públicos, mantener relación humana",
          "Solo para ricos",
          "Sin desafíos",
        ],
        correct: 1,
      },
      {
        q: "Integrando liderazgo transformacional y Teoría X/Y, ¿cómo debe evolucionar la gestión enfermera en contexto moderno?",
        options: [
          "Permanecer con control-mando",
          "Pasar de control externo a empoderamiento, confiar en responsabilidad profesional, inspirar excepcionalidad, desarrollar potencial",
          "Teoría X es mejor",
          "Las personas no evolucionan",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo relacionan la gestión por procesos, mejora continua y Lean Healthcare para reducir carga asistencial?",
        options: [
          "Los procesos no importan",
          "Mapear procesos, eliminar desperdicio, optimizar flujos, medir mejoras, involucrar staff en kaizen continuo",
          "Cambios radicales únicamente",
          "Sin mejora posible",
        ],
        correct: 1,
      },
      {
        q: "Combinando análisis DAFO estratégico con indicadores de desempeño, ¿cuál es el propósito del Balanced Scorecard?",
        options: [
          "Solo controlar gastos",
          "Medir fortalezas/debilidades contra KPIs financieros, clientes, procesos internos, aprendizaje para validar estrategia",
          "Documento administrativo",
          "Sin valor práctico",
        ],
        correct: 1,
      },
      {
        q: "Integrando seguridad del paciente, ética y comunicación efectiva, ¿cómo reportar un near-miss en enfermería?",
        options: [
          "Ocultarlo para evitar culpa",
          "Notificar formal, analizar causas sin blame, aprender, comunicar lecciones, implementar mejoras preventivas",
          "Ignorarlo",
          "Solo entre colegas",
        ],
        correct: 1,
      },
      {
        q: "¿Cómo integran la imagen digital del profesional, competencias de comunicación y marca personal en enfermería?",
        options: [
          "Las redes sociales no importan",
          "Coherencia online-offline, ética digital, profesionalismo en interacciones, credibilidad basada en excelencia clínica y relacional",
          "Privacidad absoluta",
          "La marca es vanidad",
        ],
        correct: 1,
      },
      {
        q: "Combinando gestión de conflictos, resolución de problemas y toma de decisiones, ¿cuál es el enfoque para dilemas ético-clínicos?",
        options: [
          "Decir sí a todo",
          "Diálogo multiperspectiva, análisis valores enfrentados, buscar mejor resultado para paciente, documentar proceso decisión",
          "Evitar decisiones",
          "Un solo punto de vista",
        ],
        correct: 1,
      },
      {
        q: "Integrando sistemas de salud, calidad y dirección estratégica, ¿cuál es el rol de acreditación de centros sanitarios?",
        options: [
          "Solo cumplimiento normativo",
          "Validar calidad estructura/procesos/resultados, garantizar seguridad, mejorar confianza, alineamiento con estándares internacionales",
          "Marketing sin valor",
          "Costo innecesario",
        ],
        correct: 1,
      },
      {
        q: "Finalmente, ¿cómo sintesiza una gestora enfermera competente: liderazgo, innovación, seguridad, calidad y tecnología?",
        options: [
          "Gestor sin visión integrada",
          "Líder inspirador que innova procesos, protege pacientes, asegura calidad, empodera equipo, usa TIC estratégicamente para excelencia",
          "Áreas aisladas sin conexión",
          "Imposible integrar todo",
        ],
        correct: 1,
      },
    ],
  },
];

// 💰 CURRENCY SYSTEM (GestCoins)
export const CURRENCY = {
  // Ganancias por actividades
  EARN_QUIZ_CORRECT: 10, // Por cada respuesta correcta
  EARN_QUIZ_PERFECT: 50, // Bonus por quiz perfecto (todas correctas)
  EARN_LEVEL_COMPLETE: 100, // Por completar un nivel
  EARN_DAILY_LOGIN: 25, // Por iniciar sesión diariamente
  EARN_STREAK_BONUS: 10, // Por cada día de racha (multiplicador)
  EARN_BADGE: 75, // Por desbloquear un badge
  EARN_MISSION_COMPLETE: 150, // Por completar una misión

  // Recompensas por logros
  EARN_FIRST_PERFECT: 200, // Primera vez con quiz perfecto
  EARN_RANK_UP: 300, // Por subir de rango
  EARN_LEAGUE_PROMOTION: 500, // Por ascender de liga

  // Balance inicial
  INITIAL_BALANCE: 100,

  // Límites
  MAX_DAILY_EARNINGS: 1000, // Máximo que se puede ganar por día
};
