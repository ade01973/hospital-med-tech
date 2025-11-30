/**
 * Hospital Cases - 8 Healthcare Management Story Arc
 * Decisiones narrativas que avanzan la historia y otorgan XP
 * Sistema dinámico con generación automática y recompensas
 * NIVEL 1: Casos básicos - NIVEL 2: Casos casi imposibles
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
 * NIVEL 2: CASOS CASI IMPOSIBLES - Mayor complejidad y dilemas éticos
 */
export const HOSPITAL_CASES_LEVEL_2 = [
  {
    id: 101,
    title: "Triaje de Recursos Limitados",
    emoji: "⚠️",
    description: "Pandemia: 50 pacientes críticos, solo 10 ventiladores. Protocolos éticos contradictorios. ¿Criterios de asignación?",
    options: [
      { text: "Protocolo por edad + pronóstico + factores médicos objetivos", correct: true, xp: 150 },
      { text: "FIFO (primero llegado)", correct: false, xp: -50 },
      { text: "Decidir casos puntuales sin protocolo", correct: false, xp: -100 }
    ],
    impact: "✓ Decisión documentada y defensible éticamente"
  },
  {
    id: 102,
    title: "Falsificación de Reportes",
    emoji: "🔍",
    description: "Encuentras que un colega médico falsificó datos clínicos por 3 meses. ¿Reportar sin pruebas sólidas?",
    options: [
      { text: "Auditoría interna + documentar + reportar a cuerpo colegiado", correct: true, xp: 150 },
      { text: "Confrontar privadamente", correct: false, xp: 30 },
      { text: "Ignorar y esperar que se descubra solo", correct: false, xp: -80 }
    ],
    impact: "✓ Integridad institucional protegida, investigación formal iniciada"
  },
  {
    id: 103,
    title: "Presupuesto vs Vidas",
    emoji: "💔",
    description: "Costo de tratamiento oncológico avanzado: 200k€/año × 5 pacientes vs. Renovación de quirófanos para 500 pacientes/año.",
    options: [
      { text: "Buscar financiamiento externo + negociar precios + fondos públicos", correct: true, xp: 150 },
      { text: "Negar el tratamiento avanzado", correct: false, xp: 0 },
      { text: "Postergar renovación de quirófanos", correct: false, xp: 40 }
    ],
    impact: "✓ Solución integral: terapia + infraestructura ambas viables"
  },
  {
    id: 104,
    title: "Crisis de Confianza (Negligencia Compañero)",
    emoji: "⚖️",
    description: "Tu mejor cardiólogo, 20 años con hospital, causó muerte por error. Presión política para ocultarlo. ¿Transparencia?",
    options: [
      { text: "Investigación + revisión de casos previos + comunicación honesta a familia", correct: true, xp: 150 },
      { text: "Retirarlo silenciosamente de la unidad", correct: false, xp: -70 },
      { text: "Culpar al paciente/equipo de enfermería", correct: false, xp: -100 }
    ],
    impact: "✓ Responsabilidad asumida, confianza institucional fortalecida a largo plazo"
  },
  {
    id: 105,
    title: "Conflicto Ético: Paciente vs Salud Pública",
    emoji: "🤝",
    description: "Paciente VIH+, actitud negacionista, reusa divulgar su estado. Riesgo de transmisión. Confidencialidad vs protección.",
    options: [
      { text: "Educación + consejería + documentación + derivación especializada", correct: true, xp: 150 },
      { text: "Revelar información sin consentimiento", correct: false, xp: -100 },
      { text: "Negar acceso al servicio", correct: false, xp: -80 }
    ],
    impact: "✓ Derechos protegidos + salud pública salvaguardada responsablemente"
  },
  {
    id: 106,
    title: "Colusión Administrativa",
    emoji: "🚩",
    description: "Descubres que contratista en licitación está conectado a junta directiva. Beneficiarios de compra aparente inflada.",
    options: [
      { text: "Auditoría externa + denuncia formal + suspensión del contrato", correct: true, xp: 150 },
      { text: "Informar discretamente al director", correct: false, xp: 50 },
      { text: "Ignorar si 'las cosas funcionan'", correct: false, xp: -120 }
    ],
    impact: "✓ Corrupción detenida, integridad financiera restaurada"
  },
  {
    id: 107,
    title: "Mobbing y Represalia",
    emoji: "😤",
    description: "Enfermero denunció condiciones inseguras. Ahora sufre aislamiento, tareas degradantes, cambios injustos de turno.",
    options: [
      { text: "Investigación formal + protección legal + medidas disciplinarias vs acosadores", correct: true, xp: 150 },
      { text: "Sugerir que 'busque empleo en otro lado'", correct: false, xp: -100 },
      { text: "Mediar informalmente", correct: false, xp: 20 }
    ],
    impact: "✓ Cultura segura restaurada, precedente legal sentado"
  },
  {
    id: 108,
    title: "Pandemia Segunda Ola - Colapso Total",
    emoji: "🌪️",
    description: "3x ocupación esperada. 70% de staff baja. Falta de oxígeno. Muertes por falta de camas. Decisión en minutos.",
    options: [
      { text: "Activar plan contingencia extremo: solicitar refuerzos ejército, desviar de otros hospitales, triaje de recursos", correct: true, xp: 150 },
      { text: "Aceptar todos + improvisar", correct: false, xp: -80 },
      { text: "Esperar instrucciones ministeriales", correct: false, xp: -100 }
    ],
    impact: "✓ Sistema en extremis coordinado, minimizadas muertes prevenibles"
  }
];

/**
 * Sistema dinámico de casos con niveles y recompensas
 * Nivel 1: 8 casos básicos → Nivel 2: 8 casos casi imposibles
 */

export const getCaseSession = () => {
  let session = localStorage.getItem('caseSession');
  if (!session) {
    return initializeNewSession();
  }
  return JSON.parse(session);
};

export const initializeNewSession = () => {
  // Leer sesión anterior si existe (sin recursión)
  let previousSession = null;
  try {
    const saved = localStorage.getItem('caseSession');
    if (saved) {
      previousSession = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error parsing session:', e);
  }
  
  // Si existe sesión anterior, mantener nivel y contador, sino empezar en nivel 1
  const level = previousSession?.level || 1;
  const levelRound = previousSession?.levelRound || 1;
  
  const casePool = level === 1 ? HOSPITAL_CASES : HOSPITAL_CASES_LEVEL_2;
  const shuffled = [...casePool].sort(() => Math.random() - 0.5);
  
  const newSession = {
    id: Date.now(),
    level: level,
    levelRound: levelRound,
    cases: shuffled.map(c => ({ ...c })),
    currentIndex: 0,
    correctAnswers: 0,
    completedCount: 0,
    startedAt: new Date().toISOString()
  };
  localStorage.setItem('caseSession', JSON.stringify(newSession));
  return newSession;
};

export const getCurrentCase = () => {
  let session = getCaseSession();
  
  // Si la sesión no tiene casos, reinicializar
  if (!session.cases || session.cases.length === 0) {
    console.log('⚠️ Sesión sin casos, reinicializando...');
    session = initializeNewSession();
  }
  
  if (session.currentIndex < session.cases.length) {
    return { ...session.cases[session.currentIndex], sessionIndex: session.currentIndex };
  }
  
  // Si llegamos aquí, reinicializar todo
  console.warn('⚠️ getCurrentCase: índice fuera de rango, reinicializando');
  session = initializeNewSession();
  return session.cases[0] ? { ...session.cases[0], sessionIndex: 0 } : null;
};

export const completeCurrentCase = (isCorrect) => {
  const session = getCaseSession();
  
  if (session.currentIndex < session.cases.length) {
    session.completedCount++;
    if (isCorrect) {
      session.correctAnswers++;
    }
    session.currentIndex++;
    
    localStorage.setItem('caseSession', JSON.stringify(session));
    
    const isSessionComplete = session.currentIndex >= session.cases.length;
    
    // Si completó perfectamente (TODAS correctas), dar recompensa y cambiar de nivel
    if (isSessionComplete && session.correctAnswers === session.cases.length) {
      // Incrementar nivel para próxima sesión
      const nextLevel = session.level === 1 ? 2 : 1; // Alternar entre nivel 1 y 2
      const nextRound = session.level === 1 ? session.levelRound : session.levelRound + 1;
      
      // Guardar el nuevo nivel/round ANTES de generar recompensa
      const updatedSession = {
        ...session,
        level: nextLevel,
        levelRound: nextRound
      };
      localStorage.setItem('caseSession', JSON.stringify(updatedSession));
      
      return {
        isSessionComplete: true,
        correctAnswers: session.correctAnswers,
        totalCases: session.cases.length,
        nextCase: null,
        reward: getFullReward(session.level, nextRound),
        nextLevel: nextLevel
      };
    }
    
    // Si la sesión se completó pero NO todas correctas, NO dar recompensa
    // Mantener en el mismo nivel pero incrementar round (para rastrear intentos)
    if (isSessionComplete) {
      const newRound = session.levelRound + 1;
      const updatedSession = {
        ...session,
        levelRound: newRound
      };
      localStorage.setItem('caseSession', JSON.stringify(updatedSession));
      
      return {
        isSessionComplete: true,
        correctAnswers: session.correctAnswers,
        totalCases: session.cases.length,
        nextCase: null,
        reward: null // NO hay recompensa si no todas son correctas
      };
    }
    
    // Aún hay más casos en la sesión
    return {
      isSessionComplete: false,
      correctAnswers: session.correctAnswers,
      totalCases: session.cases.length,
      nextCase: getCurrentCase(),
      reward: null
    };
  }
  
  return { isSessionComplete: true, correctAnswers: session.correctAnswers, totalCases: session.cases.length };
};

export const getFullReward = (level = 1, round = 1) => {
  // Aumentar recompensa con cada nivel y ronda completada
  const baseGestCoins = level === 1 ? 500 : 1500; // Nivel 2 da más
  const gestCoinsReward = baseGestCoins + (round * 250);
  
  const levelText = level === 1 ? "NIVEL 1" : "NIVEL 2 - CASI IMPOSIBLE";
  
  return {
    xp: level === 1 ? 500 : 1000,
    gestcoins: gestCoinsReward,
    badge: level === 1 ? 'gestor_crisis_master' : 'gestor_leyenda',
    title: level === 1 ? '¡MAESTRO DE DECISIONES! 👑' : '¡LEYENDA MÉDICA! 🏆',
    message: `Completaste todos los casos de ${levelText} con decisiones perfectas (Ronda ${round})`,
    icon: level === 1 ? '👑' : '🏆',
    level,
    round
  };
};

export const resetCaseSession = () => {
  // Obtener sesión anterior para mantener nivel y round
  const previousSession = getCaseSession();
  
  // Generar nuevos 8 casos del mismo nivel
  const casePool = previousSession.level === 1 ? HOSPITAL_CASES : HOSPITAL_CASES_LEVEL_2;
  const shuffled = [...casePool].sort(() => Math.random() - 0.5);
  
  const newSession = {
    id: Date.now(),
    level: previousSession.level,
    levelRound: previousSession.levelRound,
    cases: shuffled.map(c => ({ ...c })),
    currentIndex: 0,
    correctAnswers: 0,
    completedCount: 0,
    startedAt: new Date().toISOString()
  };
  
  localStorage.setItem('caseSession', JSON.stringify(newSession));
  return newSession;
};

export const getSessionProgress = () => {
  const session = getCaseSession();
  return {
    completed: session.completedCount,
    correct: session.correctAnswers,
    total: session.cases.length,
    isComplete: session.currentIndex >= session.cases.length,
    level: session.level,
    levelRound: session.levelRound
  };
};

// Legacy functions para compatibilidad
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
  const session = getCaseSession();
  return {
    total: session.cases.length,
    completed: session.completedCount,
    correct: session.correctAnswers,
    level: session.level,
    levelRound: session.levelRound
  };
};
