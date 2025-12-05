import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Send, Bot, User, Target, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Users, AlertTriangle, Home, BookOpen, Trophy, Sparkles, Brain, GitBranch, ListOrdered, ArrowUp, ArrowDown, RotateCcw, Check, X, Flame, TrendingUp } from 'lucide-react';
import decisionBg from '../../assets/decision-making-bg.png';

const usePlayerAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('playerAvatar');
      if (stored) {
        setAvatar(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading avatar:', e);
    }
  }, []);
  
  return avatar;
};

const PlayerAvatarIcon = ({ size = 'sm', className = '' }) => {
  const avatar = usePlayerAvatar();
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const FallbackAvatar = () => (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
      <User className="w-1/2 h-1/2 text-white" />
    </div>
  );
  
  if (!avatar || !avatar.characterPreset || imgError) {
    return <FallbackAvatar />;
  }
  
  const gender = avatar.gender || 'female';
  const preset = avatar.characterPreset;
  const imgPath = new URL(`../../assets/${gender}-characters/${gender}-character-${preset}.png`, import.meta.url).href;
  
  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-cyan-400/50 ${className}`}>
      <img 
        src={imgPath}
        alt="Tu avatar"
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-30"
        style={{
          width: Math.random() * 6 + 2 + 'px',
          height: Math.random() * 6 + 2 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          background: `linear-gradient(135deg, ${['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'][Math.floor(Math.random() * 4)]}, transparent)`,
          animation: `float ${8 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
      }
    `}</style>
  </div>
);

const GlowingOrb = ({ color, size, left, top, delay }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: color,
      animationDelay: delay,
      animationDuration: '4s'
    }}
  />
);

const DECISION_SCENARIOS = [
  {
    id: 'turno-absentismo',
    title: 'Gestión de Absentismo Urgente',
    category: 'Gestión de Recursos Humanos',
    difficulty: 'Intermedio',
    duration: '15-20 min',
    icon: '📋',
    color: 'from-cyan-500 to-blue-500',
    description: 'Una enfermera del turno de noche llama enferma 2 horas antes de su turno. Debes decidir cómo cubrir la baja.',
    actors: ['Supervisora de unidad', 'Equipo de enfermería de noche', 'Enfermera de refuerzo'],
    topics: ['Absentismo', 'Cobertura de turnos', 'Recursos humanos']
  },
  {
    id: 'asignacion-cargas',
    title: 'Redistribución de Cargas de Trabajo',
    category: 'Gestión de Recursos Humanos',
    difficulty: 'Avanzado',
    duration: '20-25 min',
    icon: '⚖️',
    color: 'from-blue-500 to-indigo-500',
    description: 'Tres pacientes críticos ingresan simultáneamente. Debes asignar cargas considerando competencias del equipo.',
    actors: ['Supervisora de UCI', 'Enfermeras expertas', 'TCAEs', 'Enfermera novel'],
    topics: ['Cargas de trabajo', 'Competencias', 'Pacientes críticos']
  },
  {
    id: 'protocolo-upp',
    title: 'Implementación de Protocolo UPP',
    category: 'Gestión Asistencial',
    difficulty: 'Intermedio',
    duration: '15-20 min',
    icon: '📑',
    color: 'from-indigo-500 to-cyan-500',
    description: 'Debes decidir cómo implementar un nuevo protocolo de prevención de úlceras por presión con resistencia del equipo.',
    actors: ['Directora de enfermería', 'Supervisoras de unidad', 'Equipo asistencial'],
    topics: ['Protocolos', 'Gestión del cambio', 'Calidad asistencial']
  },
  {
    id: 'gestion-camas',
    title: 'Crisis de Gestión de Camas',
    category: 'Gestión Asistencial',
    difficulty: 'Avanzado',
    duration: '20-25 min',
    icon: '🛏️',
    color: 'from-sky-500 to-blue-500',
    description: 'Urgencias está colapsada y hay que decidir altas y traslados para liberar camas en un momento crítico.',
    actors: ['Supervisora de Urgencias', 'Coordinadora de camas', 'Jefas de unidades'],
    topics: ['Flujo de pacientes', 'Altas', 'Priorización clínica']
  },
  {
    id: 'evento-adverso',
    title: 'Gestión de Evento Adverso',
    category: 'Seguridad del Paciente',
    difficulty: 'Avanzado',
    duration: '25-30 min',
    icon: '⚠️',
    color: 'from-blue-500 to-cyan-500',
    description: 'Se ha producido un error de medicación. Debes tomar decisiones inmediatas y planificar acciones correctivas.',
    actors: ['Supervisora de planta', 'Enfermera implicada', 'Farmacia', 'Dirección'],
    topics: ['Seguridad', 'Eventos adversos', 'Cultura no punitiva']
  },
  {
    id: 'control-stock',
    title: 'Gestión de Stock y Recursos',
    category: 'Recursos Materiales',
    difficulty: 'Intermedio',
    duration: '15-20 min',
    icon: '📦',
    color: 'from-teal-500 to-blue-500',
    description: 'Hay escasez de material fungible crítico y debes decidir cómo gestionar el stock limitado.',
    actors: ['Supervisora de unidad', 'Almacén central', 'Farmacia'],
    topics: ['Stock', 'Recursos materiales', 'Priorización']
  },
  {
    id: 'conflicto-equipo',
    title: 'Mediación en Conflicto de Equipo',
    category: 'Gestión de Conflictos',
    difficulty: 'Avanzado',
    duration: '20-25 min',
    icon: '🤝',
    color: 'from-indigo-500 to-blue-500',
    description: 'Dos enfermeras veteranas tienen un conflicto que afecta al clima laboral. Debes mediar y tomar decisiones.',
    actors: ['Supervisora de unidad', 'Enfermeras en conflicto', 'Resto del equipo'],
    topics: ['Conflictos', 'Mediación', 'Clima laboral']
  },
  {
    id: 'humanizacion-uci',
    title: 'Plan de Humanización en UCI',
    category: 'Gestión Estratégica',
    difficulty: 'Intermedio',
    duration: '15-20 min',
    icon: '💚',
    color: 'from-cyan-500 to-teal-500',
    description: 'Debes decidir cómo flexibilizar horarios de visita en UCI equilibrando humanización y seguridad.',
    actors: ['Supervisora UCI', 'Equipo de enfermería', 'Familias', 'Dirección'],
    topics: ['Humanización', 'Visitas', 'Gestión del cambio']
  }
];

const DECISION_TREES = [
  {
    id: 'crisis-personal',
    title: 'Crisis de Personal en Turno Nocturno',
    description: 'Son las 22:00h y te avisan de que dos enfermeras del turno de noche no pueden acudir.',
    category: 'Recursos Humanos',
    icon: '🌙',
    color: 'from-blue-500 to-indigo-500',
    initialNode: 'start',
    nodes: {
      start: {
        text: 'Son las 22:00h. Te llaman para informarte que dos enfermeras del turno de noche (de un equipo de 5) no podrán acudir: una por enfermedad y otra por emergencia familiar. El turno empieza a las 23:00h. La unidad tiene 25 pacientes, 5 de ellos críticos. ¿Qué decides hacer primero?',
        options: [
          { text: 'Llamar inmediatamente a enfermeras de refuerzo de la bolsa de guardia', next: 'bolsa_guardia' },
          { text: 'Contactar con supervisoras de otras unidades para redistribuir personal', next: 'redistribuir' },
          { text: 'Pedir a las enfermeras del turno de tarde que doblen turno', next: 'doblar_turno' },
          { text: 'Evaluar si puedo reducir la ratio reorganizando pacientes', next: 'reorganizar' }
        ]
      },
      bolsa_guardia: {
        text: 'Llamas a la bolsa de guardia. De las 3 enfermeras disponibles, solo 1 puede acudir y llegará a las 00:30h. Aún te falta cubrir otro puesto. ¿Qué haces?',
        options: [
          { text: 'Insistir con más llamadas a la bolsa de refuerzos', next: 'insistir_bolsa' },
          { text: 'Combinar: pedir a una enfermera de tarde que haga 4 horas extra', next: 'solucion_mixta' },
          { text: 'Asumir el turno con 4 enfermeras y reorganizar cargas', next: 'asumir_deficit' }
        ]
      },
      redistribuir: {
        text: 'Contactas con otras unidades. Medicina Interna tiene una enfermera que podría venir, pero dejaría su unidad con ratio justa. Traumatología no puede ceder a nadie. ¿Qué decides?',
        options: [
          { text: 'Aceptar la enfermera de Medicina Interna', next: 'aceptar_medicina' },
          { text: 'Buscar otras opciones para no perjudicar a Medicina Interna', next: 'otras_opciones' },
          { text: 'Combinar: media enfermera de M. Interna + llamar a bolsa', next: 'solucion_mixta' }
        ]
      },
      doblar_turno: {
        text: 'Propones doblar turno a las enfermeras de tarde. Una acepta hacer 4 horas extra (hasta las 03:00h). Otra se niega porque tiene un niño pequeño. Una tercera podría, pero lleva ya 12 horas y está agotada. ¿Cómo procedes?',
        options: [
          { text: 'Aceptar las 4 horas de la primera y buscar otra solución para el resto', next: 'solucion_mixta' },
          { text: 'Insistir a la enfermera agotada para que haga unas horas más', next: 'insistir_agotada' },
          { text: 'No forzar a nadie y buscar alternativas en bolsa de refuerzos', next: 'bolsa_guardia' }
        ]
      },
      reorganizar: {
        text: 'Analizas la situación: de los 5 pacientes críticos, 2 podrían pasar a semicríticos si estabilizan. Podrías concentrar a los críticos para que los atienda el personal más experto. ¿Esta reorganización es suficiente?',
        options: [
          { text: 'Sí, con buena organización 4 enfermeras pueden cubrir', next: 'asumir_deficit' },
          { text: 'No es suficiente, necesito al menos una persona más', next: 'bolsa_guardia' },
          { text: 'Reorganizo Y además busco refuerzo parcial', next: 'solucion_mixta' }
        ]
      },
      insistir_bolsa: {
        text: 'Sigues llamando pero nadie más está disponible. Son las 22:45h y el tiempo se acaba. El turno de noche está preocupado.',
        options: [
          { text: 'Asumir el déficit y gestionar con 4 enfermeras bien organizadas', next: 'asumir_deficit' },
          { text: 'Última opción: pedir apoyo parcial a supervisión de guardia del hospital', next: 'supervision_guardia' }
        ]
      },
      solucion_mixta: {
        text: 'Consigues una solución combinada: 1 enfermera de refuerzo que llega a las 00:30h + 4 horas extra de una del turno de tarde + reorganización de cargas. El turno queda cubierto de forma razonable.',
        isEnd: true,
        score: 9,
        feedback: '¡Excelente gestión! Has combinado varias estrategias de forma inteligente: refuerzos, horas extra voluntarias y reorganización. Esta flexibilidad y visión global es clave en la gestión enfermera. Has mantenido la seguridad del paciente sin forzar excesivamente al personal.'
      },
      asumir_deficit: {
        text: 'Decides trabajar con 4 enfermeras reorganizando cargas. La enfermera más experta asume los 5 críticos con apoyo de TCAE. Las otras 3 se reparten los 20 pacientes restantes. El turno es duro pero viable.',
        isEnd: true,
        score: 6,
        feedback: 'Has tomado una decisión pragmática ante la falta de recursos. La reorganización de cargas es correcta, pero trabajar con ratio tan ajustada supone riesgo. En el futuro, intenta agotar más opciones antes de asumir déficit. Lo positivo: priorizaste la seguridad de los críticos.'
      },
      insistir_agotada: {
        text: 'La enfermera agotada acepta a regañadientes hacer 2 horas más. A las 01:00h comete un error de medicación menor por fatiga. Afortunadamente se detecta a tiempo.',
        isEnd: true,
        score: 3,
        feedback: 'Forzar a personal agotado a trabajar más horas pone en riesgo la seguridad del paciente. El error de medicación, aunque menor, era previsible. La gestión de personas debe considerar siempre el factor humano y los límites del cansancio. Busca siempre alternativas antes de forzar.'
      },
      aceptar_medicina: {
        text: 'Aceptas la enfermera de Medicina Interna. Tu unidad queda cubierta, pero durante la noche hay una urgencia en M. Interna que se gestiona con dificultad por falta de personal.',
        isEnd: true,
        score: 5,
        feedback: 'Resolviste tu problema pero creaste otro. En gestión enfermera debemos pensar en el hospital como sistema. Redistribuir personal debe hacerse con visión global, no solo de tu unidad. La próxima vez, busca soluciones que no perjudiquen a otras unidades.'
      },
      otras_opciones: {
        text: 'Decides no perjudicar a Medicina Interna y buscas otras opciones. Tras varias llamadas, consigues un refuerzo de la bolsa y 2 horas extra de una compañera.',
        isEnd: true,
        score: 8,
        feedback: 'Muy buena decisión. Has mostrado visión de sistema al no perjudicar a otra unidad. Aunque requirió más esfuerzo, encontraste una solución equilibrada. Este enfoque colaborativo fortalece las relaciones entre unidades y mejora el clima laboral global.'
      },
      supervision_guardia: {
        text: 'La supervisión de guardia te ayuda a conseguir una enfermera de quirófano que está de guardia localizada. Llega a las 00:00h y el turno queda cubierto.',
        isEnd: true,
        score: 7,
        feedback: 'Escalaste correctamente el problema cuando agotaste tus opciones. Usar los recursos de supervisión de guardia es adecuado en situaciones de crisis. Sin embargo, intenta siempre resolver en tu nivel antes de escalar, y avisa con tiempo suficiente.'
      }
    }
  },
  {
    id: 'reclamacion-familiar',
    title: 'Gestión de Reclamación Familiar',
    description: 'Un familiar presenta una queja formal por el trato recibido. Debes gestionar la situación.',
    category: 'Atención a Reclamaciones',
    icon: '📝',
    color: 'from-indigo-500 to-cyan-500',
    initialNode: 'start',
    nodes: {
      start: {
        text: 'La hija de un paciente ingresado presenta una queja formal en el mostrador de enfermería. Está muy alterada y dice que "nadie le hace caso a su padre", que "las enfermeras no vienen cuando llama" y amenaza con ir a dirección. Otros pacientes y familiares observan la escena. ¿Cómo actúas?',
        options: [
          { text: 'Invitarla a pasar a un despacho privado para hablar con calma', next: 'despacho' },
          { text: 'Intentar calmarla ahí mismo explicando la situación', next: 'calmar_publico' },
          { text: 'Pedir a otra enfermera que la atienda mientras reviso la historia del paciente', next: 'revisar_historia' },
          { text: 'Disculparte inmediatamente y prometerle que no volverá a pasar', next: 'disculpa_rapida' }
        ]
      },
      despacho: {
        text: 'La invitas amablemente a pasar al despacho. Acepta. Una vez en privado, le ofreces agua y le pides que te cuente con detalle qué ha ocurrido. Se calma un poco y explica que su padre lleva 20 minutos esperando para ir al baño.',
        options: [
          { text: 'Escuchar activamente, validar su frustración y explicar la situación', next: 'escucha_activa' },
          { text: 'Ir inmediatamente a atender al paciente y volver después', next: 'atender_primero' },
          { text: 'Llamar a la enfermera responsable del paciente para que explique', next: 'llamar_enfermera' }
        ]
      },
      calmar_publico: {
        text: 'Intentas calmarla en el pasillo pero la situación empeora. Otros familiares empiezan a murmurar y un paciente se queja del ruido. La hija dice "¿Lo ve? A nadie le importa".',
        options: [
          { text: 'Ahora sí, llevarla a un espacio privado', next: 'despacho' },
          { text: 'Pedir ayuda a un compañero para gestionar la situación', next: 'pedir_ayuda' }
        ]
      },
      revisar_historia: {
        text: 'Mientras revisas la historia, la familiar se enfada más porque siente que la ignoras. "¿Ve? Es exactamente lo que digo, nadie me escucha".',
        options: [
          { text: 'Dejar la historia y atenderla directamente', next: 'despacho' },
          { text: 'Explicarle que estás revisando para ayudarla mejor', next: 'explicar_revision' }
        ]
      },
      disculpa_rapida: {
        text: 'La disculpa rápida no la satisface. "Eso ya me lo dijeron ayer y sigue igual. Quiero hablar con la supervisora". La situación escala.',
        options: [
          { text: 'Ofrecerte a ser tú quien gestione la situación como supervisora', next: 'despacho' },
          { text: 'Llamar a tu supervisora inmediatamente', next: 'llamar_supervisora' }
        ]
      },
      escucha_activa: {
        text: 'Escuchas sin interrumpir, asientes y dices: "Entiendo su frustración, 20 minutos esperando para algo tan básico es demasiado tiempo. Tiene razón en estar enfadada". La familiar se relaja visiblemente. "Gracias por escucharme, es lo único que pedía".',
        options: [
          { text: 'Ahora explicar la situación y proponer soluciones', next: 'proponer_soluciones' },
          { text: 'Ir a atender al padre inmediatamente', next: 'atender_ahora' }
        ]
      },
      atender_primero: {
        text: 'Vas a atender al paciente. Cuando vuelves, la familiar está más calmada pero dice: "Al menos ahora sí le han hecho caso. Pero quiero que esto no vuelva a pasar".',
        options: [
          { text: 'Sentarte con ella y elaborar un plan para mejorar la atención', next: 'plan_mejora' },
          { text: 'Explicar que hacéis lo que podéis con los recursos disponibles', next: 'explicar_recursos' }
        ]
      },
      llamar_enfermera: {
        text: 'Llamas a la enfermera responsable. Ella explica que estaba atendiendo una urgencia con otro paciente. La familiar entiende mejor pero sigue molesta.',
        options: [
          { text: 'Proponer un sistema para que la familia pueda comunicar necesidades', next: 'sistema_comunicacion' },
          { text: 'Agradecer la comprensión y dar por cerrado el tema', next: 'cerrar_pronto' }
        ]
      },
      pedir_ayuda: {
        text: 'Un compañero viene a ayudar. Entre los dos conseguís llevar a la familiar al despacho y calmar la situación en el pasillo.',
        isEnd: true,
        score: 6,
        feedback: 'Pedir ayuda es correcto, pero lo ideal era actuar antes de que la situación escalara. Llevar la conversación a un espacio privado desde el inicio habría evitado el espectáculo público. Aprende a anticipar y actuar con rapidez en gestión de quejas.'
      },
      explicar_revision: {
        text: 'Le explicas que estás revisando su caso para ayudarla. Ella acepta esperar un momento. Tras revisar, puedes dar una respuesta más completa.',
        options: [
          { text: 'Ahora sí, llevarla a un despacho con la información', next: 'proponer_soluciones' }
        ]
      },
      llamar_supervisora: {
        text: 'Tu supervisora viene y gestiona la situación. La queja se resuelve pero tú has perdido la oportunidad de demostrar liderazgo.',
        isEnd: true,
        score: 5,
        feedback: 'Escalar a supervisión puede ser necesario en casos graves, pero esta situación podías gestionarla tú. Delegar demasiado rápido puede interpretarse como falta de capacidad de resolución. Intenta resolver en tu nivel antes de escalar.'
      },
      proponer_soluciones: {
        text: 'Explicas que el turno ha sido complicado con varias urgencias, pero propones soluciones: "Vamos a poner un timbre directo en la habitación de su padre y hablaré con el equipo para priorizar sus necesidades básicas. ¿Le parece bien?"',
        isEnd: true,
        score: 9,
        feedback: '¡Excelente gestión! Has seguido los pasos correctos: escucha activa, validación emocional, explicación sin excusas y propuesta de soluciones concretas. Este enfoque convierte una queja en una oportunidad de mejora y fideliza a la familia.'
      },
      atender_ahora: {
        text: 'Atiendes al paciente. La familiar queda satisfecha de que se haya actuado. La queja formal no llega a presentarse.',
        isEnd: true,
        score: 7,
        feedback: 'Has priorizado la acción sobre la conversación, lo cual a veces es correcto. Sin embargo, faltó cerrar el círculo con la familiar: explicar qué pasó y qué se hará para evitarlo. Una queja bien gestionada puede mejorar procesos.'
      },
      plan_mejora: {
        text: 'Elaboráis juntas un plan: timbre de llamada, rondas cada 2 horas para necesidades básicas, y número de contacto directo. La familiar agradece la implicación.',
        isEnd: true,
        score: 9,
        feedback: '¡Excelente! Has convertido una queja en una oportunidad de mejora y has involucrado a la familia en la solución. Este enfoque colaborativo mejora la experiencia del paciente y fortalece la relación con las familias.'
      },
      explicar_recursos: {
        text: 'La familiar responde: "Siempre la misma excusa de los recursos. Eso a mí no me soluciona nada". Se va insatisfecha y presenta la queja formal.',
        isEnd: true,
        score: 4,
        feedback: 'Explicar la falta de recursos sin ofrecer soluciones concretas frustra a las familias. Ellos no pueden cambiar los recursos, pero tú sí puedes proponer pequeñas mejoras. Enfócate siempre en qué SÍ puedes hacer, no en lo que no puedes.'
      },
      sistema_comunicacion: {
        text: 'Propones un sistema de comunicación: pizarra en la habitación con necesidades, timbre de llamada y rondas periódicas. La familiar valora el esfuerzo y retira la queja.',
        isEnd: true,
        score: 8,
        feedback: 'Muy bien. Has buscado una solución sistémica que beneficiará no solo a este paciente sino a todos. Convertir una queja individual en una mejora de proceso es gestión enfermera de calidad.'
      },
      cerrar_pronto: {
        text: 'La familiar acepta pero se queda con sensación de que no se ha hecho nada real. Aunque no presenta queja formal, su opinión del servicio es negativa.',
        isEnd: true,
        score: 5,
        feedback: 'Has resuelto la situación inmediata pero no has aprovechado la oportunidad de mejora. Las quejas son feedback valioso. Cuando alguien se queja, busca siempre qué puedes mejorar para que no vuelva a ocurrir.'
      }
    }
  }
];

const PRIORITIZATION_EXERCISES = [
  {
    id: 'inicio-turno',
    title: 'Priorización al Inicio de Turno',
    description: 'Son las 08:00h, acabas de recibir el parte y tienes estas tareas pendientes. Ordénalas por prioridad.',
    icon: '🌅',
    color: 'from-cyan-500 to-blue-500',
    tasks: [
      { id: 1, text: 'Paciente habitación 305 refiere dolor torácico de nueva aparición', priority: 1, explanation: 'Emergencia: dolor torácico puede indicar evento cardíaco. Evaluación inmediata obligatoria.' },
      { id: 2, text: 'Administrar insulina a paciente diabético antes del desayuno (08:30h)', priority: 2, explanation: 'Alta prioridad: medicación tiempo-dependiente para evitar hiperglucemia.' },
      { id: 3, text: 'Revisar resultados de analítica de control pendientes', priority: 4, explanation: 'Importante pero no urgente: se puede hacer tras tareas urgentes.' },
      { id: 4, text: 'Preparar medicación de las 09:00h para 6 pacientes', priority: 3, explanation: 'Importante: requiere tiempo de preparación antes de la hora de administración.' },
      { id: 5, text: 'Cambiar vendaje de herida quirúrgica programado', priority: 5, explanation: 'Programado: puede hacerse en cualquier momento del turno.' },
      { id: 6, text: 'Actualizar plan de cuidados en historia electrónica', priority: 6, explanation: 'Administrativa: importante pero puede hacerse al final del turno.' }
    ]
  },
  {
    id: 'multiple-llamadas',
    title: 'Gestión de Múltiples Llamadas',
    description: 'Suenan 4 timbres a la vez. Ordena en qué orden atenderías las llamadas.',
    icon: '🔔',
    color: 'from-blue-500 to-indigo-500',
    tasks: [
      { id: 1, text: 'Hab. 201: Paciente postoperado de cadera quiere levantarse solo al baño', priority: 1, explanation: 'Riesgo de caída inminente: paciente puede intentar levantarse y caerse causando lesión grave.' },
      { id: 2, text: 'Hab. 205: Familiar pregunta cuándo viene el médico', priority: 4, explanation: 'Información: puede esperar, no hay urgencia clínica.' },
      { id: 3, text: 'Hab. 210: Paciente refiere dificultad para respirar', priority: 1, explanation: 'Urgencia respiratoria: requiere valoración inmediata. Igual prioridad que caída.' },
      { id: 4, text: 'Hab. 208: Bomba de perfusión pitando por fin de suero', priority: 2, explanation: 'Importante: puede esperar unos minutos pero hay que evitar que se obstruya la vía.' },
      { id: 5, text: 'Hab. 203: Paciente pide su medicación para el dolor (toca en 30 min)', priority: 3, explanation: 'Puede esperar: aún no es hora de administración, valorar pero no es urgente.' }
    ]
  },
  {
    id: 'fin-turno',
    title: 'Cierre de Turno con Imprevistos',
    description: 'Faltan 30 minutos para acabar tu turno y tienes estas tareas pendientes. ¿Qué haces primero?',
    icon: '🌆',
    color: 'from-indigo-500 to-cyan-500',
    tasks: [
      { id: 1, text: 'Registrar constantes de 3 pacientes que tomaste hace 1 hora', priority: 3, explanation: 'Importante: el registro es obligatorio pero las constantes ya fueron tomadas.' },
      { id: 2, text: 'Preparar medicación IV urgente pautada para las 14:45h', priority: 1, explanation: 'Urgente: la medicación debe estar lista para su hora de administración.' },
      { id: 3, text: 'Atender nueva prescripción de analgesia PRN', priority: 2, explanation: 'Importante: paciente con dolor necesita su medicación.' },
      { id: 4, text: 'Actualizar plan de cuidados de paciente que recibió el alta', priority: 5, explanation: 'Administrativa: puede delegarse o pasarse al siguiente turno.' },
      { id: 5, text: 'Revisar y firmar pendientes en la historia clínica', priority: 4, explanation: 'Importante: debe hacerse pero puede ser lo último antes de pasar parte.' },
      { id: 6, text: 'Preparar el parte de enfermería para el turno siguiente', priority: 4, explanation: 'Importante: necesario para continuidad de cuidados pero es de las últimas tareas.' }
    ]
  },
  {
    id: 'supervision-unidad',
    title: 'Decisiones de Supervisora de Unidad',
    description: 'Como supervisora, tienes estos temas pendientes hoy. Prioriza tu agenda.',
    icon: '👩‍💼',
    color: 'from-teal-500 to-cyan-500',
    tasks: [
      { id: 1, text: 'Enfermera informa de casi-error de medicación que detectó a tiempo', priority: 2, explanation: 'Alto: analizar causa y prevenir que se repita es esencial para seguridad.' },
      { id: 2, text: 'Reunión con Dirección sobre presupuesto del próximo trimestre', priority: 3, explanation: 'Importante: afecta recursos pero tiene fecha fija.' },
      { id: 3, text: 'Dos enfermeras solicitan el mismo día de vacaciones', priority: 4, explanation: 'Gestión: importante pero no urgente, hay tiempo para resolver.' },
      { id: 4, text: 'Paciente crítico inestable que requiere valoración de cargas', priority: 1, explanation: 'Urgente: la seguridad del paciente es la máxima prioridad.' },
      { id: 5, text: 'Completar evaluación de desempeño de una enfermera (plazo mañana)', priority: 3, explanation: 'Plazo cercano: hay que hacerlo hoy pero no es lo más urgente.' },
      { id: 6, text: 'Responder emails de coordinación con otras unidades', priority: 5, explanation: 'Rutinario: puede hacerse al final del día o delegarse.' }
    ]
  }
];

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue}{suffix}</span>;
};

const ScoreDisplay = ({ score, feedback, onContinue }) => {
  const getScoreColor = (score) => {
    if (score >= 8) return 'from-emerald-500 to-green-500';
    if (score >= 6) return 'from-amber-500 to-yellow-500';
    if (score >= 4) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreMessage = (score) => {
    if (score >= 9) return '¡Excepcional!';
    if (score >= 8) return '¡Excelente!';
    if (score >= 7) return '¡Muy bien!';
    if (score >= 6) return 'Bien';
    if (score >= 5) return 'Aceptable';
    if (score >= 4) return 'Mejorable';
    return 'Necesita trabajo';
  };

  const handleContinue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 relative">
        <div className="text-center mb-6">
          <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getScoreColor(score)} flex items-center justify-center mb-4 shadow-xl`}>
            <span className="text-4xl font-black text-white">{score}</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{getScoreMessage(score)}</h2>
          <p className="text-cyan-300 text-sm">Puntuación: {score}/10</p>
        </div>
        
        <div className="bg-slate-700/80 rounded-2xl p-5 mb-6 border border-slate-600 max-h-60 overflow-y-auto">
          <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Feedback
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed">{feedback}</p>
        </div>
        
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30 cursor-pointer relative z-10"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const ModeSelector = ({ onSelectMode }) => {
  const modes = [
    {
      id: 'scenarios',
      title: 'Escenarios de Decisión',
      description: 'Resuelve casos reales de gestión sanitaria con feedback de IA',
      icon: Target,
      color: 'from-cyan-500 to-blue-500',
      features: ['Casos de gestión RRHH', 'Gestión asistencial', 'Resolución de conflictos']
    },
    {
      id: 'tree',
      title: 'Árbol de Decisiones',
      description: 'Cada decisión lleva a consecuencias diferentes. Encuentra el mejor camino.',
      icon: GitBranch,
      color: 'from-blue-500 to-indigo-500',
      features: ['Decisiones encadenadas', 'Múltiples finales', 'Consecuencias realistas']
    },
    {
      id: 'priority',
      title: 'Priorización de Tareas',
      description: 'Ordena tareas según urgencia e importancia. Entrena tu criterio clínico.',
      icon: ListOrdered,
      color: 'from-indigo-500 to-cyan-500',
      features: ['Ordenación por prioridad', 'Criterio clínico', 'Feedback detallado']
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-cyan-400/50 mb-6 shadow-lg">
            <Target className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-lg">Módulo de Toma de Decisiones</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
            Elige tu <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Modalidad</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Entrena tu capacidad de tomar decisiones en diferentes formatos adaptados a la gestión enfermera
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className="bg-slate-800/95 backdrop-blur-xl border-2 border-slate-600 hover:border-cyan-400 rounded-2xl p-6 text-left transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1 shadow-xl hover:shadow-cyan-500/20"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-100">{mode.title}</h3>
                <p className="text-slate-300 text-sm mb-4">{mode.description}</p>
                <ul className="space-y-2">
                  {mode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                      <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScenarioSelector = ({ onSelectScenario, onBack }) => {
  const [scenarios, setScenarios] = useState(DECISION_SCENARIOS);
  const [aiScenarios, setAiScenarios] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const generateNewScenario = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Error al generar escenario');
      }
      
      const newScenario = await response.json();
      setAiScenarios(prev => [newScenario, ...prev]);
    } catch (error) {
      console.error('Error generating scenario:', error);
      setGenerationError('No se pudo generar el escenario. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const allScenarios = [...aiScenarios, ...scenarios];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#3b82f6" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-cyan-400 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a modalidades</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
            Escenarios de <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Decisión</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block mb-4">Selecciona un caso para resolver o genera uno nuevo con IA</p>
          
          <button
            onClick={generateNewScenario}
            disabled={isGenerating}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando caso nuevo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar Caso con IA</span>
              </>
            )}
          </button>
          
          {generationError && (
            <p className="text-red-400 text-sm mt-3 bg-red-900/30 px-4 py-2 rounded-lg inline-block">{generationError}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {allScenarios.map((scenario, idx) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.02] hover:-translate-y-1 ${
                idx < aiScenarios.length 
                  ? 'border-purple-500/50 hover:border-purple-400' 
                  : 'border-slate-600 hover:border-cyan-400'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {idx < aiScenarios.length && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-100">{scenario.title}</h3>
                  <p className="text-cyan-400 text-xs font-medium mb-2">{scenario.category}</p>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">{scenario.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 bg-slate-700/80 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {scenario.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-700/80 px-2 py-1 rounded-lg">
                      <Zap className="w-3 h-3" />
                      {scenario.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScenarioChat = ({ scenario, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalFeedback, setFinalFeedback] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**${scenario.title}**\n\n📋 **Categoría:** ${scenario.category}\n⏱️ **Duración estimada:** ${scenario.duration}\n\n---\n\n${scenario.description}\n\n**Actores involucrados:**\n${scenario.actors.map(a => `• ${a}`).join('\n')}\n\n---\n\n¿Estás listo/a para comenzar? Escribe **"Empezar"** y te presentaré el escenario completo para que tomes decisiones.`
    }]);
  }, [scenario]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const parseEvaluation = (text) => {
    const scoreMatch = text.match(/\*\*EVALUACIÓN:\s*(\d+)\/10\*\*/i) || 
                       text.match(/EVALUACIÓN:\s*(\d+)\/10/i) ||
                       text.match(/Puntuación:\s*(\d+)\/10/i) ||
                       text.match(/Nota:\s*(\d+)\/10/i);
    
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const feedbackStart = text.indexOf(scoreMatch[0]) + scoreMatch[0].length;
      let feedback = text.substring(feedbackStart).trim();
      feedback = feedback.replace(/^\*+|\*+$/g, '').trim();
      if (feedback.length < 50) {
        feedback = text.replace(scoreMatch[0], '').trim();
      }
      return { score, feedback };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un simulador de formación para gestoras enfermeras (supervisoras de unidad o directoras de enfermería). 

ESCENARIO ACTUAL: "${scenario.title}"
CATEGORÍA: ${scenario.category}
DESCRIPCIÓN: ${scenario.description}
ACTORES: ${scenario.actors.join(', ')}
TEMAS CLAVE: ${scenario.topics.join(', ')}

TU FUNCIÓN:
1. Cuando el usuario diga "Empezar" o similar, presenta un escenario detallado con:
   - Contexto específico del hospital/unidad
   - Los actores involucrados con nombres y roles
   - La situación problemática concreta
   - Pregunta qué decisión tomaría el estudiante

2. Después de cada decisión del usuario:
   - Muestra las consecuencias de su decisión
   - Presenta nuevos desarrollos o complicaciones
   - Haz preguntas de seguimiento
   - Guía hacia una resolución completa del caso

3. Cuando el caso esté resuelto (tras 3-5 intercambios de decisiones):
   - Proporciona una EVALUACIÓN de 0 a 10
   - El formato EXACTO debe ser: "**EVALUACIÓN: X/10**" donde X es el número
   - Da feedback constructivo explicando:
     * Qué decisiones fueron acertadas
     * Qué podría haber hecho mejor
     * Conceptos clave de gestión aplicados

IMPORTANTE:
- Los escenarios son sobre gestión de recursos humanos, gestión asistencial, recursos materiales, conflictos o gestión estratégica
- Los actores son SIEMPRE gestoras enfermeras y su equipo
- Mantén realismo en el contexto sanitario español
- Sé constructivo pero exigente en la evaluación
- Siempre en español
- SIEMPRE incluye "**EVALUACIÓN: X/10**" cuando concluyas el caso`
        })
      });

      const data = await response.json();
      const aiResponse = data.response;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      const evaluation = parseEvaluation(aiResponse);
      if (evaluation) {
        setTimeout(() => {
          setFinalScore(evaluation.score);
          setFinalFeedback(evaluation.feedback || 'Has completado el escenario. Revisa tus decisiones para seguir mejorando.');
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Error en chat:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ **Error de conexión**\n\nEl servicio de IA está temporalmente ocupado. Por favor, espera unos segundos e intenta de nuevo.\n\n*Puedes volver a escribir tu mensaje.*' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length > 1) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        setInput(lastUserMsg.content);
      }
    }
  };

  if (showResult) {
    return (
      <ScoreDisplay
        score={finalScore}
        feedback={finalFeedback}
        onContinue={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-cyan-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl shadow-lg`}>
            {scenario.icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{scenario.title}</h1>
            <p className="text-xs text-cyan-300">{scenario.category}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {msg.role === 'assistant' && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90 text-white border border-cyan-400/30'
                : 'bg-slate-800/90 border-2 border-slate-600/80 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0">
                <PlayerAvatarIcon size="md" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-cyan-300">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-sm font-medium">Analizando situación...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-cyan-500/50 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu decisión..."
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const TreeSelector = ({ onSelectTree, onBack }) => {
  const [trees, setTrees] = useState(DECISION_TREES);
  const [aiTrees, setAiTrees] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const generateNewTree = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/generate-decision-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Error al generar árbol');
      }
      
      const newTree = await response.json();
      setAiTrees(prev => [newTree, ...prev]);
    } catch (error) {
      console.error('Error generating tree:', error);
      setGenerationError('No se pudo generar el árbol. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const allTrees = [...aiTrees, ...trees];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#6366f1" size="280px" left="10%" top="25%" delay="0s" />
      <GlowingOrb color="#3b82f6" size="200px" left="80%" top="55%" delay="1.5s" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-indigo-400 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a modalidades</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
            Árbol de <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Decisiones</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block mb-4">Cada decisión tiene consecuencias. Elige sabiamente.</p>
          
          <button
            onClick={generateNewTree}
            disabled={isGenerating}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando árbol nuevo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar Árbol con IA</span>
              </>
            )}
          </button>
          
          {generationError && (
            <p className="text-red-400 text-sm mt-3 bg-red-900/30 px-4 py-2 rounded-lg inline-block">{generationError}</p>
          )}
        </div>

        <div className="grid gap-4">
          {allTrees.map((tree, idx) => (
            <button
              key={tree.id}
              onClick={() => onSelectTree(tree)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.01] hover:-translate-y-1 relative ${
                idx < aiTrees.length 
                  ? 'border-purple-500/50 hover:border-purple-400' 
                  : 'border-slate-600 hover:border-indigo-400'
              }`}
            >
              {idx < aiTrees.length && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tree.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                  {tree.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-100">{tree.title}</h3>
                  <p className="text-indigo-400 text-xs font-medium mb-2">{tree.category}</p>
                  <p className="text-slate-300 text-sm">{tree.description}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DecisionTreeGame = ({ tree, onBack, onComplete }) => {
  const [currentNode, setCurrentNode] = useState(tree.initialNode);
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const node = tree.nodes[currentNode];

  const handleChoice = (option, idx) => {
    setSelectedOption(idx);
    setTimeout(() => {
      setHistory([...history, { node: currentNode, choice: option.text }]);
      
      if (tree.nodes[option.next].isEnd) {
        setCurrentNode(option.next);
        setTimeout(() => setShowResult(true), 500);
      } else {
        setCurrentNode(option.next);
      }
      setSelectedOption(null);
    }, 300);
  };

  const handleRestart = () => {
    setCurrentNode(tree.initialNode);
    setHistory([]);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (showResult) {
    const endNode = tree.nodes[currentNode];
    return (
      <ScoreDisplay
        score={endNode.score}
        feedback={endNode.feedback}
        onContinue={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#6366f1" size="300px" left="10%" top="20%" delay="0s" />
      <GlowingOrb color="#3b82f6" size="200px" left="70%" top="60%" delay="2s" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-indigo-400 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Salir</span>
          </button>
          <div className="flex items-center gap-3">
            <PlayerAvatarIcon size="md" />
            <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-indigo-500/50">
              <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>{history.length} decisiones</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-indigo-400 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reiniciar</span>
          </button>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl p-6 mb-6 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4 mb-5 relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tree.color} flex items-center justify-center text-2xl shadow-xl ring-2 ring-white/20`}>
              {tree.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white">{tree.title}</h2>
              <p className="text-sm text-indigo-300 font-medium">{tree.category}</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full font-bold border border-indigo-500/30">
              <GitBranch className="w-4 h-4" />
              <span>Decisión {history.length + 1}</span>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-2xl p-5 border border-slate-600/50">
            <p className="text-slate-100 leading-relaxed text-base">{node.text}</p>
          </div>
        </div>

        {node.options && (
          <div className="space-y-3">
            <p className="text-indigo-300 text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              ¿Qué decides hacer?
            </p>
            {node.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(option, idx)}
                disabled={selectedOption !== null}
                className={`w-full bg-slate-800/90 backdrop-blur-xl border-2 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-indigo-500/20 ${
                  selectedOption === idx 
                    ? 'border-indigo-400 scale-[0.98] bg-indigo-900/50' 
                    : 'border-slate-600 hover:border-indigo-400 hover:scale-[1.01] hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-all ${
                    selectedOption === idx 
                      ? 'bg-indigo-500 scale-110' 
                      : 'bg-gradient-to-br from-indigo-500 to-blue-500 group-hover:scale-110'
                  }`}>
                    {selectedOption === idx ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  <p className="text-slate-100 group-hover:text-white text-sm flex-1 font-medium">{option.text}</p>
                  <ChevronRight className={`w-5 h-5 transition-all ${
                    selectedOption === idx 
                      ? 'text-indigo-400 translate-x-1' 
                      : 'text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {history.length > 0 && (
          <div className="mt-6 bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Tu camino hasta aquí:
            </p>
            <div className="flex flex-wrap gap-2">
              {history.map((h, idx) => (
                <div key={idx} className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-500/30 flex items-center gap-2">
                  <span className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{idx + 1}</span>
                  <span className="truncate max-w-[150px]">{h.choice.substring(0, 30)}...</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PrioritySelector = ({ onSelectExercise, onBack }) => {
  const [exercises, setExercises] = useState(PRIORITIZATION_EXERCISES);
  const [aiExercises, setAiExercises] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const generateNewExercise = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch('/api/generate-priority-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Error al generar ejercicio');
      }
      
      const newExercise = await response.json();
      setAiExercises(prev => [newExercise, ...prev]);
    } catch (error) {
      console.error('Error generating exercise:', error);
      setGenerationError('No se pudo generar el ejercicio. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const allExercises = [...aiExercises, ...exercises];

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="260px" left="8%" top="30%" delay="0s" />
      <GlowingOrb color="#8b5cf6" size="200px" left="82%" top="50%" delay="1.5s" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-cyan-400 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a modalidades</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-3 drop-shadow-lg">
            Priorización de <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Tareas</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block mb-4">Ordena las tareas según su urgencia e importancia</p>
          
          <button
            onClick={generateNewExercise}
            disabled={isGenerating}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 mx-auto hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando ejercicio nuevo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar Ejercicio con IA</span>
              </>
            )}
          </button>
          
          {generationError && (
            <p className="text-red-400 text-sm mt-3 bg-red-900/30 px-4 py-2 rounded-lg inline-block">{generationError}</p>
          )}
        </div>

        <div className="grid gap-4">
          {allExercises.map((exercise, idx) => (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-cyan-500/20 hover:scale-[1.01] hover:-translate-y-1 relative ${
                idx < aiExercises.length 
                  ? 'border-teal-500/50 hover:border-teal-400' 
                  : 'border-slate-600 hover:border-cyan-400'
              }`}
            >
              {idx < aiExercises.length && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exercise.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                  {exercise.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-100">{exercise.title}</h3>
                  <p className="text-slate-300 text-sm">{exercise.description}</p>
                  <p className="text-cyan-400 text-xs mt-2 bg-slate-700/50 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                    <ListOrdered className="w-3 h-3" />
                    {exercise.tasks.length} tareas para ordenar
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PriorityGame = ({ exercise, onBack }) => {
  const [userOrder, setUserOrder] = useState([...exercise.tasks].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...userOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setUserOrder(newOrder);
  };

  const moveDown = (index) => {
    if (index === userOrder.length - 1) return;
    const newOrder = [...userOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setUserOrder(newOrder);
  };

  const handleSubmit = () => {
    let points = 0;
    const maxPoints = userOrder.length;
    
    userOrder.forEach((task, index) => {
      const correctPosition = task.priority - 1;
      const distance = Math.abs(index - correctPosition);
      if (distance === 0) points += 1;
      else if (distance === 1) points += 0.5;
    });
    
    const finalScore = Math.round((points / maxPoints) * 10);
    setScore(finalScore);
    setSubmitted(true);
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const getFeedback = (score) => {
    if (score >= 9) return '¡Excelente criterio de priorización! Has demostrado un sólido conocimiento de urgencias vs importancia en el contexto sanitario.';
    if (score >= 7) return 'Muy buen trabajo. Tu criterio de priorización es sólido, aunque hay algunos matices que podrías mejorar. Revisa las explicaciones.';
    if (score >= 5) return 'Aceptable. Tienes el concepto general pero necesitas afinar tu criterio. Recuerda: primero seguridad del paciente, luego medicación tiempo-dependiente.';
    return 'Necesitas trabajar más la priorización. Recuerda el principio: urgente + importante primero, importante pero no urgente después, y lo administrativo al final.';
  };

  const correctCount = submitted ? userOrder.filter((task, idx) => task.priority === idx + 1).length : 0;

  if (showResult) {
    return (
      <ScoreDisplay
        score={score}
        feedback={getFeedback(score)}
        onContinue={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#06b6d4" size="250px" left="5%" top="30%" delay="0s" />
      <GlowingOrb color="#8b5cf6" size="200px" left="80%" top="50%" delay="1.5s" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-all bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600 hover:border-cyan-400 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Salir</span>
          </button>
          <div className="flex items-center gap-3">
            <PlayerAvatarIcon size="md" />
            <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-cyan-500/50">
              <div className="flex items-center gap-2 text-cyan-300 text-sm font-medium">
                <ListOrdered className="w-4 h-4" />
                <span>{userOrder.length} tareas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl p-6 mb-6 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4 mb-4 relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exercise.color} flex items-center justify-center text-2xl shadow-xl ring-2 ring-white/20`}>
              {exercise.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white">{exercise.title}</h2>
              <p className="text-sm text-cyan-300 font-medium">{exercise.description}</p>
            </div>
          </div>
          
          {submitted && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                  style={{ width: `${(correctCount / userOrder.length) * 100}%` }}
                />
              </div>
              <span className="text-emerald-400 font-bold text-sm">{correctCount}/{userOrder.length} correctas</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-cyan-400 font-medium text-sm flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl">
            {submitted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Resultado de tu priorización:
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" />
                <ArrowDown className="w-4 h-4 -ml-2" />
                Ordena de mayor a menor prioridad:
              </>
            )}
          </p>
          {!submitted && (
            <span className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full">
              1 = Más urgente
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {userOrder.map((task, index) => {
            const isCorrect = submitted && task.priority === index + 1;
            const isClose = submitted && Math.abs(task.priority - (index + 1)) === 1;
            
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all shadow-xl backdrop-blur-sm ${
                  submitted
                    ? isCorrect
                      ? 'bg-emerald-900/70 border-emerald-500/70 shadow-emerald-500/20'
                      : isClose
                        ? 'bg-amber-900/70 border-amber-500/70 shadow-amber-500/20'
                        : 'bg-red-900/70 border-red-500/70 shadow-red-500/20'
                    : 'bg-slate-800/90 border-slate-600/80 hover:border-cyan-400/50 hover:shadow-cyan-500/10'
                }`}
                style={{
                  animation: submitted ? `fadeIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                  submitted
                    ? isCorrect
                      ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white'
                      : isClose
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                        : 'bg-gradient-to-br from-red-500 to-rose-500 text-white'
                    : 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-cyan-400 border-2 border-cyan-500/50'
                }`}>
                  {submitted ? (isCorrect ? <Check className="w-5 h-5" /> : index + 1) : index + 1}
                </div>
                
                <p className="flex-1 text-slate-100 text-sm font-medium">{task.text}</p>
                
                {!submitted && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-2 bg-slate-700/80 hover:bg-cyan-500/30 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 border border-slate-600 hover:border-cyan-500/50"
                    >
                      <ArrowUp className="w-4 h-4 text-slate-300" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === userOrder.length - 1}
                      className="p-2 bg-slate-700/80 hover:bg-cyan-500/30 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 border border-slate-600 hover:border-cyan-500/50"
                    >
                      <ArrowDown className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>
                )}
                
                {submitted && !isCorrect && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 bg-slate-700/80 px-3 py-1.5 rounded-full border border-slate-600">
                      Correcto: {task.priority}º
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {submitted && (
          <div className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600/80 rounded-2xl p-6 mb-6 shadow-xl">
            <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Explicación del orden correcto:
            </h3>
            <div className="space-y-4">
              {[...exercise.tasks]
                .sort((a, b) => a.priority - b.priority)
                .map((task, idx) => (
                  <div key={task.id} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                      {task.priority}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{task.text}</p>
                      <p className="text-slate-400 text-xs mt-1">{task.explanation}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/30 hover:scale-[1.02] hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Comprobar Orden
            </span>
          </button>
        ) : (
          <button
            onClick={handleShowResult}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 hover:scale-[1.02] hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              Ver Puntuación Final
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

const DecisionMakingModule = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('mode-select');
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleSelectMode = (mode) => {
    if (mode === 'scenarios') setCurrentView('scenario-select');
    else if (mode === 'tree') setCurrentView('tree-select');
    else if (mode === 'priority') setCurrentView('priority-select');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'mode-select':
        return <ModeSelector onSelectMode={handleSelectMode} />;
      
      case 'scenario-select':
        return (
          <ScenarioSelector
            onSelectScenario={(scenario) => {
              setSelectedScenario(scenario);
              setCurrentView('scenario-chat');
            }}
            onBack={() => setCurrentView('mode-select')}
          />
        );
      
      case 'scenario-chat':
        return (
          <ScenarioChat
            scenario={selectedScenario}
            onBack={() => setCurrentView('scenario-select')}
          />
        );
      
      case 'tree-select':
        return (
          <TreeSelector
            onSelectTree={(tree) => {
              setSelectedTree(tree);
              setCurrentView('tree-game');
            }}
            onBack={() => setCurrentView('mode-select')}
          />
        );
      
      case 'tree-game':
        return (
          <DecisionTreeGame
            tree={selectedTree}
            onBack={() => setCurrentView('tree-select')}
          />
        );
      
      case 'priority-select':
        return (
          <PrioritySelector
            onSelectExercise={(exercise) => {
              setSelectedExercise(exercise);
              setCurrentView('priority-game');
            }}
            onBack={() => setCurrentView('mode-select')}
          />
        );
      
      case 'priority-game':
        return (
          <PriorityGame
            exercise={selectedExercise}
            onBack={() => setCurrentView('priority-select')}
          />
        );
      
      default:
        return <ModeSelector onSelectMode={handleSelectMode} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${decisionBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-teal-900/70 to-slate-900/85" />
      
      {currentView === 'mode-select' && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-800/95 backdrop-blur-xl px-4 py-2 rounded-xl border-2 border-cyan-500/50 text-slate-200 hover:text-white hover:border-cyan-400 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Volver al Hub</span>
          </button>
        </div>
      )}
      
      <div className="relative z-10 flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DecisionMakingModule;
