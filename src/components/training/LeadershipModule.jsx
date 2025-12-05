import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Send, Bot, User, Brain, Loader2, Trash2, Zap, Play, CheckCircle, Star, Award, ChevronRight, Clock, Users, Target, Home, Trophy, Sparkles, Crown, TrendingUp, BarChart3, Flame, RefreshCw, ChevronDown, AlertTriangle } from 'lucide-react';
import leadershipBg from '../../assets/leadership-bg.png';

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
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg ${className}`}>
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
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-emerald-400/50 ${className}`}>
      <img 
        src={imgPath}
        alt="Tu avatar"
        className="w-full h-full object-cover object-top"
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
          background: `linear-gradient(135deg, ${['#10b981', '#14b8a6', '#06b6d4', '#22c55e'][Math.floor(Math.random() * 4)]}, transparent)`,
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

const LEADERSHIP_MODES = [
  {
    id: 'scenarios',
    title: 'Escenarios de Liderazgo',
    description: 'Resuelve situaciones reales y descubre tu estilo de liderazgo',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-500',
    features: ['Chat interactivo', 'Evaluación de estilo', 'Puntuación 0-10']
  },
  {
    id: 'transformational',
    title: 'Test Liderazgo Transformador',
    description: '10 preguntas para medir tu capacidad de inspirar y motivar',
    icon: '🦋',
    color: 'from-purple-500 to-pink-500',
    features: ['10 preguntas clave', 'Gráfica de dimensiones', 'Áreas de mejora']
  },
  {
    id: 'situational',
    title: 'Test Liderazgo Situacional',
    description: 'Evalúa tu capacidad de adaptar el estilo al contexto',
    icon: '🔄',
    color: 'from-blue-500 to-cyan-500',
    features: ['Escenarios variables', 'Modelo Hersey-Blanchard', 'Feedback adaptativo']
  },
  {
    id: 'general',
    title: 'Evaluación General',
    description: 'Descubre tu estilo de liderazgo predominante',
    icon: '📊',
    color: 'from-amber-500 to-orange-500',
    features: ['Análisis completo', 'Identificación de estilo', 'Recomendaciones']
  },
  {
    id: 'microchallenges',
    title: 'Micro-retos Diarios',
    description: 'Desafíos rápidos con dificultad progresiva',
    icon: '⚡',
    color: 'from-rose-500 to-red-500',
    features: ['Retos gamificados', 'Niveles de dificultad', 'Racha de victorias']
  }
];

const LEADERSHIP_SCENARIOS = [
  {
    id: 'resistencia-cambio',
    title: 'Resistencia al Cambio en la Unidad',
    category: 'Gestión del Cambio',
    description: 'Tu equipo se resiste a implementar un nuevo protocolo digital. Debes liderar la transición.',
    difficulty: 'Intermedio',
    icon: '🔄',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'conflicto-turnos',
    title: 'Conflicto entre Turnos',
    category: 'Resolución de Conflictos',
    description: 'Hay tensiones entre el turno de mañana y el de noche. El clima laboral se deteriora.',
    difficulty: 'Avanzado',
    icon: '⚔️',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 'motivar-equipo',
    title: 'Equipo Desmotivado',
    category: 'Motivación',
    description: 'Tras meses de alta carga, tu equipo muestra signos de burnout y baja motivación.',
    difficulty: 'Avanzado',
    icon: '💪',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'enfermera-referente',
    title: 'Desarrollo de Talento',
    category: 'Desarrollo de Personas',
    description: 'Una enfermera con potencial rechaza asumir el rol de referente. Debes convencerla.',
    difficulty: 'Intermedio',
    icon: '🌱',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'crisis-recursos',
    title: 'Liderazgo en Crisis',
    category: 'Gestión de Crisis',
    description: 'Escasez de personal y materiales. Debes mantener la calidad asistencial con recursos limitados.',
    difficulty: 'Experto',
    icon: '🚨',
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'integracion-novel',
    title: 'Integración de Personal Novel',
    category: 'Onboarding',
    description: 'Tres enfermeras recién graduadas se incorporan a tu unidad. Debes facilitar su integración.',
    difficulty: 'Básico',
    icon: '👥',
    color: 'from-blue-500 to-indigo-500'
  }
];

const ALL_TRANSFORMATIONAL_QUESTIONS = [
  {
    id: 1,
    dimension: 'Influencia Idealizada',
    question: '¿Cómo actuarías si descubres un error en un protocolo que tú misma implementaste?',
    options: [
      { text: 'Reconozco el error públicamente y lidero la corrección', score: 4, style: 'transformador' },
      { text: 'Corrijo el error discretamente sin dar explicaciones', score: 2, style: 'transaccional' },
      { text: 'Delego la corrección en otro miembro del equipo', score: 1, style: 'laissez-faire' },
      { text: 'Espero a que alguien más lo detecte', score: 0, style: 'pasivo' }
    ]
  },
  {
    id: 2,
    dimension: 'Motivación Inspiracional',
    question: 'Tu equipo debe implementar un cambio difícil. ¿Cómo los motivarías?',
    options: [
      { text: 'Comparto una visión de futuro y cómo el cambio nos acerca a ella', score: 4, style: 'transformador' },
      { text: 'Explico las consecuencias negativas de no cambiar', score: 2, style: 'transaccional' },
      { text: 'Ofrezco incentivos por cumplir los objetivos del cambio', score: 2, style: 'transaccional' },
      { text: 'Dejo que cada uno encuentre su propia motivación', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 3,
    dimension: 'Estimulación Intelectual',
    question: 'Una enfermera propone una idea poco convencional para mejorar un proceso. ¿Qué haces?',
    options: [
      { text: 'Animo a explorar la idea y facilito recursos para probarla', score: 4, style: 'transformador' },
      { text: 'La evalúo según los protocolos existentes', score: 2, style: 'transaccional' },
      { text: 'Le pido que la desarrolle ella sola y me presente resultados', score: 1, style: 'delegativo' },
      { text: 'Le explico por qué hacemos las cosas como las hacemos', score: 1, style: 'directivo' }
    ]
  },
  {
    id: 4,
    dimension: 'Consideración Individualizada',
    question: '¿Cómo gestionas el desarrollo profesional de tu equipo?',
    options: [
      { text: 'Identifico las fortalezas únicas de cada persona y creo planes personalizados', score: 4, style: 'transformador' },
      { text: 'Ofrezco las mismas oportunidades de formación a todos', score: 2, style: 'equitativo' },
      { text: 'Priorizo a quienes muestran más iniciativa', score: 2, style: 'meritocrático' },
      { text: 'Dejo que cada uno gestione su propio desarrollo', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 5,
    dimension: 'Influencia Idealizada',
    question: 'En una situación de alta presión, ¿cómo te comportas?',
    options: [
      { text: 'Mantengo la calma, doy ejemplo y apoyo emocionalmente al equipo', score: 4, style: 'transformador' },
      { text: 'Me centro en dar instrucciones claras y supervisar el trabajo', score: 3, style: 'directivo' },
      { text: 'Delego responsabilidades para poder centrarme en lo crítico', score: 2, style: 'delegativo' },
      { text: 'Muestro mi preocupación para que el equipo entienda la gravedad', score: 1, style: 'reactivo' }
    ]
  },
  {
    id: 6,
    dimension: 'Motivación Inspiracional',
    question: '¿Cómo comunicas los objetivos de la unidad a tu equipo?',
    options: [
      { text: 'Conecto los objetivos con el propósito de cuidar mejor a los pacientes', score: 4, style: 'transformador' },
      { text: 'Presento datos y métricas claras de lo que debemos lograr', score: 2, style: 'transaccional' },
      { text: 'Explico las consecuencias de no cumplirlos', score: 1, style: 'coercitivo' },
      { text: 'Los comunico y dejo que cada uno los interprete', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 7,
    dimension: 'Estimulación Intelectual',
    question: 'Ante un problema recurrente en la unidad, ¿cuál es tu enfoque?',
    options: [
      { text: 'Reúno al equipo para hacer un análisis creativo y buscar soluciones nuevas', score: 4, style: 'transformador' },
      { text: 'Reviso los protocolos y busco dónde no se cumplen', score: 2, style: 'transaccional' },
      { text: 'Consulto con expertos externos', score: 2, style: 'consultivo' },
      { text: 'Aplico la solución que funcionó en el pasado', score: 1, style: 'tradicional' }
    ]
  },
  {
    id: 8,
    dimension: 'Consideración Individualizada',
    question: 'Una enfermera excelente pasa por un momento personal difícil. ¿Qué haces?',
    options: [
      { text: 'Tengo una conversación privada, ofrezco apoyo y adapto temporalmente su carga', score: 4, style: 'transformador' },
      { text: 'Le informo de los recursos de apoyo disponibles en la institución', score: 2, style: 'formal' },
      { text: 'Mantengo las expectativas pero soy comprensivo si hay algún fallo', score: 2, style: 'equilibrado' },
      { text: 'Trato a todos igual independientemente de circunstancias personales', score: 1, style: 'imparcial' }
    ]
  },
  {
    id: 9,
    dimension: 'Influencia Idealizada',
    question: '¿Cómo construyes confianza con tu equipo?',
    options: [
      { text: 'Soy transparente, cumplo mis compromisos y admito mis errores', score: 4, style: 'transformador' },
      { text: 'Demuestro competencia técnica y tomo buenas decisiones', score: 3, style: 'experto' },
      { text: 'Mantengo una relación profesional y respeto jerárquico', score: 2, style: 'formal' },
      { text: 'Defiendo siempre a mi equipo ante la dirección', score: 2, style: 'protector' }
    ]
  },
  {
    id: 10,
    dimension: 'Motivación Inspiracional',
    question: 'Cuando el equipo logra un éxito importante, ¿cómo lo celebras?',
    options: [
      { text: 'Reconozco públicamente el esfuerzo de todos y conecto el logro con nuestra misión', score: 4, style: 'transformador' },
      { text: 'Comunico el éxito a dirección para que se reconozca al equipo', score: 3, style: 'promotor' },
      { text: 'Organizo una pequeña celebración informal', score: 2, style: 'cercano' },
      { text: 'Paso a enfocarme en el siguiente objetivo', score: 1, style: 'orientado-a-tarea' }
    ]
  },
  {
    id: 11,
    dimension: 'Influencia Idealizada',
    question: 'Recibes una crítica injusta de un superior delante de tu equipo. ¿Cómo reaccionas?',
    options: [
      { text: 'Mantengo la compostura, escucho y después hablo en privado con el superior', score: 4, style: 'transformador' },
      { text: 'Me defiendo inmediatamente con argumentos', score: 2, style: 'reactivo' },
      { text: 'Acepto la crítica sin cuestionarla', score: 1, style: 'pasivo' },
      { text: 'Hago notar el error del superior delante de todos', score: 0, style: 'confrontacional' }
    ]
  },
  {
    id: 12,
    dimension: 'Estimulación Intelectual',
    question: '¿Cómo fomentas la innovación en tu unidad?',
    options: [
      { text: 'Creo espacios seguros para que el equipo proponga y experimente sin miedo al fracaso', score: 4, style: 'transformador' },
      { text: 'Implemento las mejores prácticas de otras unidades', score: 2, style: 'transaccional' },
      { text: 'Espero a que surjan ideas espontáneamente', score: 1, style: 'laissez-faire' },
      { text: 'Propongo yo las mejoras y las implemento', score: 2, style: 'directivo' }
    ]
  },
  {
    id: 13,
    dimension: 'Consideración Individualizada',
    question: 'Una enfermera veterana parece estancada profesionalmente. ¿Qué haces?',
    options: [
      { text: 'Exploro sus intereses ocultos y busco oportunidades que la reten de nuevo', score: 4, style: 'transformador' },
      { text: 'Le ofrezco la misma formación que a los demás', score: 2, style: 'equitativo' },
      { text: 'Respeto su zona de confort si cumple con su trabajo', score: 1, style: 'laissez-faire' },
      { text: 'Le asigno tareas más desafiantes para forzar su crecimiento', score: 2, style: 'directivo' }
    ]
  },
  {
    id: 14,
    dimension: 'Motivación Inspiracional',
    question: 'El equipo enfrenta un período de recortes y reestructuración. ¿Cómo mantienes la moral?',
    options: [
      { text: 'Soy honesta sobre la situación pero transmito esperanza y propósito colectivo', score: 4, style: 'transformador' },
      { text: 'Me centro en los aspectos positivos y evito hablar de lo negativo', score: 2, style: 'evasivo' },
      { text: 'Ofrezco incentivos a quienes mejor se adapten', score: 2, style: 'transaccional' },
      { text: 'Dejo que cada uno gestione su propia preocupación', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 15,
    dimension: 'Influencia Idealizada',
    question: 'Te piden que implementes una política con la que no estás de acuerdo. ¿Qué haces?',
    options: [
      { text: 'Expreso mis dudas por los canales apropiados, pero si se mantiene, la implemento con integridad', score: 4, style: 'transformador' },
      { text: 'La implemento sin cuestionarla', score: 1, style: 'pasivo' },
      { text: 'Me niego abiertamente a implementarla', score: 1, style: 'confrontacional' },
      { text: 'La implemento de forma laxa para minimizar su impacto', score: 2, style: 'evasivo' }
    ]
  },
  {
    id: 16,
    dimension: 'Estimulación Intelectual',
    question: 'Un miembro del equipo cuestiona la forma en que siempre se han hecho las cosas. ¿Cómo respondes?',
    options: [
      { text: 'Agradezco el cuestionamiento y exploramos juntos si hay una mejor manera', score: 4, style: 'transformador' },
      { text: 'Le explico las razones históricas del método actual', score: 2, style: 'tradicional' },
      { text: 'Le pido que primero domine el método actual antes de cuestionarlo', score: 2, style: 'directivo' },
      { text: 'Ignoro el comentario para no generar conflicto', score: 1, style: 'evasivo' }
    ]
  },
  {
    id: 17,
    dimension: 'Consideración Individualizada',
    question: '¿Cómo identificas las necesidades de desarrollo de cada persona de tu equipo?',
    options: [
      { text: 'Mantengo conversaciones regulares individuales sobre sus aspiraciones y retos', score: 4, style: 'transformador' },
      { text: 'Uso las evaluaciones de desempeño anuales', score: 2, style: 'formal' },
      { text: 'Observo su trabajo y detecto yo las áreas de mejora', score: 2, style: 'directivo' },
      { text: 'Espero a que me lo comuniquen ellos', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 18,
    dimension: 'Motivación Inspiracional',
    question: '¿Cómo transmites la importancia del trabajo de enfermería a tu equipo?',
    options: [
      { text: 'Comparto historias de impacto real en pacientes y conecto el trabajo diario con el propósito mayor', score: 4, style: 'transformador' },
      { text: 'Muestro indicadores de calidad y eficiencia', score: 2, style: 'transaccional' },
      { text: 'Doy por hecho que ya saben por qué es importante', score: 1, style: 'pasivo' },
      { text: 'Recuerdo las consecuencias de no hacerlo bien', score: 1, style: 'coercitivo' }
    ]
  },
  {
    id: 19,
    dimension: 'Influencia Idealizada',
    question: 'Debes tomar una decisión impopular pero necesaria. ¿Cómo la comunicas?',
    options: [
      { text: 'Explico honestamente las razones, asumo la responsabilidad y ofrezco apoyo en la transición', score: 4, style: 'transformador' },
      { text: 'La comunico como una orden de arriba para evitar ser el blanco', score: 1, style: 'evasivo' },
      { text: 'La implemento sin dar explicaciones', score: 1, style: 'autocrático' },
      { text: 'Busco suavizarla con compensaciones', score: 2, style: 'transaccional' }
    ]
  },
  {
    id: 20,
    dimension: 'Estimulación Intelectual',
    question: 'Tu unidad necesita mejorar un indicador de calidad. ¿Cuál es tu enfoque?',
    options: [
      { text: 'Involucro al equipo en analizar las causas raíz y diseñar soluciones creativas', score: 4, style: 'transformador' },
      { text: 'Implemento las recomendaciones de la literatura científica', score: 2, style: 'experto' },
      { text: 'Establezco controles más estrictos del proceso', score: 2, style: 'transaccional' },
      { text: 'Identifico a los responsables del bajo rendimiento', score: 1, style: 'coercitivo' }
    ]
  },
  {
    id: 21,
    dimension: 'Consideración Individualizada',
    question: 'Una enfermera muy competente quiere reducir su jornada por motivos familiares. ¿Qué haces?',
    options: [
      { text: 'Busco fórmulas flexibles que le permitan conciliar sin perder su talento', score: 4, style: 'transformador' },
      { text: 'Le explico que las normas son iguales para todos', score: 1, style: 'rígido' },
      { text: 'Se lo permito si no afecta al servicio', score: 2, style: 'práctico' },
      { text: 'Le sugiero que busque otro puesto más compatible', score: 1, style: 'insensible' }
    ]
  },
  {
    id: 22,
    dimension: 'Motivación Inspiracional',
    question: 'El equipo está agotado tras una temporada muy dura. ¿Cómo los remotivas?',
    options: [
      { text: 'Reconozco su sacrificio, comparto una visión de mejora y trabajo codo a codo con ellos', score: 4, style: 'transformador' },
      { text: 'Les doy tiempo libre extra como compensación', score: 2, style: 'transaccional' },
      { text: 'Les recuerdo que es su obligación profesional', score: 1, style: 'coercitivo' },
      { text: 'Espero a que se recuperen solos con el tiempo', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 23,
    dimension: 'Influencia Idealizada',
    question: '¿Cómo gestionas tus propios errores como líder?',
    options: [
      { text: 'Los reconozco abiertamente, aprendo de ellos y los uso como ejemplo de humildad', score: 4, style: 'transformador' },
      { text: 'Los corrijo discretamente sin hacer ruido', score: 2, style: 'discreto' },
      { text: 'Busco explicaciones externas que los justifiquen', score: 1, style: 'defensivo' },
      { text: 'Los minimizo para mantener mi autoridad', score: 1, style: 'inseguro' }
    ]
  },
  {
    id: 24,
    dimension: 'Estimulación Intelectual',
    question: 'Una enfermera novel propone algo que parece inviable pero tiene potencial. ¿Qué haces?',
    options: [
      { text: 'La animo a desarrollar la idea y le ofrezco mentorización para hacerla viable', score: 4, style: 'transformador' },
      { text: 'Le explico por qué no funcionará en la práctica', score: 2, style: 'realista' },
      { text: 'Le digo que lo comente cuando tenga más experiencia', score: 1, style: 'condescendiente' },
      { text: 'La ignoro amablemente para no desmotivarla', score: 1, style: 'evasivo' }
    ]
  },
  {
    id: 25,
    dimension: 'Consideración Individualizada',
    question: 'Detectas que una enfermera tiene talento para la investigación. ¿Qué haces?',
    options: [
      { text: 'La conecto con oportunidades de investigación y adapto su rol para que pueda desarrollarse', score: 4, style: 'transformador' },
      { text: 'Le informo de las convocatorias disponibles', score: 2, style: 'informativo' },
      { text: 'Le digo que primero se centre en su trabajo asistencial', score: 1, style: 'limitante' },
      { text: 'Dejo que ella misma busque su camino si le interesa', score: 1, style: 'laissez-faire' }
    ]
  },
  {
    id: 26,
    dimension: 'Motivación Inspiracional',
    question: '¿Cómo compartes la visión estratégica del hospital con tu equipo?',
    options: [
      { text: 'Traduzco la estrategia a impacto concreto en pacientes y les muestro cómo contribuyen', score: 4, style: 'transformador' },
      { text: 'Les paso la documentación oficial para que la lean', score: 1, style: 'burocrático' },
      { text: 'Les explico los objetivos y metas que nos afectan', score: 2, style: 'transaccional' },
      { text: 'No les cargo con información estratégica que no les compete', score: 1, style: 'paternalista' }
    ]
  },
  {
    id: 27,
    dimension: 'Influencia Idealizada',
    question: 'Un familiar de paciente se queja de tu equipo injustamente. ¿Cómo actúas?',
    options: [
      { text: 'Defiendo a mi equipo con empatía hacia el familiar, investigando los hechos', score: 4, style: 'transformador' },
      { text: 'Pido disculpas al familiar para evitar conflictos', score: 2, style: 'complaciente' },
      { text: 'Derivo la queja a atención al paciente sin intervenir', score: 1, style: 'evasivo' },
      { text: 'Critico a mi equipo delante del familiar para calmar la situación', score: 0, style: 'desleal' }
    ]
  },
  {
    id: 28,
    dimension: 'Estimulación Intelectual',
    question: '¿Cómo promueves el aprendizaje continuo en tu equipo?',
    options: [
      { text: 'Creo una cultura donde el error se ve como oportunidad y el aprendizaje es diario', score: 4, style: 'transformador' },
      { text: 'Facilito el acceso a cursos y formaciones regladas', score: 2, style: 'formal' },
      { text: 'Exijo que cada uno se forme por su cuenta', score: 1, style: 'delegativo' },
      { text: 'Organizo sesiones formativas obligatorias', score: 2, style: 'directivo' }
    ]
  },
  {
    id: 29,
    dimension: 'Consideración Individualizada',
    question: 'Un TCAE veterano se siente infravalorado. ¿Cómo lo abordas?',
    options: [
      { text: 'Reconozco su valor único, exploro sus necesidades y busco formas de potenciar su rol', score: 4, style: 'transformador' },
      { text: 'Le recuerdo la importancia de su trabajo para el equipo', score: 2, style: 'informativo' },
      { text: 'Le sugiero que si no está contento puede buscar otras opciones', score: 0, style: 'insensible' },
      { text: 'Le digo que todos nos sentimos así a veces', score: 1, style: 'minimizador' }
    ]
  },
  {
    id: 30,
    dimension: 'Motivación Inspiracional',
    question: 'Tienes que pedir un esfuerzo extra al equipo durante las vacaciones. ¿Cómo lo planteas?',
    options: [
      { text: 'Explico la necesidad, apelo a nuestro compromiso con los pacientes y me ofrezco a hacer mi parte', score: 4, style: 'transformador' },
      { text: 'Lo presento como una obligación profesional', score: 2, style: 'directivo' },
      { text: 'Ofrezco compensación económica o días libres', score: 2, style: 'transaccional' },
      { text: 'Impongo el cuadrante sin explicaciones', score: 1, style: 'autocrático' }
    ]
  }
];

const ALL_SITUATIONAL_SCENARIOS = [
  {
    id: 1,
    scenario: 'Una enfermera recién incorporada (3 meses) te pide ayuda con un procedimiento complejo que nunca ha realizado.',
    context: 'Alta motivación pero baja competencia',
    bestStyle: 'Directivo',
    options: [
      { text: 'Le doy instrucciones detalladas paso a paso y superviso de cerca', style: 'Directivo', score: 4 },
      { text: 'Le explico el procedimiento y le pido que me pregunte sus dudas', style: 'Persuasivo', score: 3 },
      { text: 'Le sugiero que practique y me avise si tiene problemas', style: 'Participativo', score: 1 },
      { text: 'Le digo que consulte el protocolo y lo intente sola', style: 'Delegativo', score: 0 }
    ]
  },
  {
    id: 2,
    scenario: 'Una enfermera veterana (15 años) expresa frustración porque siente que sus ideas nunca se implementan.',
    context: 'Alta competencia pero motivación descendente',
    bestStyle: 'Participativo',
    options: [
      { text: 'Organizo una reunión para escuchar sus ideas y explorar cómo implementarlas', style: 'Participativo', score: 4 },
      { text: 'Le explico las razones por las que algunas ideas no se implementaron', style: 'Persuasivo', score: 2 },
      { text: 'Le doy más autonomía para que implemente sus propias mejoras', style: 'Delegativo', score: 2 },
      { text: 'Le recuerdo los canales formales para proponer mejoras', style: 'Directivo', score: 0 }
    ]
  },
  {
    id: 3,
    scenario: 'Un TCAE muy competente y motivado quiere asumir más responsabilidades en la unidad.',
    context: 'Alta competencia y alta motivación',
    bestStyle: 'Delegativo',
    options: [
      { text: 'Le asigno un proyecto y le doy autonomía para gestionarlo', style: 'Delegativo', score: 4 },
      { text: 'Discutimos juntos qué responsabilidades podría asumir', style: 'Participativo', score: 3 },
      { text: 'Le propongo un plan de desarrollo con objetivos claros', style: 'Persuasivo', score: 2 },
      { text: 'Le asigno tareas específicas con supervisión regular', style: 'Directivo', score: 1 }
    ]
  },
  {
    id: 4,
    scenario: 'Una enfermera que antes era excelente ha bajado su rendimiento tras una reorganización de turnos.',
    context: 'Competencia demostrada pero motivación en declive',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Tengo una conversación para entender qué le pasa y buscar soluciones juntos', style: 'Persuasivo', score: 4 },
      { text: 'Le doy espacio para adaptarse sin presionarla', style: 'Delegativo', score: 2 },
      { text: 'Le recuerdo las expectativas y le pido que vuelva a su nivel anterior', style: 'Directivo', score: 1 },
      { text: 'La involucro en decidir cómo mejorar la organización de turnos', style: 'Participativo', score: 3 }
    ]
  },
  {
    id: 5,
    scenario: 'Un grupo de enfermeras nuevas debe aprender a usar un nuevo sistema de registro electrónico.',
    context: 'Baja competencia en la tarea, motivación variable',
    bestStyle: 'Directivo',
    options: [
      { text: 'Organizo una formación estructurada con práctica supervisada', style: 'Directivo', score: 4 },
      { text: 'Les explico los beneficios del sistema y les doy manuales', style: 'Persuasivo', score: 2 },
      { text: 'Les pido que exploren el sistema y me consulten dudas', style: 'Participativo', score: 1 },
      { text: 'Las emparejo con usuarios expertos para que aprendan', style: 'Delegativo', score: 2 }
    ]
  },
  {
    id: 6,
    scenario: 'Una supervisora adjunta muy capaz gestiona habitualmente la unidad en tu ausencia sin problemas.',
    context: 'Alta competencia y alta motivación demostradas',
    bestStyle: 'Delegativo',
    options: [
      { text: 'Le doy total autonomía y solo pido que me informe de lo relevante', style: 'Delegativo', score: 4 },
      { text: 'Revisamos juntas la planificación antes de mi ausencia', style: 'Participativo', score: 2 },
      { text: 'Le dejo instrucciones detalladas por si las necesita', style: 'Persuasivo', score: 1 },
      { text: 'Establezco check-ins regulares durante mi ausencia', style: 'Directivo', score: 0 }
    ]
  },
  {
    id: 7,
    scenario: 'Una enfermera con 5 años de experiencia ha sido asignada a una unidad completamente diferente a la que conoce.',
    context: 'Competencia general alta pero específica baja, motivación moderada',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Le doy orientación sobre las especificidades de la unidad pero confío en su experiencia', style: 'Persuasivo', score: 4 },
      { text: 'La trato como a cualquier enfermera nueva con formación completa', style: 'Directivo', score: 2 },
      { text: 'Le pido que identifique sus necesidades de formación', style: 'Participativo', score: 2 },
      { text: 'Confío en que su experiencia le permitirá adaptarse sola', style: 'Delegativo', score: 1 }
    ]
  },
  {
    id: 8,
    scenario: 'Tu equipo debe implementar un nuevo protocolo de seguridad obligatorio que genera resistencia generalizada.',
    context: 'Competencia variable, motivación baja por imposición externa',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Explico el por qué del protocolo, escucho preocupaciones y busco facilitar la adaptación', style: 'Persuasivo', score: 4 },
      { text: 'Doy instrucciones claras y establezco un calendario de implementación', style: 'Directivo', score: 2 },
      { text: 'Creo un grupo de trabajo para decidir cómo implementarlo', style: 'Participativo', score: 2 },
      { text: 'Dejo que cada uno encuentre su forma de adaptarse', style: 'Delegativo', score: 0 }
    ]
  },
  {
    id: 9,
    scenario: 'Un enfermero novel muy motivado comete errores repetidos en la administración de medicación.',
    context: 'Baja competencia, alta motivación pero ansiedad',
    bestStyle: 'Directivo',
    options: [
      { text: 'Reviso con él cada paso del proceso y superviso hasta que lo domine', style: 'Directivo', score: 4 },
      { text: 'Le explico la importancia de hacerlo bien y confío en que mejorará', style: 'Persuasivo', score: 2 },
      { text: 'Le pregunto qué cree que está fallando y cómo lo solucionaría', style: 'Participativo', score: 1 },
      { text: 'Le asigno tareas menos críticas hasta que gane confianza', style: 'Delegativo', score: 1 }
    ]
  },
  {
    id: 10,
    scenario: 'Una enfermera experta y autónoma te pide consejo sobre cómo abordar un conflicto con un médico.',
    context: 'Alta competencia y alta motivación, busca apoyo puntual',
    bestStyle: 'Participativo',
    options: [
      { text: 'Exploramos juntas opciones y le dejo decidir el enfoque', style: 'Participativo', score: 4 },
      { text: 'Le doy instrucciones claras de cómo manejar la situación', style: 'Directivo', score: 1 },
      { text: 'Le sugiero que lo resuelva ella misma como siempre hace', style: 'Delegativo', score: 2 },
      { text: 'Le explico diferentes estrategias de comunicación', style: 'Persuasivo', score: 3 }
    ]
  },
  {
    id: 11,
    scenario: 'Una TCAE experimentada ha perdido interés tras ser rechazada para un ascenso.',
    context: 'Alta competencia, motivación muy baja',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Hablo con ella sobre su decepción y exploro nuevas metas motivadoras', style: 'Persuasivo', score: 4 },
      { text: 'Le doy más autonomía para que recupere el interés', style: 'Delegativo', score: 2 },
      { text: 'La involucro en proyectos especiales para reactivarla', style: 'Participativo', score: 3 },
      { text: 'Le recuerdo sus responsabilidades profesionales', style: 'Directivo', score: 1 }
    ]
  },
  {
    id: 12,
    scenario: 'Una enfermera junior muy entusiasta quiere liderar un proyecto de mejora de calidad.',
    context: 'Motivación muy alta, competencia en desarrollo',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Le asigno el proyecto con mentorización y checkpoints regulares', style: 'Persuasivo', score: 4 },
      { text: 'Le doy el proyecto y total libertad para desarrollarlo', style: 'Delegativo', score: 1 },
      { text: 'Le explico paso a paso cómo debe hacerlo', style: 'Directivo', score: 2 },
      { text: 'Diseñamos juntas el plan de trabajo', style: 'Participativo', score: 3 }
    ]
  },
  {
    id: 13,
    scenario: 'Tu equipo de enfermeras veteranas debe adaptarse a un nuevo modelo de cuidados centrado en el paciente.',
    context: 'Alta competencia técnica, resistencia al cambio',
    bestStyle: 'Participativo',
    options: [
      { text: 'Las involucro en diseñar cómo implementar el nuevo modelo', style: 'Participativo', score: 4 },
      { text: 'Les explico los beneficios del cambio y les doy tiempo', style: 'Persuasivo', score: 3 },
      { text: 'Establezco los nuevos procedimientos y superviso el cumplimiento', style: 'Directivo', score: 1 },
      { text: 'Confío en que se adaptarán con el tiempo', style: 'Delegativo', score: 1 }
    ]
  },
  {
    id: 14,
    scenario: 'Una enfermera recién graduada con excelente formación teórica pero sin experiencia práctica.',
    context: 'Baja competencia práctica, motivación alta',
    bestStyle: 'Directivo',
    options: [
      { text: 'Le proporciono formación práctica estructurada con supervisión directa', style: 'Directivo', score: 4 },
      { text: 'Le explico la teoría aplicada y confío en que la traslade a la práctica', style: 'Persuasivo', score: 2 },
      { text: 'La emparejo con una enfermera veterana', style: 'Delegativo', score: 2 },
      { text: 'Discutimos juntas los casos para que aprenda', style: 'Participativo', score: 1 }
    ]
  },
  {
    id: 15,
    scenario: 'Un TCAE con 20 años de experiencia cuestiona constantemente los nuevos protocolos.',
    context: 'Alta competencia tradicional, motivación selectiva',
    bestStyle: 'Participativo',
    options: [
      { text: 'Le pido que analice los nuevos protocolos y proponga mejoras', style: 'Participativo', score: 4 },
      { text: 'Le explico las razones científicas de los cambios', style: 'Persuasivo', score: 3 },
      { text: 'Le recuerdo que debe cumplir los protocolos vigentes', style: 'Directivo', score: 1 },
      { text: 'Confío en que con el tiempo los aceptará', style: 'Delegativo', score: 1 }
    ]
  },
  {
    id: 16,
    scenario: 'Una enfermera competente y motivada te pide permiso para asistir a un congreso en horario laboral.',
    context: 'Alta competencia, alta motivación, necesita desarrollo',
    bestStyle: 'Delegativo',
    options: [
      { text: 'Le doy el permiso y le pido que comparta lo aprendido con el equipo', style: 'Delegativo', score: 4 },
      { text: 'Evaluamos juntas si es relevante para su desarrollo y la unidad', style: 'Participativo', score: 3 },
      { text: 'Le explico los criterios para aprobar estas peticiones', style: 'Persuasivo', score: 2 },
      { text: 'Le digo que primero debe justificar por escrito la petición', style: 'Directivo', score: 1 }
    ]
  },
  {
    id: 17,
    scenario: 'Un grupo mixto (noveles y veteranas) debe trabajar en un nuevo proyecto de humanización.',
    context: 'Competencias mixtas, motivación variable',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Explico la visión del proyecto y asigno roles según competencias', style: 'Persuasivo', score: 4 },
      { text: 'Dejo que el grupo se auto-organice', style: 'Delegativo', score: 1 },
      { text: 'Estructuro el proyecto paso a paso para todos', style: 'Directivo', score: 2 },
      { text: 'Facilito que el grupo decida cómo organizarse', style: 'Participativo', score: 3 }
    ]
  },
  {
    id: 18,
    scenario: 'Una enfermera muy competente muestra signos de burnout pero se niega a reducir su carga.',
    context: 'Alta competencia, motivación comprometida por agotamiento',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Hablo con ella sobre la importancia del autocuidado y negocio adaptaciones', style: 'Persuasivo', score: 4 },
      { text: 'Respeto su decisión de mantener su carga', style: 'Delegativo', score: 1 },
      { text: 'Le impongo una reducción de carga por su bien', style: 'Directivo', score: 2 },
      { text: 'Exploramos juntas formas de hacer más sostenible su trabajo', style: 'Participativo', score: 3 }
    ]
  },
  {
    id: 19,
    scenario: 'Una enfermera novel acaba de completar con éxito su período de formación inicial.',
    context: 'Competencia demostrada en lo básico, motivación alta',
    bestStyle: 'Persuasivo',
    options: [
      { text: 'Le doy más autonomía gradualmente con supervisión periódica', style: 'Persuasivo', score: 4 },
      { text: 'Le asigno trabajo independiente como al resto del equipo', style: 'Delegativo', score: 2 },
      { text: 'Mantengo la supervisión directa por seguridad', style: 'Directivo', score: 2 },
      { text: 'Discutimos qué áreas siente que domina y cuáles no', style: 'Participativo', score: 3 }
    ]
  },
  {
    id: 20,
    scenario: 'Una enfermera referente muy capaz gestiona habitualmente su área sin incidencias.',
    context: 'Alta competencia y alta motivación consolidadas',
    bestStyle: 'Delegativo',
    options: [
      { text: 'Le doy autonomía total y solo intervengo si me lo pide', style: 'Delegativo', score: 4 },
      { text: 'Mantengo reuniones regulares para alinear objetivos', style: 'Participativo', score: 2 },
      { text: 'Le doy feedback regular sobre su desempeño', style: 'Persuasivo', score: 2 },
      { text: 'Superviso sus decisiones para asegurar la calidad', style: 'Directivo', score: 0 }
    ]
  },
  {
    id: 21,
    scenario: 'Un estudiante de enfermería en prácticas está muy nervioso en su primer día.',
    context: 'Sin competencia, motivación condicionada por miedo',
    bestStyle: 'Directivo',
    options: [
      { text: 'Le guío paso a paso, dándole seguridad y estructura clara', style: 'Directivo', score: 4 },
      { text: 'Le explico que es normal el nerviosismo y confío en que se adaptará', style: 'Persuasivo', score: 2 },
      { text: 'Le pregunto qué necesita para sentirse más cómodo', style: 'Participativo', score: 1 },
      { text: 'Le dejo explorar la unidad a su ritmo', style: 'Delegativo', score: 0 }
    ]
  },
  {
    id: 22,
    scenario: 'Una enfermera senior quiere mentorizar a las nuevas incorporaciones.',
    context: 'Alta competencia, alta motivación para contribuir',
    bestStyle: 'Delegativo',
    options: [
      { text: 'Le doy la responsabilidad de diseñar el programa de mentorización', style: 'Delegativo', score: 4 },
      { text: 'Diseñamos juntas el programa de mentorización', style: 'Participativo', score: 3 },
      { text: 'Le explico cómo debe ser el programa ideal', style: 'Persuasivo', score: 1 },
      { text: 'Le doy instrucciones específicas de cómo hacerlo', style: 'Directivo', score: 0 }
    ]
  }
];

const GENERAL_LEADERSHIP_QUESTIONS = [
  {
    id: 1,
    question: '¿Cómo prefieres tomar decisiones en tu equipo?',
    options: [
      { text: 'Analizo datos y decido lo mejor para el equipo', style: 'Autocrático' },
      { text: 'Consulto al equipo pero tomo la decisión final', style: 'Consultivo' },
      { text: 'Decidimos juntos por consenso', style: 'Democrático' },
      { text: 'Dejo que el equipo decida y apoyo su elección', style: 'Laissez-faire' }
    ]
  },
  {
    id: 2,
    question: '¿Qué te motiva más como líder?',
    options: [
      { text: 'Ver crecer y desarrollarse a mi equipo', style: 'Transformador' },
      { text: 'Alcanzar los objetivos establecidos', style: 'Transaccional' },
      { text: 'Servir las necesidades de mi equipo', style: 'Servidor' },
      { text: 'Crear un ambiente de trabajo armonioso', style: 'Afiliativo' }
    ]
  },
  {
    id: 3,
    question: 'Ante un error de un miembro del equipo, ¿cómo reaccionas?',
    options: [
      { text: 'Lo uso como oportunidad de aprendizaje para todos', style: 'Transformador' },
      { text: 'Aplico las consecuencias establecidas con justicia', style: 'Transaccional' },
      { text: 'Pregunto cómo puedo ayudar a evitar que se repita', style: 'Servidor' },
      { text: 'Minimizo el impacto para proteger al equipo', style: 'Afiliativo' }
    ]
  },
  {
    id: 4,
    question: '¿Cómo estableces expectativas con tu equipo?',
    options: [
      { text: 'Co-creamos juntos los objetivos y estándares', style: 'Democrático' },
      { text: 'Comunico una visión inspiradora y dejo libertad en el cómo', style: 'Transformador' },
      { text: 'Defino claramente las metas y los indicadores de éxito', style: 'Transaccional' },
      { text: 'Les pregunto qué necesitan y adapto las expectativas', style: 'Servidor' }
    ]
  },
  {
    id: 5,
    question: '¿Cómo gestionas las diferencias de opinión en tu equipo?',
    options: [
      { text: 'Facilito el diálogo hasta encontrar una solución que satisfaga a todos', style: 'Democrático' },
      { text: 'Escucho todas las perspectivas y tomo la decisión que considero mejor', style: 'Consultivo' },
      { text: 'Animo a explorar el conflicto como fuente de innovación', style: 'Transformador' },
      { text: 'Busco rápidamente una solución para mantener la armonía', style: 'Afiliativo' }
    ]
  },
  {
    id: 6,
    question: '¿Qué valoras más en un miembro de tu equipo?',
    options: [
      { text: 'Su creatividad y capacidad de proponer mejoras', style: 'Transformador' },
      { text: 'Su fiabilidad y cumplimiento de compromisos', style: 'Transaccional' },
      { text: 'Su capacidad de trabajar bien con los demás', style: 'Afiliativo' },
      { text: 'Su autonomía y capacidad de autogestión', style: 'Laissez-faire' }
    ]
  },
  {
    id: 7,
    question: '¿Cómo prefieres comunicarte con tu equipo?',
    options: [
      { text: 'Reuniones regulares de equipo para compartir información', style: 'Democrático' },
      { text: 'Conversaciones individuales adaptadas a cada persona', style: 'Transformador' },
      { text: 'Comunicaciones claras y estructuradas con seguimiento', style: 'Transaccional' },
      { text: 'Política de puertas abiertas para cuando lo necesiten', style: 'Servidor' }
    ]
  },
  {
    id: 8,
    question: 'Cuando hay que hacer cambios, ¿cuál es tu enfoque?',
    options: [
      { text: 'Inspiro al equipo con una visión de futuro mejor', style: 'Transformador' },
      { text: 'Explico claramente qué hay que hacer y por qué', style: 'Transaccional' },
      { text: 'Involucro al equipo en diseñar cómo hacer el cambio', style: 'Democrático' },
      { text: 'Proporciono apoyo y recursos para facilitar la transición', style: 'Servidor' }
    ]
  },
  {
    id: 9,
    question: '¿Cómo delegas tareas importantes?',
    options: [
      { text: 'Doy autonomía total y confío en el resultado', style: 'Laissez-faire' },
      { text: 'Delego pero establezco puntos de control claros', style: 'Transaccional' },
      { text: 'Identifico quién puede crecer con esa responsabilidad', style: 'Transformador' },
      { text: 'Me aseguro de que tienen todo lo que necesitan antes de empezar', style: 'Servidor' }
    ]
  },
  {
    id: 10,
    question: '¿Cómo manejas situaciones de crisis en tu equipo?',
    options: [
      { text: 'Tomo el control y doy instrucciones claras', style: 'Autocrático' },
      { text: 'Consulto rápidamente con expertos y decido', style: 'Consultivo' },
      { text: 'Mantengo la calma y doy ejemplo al equipo', style: 'Transformador' },
      { text: 'Me centro en proteger emocionalmente a mi equipo', style: 'Afiliativo' }
    ]
  },
  {
    id: 11,
    question: '¿Qué haces cuando un miembro destaca positivamente?',
    options: [
      { text: 'Le reconozco públicamente y le propongo nuevos retos', style: 'Transformador' },
      { text: 'Le recompenso según el sistema establecido', style: 'Transaccional' },
      { text: 'Le pregunto cómo puedo ayudarle a seguir creciendo', style: 'Servidor' },
      { text: 'Celebro su éxito con todo el equipo', style: 'Afiliativo' }
    ]
  },
  {
    id: 12,
    question: '¿Cómo estructuras las reuniones de equipo?',
    options: [
      { text: 'Sigo una agenda flexible con espacio para participación', style: 'Democrático' },
      { text: 'Informo de lo necesario y pido feedback breve', style: 'Consultivo' },
      { text: 'Las uso para inspirar y conectar con el propósito', style: 'Transformador' },
      { text: 'Las mantengo cortas con objetivos claros y seguimiento', style: 'Transaccional' }
    ]
  },
  {
    id: 13,
    question: '¿Cómo gestionas la formación de tu equipo?',
    options: [
      { text: 'Identifico las necesidades únicas de cada persona', style: 'Transformador' },
      { text: 'Ofrezco las mismas oportunidades a todos', style: 'Democrático' },
      { text: 'Pregunto qué formación necesitan y la facilito', style: 'Servidor' },
      { text: 'Dejo que cada uno gestione su propio desarrollo', style: 'Laissez-faire' }
    ]
  },
  {
    id: 14,
    question: '¿Cómo abordas los objetivos institucionales?',
    options: [
      { text: 'Los traduzco en beneficios para pacientes y equipo', style: 'Transformador' },
      { text: 'Los comunico y establezco un sistema de seguimiento', style: 'Transaccional' },
      { text: 'Los discuto con el equipo para decidir cómo abordarlos', style: 'Democrático' },
      { text: 'Los transmito tal cual sin añadir mis opiniones', style: 'Laissez-faire' }
    ]
  },
  {
    id: 15,
    question: 'Ante un bajo rendimiento sostenido, ¿cómo actúas?',
    options: [
      { text: 'Investigo las causas y busco cómo apoyar a la persona', style: 'Servidor' },
      { text: 'Aplico el procedimiento establecido de forma justa', style: 'Transaccional' },
      { text: 'Tengo una conversación profunda sobre expectativas y motivación', style: 'Transformador' },
      { text: 'Intento proteger a la persona minimizando el impacto', style: 'Afiliativo' }
    ]
  },
  {
    id: 16,
    question: '¿Cómo fomentas el trabajo en equipo?',
    options: [
      { text: 'Creo una visión compartida que nos une', style: 'Transformador' },
      { text: 'Organizo actividades y espacios para el vínculo grupal', style: 'Afiliativo' },
      { text: 'Elimino obstáculos para que colaboren mejor', style: 'Servidor' },
      { text: 'Establezco objetivos comunes y celebramos los logros', style: 'Democrático' }
    ]
  },
  {
    id: 17,
    question: '¿Cómo compartes información con tu equipo?',
    options: [
      { text: 'Soy transparente y comparto todo lo que puedo', style: 'Democrático' },
      { text: 'Comparto lo necesario para que hagan su trabajo', style: 'Transaccional' },
      { text: 'Filtro para protegerles de información estresante', style: 'Afiliativo' },
      { text: 'Conecto la información con el propósito mayor', style: 'Transformador' }
    ]
  },
  {
    id: 18,
    question: '¿Qué papel juega la creatividad en tu liderazgo?',
    options: [
      { text: 'Animo constantemente a cuestionar y proponer', style: 'Transformador' },
      { text: 'La valoro si está dentro de los procesos establecidos', style: 'Transaccional' },
      { text: 'Dejo libertad total para explorar', style: 'Laissez-faire' },
      { text: 'La facilito proporcionando tiempo y recursos', style: 'Servidor' }
    ]
  },
  {
    id: 19,
    question: '¿Cómo manejas tu propio estrés como líder?',
    options: [
      { text: 'Lo oculto para no afectar al equipo', style: 'Afiliativo' },
      { text: 'Soy transparente y modelo estrategias de afrontamiento', style: 'Transformador' },
      { text: 'Me centro en cumplir objetivos sin dejar que me afecte', style: 'Transaccional' },
      { text: 'Busco apoyo de mi equipo cuando lo necesito', style: 'Democrático' }
    ]
  },
  {
    id: 20,
    question: '¿Cómo gestionas el tiempo de tu equipo?',
    options: [
      { text: 'Establezco prioridades claras y plazos definidos', style: 'Transaccional' },
      { text: 'Pregunto qué necesitan para gestionar mejor su tiempo', style: 'Servidor' },
      { text: 'Confío en que cada uno gestione su propia carga', style: 'Laissez-faire' },
      { text: 'Les ayudo a conectar su trabajo con lo que importa', style: 'Transformador' }
    ]
  },
  {
    id: 21,
    question: '¿Cómo manejas los rumores o información informal?',
    options: [
      { text: 'Los atajo con comunicación oficial clara', style: 'Autocrático' },
      { text: 'Investigo su origen y abordo las preocupaciones subyacentes', style: 'Consultivo' },
      { text: 'Los uso como termómetro del clima laboral', style: 'Transformador' },
      { text: 'Los ignoro si no afectan al trabajo', style: 'Laissez-faire' }
    ]
  },
  {
    id: 22,
    question: '¿Cómo equilibras las necesidades del equipo con las de la institución?',
    options: [
      { text: 'Busco soluciones que beneficien a ambas partes', style: 'Transformador' },
      { text: 'Priorizo las necesidades de mi equipo siempre que puedo', style: 'Servidor' },
      { text: 'Sigo las directrices institucionales con flexibilidad', style: 'Transaccional' },
      { text: 'Involucro al equipo en encontrar el equilibrio', style: 'Democrático' }
    ]
  }
];

const MICRO_CHALLENGES = [
  {
    id: 'motivar-referente',
    difficulty: 1,
    title: 'Motivar Referente',
    challenge: '¿Cómo motivarías a una enfermera que rechaza asumir un rol de referente porque dice que "no es lo suyo"?',
    hints: ['Considera sus miedos', 'Piensa en desarrollo gradual', 'Busca motivación intrínseca']
  },
  {
    id: 'resistencia-cambio',
    difficulty: 1,
    title: 'Resistencia al Cambio',
    challenge: 'Propón una estrategia para reducir la resistencia al cambio en tu unidad ante un nuevo protocolo de documentación.',
    hints: ['Involucra al equipo', 'Comunica beneficios', 'Identifica aliados']
  },
  {
    id: 'conflicto-turnos',
    difficulty: 2,
    title: 'Conflicto entre Turnos',
    challenge: '¿Cómo actuarías ante un conflicto entre el turno de mañana y el de noche que está afectando la continuidad de cuidados?',
    hints: ['Escucha ambas partes', 'Busca causas raíz', 'Crea espacios de encuentro']
  },
  {
    id: 'burnout-equipo',
    difficulty: 2,
    title: 'Burnout en Equipo',
    challenge: 'Tu equipo muestra signos de burnout tras meses de alta carga. ¿Qué acciones tomarías como líder?',
    hints: ['Reconoce el esfuerzo', 'Busca recursos adicionales', 'Cuida el bienestar']
  },
  {
    id: 'decision-impopular',
    difficulty: 3,
    title: 'Decisión Impopular',
    challenge: 'Debes comunicar una decisión de dirección que sabes que será muy impopular en tu equipo. ¿Cómo lo harías?',
    hints: ['Sé transparente', 'Explica el contexto', 'Escucha sin justificar']
  },
  {
    id: 'conflicto-valores',
    difficulty: 3,
    title: 'Conflicto de Valores',
    challenge: 'Una enfermera excelente técnicamente tiene actitudes que no encajan con los valores del equipo. ¿Cómo lo abordarías?',
    hints: ['Conversación directa', 'Expectativas claras', 'Consecuencias definidas']
  }
];

const EMOJIS_BY_SCORE = {
  excellent: ['🎉', '🏆', '⭐', '🌟', '💫', '🚀', '👑', '💯'],
  good: ['👏', '✨', '💪', '🎯', '👍', '😊', '🌈', '🔥'],
  average: ['🤔', '📈', '💡', '🔄', '👀', '🌱', '📚', '⏳'],
  poor: ['😕', '📉', '⚠️', '🔧', '💭', '🎓', '🔍', '📝']
};

const PHRASES_BY_SCORE = {
  excellent: [
    '¡Excepcional! Tu liderazgo inspira',
    '¡Brillante! Un líder transformador en acción',
    '¡Impresionante! Demuestras maestría en liderazgo',
    '¡Sobresaliente! Tu equipo tiene suerte de tenerte'
  ],
  good: [
    '¡Muy bien! Vas por buen camino',
    '¡Buen trabajo! Tu liderazgo es sólido',
    '¡Genial! Tienes las bases bien asentadas',
    '¡Bien hecho! Sigue desarrollando tu potencial'
  ],
  average: [
    'Hay potencial, pero margen de mejora',
    'En desarrollo, sigue aprendiendo',
    'Base correcta, pero puedes crecer más',
    'Oportunidad de crecimiento detectada'
  ],
  poor: [
    'Es momento de reflexionar sobre tu liderazgo',
    'Hay áreas importantes que trabajar',
    'El liderazgo se desarrolla, no te desanimes',
    'Identifica tus áreas de mejora para crecer'
  ]
};

const getScoreCategory = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'average';
  return 'poor';
};

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Función para aleatorizar el orden de las opciones de una pregunta
const shuffleOptions = (options) => {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Función para aleatorizar las opciones de cada pregunta en un array de preguntas
const shuffleQuestionOptions = (questions) => {
  return questions.map(q => ({
    ...q,
    options: shuffleOptions(q.options)
  }));
};

const ModeSelector = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#10b981" size="300px" left="5%" top="20%" delay="0s" />
      <GlowingOrb color="#14b8a6" size="200px" left="85%" top="60%" delay="2s" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 px-6 py-3 rounded-2xl border border-emerald-500/30 mb-6">
            <Brain className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-black text-white">
              Centro de <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Liderazgo</span>
            </h1>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block">
            Desarrolla y evalúa tus competencias de liderazgo enfermero
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEADERSHIP_MODES.map((mode, idx) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] hover:-translate-y-1`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl ring-2 ring-white/20 group-hover:scale-110 transition-transform`}>
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-100">{mode.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{mode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {mode.features.map((feature, fidx) => (
                      <span key={fidx} className="text-xs bg-slate-700/80 text-emerald-300 px-2 py-1 rounded-lg">
                        {feature}
                      </span>
                    ))}
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

const ScoreDisplay = ({ score, maxScore, feedback, leadershipStyle, onContinue, additionalInfo }) => {
  const category = getScoreCategory(score, maxScore);
  const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
  const phrase = getRandomElement(PHRASES_BY_SCORE[category]);
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingParticles />
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full text-center border-2 border-emerald-500/30 shadow-2xl">
        <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
        <h2 className="text-2xl font-black text-white mb-2">{phrase}</h2>
        
        <div className="bg-slate-700/50 rounded-2xl p-6 my-6">
          <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {score}/{maxScore}
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3 mb-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                category === 'excellent' ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                category === 'good' ? 'bg-gradient-to-r from-teal-400 to-cyan-400' :
                category === 'average' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                'bg-gradient-to-r from-rose-400 to-red-400'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-slate-300 text-sm">{percentage}% de puntuación</p>
        </div>
        
        {leadershipStyle && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 mb-4">
            <p className="text-emerald-300 font-bold text-lg mb-1">Tu estilo predominante:</p>
            <p className="text-white text-xl font-black">{leadershipStyle}</p>
          </div>
        )}
        
        <p className="text-slate-200 text-sm mb-6 leading-relaxed">{feedback}</p>
        
        {additionalInfo && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-slate-300 text-sm whitespace-pre-line">{additionalInfo}</p>
          </div>
        )}
        
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:scale-105"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const RadarChart = ({ data, labels, title }) => {
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const sides = data.length;
  
  const getPoint = (value, index) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = (value / 4) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  const getLabelPoint = (index) => {
    const angle = (Math.PI * 2 * index) / sides - Math.PI / 2;
    const r = radius + 30;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  const gridLines = [0.25, 0.5, 0.75, 1].map(factor => {
    const r = factor * radius;
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      points.push({
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      });
    }
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });
  
  const dataPoints = data.map((value, index) => getPoint(value, index));
  const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  
  return (
    <div className="bg-slate-800/80 rounded-2xl p-4 border border-emerald-500/30">
      <h3 className="text-white font-bold text-center mb-4">{title}</h3>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
        {gridLines.map((points, idx) => (
          <polygon key={idx} points={points} fill="none" stroke="#475569" strokeWidth="1" />
        ))}
        
        {[...Array(sides)].map((_, i) => {
          const end = getPoint(4, i);
          return (
            <line key={i} x1={centerX} y1={centerY} x2={end.x} y2={end.y} stroke="#475569" strokeWidth="1" />
          );
        })}
        
        <polygon points={dataPath} fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" />
        
        {dataPoints.map((point, idx) => (
          <circle key={idx} cx={point.x} cy={point.y} r="5" fill="#10b981" />
        ))}
        
        {labels.map((label, idx) => {
          const pos = getLabelPoint(idx);
          return (
            <text
              key={idx}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 text-[10px]"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const ScenarioChat = ({ scenario, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `**${scenario.title}**\n\n📋 **Categoría:** ${scenario.category}\n⚡ **Dificultad:** ${scenario.difficulty}\n\n---\n\n${scenario.description}\n\n---\n\n¿Estás listo/a para demostrar tu liderazgo? Escribe **"Empezar"** para comenzar el escenario.`
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
    const scoreMatch = text.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i) || 
                       text.match(/PUNTUACIÓN:\s*(\d+)\/10/i) ||
                       text.match(/\*\*EVALUACIÓN:\s*(\d+)\/10\*\*/i);
    
    const styleMatch = text.match(/\*\*ESTILO.*?:\s*([^*\n]+)\*\*/i) ||
                       text.match(/ESTILO.*?:\s*([^\n]+)/i);
    
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1], 10);
      const style = styleMatch ? styleMatch[1].trim() : null;
      return { score, style, feedback: text };
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
          systemPrompt: `Eres un simulador de liderazgo para gestoras enfermeras.

ESCENARIO: "${scenario.title}"
CATEGORÍA: ${scenario.category}
DESCRIPCIÓN: ${scenario.description}

TU FUNCIÓN:
1. Cuando el usuario diga "Empezar", presenta un escenario detallado de liderazgo con:
   - Contexto específico del hospital/unidad
   - Personas involucradas con nombres y roles
   - El desafío de liderazgo concreto
   - Pregunta qué haría como líder

2. Después de cada respuesta del usuario:
   - Evalúa qué estilo de liderazgo está aplicando (Transformador, Transaccional, Situacional, Servidor, etc.)
   - Muestra las consecuencias de sus decisiones
   - Presenta nuevos desarrollos
   - Guía hacia una resolución

3. Tras 3-4 intercambios, proporciona:
   - **PUNTUACIÓN: X/10** (formato exacto)
   - **ESTILO DETECTADO: [nombre del estilo]**
   - Feedback sobre fortalezas y áreas de mejora
   - Qué le falta para ser un líder transformador
   - Qué le falta para ser un líder situacional
   - Si el estilo aplicado era adecuado o no para este caso

ESTILOS DE LIDERAZGO A DETECTAR:
- Transformador: inspira, motiva, desarrolla personas
- Transaccional: recompensas, objetivos, supervisión
- Situacional: adapta el estilo al contexto
- Servidor: prioriza necesidades del equipo
- Autocrático: decide solo
- Laissez-faire: deja hacer

IMPORTANTE:
- Siempre en español
- Contexto de gestión enfermera en España
- Sé exigente pero constructivo`
        })
      });

      const data = await response.json();
      const aiResponse = data.response;
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      const evaluation = parseEvaluation(aiResponse);
      if (evaluation) {
        setTimeout(() => {
          setResult(evaluation);
          setShowResult(true);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error de conexión. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showResult && result) {
    return (
      <ScoreDisplay
        score={result.score}
        maxScore={10}
        feedback={result.feedback.substring(0, 500) + '...'}
        leadershipStyle={result.style}
        onContinue={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800 border-b-2 border-emerald-500/50 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-xl shadow-lg`}>
            {scenario.icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{scenario.title}</h1>
            <p className="text-xs text-emerald-300">{scenario.category}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/60 to-slate-800/40">
        <FloatingParticles />
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {msg.role === 'assistant' && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl ring-2 ring-white/20`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white border border-emerald-400/30'
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
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center flex-shrink-0 shadow-xl`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800/90 border-2 border-slate-600/80 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3 text-emerald-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Evaluando tu liderazgo...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800 border-t-2 border-emerald-500/50 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="¿Cómo actuarías como líder?"
            className="flex-1 bg-slate-700 border-2 border-slate-500 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

const TransformationalTest = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  // Sistema de regeneración: baraja las preguntas y las opciones en cada intento
  const questions = useMemo(() => {
    const shuffled = [...ALL_TRANSFORMATIONAL_QUESTIONS].sort(() => Math.random() - 0.5);
    // Seleccionar 20 preguntas aleatorias del pool de 30 y aleatorizar sus opciones
    return shuffleQuestionOptions(shuffled.slice(0, 20));
  }, []);
  
  const handleAnswer = (optionIndex) => {
    const option = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, { 
      questionId: currentQuestion, 
      score: option.score,
      dimension: questions[currentQuestion].dimension
    }];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };
  
  if (showResult) {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const maxScore = questions.length * 4;
    
    const dimensions = {};
    answers.forEach(a => {
      if (!dimensions[a.dimension]) {
        dimensions[a.dimension] = { total: 0, count: 0 };
      }
      dimensions[a.dimension].total += a.score;
      dimensions[a.dimension].count += 1;
    });
    
    const dimensionLabels = Object.keys(dimensions);
    const dimensionScores = dimensionLabels.map(d => dimensions[d].total / dimensions[d].count);
    
    const percentage = (totalScore / maxScore) * 100;
    let feedback = '';
    let areasToImprove = [];
    
    dimensionLabels.forEach((dim, idx) => {
      if (dimensionScores[idx] < 3) {
        areasToImprove.push(dim);
      }
    });
    
    if (percentage >= 80) {
      feedback = '¡Excelente! Demuestras un liderazgo altamente transformador. Inspiras a tu equipo y promueves el desarrollo individual.';
    } else if (percentage >= 60) {
      feedback = 'Buen nivel de liderazgo transformador. Tienes fortalezas pero aún puedes potenciar algunas dimensiones.';
    } else {
      feedback = 'Tu liderazgo tiene elementos transformadores pero hay oportunidades significativas de mejora.';
    }
    
    const additionalInfo = areasToImprove.length > 0 
      ? `Áreas de mejora para ser un líder transformador:\n• ${areasToImprove.join('\n• ')}\n\nConsejos:\n• Trabaja en mostrar más coherencia entre lo que dices y haces\n• Inspira con una visión compartida del futuro\n• Estimula el pensamiento creativo de tu equipo\n• Conoce las necesidades individuales de cada persona`
      : 'Mantienes un equilibrio excelente en las 4 dimensiones del liderazgo transformador. ¡Sigue así!';
    
    return (
      <div className="min-h-screen p-4 relative">
        <FloatingParticles />
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <RadarChart 
            data={dimensionScores} 
            labels={dimensionLabels.map(d => d.split(' ')[0])} 
            title="Tu Perfil de Liderazgo Transformador"
          />
          
          <div className="mt-6">
            <ScoreDisplay
              score={totalScore}
              maxScore={maxScore}
              feedback={feedback}
              leadershipStyle="Transformador"
              onContinue={onBack}
              additionalInfo={additionalInfo}
            />
          </div>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#a855f7" size="250px" left="10%" top="30%" delay="0s" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                🦋
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Liderazgo Transformador</h2>
                <p className="text-purple-300 text-sm">{question.dimension}</p>
              </div>
            </div>
            <div className="bg-purple-500/20 px-4 py-2 rounded-xl">
              <span className="text-purple-300 font-bold">{currentQuestion + 1}/{questions.length}</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <p className="text-white text-lg mb-6 leading-relaxed">{question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left bg-slate-700/50 hover:bg-purple-500/20 border-2 border-slate-600 hover:border-purple-500 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-600 group-hover:bg-purple-500 flex items-center justify-center text-white font-bold transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-200 group-hover:text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SituationalTest = ({ onBack }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  // Sistema de regeneración: baraja los escenarios y las opciones en cada intento
  const scenarios = useMemo(() => {
    const shuffled = [...ALL_SITUATIONAL_SCENARIOS].sort(() => Math.random() - 0.5);
    // Seleccionar 20 escenarios aleatorios del pool de 22 y aleatorizar sus opciones
    return shuffleQuestionOptions(shuffled.slice(0, 20));
  }, []);
  
  const handleAnswer = (optionIndex) => {
    const option = scenarios[currentScenario].options[optionIndex];
    const newAnswers = [...answers, {
      scenarioId: currentScenario,
      score: option.score,
      styleChosen: option.style,
      bestStyle: scenarios[currentScenario].bestStyle
    }];
    setAnswers(newAnswers);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setShowResult(true);
    }
  };
  
  if (showResult) {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const maxScore = scenarios.length * 4;
    
    const styleCount = {};
    answers.forEach(a => {
      styleCount[a.styleChosen] = (styleCount[a.styleChosen] || 0) + 1;
    });
    
    const correctMatches = answers.filter(a => a.styleChosen === a.bestStyle).length;
    
    const percentage = (totalScore / maxScore) * 100;
    let feedback = '';
    
    if (percentage >= 80) {
      feedback = `¡Excelente adaptabilidad! Acertaste ${correctMatches}/${answers.length} estilos óptimos. Demuestras un dominio del liderazgo situacional.`;
    } else if (percentage >= 60) {
      feedback = `Buena capacidad de adaptación. Acertaste ${correctMatches}/${answers.length} estilos. Puedes mejorar tu lectura del contexto.`;
    } else {
      feedback = `Necesitas trabajar tu flexibilidad de estilos. Acertaste ${correctMatches}/${answers.length}. Recuerda: adapta tu liderazgo a la madurez del equipo.`;
    }
    
    const styleLabels = ['Directivo', 'Persuasivo', 'Participativo', 'Delegativo'];
    const styleScores = styleLabels.map(style => styleCount[style] || 0);
    
    const additionalInfo = `Distribución de estilos usados:\n• Directivo: ${styleCount['Directivo'] || 0} veces\n• Persuasivo: ${styleCount['Persuasivo'] || 0} veces\n• Participativo: ${styleCount['Participativo'] || 0} veces\n• Delegativo: ${styleCount['Delegativo'] || 0} veces\n\nRecuerda el modelo Hersey-Blanchard:\n• Directivo: para baja competencia, alta motivación\n• Persuasivo: para competencia creciente, motivación variable\n• Participativo: para alta competencia, motivación variable\n• Delegativo: para alta competencia, alta motivación`;
    
    return (
      <div className="min-h-screen p-4 relative">
        <FloatingParticles />
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <RadarChart 
            data={styleScores.map(s => s * (4 / scenarios.length) * 4)} 
            labels={styleLabels} 
            title="Tu Uso de Estilos Situacionales"
          />
          
          <div className="mt-6">
            <ScoreDisplay
              score={totalScore}
              maxScore={maxScore}
              feedback={feedback}
              leadershipStyle="Situacional"
              onContinue={onBack}
              additionalInfo={additionalInfo}
            />
          </div>
        </div>
      </div>
    );
  }
  
  const scenario = scenarios[currentScenario];
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#3b82f6" size="250px" left="10%" top="30%" delay="0s" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                🔄
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Liderazgo Situacional</h2>
                <p className="text-blue-300 text-sm">Adapta tu estilo al contexto</p>
              </div>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-xl">
              <span className="text-blue-300 font-bold">{currentScenario + 1}/{scenarios.length}</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
            <p className="text-blue-200 text-sm italic">📍 Contexto: {scenario.context}</p>
          </div>
          
          <p className="text-white text-lg mb-6 leading-relaxed">{scenario.scenario}</p>
          
          <div className="space-y-3">
            {scenario.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left bg-slate-700/50 hover:bg-blue-500/20 border-2 border-slate-600 hover:border-blue-500 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-600 group-hover:bg-blue-500 flex items-center justify-center text-white font-bold transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-200 group-hover:text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralEvaluation = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  
  // Sistema de regeneración: baraja las preguntas y las opciones en cada intento
  const questions = useMemo(() => {
    const shuffled = [...GENERAL_LEADERSHIP_QUESTIONS].sort(() => Math.random() - 0.5);
    // Seleccionar 20 preguntas aleatorias del pool de 22 y aleatorizar sus opciones
    return shuffleQuestionOptions(shuffled.slice(0, 20));
  }, []);
  
  const handleAnswer = (optionIndex) => {
    const option = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, { 
      questionId: currentQuestion, 
      style: option.style
    }];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };
  
  if (showResult) {
    const styleCount = {};
    answers.forEach(a => {
      styleCount[a.style] = (styleCount[a.style] || 0) + 1;
    });
    
    const dominantStyle = Object.entries(styleCount).sort((a, b) => b[1] - a[1])[0][0];
    
    const styleDescriptions = {
      'Transformador': {
        description: 'Inspiras y motivas a tu equipo hacia una visión compartida. Te centras en el desarrollo individual y en crear un propósito mayor.',
        fitness: 'Muy adecuado para la gestión enfermera. Fomenta la innovación, el compromiso y el desarrollo profesional del equipo.',
        improve: 'Asegúrate de no descuidar los objetivos operativos inmediatos. Combina inspiración con estructura.'
      },
      'Transaccional': {
        description: 'Te enfocas en objetivos claros, recompensas por logros y supervisión del rendimiento. Valoras la estructura y la previsibilidad.',
        fitness: 'Útil para tareas rutinarias y cuando hay que garantizar cumplimiento de protocolos. Puede limitar la creatividad.',
        improve: 'Incorpora más elementos de inspiración y desarrollo personal. No todo es intercambio de recompensas.'
      },
      'Democrático': {
        description: 'Valoras la participación del equipo en las decisiones. Buscas consenso y fomentas la colaboración.',
        fitness: 'Muy adecuado para equipos maduros en enfermería. Aumenta el compromiso pero puede ralentizar decisiones urgentes.',
        improve: 'En situaciones de crisis, sé capaz de tomar decisiones rápidas. No todo puede decidirse en grupo.'
      },
      'Servidor': {
        description: 'Priorizas las necesidades del equipo. Te ves como un facilitador que ayuda a los demás a crecer.',
        fitness: 'Excelente para crear equipos comprometidos y desarrollar talento. Muy valorado en enfermería.',
        improve: 'No descuides tus propias necesidades. Asegúrate de establecer límites claros.'
      },
      'Consultivo': {
        description: 'Consultas opiniones pero mantienes la autoridad en las decisiones finales. Equilibras participación y liderazgo.',
        fitness: 'Muy equilibrado para gestión enfermera. Permite eficiencia manteniendo la voz del equipo.',
        improve: 'Explica siempre el porqué de tus decisiones finales para mantener la confianza del equipo.'
      },
      'Laissez-faire': {
        description: 'Das mucha autonomía al equipo. Intervienes poco y confías en la autogestión.',
        fitness: 'Solo adecuado con equipos muy maduros y autónomos. Puede crear caos con personal inexperto.',
        improve: 'Aumenta tu presencia y supervisión. El liderazgo requiere guía activa.'
      },
      'Autocrático': {
        description: 'Tomas las decisiones de forma independiente. Valoras la eficiencia y el control.',
        fitness: 'Puede ser necesario en emergencias, pero no es sostenible. Reduce la motivación del equipo.',
        improve: 'Incorpora más participación del equipo. Escucha más y delega responsabilidades.'
      },
      'Afiliativo': {
        description: 'Priorizas las relaciones y el bienestar emocional del equipo. Buscas armonía.',
        fitness: 'Muy útil tras crisis o conflictos. Puede descuidar rendimiento si se usa en exceso.',
        improve: 'No evites los conflictos necesarios. A veces hay que dar feedback difícil.'
      }
    };
    
    const styleInfo = styleDescriptions[dominantStyle] || {
      description: 'Tienes un estilo de liderazgo único.',
      fitness: 'Adapta tu liderazgo según el contexto.',
      improve: 'Sigue desarrollando tus competencias.'
    };
    
    const score = answers.filter(a => ['Transformador', 'Servidor', 'Democrático'].includes(a.style)).length;
    const maxScore = answers.length;
    
    return (
      <ScoreDisplay
        score={score}
        maxScore={maxScore}
        feedback={styleInfo.description}
        leadershipStyle={dominantStyle}
        onContinue={onBack}
        additionalInfo={`Adecuación en gestión enfermera:\n${styleInfo.fitness}\n\nÁreas de desarrollo:\n${styleInfo.improve}`}
      />
    );
  }
  
  const question = questions[currentQuestion];
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#f59e0b" size="250px" left="10%" top="30%" delay="0s" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-amber-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Evaluación General</h2>
                <p className="text-amber-300 text-sm">Descubre tu estilo predominante</p>
              </div>
            </div>
            <div className="bg-amber-500/20 px-4 py-2 rounded-xl">
              <span className="text-amber-300 font-bold">{currentQuestion + 1}/{questions.length}</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <p className="text-white text-lg mb-6 leading-relaxed">{question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left bg-slate-700/50 hover:bg-amber-500/20 border-2 border-slate-600 hover:border-amber-500 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-600 group-hover:bg-amber-500 flex items-center justify-center text-white font-bold transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-slate-200 group-hover:text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MicroChallenges = ({ onBack }) => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [regenerateKey, setRegenerateKey] = useState(0);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('leadershipStreak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem('leadershipDifficulty');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  // Sistema de regeneración: baraja los retos cada vez que se regenera
  const availableChallenges = useMemo(() => {
    const filtered = MICRO_CHALLENGES.filter(c => c.difficulty <= difficulty + 1);
    return [...filtered].sort(() => Math.random() - 0.5);
  }, [difficulty, regenerateKey]);
  
  const handleRegenerate = () => {
    setRegenerateKey(prev => prev + 1);
  };
  
  const startChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setUserResponse('');
    setFeedback(null);
  };
  
  const submitResponse = async () => {
    if (!userResponse.trim() || isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userResponse,
          systemPrompt: `Eres un evaluador de micro-retos de liderazgo para gestoras enfermeras.

RETO: "${currentChallenge.challenge}"

Evalúa la respuesta del usuario y proporciona:
1. **PUNTUACIÓN: X/10** (formato exacto)
2. **ESTILO DETECTADO:** [nombre del estilo de liderazgo aplicado]
3. Feedback breve (máximo 3 frases) sobre:
   - Fortalezas de la respuesta
   - Área de mejora
   - Si el estilo aplicado es adecuado para este reto

Sé constructivo y específico. Contexto: gestión enfermera en España.`
        })
      });
      
      const data = await response.json();
      const aiResponse = data.response;
      
      const scoreMatch = aiResponse.match(/\*\*PUNTUACIÓN:\s*(\d+)\/10\*\*/i);
      const styleMatch = aiResponse.match(/\*\*ESTILO.*?:\s*([^*\n]+)\*\*/i);
      
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 5;
      const style = styleMatch ? styleMatch[1].trim() : 'No identificado';
      
      if (score >= 7) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('leadershipStreak', newStreak.toString());
        
        if (newStreak % 3 === 0 && difficulty < 3) {
          const newDifficulty = difficulty + 1;
          setDifficulty(newDifficulty);
          localStorage.setItem('leadershipDifficulty', newDifficulty.toString());
        }
      } else {
        setStreak(0);
        localStorage.setItem('leadershipStreak', '0');
      }
      
      setFeedback({ score, style, text: aiResponse });
    } catch (error) {
      setFeedback({ score: 0, style: 'Error', text: 'Error al evaluar. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (feedback) {
    const category = getScoreCategory(feedback.score, 10);
    const emoji = getRandomElement(EMOJIS_BY_SCORE[category]);
    
    return (
      <div className="min-h-screen p-4 md:p-8 relative">
        <FloatingParticles />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-rose-500/30 shadow-xl text-center">
            <div className="text-7xl mb-4">{emoji}</div>
            <div className="text-4xl font-black text-white mb-2">{feedback.score}/10</div>
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-xl px-4 py-2 inline-block mb-4">
              <span className="text-rose-300">Estilo: </span>
              <span className="text-white font-bold">{feedback.style}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-bold">Racha: {streak}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Nivel: {difficulty}</span>
            </div>
            
            <p className="text-slate-200 text-sm mb-6 leading-relaxed whitespace-pre-line text-left">
              {feedback.text.replace(/\*\*/g, '')}
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentChallenge(null);
                  setFeedback(null);
                }}
                className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Nuevo Reto
              </button>
              <button
                onClick={onBack}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (currentChallenge) {
    return (
      <div className="min-h-screen p-4 md:p-8 relative">
        <FloatingParticles />
        <GlowingOrb color="#f43f5e" size="250px" left="10%" top="30%" delay="0s" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <button
            onClick={() => setCurrentChallenge(null)}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-rose-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentChallenge.title}</h2>
                  <p className="text-rose-300 text-sm">Nivel {currentChallenge.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-2 rounded-xl">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 font-bold">{streak}</span>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentChallenge.challenge}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">💡 Pistas:</p>
              <div className="flex flex-wrap gap-2">
                {currentChallenge.hints.map((hint, idx) => (
                  <span key={idx} className="text-xs bg-slate-700/80 text-slate-300 px-2 py-1 rounded-lg">
                    {hint}
                  </span>
                ))}
              </div>
            </div>
            
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Escribe tu respuesta como líder..."
              className="w-full bg-slate-700/50 border-2 border-slate-600 focus:border-rose-500 rounded-xl p-4 text-white placeholder-slate-400 resize-none h-32 focus:outline-none"
              disabled={isLoading}
            />
            
            <button
              onClick={submitResponse}
              disabled={!userResponse.trim() || isLoading}
              className="w-full mt-4 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar Respuesta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#f43f5e" size="300px" left="5%" top="20%" delay="0s" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-3">
            Micro-retos de <span className="bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">Liderazgo</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-bold">Racha: {streak}</span>
            </div>
            <div className="bg-slate-700/80 px-4 py-2 rounded-xl">
              <span className="text-slate-300">Nivel: {difficulty}/3</span>
            </div>
          </div>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block mb-4">
            Resuelve retos rápidos y mejora tu liderazgo
          </p>
          
          <button
            onClick={handleRegenerate}
            className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Regenerar Retos</span>
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {availableChallenges.map((challenge, idx) => (
            <button
              key={challenge.id}
              onClick={() => startChallenge(challenge)}
              className="bg-slate-800/90 backdrop-blur-xl border-2 border-slate-600 hover:border-rose-400 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-rose-500/20 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(challenge.difficulty)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-rose-400 fill-rose-400" />
                  ))}
                  {[...Array(3 - challenge.difficulty)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-slate-600" />
                  ))}
                </div>
                <span className="text-rose-300 text-sm font-medium">Nivel {challenge.difficulty}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-100">{challenge.title}</h3>
              <p className="text-slate-300 text-sm line-clamp-2">{challenge.challenge}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScenarioSelector = ({ onSelectScenario, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiScenarios, setAiScenarios] = useState([]);
  const [error, setError] = useState(null);
  
  const allScenarios = [...aiScenarios, ...LEADERSHIP_SCENARIOS];
  
  const generateScenario = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-leadership-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Error generando escenario');
      
      const scenario = await response.json();
      setAiScenarios(prev => [scenario, ...prev]);
    } catch (err) {
      setError('No se pudo generar el escenario. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <FloatingParticles />
      <GlowingOrb color="#10b981" size="300px" left="5%" top="20%" delay="0s" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-all bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-3">
            Escenarios de <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Liderazgo</span>
          </h1>
          <p className="text-slate-200 bg-slate-800/70 px-4 py-2 rounded-xl inline-block mb-4">
            Demuestra tu capacidad de liderar en situaciones reales
          </p>
          
          <button
            onClick={generateScenario}
            disabled={isGenerating}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto hover:scale-105"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar con IA</span>
              </>
            )}
          </button>
          
          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {allScenarios.map((scenario, idx) => (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`bg-slate-800/90 backdrop-blur-xl border-2 rounded-2xl p-5 text-left transition-all group shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] ${
                idx < aiScenarios.length 
                  ? 'border-purple-500/50 hover:border-purple-400' 
                  : 'border-slate-600 hover:border-emerald-400'
              }`}
            >
              {idx < aiScenarios.length && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-xl`}>
                  {scenario.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{scenario.title}</h3>
                  <p className="text-emerald-400 text-xs font-medium mb-2">{scenario.category}</p>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">{scenario.description}</p>
                  <span className="text-xs bg-slate-700/80 text-slate-300 px-2 py-1 rounded-lg">
                    {scenario.difficulty}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LeadershipModule = ({ onBack }) => {
  const [currentMode, setCurrentMode] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const bgStyle = {
    backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(6, 78, 59, 0.12), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  if (currentMode === 'scenarios' && selectedScenario) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={bgStyle}>
        <ScenarioChat 
          scenario={selectedScenario} 
          onBack={() => setSelectedScenario(null)} 
        />
      </div>
    );
  }

  if (currentMode === 'scenarios') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={bgStyle}>
        <ScenarioSelector 
          onSelectScenario={setSelectedScenario}
          onBack={() => setCurrentMode(null)}
        />
      </div>
    );
  }

  if (currentMode === 'transformational') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{...bgStyle, backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(88, 28, 135, 0.15), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`}}>
        <TransformationalTest onBack={() => setCurrentMode(null)} />
      </div>
    );
  }

  if (currentMode === 'situational') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{...bgStyle, backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(30, 64, 175, 0.15), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`}}>
        <SituationalTest onBack={() => setCurrentMode(null)} />
      </div>
    );
  }

  if (currentMode === 'general') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{...bgStyle, backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(180, 83, 9, 0.15), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`}}>
        <GeneralEvaluation onBack={() => setCurrentMode(null)} />
      </div>
    );
  }

  if (currentMode === 'microchallenges') {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{...bgStyle, backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(190, 18, 60, 0.15), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`}}>
        <MicroChallenges onBack={() => setCurrentMode(null)} />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.92), rgba(6, 78, 59, 0.15), rgba(15, 23, 42, 0.92)), url(${leadershipBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Liderazgo</h1>
            <p className="text-xs text-emerald-300">Centro de desarrollo de liderazgo</p>
          </div>
        </div>
        <PlayerAvatarIcon size="md" />
      </div>
      
      <ModeSelector onSelectMode={setCurrentMode} />
    </div>
  );
};

export default LeadershipModule;
