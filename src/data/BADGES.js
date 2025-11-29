/**
 * Achievement Badges System - 15 Badges
 * Cada badge tiene condición de desbloqueo, recompensa XP, rareza
 */

export const BADGES = [
  {
    id: "especialista",
    name: "Especialista",
    emoji: "🏥",
    description: "Completa 3 módulos educativos",
    color: "from-blue-500 to-cyan-500",
    rarity: "common",
    xpReward: 50,
    condition: (progress) => progress.completedLevels && Object.keys(progress.completedLevels).length >= 3
  },
  {
    id: "gestor_equipos",
    name: "Gestor de Equipos",
    emoji: "👥",
    description: "Crear o ganar 3 team quests",
    color: "from-purple-500 to-pink-500",
    rarity: "common",
    xpReward: 50,
    condition: (progress) => progress.teamQuestsCompleted >= 3
  },
  {
    id: "hospitalero",
    name: "Hospitalero",
    emoji: "❤️",
    description: "Completar 5 casos de pacientes",
    color: "from-red-500 to-orange-500",
    rarity: "common",
    xpReward: 50,
    condition: (progress) => progress.casesCompleted >= 5
  },
  {
    id: "lider_estrategico",
    name: "Líder Estratégico",
    emoji: "📊",
    description: "Llegar al tier 'Jefa de Área' (Tier 5)",
    color: "from-emerald-500 to-green-500",
    rarity: "rare",
    xpReward: 75,
    condition: (progress) => progress.tier >= 5
  },
  {
    id: "combatiente",
    name: "Combatiente",
    emoji: "⚔️",
    description: "Vencer 5 jefes (Boss Battles)",
    color: "from-orange-600 to-red-600",
    rarity: "rare",
    xpReward: 75,
    condition: (progress) => progress.bossesDefeated >= 5
  },
  {
    id: "racha_master",
    name: "Racha Master",
    emoji: "🔥",
    description: "Mantener 7 días de racha consecutiva",
    color: "from-amber-500 to-orange-500",
    rarity: "rare",
    xpReward: 75,
    condition: (progress) => progress.maxStreak >= 7
  },
  {
    id: "auditor_experto",
    name: "Auditor Experto",
    emoji: "🚨",
    description: "Pasar 3 auditorías (CCAFR cases)",
    color: "from-indigo-500 to-purple-500",
    rarity: "rare",
    xpReward: 75,
    condition: (progress) => progress.auditsPassed >= 3
  },
  {
    id: "salva_vidas",
    name: "Salva Vidas",
    emoji: "🚑",
    description: "Completar 3 casos de emergencia",
    color: "from-red-500 to-pink-500",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => progress.emergencyCasesCompleted >= 3
  },
  {
    id: "gestor_crisis",
    name: "Gestor de Crisis",
    emoji: "💫",
    description: "Resolver 5 conflictos de personal",
    color: "from-yellow-500 to-orange-500",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => progress.conflictsResolved >= 5
  },
  {
    id: "innovador",
    name: "Innovador",
    emoji: "💡",
    description: "Desbloquear 10 decisiones únicas en casos",
    color: "from-cyan-400 to-blue-500",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => progress.uniqueDecisions >= 10
  },
  {
    id: "maestro_sanitario",
    name: "Maestro Sanitario",
    emoji: "👑",
    description: "Alcanzar tier 'Gerenta' (Tier 8)",
    color: "from-yellow-400 to-amber-600",
    rarity: "legendary",
    xpReward: 150,
    condition: (progress) => progress.tier >= 8
  },
  {
    id: "colaborador",
    name: "Colaborador",
    emoji: "🤝",
    description: "Participar en 20 team quests",
    color: "from-pink-500 to-rose-500",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => progress.teamQuestsCompleted >= 20
  },
  {
    id: "analista",
    name: "Analista",
    emoji: "📈",
    description: "Completar progreso personal > 75%",
    color: "from-green-500 to-emerald-600",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => {
      const completedLevels = Object.keys(progress.completedLevels || {}).length;
      return completedLevels >= 16; // 16/22 módulos = ~73%
    }
  },
  {
    id: "mentor",
    name: "Mentor",
    emoji: "👨‍🏫",
    description: "Ayudar 5 equipos a ganar team quests",
    color: "from-blue-600 to-cyan-500",
    rarity: "epic",
    xpReward: 100,
    condition: (progress) => progress.teamWinsHelped >= 5
  },
  {
    id: "campeon",
    name: "Campeón",
    emoji: "🏆",
    description: "Alcanzar top 10 en leaderboard global",
    color: "from-amber-400 to-yellow-500",
    rarity: "legendary",
    xpReward: 150,
    condition: (progress) => progress.leaderboardRank <= 10
  }
];

/**
 * Rastrear badges desbloqueados del usuario
 * Guardado en localStorage: unlockedBadges -> { "especialista": true, ... }
 */
export const getUnlockedBadges = () => {
  const saved = localStorage.getItem('unlockedBadges');
  return saved ? JSON.parse(saved) : {};
};

export const unlockBadge = (badgeId) => {
  const unlocked = getUnlockedBadges();
  unlocked[badgeId] = true;
  localStorage.setItem('unlockedBadges', JSON.stringify(unlocked));
};

export const isBadgeUnlocked = (badgeId) => {
  return getUnlockedBadges()[badgeId] === true;
};

export const getBadgeById = (badgeId) => {
  return BADGES.find(b => b.id === badgeId);
};

export const checkBadgeUnlocks = (progress) => {
  const unlockedBadges = getUnlockedBadges();
  const newlyUnlocked = [];

  BADGES.forEach(badge => {
    if (!unlockedBadges[badge.id] && badge.condition(progress)) {
      unlockBadge(badge.id);
      newlyUnlocked.push(badge);
    }
  });

  return newlyUnlocked;
};
