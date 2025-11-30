/**
 * Feedback dinámico para Hospital Cases
 * Respuestas aleatorias positivas y negativas con emojis
 */

export const POSITIVE_FEEDBACKS = [
  { emoji: '✅', text: '¡Decisión Correcta! ¡Excelente gestión!' },
  { emoji: '🎉', text: '¡Bravo! ¡Tomaste la mejor decisión!' },
  { emoji: '⭐', text: '¡Perfecto! ¡Demuestras sabiduría gestor/a!' },
  { emoji: '🏆', text: '¡Increíble! ¡Resolviste la crisis brillantemente!' },
  { emoji: '💪', text: '¡Muy bien! ¡Tu criterio es impecable!' },
  { emoji: '🌟', text: '¡Fantástico! ¡Esa fue la opción ideal!' },
  { emoji: '👏', text: '¡Claro! ¡Decisión de gestor/a experimentado!' },
  { emoji: '🎯', text: '¡Acertaste! ¡Precisión en tu gestión!' },
  { emoji: '💯', text: '¡Magistral! ¡Así se lidera un hospital!' },
  { emoji: '🚀', text: '¡Espectacular! ¡Avanzas brillantemente!' }
];

export const NEGATIVE_FEEDBACKS = [
  { emoji: '❌', text: 'Hay una opción mejor... ¡Pero sigue intentando!' },
  { emoji: '💭', text: 'No fue la ideal... ¡Aprenderás con cada caso!' },
  { emoji: '🔄', text: 'Esa no era la mejor... ¡Los errores enseñan!' },
  { emoji: '📚', text: 'Necesitas reconsiderar... ¡Cada intento te acerca!' },
  { emoji: '🎓', text: 'No es la opción correcta... ¡Sigue aprendiendo!' },
  { emoji: '⚡', text: 'Esa decisión no era óptima... ¡Adelante!' },
  { emoji: '🌱', text: 'Hay camino por recorrer... ¡No te desanimes!' },
  { emoji: '💡', text: 'Necesitas otra perspectiva... ¡Lo conseguirás!' },
  { emoji: '🎪', text: 'Esa no es la salida... ¡Sigue buscando!' },
  { emoji: '🔮', text: 'La respuesta correcta está cerca... ¡Persevera!' }
];

export const getRandomPositiveFeedback = () => {
  return POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)];
};

export const getRandomNegativeFeedback = () => {
  return NEGATIVE_FEEDBACKS[Math.floor(Math.random() * NEGATIVE_FEEDBACKS.length)];
};
