/**
 * Mensajes de ánimo y avisos de tiempo para el quiz
 * Varios de cada tipo para aparecer aleatoriamente
 */

export const ENCOURAGEMENT_MESSAGES = {
  // Mensajes durante el quiz (aparecen aleatoriamente)
  general: [
    "¡Vamos, tú puedes! 💪",
    "¡Sigue así, vas genial! ⭐",
    "¡Concentración, gestor/a! 🎯",
    "¡Demuestra tu potencial! 🌟",
    "¡Cada pregunta, una oportunidad! 🚀",
    "¡Ritmo perfecto, continúa! 🔥",
    "¡Eres un/a profesional! 👏",
    "¡La gestión sanitaria te llama! 🏥",
    "¡Ninguna pregunta es imposible! 💡",
    "¡Tu conocimiento brilla! ✨",
    "¡Adelante con determinación! 🎪",
    "¡Gestiona este módulo! 📊",
  ],

  // Mensajes cuando quedan 10 segundos
  timeWarning10: [
    "⏱️ ¡10 segundos! Decide rápido",
    "⏰ ¡Se acaba el tiempo! Piensa",
    "⚡ Solo 10 segundos quedan",
    "🚨 ¡Hurry! 10 segundos",
    "⏳ ¡Apúrate! Tienes 10",
    "⏱️ ¡Última oportunidad!",
    "⚠️ ¡Muy poco tiempo!",
    "🏃 ¡Corre, gestor/a!",
  ],

  // Mensajes cuando quedan 5 segundos (crítico)
  timeWarning5: [
    "🔴 ¡5 SEGUNDOS! ¡ELIGE AHORA!",
    "🚨 ¡CRÍTICO! ¡5 SEGUNDOS!",
    "⚡ ¡YA! ¡Solo 5 segundos!",
    "🔥 ¡RÁPIDO! ¡5 SEGUNDOS!",
    "⏰ ¡URGENTE! ¡Quedan 5!",
    "💥 ¡¡¡AHORA!!! ¡5 SEGUNDOS!",
    "🚨 ¡RESPONDE! ¡5 SEGUNDOS!",
    "⏳ ¡MOMENTO CRÍTICO! ¡5!",
  ],

  // Mensajes cuando NO responden a tiempo
  timeUp: [
    "⏱️ ¡Se acabó el tiempo!",
    "⏰ Tiempo agotado",
    "🚨 ¡Demasiado lento!",
    "⏳ ¡No respondiste a tiempo!",
    "⚡ ¡El tiempo fue más rápido!",
    "🔴 ¡Tiempo finalizado!",
    "⚠️ ¡Oportunidad perdida!",
    "💔 ¡Se nos fue el tiempo!",
  ],

  // Mensajes de racha/motivación en respuestas correctas
  streakBonus: [
    "¡Eres imparable! 🔥",
    "¡La racha continúa! ✨",
    "¡Cada vez mejor! 📈",
    "¡Dominando el módulo! 👑",
    "¡Increíble actuación! 🌟",
    "¡Profesional de verdad! 🏥",
    "¡Sin errores, perfecto! 💯",
    "¡Vas como una máquina! ⚙️",
  ],
};

/**
 * Obtener un mensaje aleatorio de un array
 */
export const getRandomMessage = (messageArray) => {
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

/**
 * Hook para obtener mensajes de ánimo durante el quiz
 */
export const useEncouragementMessages = () => {
  const getGeneralEncouragement = () =>
    getRandomMessage(ENCOURAGEMENT_MESSAGES.general);

  const getTimeWarning10 = () =>
    getRandomMessage(ENCOURAGEMENT_MESSAGES.timeWarning10);

  const getTimeWarning5 = () =>
    getRandomMessage(ENCOURAGEMENT_MESSAGES.timeWarning5);

  const getTimeUp = () =>
    getRandomMessage(ENCOURAGEMENT_MESSAGES.timeUp);

  const getStreakBonus = () =>
    getRandomMessage(ENCOURAGEMENT_MESSAGES.streakBonus);

  return {
    getGeneralEncouragement,
    getTimeWarning10,
    getTimeWarning5,
    getTimeUp,
    getStreakBonus,
  };
};
