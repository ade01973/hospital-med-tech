// 🏆 SISTEMA COMPLETO DE BADGES Y LOGROS

export const BADGES_DATABASE = {
  // 1️⃣ BADGES DE PROGRESO
  primera_victoria: {
    id: "primera_victoria",
    name: "Primera Victoria",
    icon: "🔰",
    category: "progreso",
    description: "Completa tu primer nivel",
    obtained: false,
    obtainedDate: null,
    color: "from-blue-500 to-cyan-500"
  },
  aprendiz_dedicado: {
    id: "aprendiz_dedicado",
    name: "Aprendiz Dedicado",
    icon: "🎓",
    category: "progreso",
    description: "Completa 5 niveles",
    obtained: false,
    obtainedDate: null,
    color: "from-cyan-500 to-teal-500",
    requirement: { type: "levelCount", value: 5 }
  },
  experto_formacion: {
    id: "experto_formacion",
    name: "Experto en Formación",
    icon: "🎖️",
    category: "progreso",
    description: "Completa 10 niveles",
    obtained: false,
    obtainedDate: null,
    color: "from-teal-500 to-emerald-500",
    requirement: { type: "levelCount", value: 10 }
  },
  maestro: {
    id: "maestro",
    name: "Maestro",
    icon: "🏆",
    category: "progreso",
    description: "Completa todos los niveles (22/22)",
    obtained: false,
    obtainedDate: null,
    color: "from-emerald-500 to-lime-500",
    requirement: { type: "allLevels", value: 22 }
  },

  // 2️⃣ BADGES DE EXCELENCIA
  perfeccionista: {
    id: "perfeccionista",
    name: "Perfeccionista",
    icon: "⭐",
    category: "excelencia",
    description: "Completa un nivel con 100% de aciertos",
    obtained: false,
    obtainedDate: null,
    color: "from-yellow-500 to-orange-500",
    requirement: { type: "perfectLevel", value: 1 }
  },
  racha_legendaria: {
    id: "racha_legendaria",
    name: "Racha Legendaria",
    icon: "🔥",
    category: "excelencia",
    description: "Alcanza racha de 10 respuestas consecutivas",
    obtained: false,
    obtainedDate: null,
    color: "from-orange-500 to-red-500",
    requirement: { type: "streak", value: 10 }
  },
  velocista: {
    id: "velocista",
    name: "Velocista",
    icon: "⚡",
    category: "excelencia",
    description: "Responde 10 preguntas en menos de 10s cada una",
    obtained: false,
    obtainedDate: null,
    color: "from-red-500 to-pink-500",
    requirement: { type: "fastAnswers", value: 10 }
  },
  genio: {
    id: "genio",
    name: "Genio",
    icon: "💡",
    category: "excelencia",
    description: "Obtén 1000+ XP en un solo nivel",
    obtained: false,
    obtainedDate: null,
    color: "from-pink-500 to-purple-500",
    requirement: { type: "xpPerLevel", value: 1000 }
  },

  // 3️⃣ BADGES DE DEDICACIÓN
  semana_perfecta: {
    id: "semana_perfecta",
    name: "Semana Perfecta",
    icon: "📅",
    category: "dedicacion",
    description: "Login 7 días consecutivos",
    obtained: false,
    obtainedDate: null,
    color: "from-blue-600 to-indigo-600",
    requirement: { type: "loginStreak", value: 7 }
  },
  mes_completo: {
    id: "mes_completo",
    name: "Mes Completo",
    icon: "🌟",
    category: "dedicacion",
    description: "Login 30 días consecutivos",
    obtained: false,
    obtainedDate: null,
    color: "from-indigo-600 to-purple-600",
    requirement: { type: "loginStreak", value: 30 }
  },
  cazador_misiones: {
    id: "cazador_misiones",
    name: "Cazador de Misiones",
    icon: "🎯",
    category: "dedicacion",
    description: "Completa 50 misiones diarias",
    obtained: false,
    obtainedDate: null,
    color: "from-purple-600 to-fuchsia-600",
    requirement: { type: "missionsCompleted", value: 50 }
  },
  inquebrantable: {
    id: "inquebrantable",
    name: "Inquebrantable",
    icon: "💪",
    category: "dedicacion",
    description: "Mantén racha de login de 100 días",
    obtained: false,
    obtainedDate: null,
    color: "from-fuchsia-600 to-rose-600",
    requirement: { type: "loginStreak", value: 100 }
  },

  // 4️⃣ BADGES DE COMPETICIÓN
  campeon: {
    id: "campeon",
    name: "Campeón",
    icon: "🥇",
    category: "competicion",
    description: "Llega a #1 en tu liga",
    obtained: false,
    obtainedDate: null,
    color: "from-yellow-500 to-yellow-600",
    requirement: { type: "leaguePosition", value: 1 }
  },
  subcampeon: {
    id: "subcampeon",
    name: "Subcampeón",
    icon: "🥈",
    category: "competicion",
    description: "Termina en top 3 de tu liga",
    obtained: false,
    obtainedDate: null,
    color: "from-slate-400 to-slate-500",
    requirement: { type: "leagueTop", value: 3 }
  },
  competidor: {
    id: "competidor",
    name: "Competidor",
    icon: "🏅",
    category: "competicion",
    description: "Participa en 10 temporadas de ligas",
    obtained: false,
    obtainedDate: null,
    color: "from-orange-600 to-orange-700",
    requirement: { type: "leagueSeasons", value: 10 }
  },

  // 5️⃣ BADGES ESPECIALES
  vip: {
    id: "vip",
    name: "VIP",
    icon: "👑",
    category: "especial",
    description: "Alcanza el rango Ministra de Sanidad",
    obtained: false,
    obtainedDate: null,
    color: "from-amber-400 to-orange-600",
    requirement: { type: "rank", value: "Ministra de Sanidad" }
  },
  fundador: {
    id: "fundador",
    name: "Fundador",
    icon: "🎉",
    category: "especial",
    description: "Eres uno de los primeros 100 usuarios",
    obtained: false,
    obtainedDate: null,
    color: "from-purple-500 to-pink-500",
    requirement: { type: "earlyUser", value: 100 }
  },
  coleccionista: {
    id: "coleccionista",
    name: "Coleccionista",
    icon: "✨",
    category: "especial",
    description: "Obtén 20 badges diferentes",
    obtained: false,
    obtainedDate: null,
    color: "from-pink-500 to-rose-500",
    requirement: { type: "totalBadges", value: 20 }
  }
};

export const BADGE_CATEGORIES = {
  progreso: { name: "Progreso", color: "bg-blue-500/10", icon: "📈" },
  excelencia: { name: "Excelencia", color: "bg-yellow-500/10", icon: "✨" },
  dedicacion: { name: "Dedicación", color: "bg-purple-500/10", icon: "💜" },
  competicion: { name: "Competición", color: "bg-red-500/10", icon: "⚔️" },
  especial: { name: "Especial", color: "bg-amber-500/10", icon: "🌟" }
};
