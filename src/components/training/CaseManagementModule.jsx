import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Briefcase, Loader2, Play, CheckCircle, Star, Award, ChevronRight, Clock, Users, AlertTriangle, Home, BookOpen, Trophy, Zap, Target, Sparkles, Flame, Crown, Gift, TrendingUp, Brain, Heart, Rocket, Medal, GraduationCap } from 'lucide-react';
import aiTrainingBg from '../../assets/ai-training-bg.png';

const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-[10%] w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-[20%] w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/4 right-[20%] w-56 h-56 bg-amber-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2.5s' }} />
    </div>
  );
};

const GlowingStars = () => {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.3)'
          }}
        />
      ))}
    </div>
  );
};

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1200;
    const steps = 25;
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
  
  return <span>{displayValue.toLocaleString()}{suffix}</span>;
};

const StatCard = ({ icon: Icon, value, label, color, delay = 0 }) => (
  <div 
    className={`bg-gradient-to-br ${color} backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl transform hover:scale-105 transition-all duration-300 animate-fadeInUp`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-white"><AnimatedCounter value={value} /></p>
        <p className="text-white/70 text-xs font-medium">{label}</p>
      </div>
    </div>
  </div>
);

const AVAILABLE_CASES = [
  {
    id: 'liderazgo-turno-nocturno',
    title: 'El Desafío del Turno Nocturno en el Hospital General',
    category: 'Liderazgo en Enfermería',
    difficulty: 'Intermedio',
    duration: '20-30 min',
    icon: '🏥',
    color: 'from-blue-500 to-cyan-500',
    description: 'Un caso complejo sobre liderazgo, gestión de conflictos y comunicación en un turno nocturno desafiante.',
    context: `El Hospital General es un centro sanitario de referencia en la región, conocido por su atención de alta calidad y su capacidad para manejar una variedad de casos médicos complejos. Sin embargo, enfrenta desafíos significativos durante los turnos de noche:

**1. Escasez de Personal:** El turno nocturno siempre ha tenido menos personal que los turnos diurnos. Esta escasez se ha agravado por recientes recortes presupuestarios y la alta demanda de servicios de salud.

**2. Aumento de Pacientes Críticos:** El hospital ha visto un incremento en el número de pacientes críticos que requieren atención constante y especializada.

**3. Implementación de un Nuevo Sistema de Gestión:** El hospital ha implementado un nuevo sistema de gestión de pacientes. El personal ha encontrado dificultades para adaptarse a la nueva interfaz y protocolos.`,
    characters: [
      { name: 'Ana García', role: 'Supervisora de Enfermería', description: 'Responsable de garantizar que el turno nocturno funcione sin problemas. Lidera al equipo a través de la transición al nuevo sistema.', emoji: '👩‍⚕️' },
      { name: 'Carlos Ruiz', role: 'Enfermero Nuevo', description: 'Relativamente nuevo, se siente abrumado por aprender el nuevo sistema y manejar pacientes críticos.', emoji: '👨‍⚕️' },
      { name: 'Sofía Pérez', role: 'Enfermera Veterana', description: 'Ha trabajado en el hospital muchos años. Resistente al cambio y vocal en su crítica al nuevo sistema.', emoji: '👩‍⚕️' },
      { name: 'Luis Fernández', role: 'Recién Graduado', description: 'Ansioso por aprender, pero su falta de experiencia en situaciones de alta presión es un obstáculo.', emoji: '👨‍⚕️' }
    ],
    situation: `En una noche particularmente ocupada, con un número inusualmente alto de pacientes críticos y varios incidentes inesperados, el equipo de enfermería se enfrenta a una tormenta perfecta de desafíos. Ana debe guiar a su equipo a través de esta crisis, asegurando que todos los pacientes reciban la atención que necesitan mientras se adapta al nuevo sistema y maneja las dinámicas complejas de su equipo.`
  },
  {
    id: 'toma-decisiones-uci',
    title: 'Crisis en la Unidad de Cuidados Intensivos (UCI)',
    category: 'Toma de Decisiones',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '🚨',
    color: 'from-red-500 to-pink-500',
    description: 'Un escenario crítico de toma de decisiones durante un brote de infección con recursos limitados.',
    context: `La Unidad de Cuidados Intensivos (UCI) del Hospital General se enfrenta a una situación crítica que pone a prueba la toma de decisiones del personal de enfermería. La UCI, conocida por su excelencia en el manejo de casos críticos, se encuentra en una situación complicada debido a:

**1. Brote de Infección Inesperado:** Un brote inesperado de una infección resistente a múltiples medicamentos ha surgido en la UCI, lo que requiere decisiones rápidas y efectivas sobre el aislamiento de pacientes, la administración de tratamientos y la prevención de la propagación.

**2. Recursos Limitados:** La UCI está experimentando una escasez de recursos críticos, incluyendo personal, equipos y medicamentos esenciales. Esto obliga al equipo a tomar decisiones difíciles sobre la asignación de recursos y la priorización de pacientes.

**3. Desafíos de Comunicación:** La comunicación efectiva entre el personal de enfermería, otros profesionales sanitarios y los familiares de los pacientes es crucial, pero se ve obstaculizada por la urgencia y la gravedad de la situación.`,
    characters: [
      { name: 'Elena Rodríguez', role: 'Jefa de Enfermeras UCI', description: 'Debe liderar a su equipo en la toma de decisiones críticas bajo presión, equilibrando la atención al paciente con los recursos limitados.', emoji: '👩‍⚕️' },
      { name: 'Miguel Álvarez', role: 'Enfermero Experimentado', description: 'Se enfrenta al desafío de manejar múltiples pacientes críticos simultáneamente, tomando decisiones rápidas y efectivas.', emoji: '👨‍⚕️' },
      { name: 'Laura Martínez', role: 'Enfermera Recién Graduada', description: 'Se encuentra abrumada por la gravedad de la situación y necesita tomar decisiones importantes mientras aún está aprendiendo.', emoji: '👩‍⚕️' },
      { name: 'Diego Sánchez', role: 'Enfermero Comunicador', description: 'Con habilidades excepcionales en comunicación, juega un papel clave en la coordinación entre el equipo, otros profesionales y las familias.', emoji: '👨‍⚕️' }
    ],
    situation: `Durante un turno particularmente intenso, con el brote de infección en su punto más crítico y recursos limitados, el equipo de enfermería de la UCI debe tomar decisiones rápidas y efectivas. Elena debe guiar a su equipo a través de esta crisis, asegurando que se tomen las mejores decisiones posibles para el cuidado de los pacientes, la gestión de recursos y la comunicación efectiva.`
  },
  {
    id: 'gestion-conflicto-cirugia',
    title: 'Tensiones en la Unidad de Cirugía',
    category: 'Gestión del Conflicto',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '⚔️',
    color: 'from-purple-500 to-indigo-500',
    description: 'Un caso sobre gestión del conflicto entre generaciones de profesionales con diferentes métodos de trabajo.',
    context: `La unidad de cirugía del Hospital General, reconocida por su excelencia en procedimientos quirúrgicos complejos y atención al paciente, enfrenta un desafío interno que amenaza su eficiencia y armonía. Este conflicto surge de varias capas de problemas:

**1. Diferencias en Métodos de Trabajo:** La unidad ha incorporado recientemente a varias enfermeras jóvenes y entusiastas, quienes traen consigo nuevas ideas y técnicas. Sin embargo, estas nuevas prácticas a menudo chocan con los métodos tradicionales y establecidos de las enfermeras veteranas, creando una división en el equipo. Las enfermeras más experimentadas ven estas nuevas ideas como una amenaza a los protocolos probados y seguros, mientras que las recién llegadas se sienten frustradas por la resistencia al cambio.

**2. Presiones de Tiempo y Estrés:** La unidad de cirugía siempre ha sido un entorno de alta presión debido a la naturaleza crítica de su trabajo. Sin embargo, recientes aumentos en el volumen de pacientes y la complejidad de los casos han intensificado el estrés. Este ambiente tenso ha exacerbado las tensiones existentes, llevando a conflictos abiertos y a veces a la disminución de la colaboración entre los miembros del equipo.

**3. Comunicación Deficiente:** A pesar de los esfuerzos por mantener una comunicación clara y abierta, el equipo ha luchado con malentendidos y falta de diálogo efectivo. Las diferencias en estilos de comunicación entre las generaciones han llevado a interpretaciones erróneas y a la falta de reconocimiento de las contribuciones de cada uno, lo que ha alimentado un ambiente de desconfianza y resentimiento.`,
    characters: [
      { name: 'Isabel Torres', role: 'Jefa de Unidad', description: 'Líder respetada con décadas de experiencia. Se enfrenta al desafío de unir a un equipo dividido, equilibrando la sabiduría de las prácticas establecidas con la innovación de las nuevas técnicas.', emoji: '👩‍⚕️' },
      { name: 'Lucía Gómez', role: 'Enfermera Recién Graduada', description: 'Con una perspectiva fresca, se siente marginada y subestimada por sus colegas más experimentadas. Lucha por encontrar su lugar y hacerse escuchar en un equipo resistente al cambio.', emoji: '👩‍⚕️' },
      { name: 'Carlos Jiménez', role: 'Enfermero Veterano', description: 'Con una sólida trayectoria en la unidad, valora la estabilidad y los protocolos probados. Ve las nuevas ideas como riesgos innecesarios y a menudo se encuentra en desacuerdo con las enfermeras más jóvenes.', emoji: '👨‍⚕️' },
      { name: 'Ana Belén Ruiz', role: 'Enfermera Mediadora', description: 'Conocida por sus habilidades de comunicación y empatía, intenta ser la voz de la razón y el puente entre los grupos. Sus esfuerzos se ven obstaculizados por la creciente tensión.', emoji: '👩‍⚕️' }
    ],
    situation: `En un día particularmente desafiante, con múltiples cirugías complejas programadas y el equipo ya bajo una considerable tensión, los conflictos entre las enfermeras alcanzan un punto crítico. Isabel se encuentra en el centro de esta tormenta, luchando por mantener la unidad y eficiencia del equipo mientras se enfrenta a la creciente frustración y el descontento. La forma en que maneje esta situación no solo determinará el resultado de las cirugías del día, sino también el futuro de la dinámica del equipo.`
  },
  {
    id: 'comunicacion-oncologia',
    title: 'Desafíos de Comunicación en la Unidad de Oncología',
    category: 'Comunicación en Enfermería',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '💬',
    color: 'from-teal-500 to-emerald-500',
    description: 'Un caso sobre comunicación efectiva, empática y culturalmente sensible en un entorno oncológico.',
    context: `La Unidad de Oncología del Hospital General se enfrenta a desafíos únicos en términos de comunicación. La naturaleza sensible de los tratamientos y el estado emocional de los pacientes y sus familias requieren una comunicación excepcionalmente cuidadosa y empática. Los desafíos recientes incluyen:

**1. Información Compleja y Sensible:** Los profesionales de enfermería deben comunicar información compleja sobre diagnósticos y tratamientos a pacientes y familias, a menudo en situaciones emocionalmente cargadas.

**2. Diversidad Cultural y Lingüística:** La unidad atiende a una población diversa, con barreras lingüísticas y culturales que pueden complicar la comunicación.

**3. Coordinación del Equipo Multidisciplinar:** La necesidad de una comunicación efectiva y coordinada entre diferentes especialistas (oncólogos, enfermería, trabajadores sociales, etc.) es crucial para proporcionar una atención integral.`,
    characters: [
      { name: 'Isabel González', role: 'Jefa de Enfermeras', description: 'Enfrenta el reto de asegurar una comunicación clara y compasiva dentro de su equipo y hacia los pacientes y sus familias.', emoji: '👩‍⚕️' },
      { name: 'Juan Martín', role: 'Enfermero Especializado en Oncología', description: 'Lucha con la comunicación efectiva de malas noticias a los pacientes, buscando el equilibrio entre la información y la empatía.', emoji: '👨‍⚕️' },
      { name: 'Lucía Ramírez', role: 'Enfermera Bilingüe', description: 'Esencial en la superación de barreras lingüísticas, pero a menudo se siente abrumada por la carga adicional de traducción y mediación cultural.', emoji: '👩‍⚕️' },
      { name: 'Carlos Vargas', role: 'Enfermero Recién Incorporado', description: 'Intenta encontrar el equilibrio entre ser informativo y empático, aprendiendo las complejidades de la comunicación en oncología.', emoji: '👨‍⚕️' }
    ],
    situation: `Durante una semana particularmente desafiante, con varios casos nuevos de diagnósticos complicados y decisiones de tratamiento difíciles, el equipo de enfermería debe manejar eficazmente la comunicación en múltiples frentes. Isabel debe liderar a su equipo para asegurar que la comunicación sea efectiva, empática y culturalmente sensible, tanto con los pacientes y sus familias como dentro del equipo multidisciplinar.`
  },
  {
    id: 'trabajo-equipo-urologia',
    title: 'Dinámicas de Trabajo en Equipo en la Unidad de Urología',
    category: 'Trabajo en Equipo',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '🤝',
    color: 'from-amber-500 to-orange-500',
    description: 'Un caso sobre colaboración efectiva, integración de nuevos miembros y coordinación multidisciplinar.',
    context: `La Unidad de Urología del Hospital Central enfrenta desafíos únicos que ponen a prueba la eficacia y cohesión de su equipo de enfermería. Esta unidad se especializa en una variedad de condiciones urológicas complejas, que van desde procedimientos quirúrgicos mínimamente invasivos hasta tratamientos para enfermedades crónicas. Los desafíos específicos incluyen:

**1. Manejo de Casos Diversos y Complejos:** La unidad atiende a una amplia gama de pacientes, cada uno con sus propias necesidades específicas. Esto requiere que el equipo de enfermería esté bien informado y preparado para manejar una variedad de situaciones clínicas.

**2. Coordinación entre Diversas Especialidades:** La atención efectiva en urología a menudo requiere la colaboración de diferentes especialidades. Esto incluye trabajar con oncólogos, nefrólogos, cirujanos, y otros, lo que puede presentar desafíos en términos de comunicación y coordinación.

**3. Carga Emocional y Estrés:** Dado que muchos pacientes enfrentan diagnósticos y tratamientos difíciles, el equipo debe manejar no solo los aspectos clínicos, sino también el impacto emocional en los pacientes y sus familias.

**4. Innovación y Actualización Constante:** La urología es un campo que evoluciona rápidamente, con nuevas tecnologías y tratamientos emergiendo regularmente. Mantenerse actualizado y adaptar estas innovaciones al trabajo diario es esencial pero desafiante.`,
    characters: [
      { name: 'Ana López', role: 'Jefa de Enfermeras', description: 'Se enfrenta al desafío de mantener un equipo unido y eficiente, asegurando que todos estén actualizados con las últimas prácticas y tecnologías.', emoji: '👩‍⚕️' },
      { name: 'Carlos Pérez', role: 'Enfermero Experimentado', description: 'Con años de experiencia en cirugía urológica, es un pilar en el equipo, pero a veces encuentra dificultades para adaptarse a los métodos más nuevos.', emoji: '👨‍⚕️' },
      { name: 'Sofía Martín', role: 'Enfermera Recién Incorporada', description: 'Trae conocimientos actualizados y nuevas perspectivas, pero se enfrenta al reto de integrarse en un equipo establecido sin causar fricciones.', emoji: '👩‍⚕️' }
    ],
    situation: `La unidad se enfrenta a una semana de alta demanda, con varios casos complicados que requieren una coordinación y colaboración excepcionales. Además, un nuevo tratamiento innovador está siendo introducido, lo que requiere una rápida adaptación y aprendizaje por parte del equipo. Ana debe liderar a su equipo a través de estos desafíos, asegurando que la atención al paciente se mantenga al más alto nivel mientras se fomenta un ambiente de trabajo en equipo efectivo y solidario.`
  },
  {
    id: 'etica-radiologia',
    title: 'Dilema Ético en la Unidad de Radiología',
    category: 'Ética en Enfermería',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '⚖️',
    color: 'from-rose-500 to-pink-600',
    description: 'Un caso sobre dilemas éticos, integridad profesional y gestión de solicitudes inapropiadas.',
    context: `La Unidad de Radiología del Hospital Central es conocida por su excelencia en el campo de los diagnósticos. Con equipos de última generación y un equipo altamente especializado, esta unidad es crucial para el diagnóstico y tratamiento de una amplia gama de condiciones. Los desafíos únicos incluyen:

**1. Alto Volumen de Trabajo y Decisiones Críticas:** La unidad maneja un alto volumen de casos, cada uno requiriendo atención detallada y decisiones rápidas, lo cual pone una presión constante sobre el equipo.

**2. Tecnología Avanzada y Capacitación Continua:** El personal necesita estar constantemente actualizado con las últimas tecnologías y procedimientos de diagnóstico, lo que implica una formación continua.

**3. Interacción con Múltiples Disciplinas:** La unidad trabaja en estrecha colaboración con casi todos los otros departamentos del hospital, lo que requiere una comunicación efectiva y coordinación constante.

**4. El Dilema Ético:** Un jefe de servicio ha solicitado que se conceda un día libre a una enfermera en una situación que no se ajusta a las políticas del hospital. Si la dirección descubre esta acción, podría llevar a un expediente disciplinario. Negarse podría deteriorar la relación laboral y generar conflictos.`,
    characters: [
      { name: 'María González', role: 'Jefa de Enfermeras', description: 'Profesional experimentada que enfrenta un dilema ético entre cumplir una solicitud inapropiada y el riesgo de generar conflictos con el jefe de servicio.', emoji: '👩‍⚕️' },
      { name: 'Juan Rodríguez', role: 'Jefe de Servicio', description: 'Realiza la solicitud inapropiada. Su relación con María y el equipo puede verse afectada por la decisión tomada.', emoji: '👨‍⚕️' },
      { name: 'Equipo de Enfermería', role: 'Personal de la Unidad', description: 'Aunque no directamente involucrados, la decisión de María influirá en la percepción de justicia y equidad en el equipo.', emoji: '👥' }
    ],
    situation: `María se encuentra entre la espada y la pared: conceder el permiso va en contra de las normas y ética profesional, pero negarlo podría generar tensiones y conflictos con el jefe de servicio, afectando potencialmente la operatividad y el ambiente de la unidad. La decisión de María no solo afectará su relación con el jefe de servicio y su equipo, sino que también podría tener repercusiones en toda la unidad y más allá. ¿Cómo debería manejar este dilema ético manteniendo su integridad profesional?`
  },
  {
    id: 'gestion-cambio-uci',
    title: 'Gestión del Cambio en la Unidad de Cuidados Intensivos',
    category: 'Gestión del Cambio',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '🔄',
    color: 'from-violet-500 to-purple-600',
    description: 'Un caso sobre implementación de cambios, resistencia del personal y liderazgo durante transiciones.',
    context: `La Unidad de Cuidados Intensivos (UCI) del Hospital Central está atravesando un período de cambios significativos. Estos cambios incluyen la implementación de nuevos protocolos clínicos, la adopción de tecnologías avanzadas, y una reestructuración del personal. Los desafíos únicos incluyen:

**1. Adaptación a Nuevas Tecnologías y Protocolos:** La UCI debe integrar rápidamente nuevas tecnologías y actualizar sus protocolos para mejorar la atención al paciente.

**2. Gestión del Cambio y Resistencia del Personal:** El personal de la UCI puede experimentar incertidumbre y resistencia ante los cambios, lo que requiere una gestión efectiva del cambio.

**3. Mantener la Calidad del Cuidado Durante la Transición:** Asegurar que los cambios no afecten negativamente la calidad del cuidado que se brinda a los pacientes críticos.

**4. Comunicación y Moral:** Mantener una comunicación clara y abierta con el equipo sobre los cambios y sus razones, sin que esto afecte la moral y cohesión del equipo.`,
    characters: [
      { name: 'Laura Martínez', role: 'Jefa de Enfermeras', description: 'Con años de experiencia en la UCI, debe liderar a su equipo a través de este período de cambio, equilibrando la innovación con el bienestar de su equipo.', emoji: '👩‍⚕️' },
      { name: 'Equipo de Enfermería', role: 'Personal de UCI', description: 'Enfrentando nuevos protocolos y tecnologías, deben adaptarse rápidamente mientras continúan proporcionando atención de alta calidad.', emoji: '👥' },
      { name: 'Personal Administrativo', role: 'Apoyo Institucional', description: 'Deben colaborar con Laura para asegurar que los cambios se implementen de manera eficiente y efectiva.', emoji: '📋' }
    ],
    situation: `Laura y su equipo se enfrentan a una semana crítica con la implementación de un nuevo sistema electrónico de registros y la introducción de un nuevo protocolo de atención al paciente. Debe asegurar que la transición sea fluida, sin comprometer la atención al paciente. ¿Cómo puede Laura liderar eficazmente durante este período de cambio, gestionar la resistencia del personal y mantener la calidad del cuidado?`
  },
  {
    id: 'marketing-sanitario',
    title: 'Campaña de Marketing Sanitario: Alimentación Saludable y Vida Activa',
    category: 'Marketing Sanitario',
    difficulty: 'Intermedio',
    duration: '25-35 min',
    icon: '📢',
    color: 'from-green-500 to-lime-500',
    description: 'Un caso sobre diseño e implementación de campañas de promoción de la salud en la comunidad.',
    context: `El Centro de Salud Comunitario necesita desarrollar una campaña de marketing sanitario enfocada en la promoción de alimentación saludable y vida activa. La comunidad presenta altas tasas de obesidad, diabetes tipo 2 y enfermedades cardiovasculares relacionadas con el sedentarismo y la mala alimentación. Los desafíos incluyen:

**1. Análisis de la Situación:** La comunidad tiene acceso limitado a información sobre nutrición y actividad física. Los hábitos alimentarios poco saludables están arraigados culturalmente.

**2. Público Objetivo Diverso:** La campaña debe llegar a diferentes grupos: familias con niños, jóvenes, adultos trabajadores y adultos mayores, cada uno con necesidades y canales de comunicación diferentes.

**3. Recursos Limitados:** El presupuesto es ajustado y se debe maximizar el impacto con recursos limitados, priorizando estrategias de bajo costo y alto alcance.

**4. Medición de Resultados:** Se necesitan métodos claros para evaluar el impacto de la campaña en los hábitos de salud de la comunidad.`,
    characters: [
      { name: 'Carmen Delgado', role: 'Coordinadora de Promoción de Salud', description: 'Lidera el diseño de la campaña. Debe equilibrar creatividad con evidencia científica y restricciones presupuestarias.', emoji: '👩‍⚕️' },
      { name: 'Roberto Vega', role: 'Gestor Enfermero de Atención Primaria', description: 'Aporta conocimiento sobre las necesidades de salud de la comunidad y los recursos disponibles en el centro de salud.', emoji: '👨‍⚕️' },
      { name: 'Elena Navarro', role: 'Especialista en Comunicación', description: 'Experta en redes sociales y medios de comunicación, ayuda a definir los canales y mensajes más efectivos.', emoji: '👩‍💼' },
      { name: 'Comunidad Local', role: 'Público Objetivo', description: 'Familias, jóvenes, adultos y mayores que deben ser alcanzados con mensajes personalizados y relevantes.', emoji: '👥' }
    ],
    situation: `El equipo debe diseñar una campaña integral de marketing sanitario en dos semanas. Deben definir: título creativo, objetivos claros, mensaje clave, estrategias y tácticas (redes sociales, eventos comunitarios), cronograma, presupuesto, materiales promocionales y métodos de evaluación. La campaña debe ser culturalmente sensible, basada en evidencia y capaz de generar cambios reales en los hábitos de alimentación y actividad física de la comunidad.`
  },
  {
    id: 'innovacion-enfermeria',
    title: 'Innovación en Enfermería: Transformación Digital del Cuidado',
    category: 'Innovación en Gestión Sanitaria',
    difficulty: 'Avanzado',
    duration: '25-35 min',
    icon: '💡',
    color: 'from-yellow-500 to-amber-500',
    description: 'Un caso sobre implementación de tecnologías digitales, optimización de procesos y gestión del cambio innovador.',
    context: `En un hospital referente en cuidados intensivos, el departamento de enfermería enfrenta retos significativos en la implementación de un nuevo modelo de atención que integra tecnologías digitales y métodos avanzados de cuidado al paciente. El cambio se centra en mejorar la eficacia del tratamiento y la eficiencia en la gestión de los recursos. Los desafíos únicos incluyen:

**1. Integración de Tecnología Avanzada:** Implementar y adaptar nuevas tecnologías digitales en la rutina de enfermería para mejorar el seguimiento y la atención al paciente, incluyendo monitorización en tiempo real.

**2. Optimización de Procesos de Atención:** Desarrollar y aplicar métodos innovadores para mejorar la eficiencia y la calidad de la atención al paciente sin perder la atención personalizada.

**3. Formación y Adaptación del Personal:** Asegurar que el equipo de enfermería esté completamente capacitado y cómodo con los nuevos sistemas y procedimientos tecnológicos.

**4. Gestión del Cambio:** Manejar la resistencia al cambio, mantener la moral del equipo y fomentar una cultura de innovación y mejora continua en el entorno de trabajo.`,
    characters: [
      { name: 'Ana Martínez', role: 'Directora de Enfermería', description: 'Responsable de liderar el proceso de transformación. Debe equilibrar la innovación tecnológica con el cuidado humano y gestionar la capacitación del equipo.', emoji: '👩‍⚕️' },
      { name: 'Equipo de Enfermería', role: 'Personal Asistencial', description: 'Deben adaptarse a las nuevas tecnologías y métodos de atención, manteniendo la calidad del cuidado al paciente durante la transición.', emoji: '👥' },
      { name: 'Personal Técnico', role: 'Soporte Tecnológico', description: 'Asisten en la implementación y mantenimiento de las nuevas tecnologías, proporcionando soporte técnico y formación al equipo.', emoji: '💻' }
    ],
    situation: `El hospital está experimentando una semana de alta demanda de atención, coincidiendo con la implementación del nuevo sistema de gestión sanitaria y monitorización de pacientes en tiempo real. Este período crítico pone a prueba la capacidad del equipo para adaptarse rápidamente a las nuevas tecnologías, manteniendo un nivel excepcional de atención al paciente. Ana debe asegurar que la transición sea fluida y eficaz, minimizando el impacto en la atención mientras maximiza los beneficios de la innovación.`
  }
];

const directoraImage = '/src/assets/female-characters/female-character-8.png';

const CaseManagementModule = ({ onBack }) => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const contentRef = useRef(null);

  const playerAvatar = JSON.parse(localStorage.getItem('playerAvatar') || '{}');
  
  const getPlayerAvatarImage = () => {
    if (playerAvatar.characterPreset) {
      const gender = playerAvatar.gender === 'male' ? 'male' : 'female';
      return `/src/assets/${gender}-characters/${gender}-character-${playerAvatar.characterPreset}.png`;
    }
    return '/src/assets/female-characters/female-character-1.png';
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const generateNextQuestion = async (previousAnswers, questionNumber) => {
    setIsGeneratingQuestion(true);
    setError(null);
    try {
      const caseInfo = selectedCase;
      const answersContext = previousAnswers.map((a, i) => 
        `Pregunta ${i + 1}: ${a.question}\nRespuesta del estudiante: ${a.answer}`
      ).join('\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Genera la pregunta número ${questionNumber} de 10 para este caso de estudio.`,
          history: [],
          systemPrompt: `Eres un experto evaluador en gestión enfermera y ${caseInfo.category.toLowerCase()}. Usa siempre la terminología "gestor/gestora enfermero/a". NUNCA uses "médico", "doctor" ni "enfermero clínico".

CASO DE ESTUDIO: "${caseInfo.title}"

CONTEXTO:
${caseInfo.context}

PERSONAJES:
${caseInfo.characters.map(c => `- ${c.name} (${c.role}): ${c.description}`).join('\n')}

SITUACIÓN CRÍTICA:
${caseInfo.situation}

RESPUESTAS ANTERIORES DEL ESTUDIANTE:
${answersContext || 'Ninguna aún (esta es la primera pregunta)'}

INSTRUCCIONES:
1. Genera UNA pregunta reflexiva y desafiante sobre el caso
2. La pregunta debe evaluar competencias de ${caseInfo.category.toLowerCase()}, gestión de conflictos o comunicación
3. Adapta la dificultad según las respuestas anteriores del estudiante
4. Si las respuestas anteriores fueron superficiales, haz preguntas que profundicen más
5. Si fueron buenas, aumenta la complejidad
6. La pregunta ${questionNumber} debe cubrir un aspecto diferente a las anteriores

TEMAS A CUBRIR EN LAS 10 PREGUNTAS (adaptados al caso):
1. Identificación del problema principal
2. Análisis de las dinámicas del equipo
3. Estrategias de ${caseInfo.category.toLowerCase()}
4. Manejo de situaciones críticas
5. Apoyo a personal con diferentes niveles de experiencia
6. Priorización en crisis
7. Comunicación efectiva
8. Delegación de tareas y recursos
9. Gestión emocional del equipo
10. Plan de acción integral

Responde SOLO con la pregunta, sin numeración ni explicaciones adicionales. La pregunta debe ser directa y clara.`
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data.response;
    } catch (error) {
      console.error('Error generating question:', error);
      setError('Error al conectar con el servicio de IA. Por favor, intenta de nuevo.');
      return null;
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const startCase = async (caseData) => {
    setSelectedCase(caseData);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuestions([]);
    setShowResults(false);
    setEvaluation(null);
    setError(null);
    
    const firstQuestion = await generateNextQuestion([], 1);
    if (firstQuestion) {
      setQuestions([firstQuestion]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isLoading || isGeneratingQuestion) return;

    const newAnswer = {
      question: questions[currentQuestion],
      answer: currentAnswer.trim()
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQuestion < 9) {
      const nextQ = await generateNextQuestion(updatedAnswers, currentQuestion + 2);
      if (nextQ) {
        setQuestions(prev => [...prev, nextQ]);
        setCurrentQuestion(prev => prev + 1);
      }
      
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const retryQuestion = async () => {
    setError(null);
    const question = await generateNextQuestion(answers, currentQuestion + 1);
    if (question) {
      if (questions.length === currentQuestion) {
        setQuestions(prev => [...prev, question]);
      } else {
        setQuestions(prev => {
          const newQuestions = [...prev];
          newQuestions[currentQuestion] = question;
          return newQuestions;
        });
      }
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const caseInfo = selectedCase;
      const allAnswers = answers.map((a, i) => 
        `**Pregunta ${i + 1}:** ${a.question}\n**Respuesta:** ${a.answer}`
      ).join('\n\n---\n\n');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Evalúa las respuestas del estudiante y proporciona calificación y feedback.',
          history: [],
          systemPrompt: `Eres un experto evaluador en gestión enfermera y ${caseInfo.category.toLowerCase()}. Usa siempre la terminología "gestor/gestora enfermero/a". NUNCA uses "médico", "doctor" ni "enfermero clínico".

CASO EVALUADO: "${caseInfo.title}"

CONTEXTO DEL CASO:
${caseInfo.context}

SITUACIÓN CRÍTICA:
${caseInfo.situation}

RESPUESTAS DEL ESTUDIANTE A LAS 10 PREGUNTAS:
${allAnswers}

INSTRUCCIONES DE EVALUACIÓN:
Evalúa las respuestas del estudiante y proporciona:

1. **CALIFICACIÓN GLOBAL** (0-100 puntos):
   - Comprensión del caso: /25 puntos
   - Aplicación de ${caseInfo.category.toLowerCase()}: /25 puntos
   - Resolución de problemas: /25 puntos
   - Comunicación y trabajo en equipo: /25 puntos

2. **FORTALEZAS DEMOSTRADAS** (3-5 puntos fuertes)

3. **ÁREAS DE MEJORA** (3-5 aspectos a desarrollar)

4. **FEEDBACK DETALLADO**:
   - Análisis de las mejores respuestas
   - Sugerencias específicas para mejorar
   - Recursos recomendados para profundizar

5. **COMPETENCIAS EVALUADAS**:
   - ${caseInfo.category}: [Nivel: Básico/Intermedio/Avanzado]
   - Toma de decisiones: [Nivel]
   - Gestión de conflictos: [Nivel]
   - Comunicación: [Nivel]
   - Trabajo en equipo: [Nivel]

6. **CONCLUSIÓN Y RECOMENDACIONES**

Sé constructivo, específico y motivador en tu feedback. Usa terminología de gestión enfermera.`
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setEvaluation(data.response);
      setShowResults(true);
    } catch (error) {
      console.error('Error evaluating:', error);
      setError('Error al evaluar las respuestas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const completedCases = JSON.parse(localStorage.getItem('completedCases') || '[]');
  const totalXP = parseInt(localStorage.getItem('totalXP') || '0');

  if (!selectedCase) {
    const nextCase = AVAILABLE_CASES.find(c => !completedCases.includes(c.id)) || AVAILABLE_CASES[0];
    const progressPercent = Math.round((completedCases.length / AVAILABLE_CASES.length) * 100);
    const xpAvailable = (AVAILABLE_CASES.length - completedCases.length) * 150;
    
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${aiTrainingBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-indigo-950/60 to-slate-950/80" />
        
        <FloatingOrbs />
        <GlowingStars />
        
        <div className="relative z-10 h-full overflow-auto">
          <div className="min-h-full p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={onBack} 
                    className="p-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 hover:border-cyan-400/50 shadow-xl hover:shadow-cyan-500/30 hover:scale-105 group"
                  >
                    <Home className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" />
                  </button>
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
                          <Brain className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-purple-200">
                          Gestión de Casos
                        </h1>
                        <p className="text-cyan-300/80 text-sm md:text-base font-medium">
                          Entrena con casos reales de gestión enfermera
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl px-4 py-2 border border-amber-400/30 shadow-lg">
                    <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-bold text-sm">Racha: 3</span>
                  </div>
                  
                  <div className="relative group">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900">
                      <img 
                        src={getPlayerAvatarImage()} 
                        alt="Tu avatar" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <StatCard icon={Trophy} value={completedCases.length} label="Casos Completados" color="from-amber-500/30 to-orange-600/30" delay={0} />
                <StatCard icon={Zap} value={totalXP} label="XP Total" color="from-cyan-500/30 to-blue-600/30" delay={100} />
                <StatCard icon={Target} value={progressPercent} label="% Progreso" color="from-purple-500/30 to-pink-600/30" delay={200} />
                <StatCard icon={Gift} value={xpAvailable} label="XP Disponible" color="from-emerald-500/30 to-teal-600/30" delay={300} />
              </div>

              <div className="mb-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-bold">Tu Progreso</span>
                    </div>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      <AnimatedCounter value={progressPercent} suffix="%" />
                    </span>
                  </div>
                  <div className="h-4 bg-slate-900/80 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-emerald-400">{completedCases.length} completados</span>
                    <span className="text-slate-400">{AVAILABLE_CASES.length - completedCases.length} restantes</span>
                  </div>
                </div>
              </div>

              {!completedCases.includes(nextCase.id) && (
                <div 
                  className="mb-6 bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-red-500/20 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/40 shadow-2xl shadow-amber-500/10 cursor-pointer group hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
                  onClick={() => startCase(nextCase)}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-bl from-amber-400/30 to-transparent rounded-full blur-2xl" />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
                    <Crown className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-bold">RECOMENDADO</span>
                  </div>
                  
                  <div className="relative flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${nextCase.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {nextCase.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-amber-200/80 text-xs font-medium uppercase tracking-wider mb-1">Siguiente Caso</p>
                      <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-amber-100 transition-colors">{nextCase.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          {nextCase.duration}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-cyan-300 font-bold">
                          <Zap className="w-3.5 h-3.5" />
                          +150 XP
                        </span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Play className="w-7 h-7 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-white">Todos los Casos</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                  <span className="text-slate-400 text-sm">{AVAILABLE_CASES.length} disponibles</span>
                </div>

                <div className="grid gap-3">
                  {AVAILABLE_CASES.map((caseItem, index) => {
                    const isCompleted = completedCases.includes(caseItem.id);
                    const isRecommended = caseItem.id === nextCase.id && !isCompleted;
                    
                    return (
                      <div
                        key={caseItem.id}
                        className={`relative backdrop-blur-xl rounded-xl border transition-all duration-300 overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.005] animate-fadeInUp ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-emerald-900/40 to-slate-900/60 border-emerald-500/40 hover:border-emerald-400/60' 
                            : isRecommended
                            ? 'bg-gradient-to-r from-amber-900/30 to-slate-900/60 border-amber-500/40 hover:border-amber-400/60'
                            : 'bg-gradient-to-r from-slate-800/50 to-slate-900/60 border-white/10 hover:border-cyan-400/40'
                        }`}
                        onClick={() => startCase(caseItem)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className={`w-14 h-14 bg-gradient-to-br ${caseItem.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}>
                                {caseItem.icon}
                              </div>
                              {isCompleted && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border border-slate-900">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {isRecommended && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border border-slate-900 animate-pulse">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div className="absolute -bottom-0.5 -left-0.5 w-5 h-5 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-white border border-white/20">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                  isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                                }`}>
                                  {caseItem.category}
                                </span>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                  caseItem.difficulty === 'Avanzado' ? 'bg-red-500/20 text-red-300 border-red-400/30' : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                                }`}>
                                  {caseItem.difficulty}
                                </span>
                                {isCompleted && (
                                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-400/30 flex items-center gap-1">
                                    <Medal className="w-2.5 h-2.5" /> Completado
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-200 transition-colors">
                                {caseItem.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  {caseItem.duration}
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Users className="w-3 h-3 text-purple-400" />
                                  {caseItem.characters.length} personajes
                                </span>
                                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                                  <Zap className="w-3 h-3" />
                                  +150 XP
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                                  : 'bg-gradient-to-br from-cyan-500 to-blue-600 group-hover:shadow-cyan-500/40'
                              }`}>
                                {isCompleted ? (
                                  <Award className="w-5 h-5 text-white" />
                                ) : (
                                  <Play className="w-5 h-5 text-white ml-0.5" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">¿Cómo funciona?</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: '1️⃣', text: 'Selecciona un caso' },
                        { icon: '2️⃣', text: 'Lee contexto y personajes' },
                        { icon: '3️⃣', text: 'Responde 10 preguntas IA' },
                        { icon: '4️⃣', text: 'Recibe feedback' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <span>{step.icon}</span>
                          <span>{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-xl rounded-xl p-5 border border-purple-500/20 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-bold text-white">Estadísticas</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                        <p className="text-slate-400 text-[10px]">Precisión</p>
                        <p className="text-lg font-black text-emerald-400">85%</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                        <p className="text-slate-400 text-[10px]">Mejor Racha</p>
                        <p className="text-lg font-black text-amber-400">5 🔥</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                        <p className="text-slate-400 text-[10px]">Nivel</p>
                        <p className="text-lg font-black text-purple-400">Pro</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                        <p className="text-slate-400 text-[10px]">Tiempo Medio</p>
                        <p className="text-lg font-black text-cyan-400">25m</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && evaluation) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${aiTrainingBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-slate-900/80 to-slate-950/90" />
        
        <div className="relative z-10 h-full overflow-auto">
          <div className="min-h-full p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-6 mb-10">
                <button 
                  onClick={() => {
                    setSelectedCase(null);
                    setShowResults(false);
                    setEvaluation(null);
                  }} 
                  className="p-4 bg-slate-800/90 hover:bg-slate-700 rounded-2xl transition-all border-2 border-slate-600 hover:border-emerald-500 shadow-xl"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white">Evaluación Completada</h1>
                    <p className="text-emerald-300 text-lg mt-1">{selectedCase.title}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border-2 border-emerald-500/50 p-8 shadow-2xl">
                <div 
                  className="text-slate-100 leading-relaxed text-lg prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatText(evaluation) }}
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    setShowResults(false);
                    setEvaluation(null);
                  }}
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-cyan-500/40 transform hover:scale-105"
                >
                  Volver a Casos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${aiTrainingBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/50 to-slate-950/90" />
      
      <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-b-2 border-cyan-500/40 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedCase(null)} 
            className="p-3 hover:bg-slate-700 rounded-xl transition-colors border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{selectedCase.category}</h1>
            <p className="text-sm text-cyan-300 font-medium">Pregunta {Math.min(currentQuestion + 1, 10)} de 10</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all shadow-lg ${
                i < answers.length
                  ? 'bg-emerald-500 shadow-emerald-500/50'
                  : i === currentQuestion
                  ? 'bg-cyan-500 animate-pulse shadow-cyan-500/50'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {currentQuestion === 0 && answers.length === 0 && (
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl border-2 border-cyan-500/40 p-8 mb-8 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                {selectedCase.icon} {selectedCase.title}
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-cyan-400 font-black mb-4 flex items-center gap-2">
                    📋 Contexto del Caso
                  </h3>
                  <div 
                    className="text-slate-200 text-lg leading-relaxed bg-slate-700/50 rounded-xl p-6"
                    dangerouslySetInnerHTML={{ __html: formatText(selectedCase.context) }}
                  />
                </div>

                <div>
                  <h3 className="text-xl text-cyan-400 font-black mb-4 flex items-center gap-2">
                    👥 Personajes Principales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCase.characters.map((char, i) => (
                      <div key={i} className="bg-slate-700/70 rounded-xl p-5 border border-slate-600">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{char.emoji}</span>
                          <div>
                            <p className="text-white font-black text-lg">{char.name}</p>
                            <p className="text-cyan-300 text-sm font-medium">{char.role}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{char.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl text-amber-400 font-black mb-4 flex items-center gap-2">
                    ⚠️ Situación Crítica
                  </h3>
                  <p className="text-slate-200 text-lg leading-relaxed bg-amber-500/10 rounded-xl p-6 border border-amber-500/30">
                    {selectedCase.situation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {answers.map((item, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-cyan-500/50 bg-slate-800">
                  <img 
                    src={directoraImage} 
                    alt="Directora" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 bg-slate-800/95 border-2 border-slate-600 rounded-2xl px-6 py-4">
                  <p className="text-xs text-cyan-400 font-black mb-2">PREGUNTA {idx + 1}</p>
                  <p className="text-white text-lg">{item.question}</p>
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <div className="max-w-[80%] bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl px-6 py-4 shadow-lg">
                  <p className="text-white text-lg">{item.answer}</p>
                </div>
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-cyan-500/50 bg-slate-800">
                  <img 
                    src={getPlayerAvatarImage()} 
                    alt="Tu avatar" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          ))}

          {questions[currentQuestion] && answers.length === currentQuestion && (
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-cyan-500/50 bg-slate-800">
                <img 
                  src={directoraImage} 
                  alt="Directora" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 bg-slate-800/95 border-2 border-cyan-500/50 rounded-2xl px-6 py-4 shadow-lg">
                <p className="text-xs text-cyan-400 font-black mb-2">PREGUNTA {currentQuestion + 1}</p>
                <p className="text-white text-lg">{questions[currentQuestion]}</p>
              </div>
            </div>
          )}

          {isGeneratingQuestion && (
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-cyan-500/50 bg-slate-800 animate-pulse">
                <img 
                  src={directoraImage} 
                  alt="Directora" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-slate-800/95 border-2 border-slate-600 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3 text-cyan-300">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-base font-medium">Generando siguiente pregunta...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-2xl p-6 text-center">
              <p className="text-red-300 text-lg mb-4">{error}</p>
              <button
                onClick={retryQuestion}
                className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-all"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-t-2 border-cyan-500/40 p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          {answers.length < 10 ? (
            <div className="flex gap-4">
              <input
                ref={inputRef}
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-slate-800/90 border-2 border-slate-600 focus:border-cyan-500 rounded-xl px-6 py-4 text-white text-lg placeholder-slate-400 focus:outline-none transition-colors"
                disabled={isGeneratingQuestion || !questions[currentQuestion]}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim() || isGeneratingQuestion || !questions[currentQuestion]}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white py-5 rounded-xl font-black text-xl transition-all shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Evaluando tus respuestas...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Enviar y Obtener Calificación
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseManagementModule;
