/**
 * Hospital Cases - 8 Healthcare Management Story Arc
 * Decisiones narrativas que avanzan la historia y otorgan XP
 */

export const HOSPITAL_CASES = [
  {
    id: 1,
    title: "Crisis de Camas UCI",
    emoji: "🏥",
    description: "El hospital está lleno y tienes 5 pacientes críticos esperando cama UCI. ¿Cómo resuelves la ocupación?",
    options: [
      { text: "Habilitar camas de cuidado intermedio", correct: true, xp: 100 },
      { text: "Derivar pacientes a otro hospital", correct: false, xp: 30 },
      { text: "Ignorar y esperar que se liberen", correct: false, xp: 0 }
    ],
    impact: "✓ Crisis UCI resuelta exitosamente"
  },
  {
    id: 2,
    title: "Conflicto de Personal",
    emoji: "👥",
    description: "Una enfermera reporta sobrecarga de trabajo y amenaza renunciar. Tienes 5 minutos para responder.",
    options: [
      { text: "Reunión empática + redistribuir carga + plan de bienestar", correct: true, xp: 100 },
      { text: "Decirle que necesitamos que aguante", correct: false, xp: 0 },
      { text: "Asignarle más tareas para 'adaptarla'", correct: false, xp: -20 }
    ],
    impact: "✓ Personal retiene confianza y motivación"
  },
  {
    id: 3,
    title: "Auditoría CCAFR",
    emoji: "🚨",
    description: "Inspectores de control de calidad llegan mañana. Tu servicio tiene 3 deficiencias documentadas.",
    options: [
      { text: "Plan correctivo integral + capacitación ya", correct: true, xp: 100 },
      { text: "Esconder documentos problemáticos", correct: false, xp: -50 },
      { text: "Culpar al equipo anterior", correct: false, xp: 10 }
    ],
    impact: "✓ Auditoría pasada con recomendaciones menores"
  },
  {
    id: 4,
    title: "Presupuesto Limitado",
    emoji: "📊",
    description: "Solo tienes 50,000€ para inversiones pero necesitas: nuevos monitores (30k), software (15k), y capacitación (20k).",
    options: [
      { text: "Priorizar monitores + buscar subvenciones para lo demás", correct: true, xp: 100 },
      { text: "Repartir equitativamente (ineficiente)", correct: false, xp: 40 },
      { text: "Gastar todo en software", correct: false, xp: 20 }
    ],
    impact: "✓ Presupuesto optimizado, equipo seguro y actualizado"
  },
  {
    id: 5,
    title: "Infecciones Nosocomiales",
    emoji: "🦠",
    description: "Brote de infecciones cruzadas en sala de cirugía. 7 pacientes afectados. Acción inmediata requerida.",
    options: [
      { text: "Protocolo de desinfección + cultivos + aislamiento", correct: true, xp: 100 },
      { text: "Cambiar solo el personal", correct: false, xp: 30 },
      { text: "Esperar a ver si se controla sola", correct: false, xp: -100 }
    ],
    impact: "✓ Brote controlado, protocolos reforzados"
  },
  {
    id: 6,
    title: "Staff Burnout",
    emoji: "😰",
    description: "Tu equipo reporta cansancio extremo. 3 de 10 enfermeras consideran baja laboral. ¿Intervención?",
    options: [
      { text: "Jornadas reducidas + rotación + apoyo psicológico", correct: true, xp: 100 },
      { text: "Motivarlos solo con palabras", correct: false, xp: 20 },
      { text: "Aumentar presión para que 'aguanten'", correct: false, xp: -50 }
    ],
    impact: "✓ Equipo recupera bienestar, productividad sube 30%"
  },
  {
    id: 7,
    title: "Paciente Insatisfecho",
    emoji: "😠",
    description: "Paciente amenaza demanda por 'trato inadecuado' y planes escalada a medios. Tienes 2 horas.",
    options: [
      { text: "Disculpa genuina + auditoría de atención + solución", correct: true, xp: 100 },
      { text: "Decirle que el hospital no tiene culpa", correct: false, xp: -30 },
      { text: "Ignorar la amenaza", correct: false, xp: -50 }
    ],
    impact: "✓ Conflicto resuelto, reputación protegida"
  },
  {
    id: 8,
    title: "Crisis de Emergencia",
    emoji: "🚑",
    description: "Accidente masivo. 25 heridos en ruta. Hospital en máxima capacidad. Coordinación crítica.",
    options: [
      { text: "Activar protocolo masivo + derivaciones + equipos móviles", correct: true, xp: 100 },
      { text: "Aceptar todos en urgencias", correct: false, xp: 20 },
      { text: "Llamar a otro hospital para que los maneje", correct: false, xp: 30 }
    ],
    impact: "✓ 24 pacientes estabilizados, 1 derivado, cero muertes"
  }
];

/**
 * Rastrear casos completados del usuario
 * Guardado en localStorage: completedCases -> { 1: true, 3: true, ... }
 */
export const getCompletedCases = () => {
  const saved = localStorage.getItem('completedCases');
  return saved ? JSON.parse(saved) : {};
};

export const markCaseAsCompleted = (caseId) => {
  const completed = getCompletedCases();
  completed[caseId] = true;
  localStorage.setItem('completedCases', JSON.stringify(completed));
};

export const getCaseProgress = () => {
  const completed = getCompletedCases();
  return Object.keys(completed).length;
};
