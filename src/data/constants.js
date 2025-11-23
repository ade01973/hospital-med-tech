import { Activity, BookOpen, User, Users, Brain, Stethoscope, MessageSquare, Zap, Target, Clock, BarChart3, Lightbulb, Shield, TrendingUp, Heart, ShieldCheck } from 'lucide-react';

export const NURSING_RANKS = [
  { title: "Estudiante", minScore: 0, color: "from-slate-500 to-slate-600", icon: "🎓" },
  { title: "Enfermera", minScore: 500, color: "from-emerald-500 to-teal-600", icon: "💉" },
  { title: "Referente", minScore: 1500, color: "from-cyan-500 to-blue-600", icon: "🌟" },
  { title: "Supervisora", minScore: 2500, color: "from-blue-600 to-indigo-600", icon: "📋" },
  { title: "Adjunta", minScore: 4000, color: "from-indigo-600 to-purple-600", icon: "📊" },
  { title: "Directora", minScore: 6000, color: "from-purple-600 to-fuchsia-600", icon: "👑" },
  { title: "Gerente", minScore: 8000, color: "from-fuchsia-600 to-rose-600", icon: "🏥" },
  { title: "Líder Global", minScore: 10000, color: "from-amber-400 to-orange-600", icon: "🌍" }
];

export const TOPICS = [
  {
    id: 1,
    title: "La Gestora Enfermera",
    subtitle: "Niveles de gestión y competencias",
    icon: Stethoscope,
    questions: [
      { q: "Según el paradigma moderno presentado, ¿cuál es la principal diferencia en el rol de la gestora enfermera respecto al enfoque histórico?", options: ["Ha aumentado su poder autoritario", "Ha evolucionado de 'controlar y mandar' a 'liderar y desarrollar'", "Ha disminuido su responsabilidad", "Es exactamente igual que antes"], correct: 1 },
      { q: "¿Cuál de los siguientes NO es un nivel de gestión en enfermería según la estructura organizativa mencionada?", options: ["Gestión Operativa", "Gestión Logística o Intermedia", "Alta Dirección", "Gestión Ejecutiva Global"], correct: 3 },
      { q: "La Gestión Operativa en enfermería se caracteriza principalmente por:", options: ["Formular estrategias institucionales", "Liderar la atención directa al paciente junto a la cama", "Coordinar entre departamentos", "Establecer políticas sanitarias"], correct: 1 },
      { q: "¿Qué responsabilidad específica tiene la Gestión Intermedia (Logística) en relación a la Alta Dirección?", options: ["Reemplazar sus decisiones", "Traducir y transmitir las estrategias hacia los niveles operativos", "Hacer lo opuesto", "No tiene relación directa"], correct: 1 },
      { q: "Según el documento, ¿cuál es el aspecto MÁS crítico que diferencia a la gestora enfermera moderna de un simple administrador?", options: ["La antigüedad en el puesto", "La capacidad de inspirar, colaborar y empoderar a través del liderazgo transformacional", "El número de tareas que realiza", "La capacidad de controlar costos"], correct: 1 },
      { q: "¿Cuál es el propósito principal de que la gestora enfermera cree 'ambientes de trabajo seguros y saludables'?", options: ["Aumentar el número de empleados", "Promover el trabajo en equipo y mejorar la calidad asistencial", "Reducir costos operativos", "Cumplir normativa laboral"], correct: 1 },
      { q: "La evaluación continua de los servicios prestados por la gestora enfermera está orientada principalmente a:", options: ["Garantizar que la atención se alinee con estándares de excelencia", "Castigar errores", "Documentar fallos", "Justificar presupuestos"], correct: 0 },
      { q: "¿Qué aspecto hace que la gestión en enfermería 'trascienda la mera administración de recursos'?", options: ["El tamaño del presupuesto", "La cantidad de personal disponible", "La capacidad de influir, motivar y promover excelencia mediante liderazgo ético", "El uso de tecnología avanzada"], correct: 2 },
      { q: "Según González García (2019), ¿cuáles son los pilares fundamentales sobre los que descansa el rol de la gestora enfermera?", options: ["Únicamente tareas operativas", "Planificación, organización de servicios, ambientes seguros, participación y evaluación", "Solo planificación estratégica", "Autoridad y control únicamente"], correct: 1 },
      { q: "¿Por qué se describe la gestión enfermera como un 'acto de equilibrio delicado y dinámico'?", options: ["Porque requiere conocimiento, habilidad, pasión, empatía y compromiso con valores fundamentales", "Porque es impredecible", "Porque es muy fácil", "Porque no tiene estabilidad"], correct: 0 }
    ]
  },
  {
    id: 2,
    title: "Liderazgo",
    subtitle: "Estilos de liderazgo",
    icon: User,
    questions: [
      { q: "Según las teorías de rasgos de liderazgo, ¿cuál es la premisa fundamental sobre cómo se adquiere el liderazgo?", options: ["El liderazgo es una habilidad aprendida exclusivamente", "Los líderes nacen con ciertos atributos innatos que predisponen al liderazgo", "El liderazgo depende únicamente del contexto", "Todos nacen con los mismos rasgos de liderazgo"], correct: 1 },
      { q: "¿Cuál es la diferencia fundamental entre liderazgo centrado en tareas y liderazgo orientado a relaciones?", options: ["El primero enfatiza la realización de objetivos; el segundo enfatiza el bienestar del equipo", "No hay diferencia real", "El primero es más efectivo siempre", "El segundo es más rápido en resultados"], correct: 0 },
      { q: "En el contexto de la enfermería, un liderazgo demasiado centrado en tareas puede resultar en:", options: ["Mayor satisfacción laboral", "Ambiente de trabajo más personal", "Disminución de satisfacción laboral y ambiente impersonal si no se atienden necesidades emocionales", "Mejor retención de personal"], correct: 2 },
      { q: "¿Cuál es el principio fundamental de las teorías situacionales o de contingencia?", options: ["Las situaciones nunca afectan el resultado", "El éxito del liderazgo depende de factores situacionales y requiere flexibilidad adaptativa", "El liderazgo es independiente del contexto", "Existe un único estilo de liderazgo efectivo para todas las situaciones"], correct: 1 },
      { q: "¿Cuál es la diferencia crítica entre liderazgo transformacional y transaccional?", options: ["Transformacional inspira cambio y excepcionalidad; transaccional usa recompensas/castigos por tareas", "No hay diferencia significativa", "Transaccional es más efectivo en enfermería", "Transformacional solo usa castigos"], correct: 0 },
      { q: "¿Cuándo es ESPECIALMENTE apropiado aplicar un liderazgo autocrático en enfermería?", options: ["Solo en reuniones administrativas", "En emergencias que requieren decisiones rápidas y precisas", "Nunca es apropiado", "En la mayoría de situaciones"], correct: 1 },
      { q: "¿Cuál es el riesgo principal de un liderazgo democrático si se aplica inadecuadamente en enfermería?", options: ["Puede comprometer la efectividad en situaciones que requieren decisiones rápidas", "Es demasiado eficiente", "Mejora siempre la retención", "Reduce la comunicación"], correct: 0 },
      { q: "El liderazgo Laissez-Faire es más efectivo cuando los miembros del equipo son:", options: ["Desinteresados en el trabajo", "Altamente experimentados, motivados y capaces de autogestión", "Nuevos en la organización", "Inexpertos y necesitan supervisión"], correct: 1 },
      { q: "Según el documento, ¿cuál es la relación entre la definición de liderazgo en enfermería y la función de influencia?", options: ["La influencia y el liderazgo son términos sinónimos sin matices", "El liderazgo es el proceso de influir en otros para alcanzar un objetivo común en cuidados", "La influencia es lo opuesto al liderazgo", "El liderazgo NO implica influencia"], correct: 1 },
      { q: "¿Cuál es la conclusión clave sobre la aplicación de estilos de liderazgo en la práctica moderna de enfermería?", options: ["La mayoría de líderes encuentran equilibrio entre estilos, ajustándose a las necesidades del equipo y contexto", "Usar un solo estilo siempre", "Los estilos nunca se deben mezclar", "No importa qué estilo se use"], correct: 0 }
    ]
  },
  {
    id: 3,
    title: "Competencias Digitales",
    subtitle: "IA y escenarios futuros",
    icon: Lightbulb,
    questions: [
      { q: "¿Cuál es la definición más precisa de competencias digitales en enfermería según el contexto académico?", options: ["Solo la capacidad de usar email y programas básicos", "Conjunto de habilidades para utilizar efectivamente TIC incluyendo datos electrónicos, telemedicina, seguridad y herramientas de IA", "La capacidad exclusiva de programar sistemas de salud", "El conocimiento de las redes sociales"], correct: 1 },
      { q: "¿Cuál es la distinción fundamental entre IA débil (estrecha) y IA fuerte (general)?", options: ["No hay diferencia real entre ambas", "IA débil realiza tareas específicas; IA fuerte posee capacidades cognitivas similares a humanos", "La IA débil es más costosa que la fuerte", "La IA fuerte solo se usa en laboratorios"], correct: 1 },
      { q: "En el contexto de diagnóstico asistido por IA en enfermería, ¿cuál es el principal beneficio de los algoritmos de IA en imágenes médicas?", options: ["Aumentar el tiempo de consulta", "Detectar patrones no evidentes al ojo humano para diagnósticos más rápidos y precisos", "Reducir únicamente costos operativos", "Reemplazar completamente al profesional sanitario"], correct: 1 },
      { q: "¿Cuál es el propósito principal de la gestión de grandes volúmenes de datos de salud mediante IA?", options: ["Analizar datos para extraer información que guíe el cuidado, identificar tendencias y predecir resultados", "Almacenar información sin procesar", "Solo crear copias de seguridad", "Difundir información del paciente"], correct: 0 },
      { q: "¿Cuál es la diferencia crítica entre Sistemas EHR y plataformas de telemedicina en términos de competencias digitales requeridas?", options: ["La telemedicina es obsoleta", "EHR gestiona registros electrónicos; telemedicina facilita consultas virtuales y monitoreo remoto", "Ambos solo sirven para almacenar datos", "Son exactamente lo mismo"], correct: 1 },
      { q: "Según el documento, ¿cuáles son los principios éticos fundamentales que las enfermeras deben comprender al usar sistemas de IA?", options: ["Autonomía del paciente, beneficencia, no maleficencia y justicia", "Solo la eficiencia económica", "Únicamente la velocidad de procesamiento", "La ganancia institucional"], correct: 0 },
      { q: "¿Cuál es la responsabilidad principal de las enfermeras en equipos multidisciplinares de desarrollo de IA?", options: ["Programar algoritmos", "Aportar experiencia clínica, perspectiva del paciente, y guiar desarrollo de herramientas clínicamente relevantes y centradas en el paciente", "Solo ejecutar órdenes técnicas", "Reemplazar a ingenieros"], correct: 1 },
      { q: "¿Cuáles son las barreras técnicas más significativas para la adopción de IA en salud mencionadas en el documento?", options: ["Los hospitales no quieren cambiar", "Falta de interoperabilidad entre sistemas y necesidad de infraestructuras robustas de datos", "La resistencia de los pacientes", "Falta de dinero solamente"], correct: 1 },
      { q: "¿Cuál es el rol crítico de las enfermeras en la fase de evaluación de herramientas de IA según el documento?", options: ["Probar en entornos reales, evaluar usabilidad/eficacia/seguridad, monitorear resultados y sugerir mejoras basadas en retroalimentación", "No participan en evaluación", "Solo observar desde lejos", "Reportar problemas técnicos al departamento IT"], correct: 0 },
      { q: "¿Cuál es la conclusión principal sobre el futuro de la enfermería en la era digital según el documento?", options: ["Las enfermeras deben ser líderes en transformación digital, integrando tecnología con cuidado humano centrado en el paciente", "La tecnología reemplazará a las enfermeras", "La enfermería permanecerá sin cambios", "Solo los ingenieros importan en salud digital"], correct: 0 }
    ]
  },
  {
    id: 4,
    title: "Gestión de la Comunicación",
    subtitle: "Efectiva y asertiva",
    icon: MessageSquare,
    questions: [
      { q: "Según el documento, ¿cuál es el propósito fundamental de la comunicación en el contexto sanitario?", options: ["Facilitar la toma de decisiones, el tratamiento y el cuidado de los pacientes", "Aumentar la duración de las consultas", "Realizar más burocracia", "Reducir el tiempo de atención"], correct: 0 },
      { q: "¿Cuál de los siguientes NO es un elemento básico del proceso de comunicación efectiva?", options: ["La retroalimentación (feedback) que completa el ciclo comunicativo", "La motivación personal del emisor", "La decodificación del mensaje por parte del receptor", "El canal por el cual se envía el mensaje"], correct: 1 },
      { q: "En la comunicación efectiva de la gestión enfermera, ¿cuáles son los tres pilares fundamentales?", options: ["Rapidez, cantidad y eficiencia", "Escucha activa, empatía y claridad", "Autoridad, control y supervisión", "Tecnología, automatización y estadísticas"], correct: 1 },
      { q: "¿Cuál es la diferencia fundamental entre comunicación horizontal y vertical en equipos sanitarios?", options: ["La horizontal ocurre entre niveles jerárquicos diferentes; la vertical entre colegas del mismo nivel", "La vertical facilita innovación y creatividad; la horizontal transmite órdenes", "La horizontal es entre profesionales del mismo nivel; la vertical entre diferentes niveles jerárquicos", "No existe diferencia real entre ambas formas"], correct: 2 },
      { q: "Según el documento, ¿cuál es el rol diferenciador de los líderes informales respecto a los formales?", options: ["Los formales ocupan jerarquía y delegan tareas; los informales influyen sin puesto oficial basándose en experiencia", "Los informales tienen más poder de decisión", "No existe diferencia funcional real", "Los líderes informales solo trabajan con pacientes"], correct: 0 },
      { q: "En el desarrollo de un plan de comunicación efectivo, ¿cuál es el segundo paso fundamental después de definir objetivos?", options: ["Implementar inmediatamente el plan", "Identificar la audiencia definiendo sus necesidades y expectativas", "Evaluar los resultados", "Capacitar al personal"], correct: 1 },
      { q: "¿Cuál es el propósito principal de implementar la inteligencia artificial (IA) en la comunicación sanitaria según el documento?", options: ["Reemplazar completamente a los enfermeros", "Identificar errores en la comunicación y sugerir mejoras, junto con análisis de datos para toma de decisiones", "Reducir costos únicamente", "Solo para traducción de idiomas"], correct: 1 },
      { q: "¿Cómo se define la realidad aumentada (RA) en el contexto de formación de enfermería?", options: ["Una herramienta virtual para diagnósticos finales", "Herramienta invaluable para formación con simulaciones realistas que mejoran comprensión y habilidades clínicas", "Un dispositivo que reemplaza la práctica clínica", "Solo un entretenimiento educativo"], correct: 2 },
      { q: "Según el documento, ¿cuáles son los desafíos clave que presentan las nuevas tecnologías en comunicación sanitaria?", options: ["Ninguno, las nuevas tecnologías resuelven todos los problemas", "Rápida evolución requiere actualización constante, integración en procesos y formación continua", "Solo la resistencia de los pacientes", "La tecnología es fácil de implementar sin capacitación"], correct: 2 },
      { q: "¿Cuál es la conclusión principal sobre la comunicación efectiva en la gestión de enfermería según el documento?", options: ["No tiene importancia en la gestión moderna", "Es un pilar fundamental que mejora calidad asistencial, seguridad del paciente y crea ambiente laboral colaborativo", "Solo es importante para administrativos", "La tecnología reemplaza la necesidad de comunicación humana"], correct: 1 }
    ]
  },
  {
    id: 5,
    title: "El Clima Laboral",
    subtitle: "Ambiente y satisfacción",
    icon: Zap,
    questions: [
      { q: "Según los estudios mencionados en el documento, ¿cuál fue el hallazgo principal de la AHRQ sobre la relación entre clima laboral positivo y resultados sanitarios?", options: ["Los hospitales con clima positivo tenían menores tasas de mortalidad, readmisión y complicaciones", "No existe relación comprobada entre clima y resultados", "El clima laboral solo afecta la productividad", "Los pacientes no notan diferencia en el ambiente"], correct: 0 },
      { q: "¿Cuál es la diferencia fundamental entre motivación intrínseca y extrínseca en el contexto del clima laboral de enfermería?", options: ["La intrínseca proviene del propio trabajo; la extrínseca de factores externos como salario y recompensas", "Son exactamente lo mismo", "La intrínseca es menos importante", "No aplica en sanidad"], correct: 1 },
      { q: "Según el documento, ¿cuáles son los tres pilares del liderazgo positivo que impactan directamente el clima laboral?", options: ["Poder, autoridad y control exclusivamente", "Comunicación clara, confianza y apoyo al personal", "Solo supervisión y evaluación", "Tecnología y procesos administrativos"], correct: 2 },
      { q: "¿Cuál es la razón específica por la que una carga de trabajo excesiva es perjudicial para el clima laboral en enfermería?", options: ["Porque reduce el tiempo de descanso", "Porque genera estrés y burnout en los profesionales, afectando el bienestar físico y mental", "Por el costo operativo", "Porque aumenta el número de reuniones"], correct: 3 },
      { q: "Según el modelo presentado, ¿cuál es la diferencia crítica entre los factores que influyen en satisfacción laboral?", options: ["El contenido del trabajo es más importante que las oportunidades de desarrollo", "El contenido, las condiciones y las oportunidades de desarrollo son factores interconectados que influyen en la satisfacción", "Solo el salario importa", "Las relaciones personales no tienen relevancia"], correct: 0 },
      { q: "¿Cuál es el propósito específico de las 'rondas regulares' mencionadas como ejemplo de liderazgo positivo sanitario?", options: ["Inspeccionar el trabajo del personal", "Hablar con el personal y conocer sus necesidades, mostrando interés genuino", "Verificar cumplimiento de horarios", "Recopilar información para evaluaciones negativas"], correct: 1 },
      { q: "En el contexto del documento, ¿cómo se define específicamente la 'cultura de seguridad' como componente del clima laboral?", options: ["Un protocolo escrito para prevenir errores", "La cultura en la que se reconocen y se toman medidas para prevenir los errores de los profesionales sanitarios", "Una auditoría externa de calidad", "Un departamento de control de calidad"], correct: 2 },
      { q: "¿Cuál es la interconexión fundamental entre el compromiso del personal y la calidad del cuidado al paciente según el documento?", options: ["No existe relación comprobada", "El personal comprometido es más productivo, tiene menos absentismo y proporciona mejor atención con mayor seguridad", "Solo afecta estadísticas administrativas", "Es relevante solo para hospitales privados"], correct: 3 },
      { q: "Según el documento, ¿cuáles son las particularidades específicas del clima laboral en el contexto sanitario que lo diferencian de otros sectores?", options: ["No hay diferencias con otros sectores", "Alta intensidad, necesidad de trabajo en equipo, exposición a estrés, contacto con dolor y sufrimiento", "Solo la falta de recursos", "Mayor flexibilidad de horarios"], correct: 0 },
      { q: "¿Cuál es el rol específico de la autonomía y responsabilidad en la motivación intrínseca del personal de enfermería según las estrategias presentadas?", options: ["Disminuye la motivación porque genera incertidumbre", "Aumenta el sentido de competencia y autonomía, lo que incrementa la motivación intrínseca y el enganche", "Solo es importante para cargos directivos", "Reduce la calidad del trabajo"], correct: 1 }
    ]
  },
  {
    id: 6,
    title: "La Gestión del Conflicto",
    subtitle: "Negociación y mediación",
    icon: Activity,
    questions: [
      { q: "Según la definición presentada en el documento, ¿cuál es el elemento fundamental de cualquier conflicto?", options: ["La presencia de agresión física", "La percepción de incompatibilidad entre objetivos, intereses o valores", "La falta de dinero", "La ausencia de comunicación escrita"], correct: 0 },
      { q: "¿Cuál de los siguientes NO es un tipo de conflicto clasificado en el ámbito sanitario según el documento?", options: ["Conflicto interpersonal", "Conflicto intrapersonal", "Conflicto organizacional", "Conflicto meteorológico"], correct: 1 },
      { q: "Según el documento, ¿cuál es identificada como la causa MÁS común de conflicto en el ámbito de la enfermería?", options: ["La competencia por recursos limitados", "La falta de comunicación", "Las diferencias de horarios", "El exceso de personal disponible"], correct: 2 },
      { q: "¿Cuáles son las CINCO fases del conflicto descritas en el documento en su orden correcto?", options: ["Resolución, crisis, escalada, percepción, desescalada", "Percepción, escalada, crisis, desescalada y resolución", "Escalada, percepción, desescalada, crisis, resolución", "Crisis, resolución, percepción, escalada, desescalada"], correct: 3 },
      { q: "Según el documento, ¿cuál es la característica DEFINITORIA del estilo colaborativo de resolución de conflictos?", options: ["Busca ganar a toda costa sin importar la relación", "Evita el conflicto sin enfrentar a la otra parte", "Busca encontrar una solución que satisfaga a todas las partes siendo asertivo y cooperativo", "Cede ante todas las demandas de la otra parte"], correct: 0 },
      { q: "¿Cuál es la diferencia crítica entre mediación y arbitraje como técnicas de resolución de conflictos según el documento?", options: ["El mediador toma decisiones vinculantes; el árbitro solo facilita la comunicación", "El arbitraje es más lento que la mediación", "El mediador facilita comunicación sin decidir; el árbitro toma decisión vinculante tras analizar la información", "Ambas técnicas son exactamente iguales"], correct: 1 },
      { q: "Según el documento, ¿cuál es la razón específica por la que los conflictos no resueltos son especialmente preocupantes en enfermería?", options: ["Aumentan los costos administrativos", "Pueden comprometer la seguridad y el cuidado del paciente, siendo lo más importante", "Crean conflictos con los familiares", "Disminuyen el número de horas trabajadas"], correct: 2 },
      { q: "¿Cuáles son las habilidades fundamentales que una enfermera DEBE desarrollar para gestionar eficazmente conflictos según el documento?", options: ["Autoridad absoluta y capacidad de sanción", "Autoconocimiento, empatía, comunicación efectiva, escucha activa y asertividad", "Solo experiencia en el puesto", "Capacidad de imponer decisiones"], correct: 3 },
      { q: "Según el documento, ¿cuál es el factor principal que afecta la percepción del conflicto en su primera fase?", options: ["El salario del personal", "Las experiencias pasadas, expectativas y emociones", "El horario de trabajo", "El tamaño del hospital"], correct: 0 },
      { q: "¿Cuál es la implicación más grave de que un conflicto escale hacia la fase de crisis según las consecuencias descritas?", options: ["Disminuye la comunicación formal", "El conflicto se vuelve más intenso y difícil de controlar, pudiendo generar agresión física, sabotaje o abandono", "Se requiere más dinero en el presupuesto", "Los pacientes se quejan más de lo usual"], correct: 1 }
    ]
  },
  {
    id: 7,
    title: "La Motivación en Gestión",
    subtitle: "Teorías y aplicación",
    icon: TrendingUp,
    questions: [
      { q: "Según la definición presentada en el documento, ¿cuál es la esencia fundamental de la motivación?", options: ["La fuerza interna que impulsa a las personas a actuar y persistir para alcanzar un objetivo", "La capacidad de trabajar más horas", "El dinero que recibe una persona", "La obediencia a la autoridad"], correct: 0 },
      { q: "¿Cuál es la correcta secuencia jerárquica de las cinco necesidades según Maslow aplicada a enfermería?", options: ["Fisiológicas, seguridad, afiliación, estima, autorrealización", "Autorrealización, estima, afiliación, seguridad, fisiológicas", "Seguridad, fisiológicas, afiliación, estima, autorrealización", "Estima, autorrealización, fisiológicas, seguridad, afiliación"], correct: 0 },
      { q: "¿Cuál es la distinción crítica entre factores de higiene y factores motivacionales según la teoría de Herzberg?", options: ["Los factores de higiene previenen insatisfacción; los motivacionales generan satisfacción activa", "Los factores de higiene generan satisfacción; los motivacionales previenen insatisfacción", "No hay diferencia entre ambos tipos", "Los factores motivacionales son menos importantes que los de higiene"], correct: 0 },
      { q: "Según la Teoría X de McGregor, ¿cuál es la premisa fundamental sobre la naturaleza del trabajador?", options: ["Las personas son responsables y buscan la autorrealización", "Las personas son perezosas y evitan el trabajo, requiriendo supervisión y control", "Las personas son indiferentes al trabajo", "Las personas trabajan solo por dinero"], correct: 1 },
      { q: "¿Cuál es la diferencia crítica entre factores intrínsecos y extrínsecos en la motivación de enfermería?", options: ["Los intrínsecos provienen de autorrealización personal; los extrínsecos de condiciones externas como salario", "Los extrínsecos son más importantes que los intrínsecos", "Ambos son exactamente iguales", "Los intrínsecos dependen del salario"], correct: 0 },
      { q: "Según el documento, ¿cuáles son los TRES estilos de liderazgo más efectivos para lograr motivación en equipos de enfermería?", options: ["Autoritario, autocrático y burocrático", "Transformacional, participativo y situacional", "Permisivo, delegativo y complaciente", "Coercitivo, directivo y correctivo"], correct: 1 },
      { q: "¿Cuál es el impacto específico de las diferentes formas de reconocimiento en la motivación del personal de enfermería según las estrategias descritas?", options: ["El reconocimiento público es la única forma efectiva", "Desde agradecimiento verbal hasta premios y oportunidades de desarrollo, todas impactan significativamente", "El reconocimiento tiene poco impacto en motivación", "Solo los premios económicos motivan"], correct: 2 },
      { q: "Según el documento, ¿cuál es el papel crítico de un entorno laboral positivo en la motivación de enfermería?", options: ["No tiene relación con motivación", "Un clima de confianza, respeto, colaboración, buena comunicación y recursos adecuados son cruciales para mantener motivación", "Solo afecta la productividad", "Es menos importante que el salario"], correct: 0 },
      { q: "¿Cuál es la implicación fundamental de que la motivación y el desempeño están directamente relacionados con la calidad del cuidado al paciente?", options: ["No existe relación comprobada", "Personal motivado es más eficiente, comprometido y proporciona mejor atención; desmotivado compromete seguridad del paciente", "La calidad depende solo del equipamiento", "El paciente no nota diferencia en motivación del personal"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las estrategias CLAVE que los líderes de enfermería deben implementar para mantener motivación durante cambios organizacionales?", options: ["Imponer cambios sin explicación", "Comunicar claramente, explicar beneficios, mantener confianza y apoyar al equipo durante la transición", "Amenazar con despidos", "Ignorar la resistencia del personal"], correct: 2 }
    ]
  },
  {
    id: 8,
    title: "Trabajo en Equipo",
    subtitle: "Colaboración e interdependencia",
    icon: Users,
    questions: [
      { q: "Según la definición presentada en el documento, ¿cuál es el elemento esencial que diferencia el trabajo en equipo de otras formas de organización?", options: ["El esfuerzo colaborativo de personas con diferentes habilidades trabajando interdependientemente para un objetivo común", "Que todos trabajen en el mismo turno", "Que tengan el mismo salario", "Que compartan el mismo despacho"], correct: 0 },
      { q: "¿Cuál es la diferencia crítica entre un grupo de trabajo y un equipo según las características presentadas en la tabla del documento?", options: ["El grupo tiene baja colaboración e interdependencia individual; el equipo tiene alta colaboración e interdependencia compartida", "Los grupos trabajan más horas", "Los equipos son más grandes", "No existe diferencia significativa"], correct: 1 },
      { q: "Según el modelo de desarrollo de equipos de Tuckman descrito en el documento, ¿cuál es la característica distintiva de la etapa de Tormenta (Storming)?", options: ["Los miembros aprenden a trabajar juntos efectivamente", "Los miembros expresan opiniones e ideas que pueden generar conflictos; es crucial aprender a manejarlos", "El equipo funciona de manera eficiente", "Los miembros se conocen por primera vez"], correct: 0 },
      { q: "¿Cuál es el propósito fundamental de la etapa de Normalización (Norming) en el desarrollo de un equipo de enfermería?", options: ["Disolver el equipo tras completar la tarea", "Establecer procedimientos estándar, mejores prácticas y roles claros donde se aprecia la fortaleza de cada miembro", "Expresar conflictos abiertamente", "Mejorar la eficiencia administrativa"], correct: 2 },
      { q: "Según el documento, ¿cuáles son los TRES atributos clave que caracterizan un equipo de trabajo eficaz en enfermería?", options: ["Centralización, competencia individual, jerarquía rígida", "Comunicación efectiva, confianza y respeto mutuo, liderazgo compartido", "Rapidez en decisiones, ausencia de conflictos, uniformidad de opiniones", "Control externo, autoridad única, responsabilidad individual"], correct: 1 },
      { q: "¿Cuál es el impacto específico de una comunicación efectiva en el contexto dinámico y estresante de los servicios de salud?", options: ["Reduce la autonomía del personal", "Previene errores, facilita coordinación de tareas y asegura seguridad del paciente", "Disminuye la velocidad de respuesta", "No tiene impacto medible"], correct: 3 },
      { q: "Según el documento, ¿cuál es la función crítica de la confianza y el respeto mutuo en la dinámica de un equipo de enfermería?", options: ["Permiten que miembros se sientan seguros compartiendo ideas, expresando preocupaciones y admitiendo errores sin temor a crítica", "Aumentan la carga de trabajo", "Reducen la responsabilidad individual", "Disminuyen la comunicación formal"], correct: 0 },
      { q: "¿Cuál es la ventaja fundamental del liderazgo compartido en un equipo de enfermería según las características descritas?", options: ["Un único líder toma todas las decisiones", "Diferentes individuos asumen liderazgo según sus fortalezas, experiencia y conocimientos específicos, promoviendo participación activa", "Elimina la necesidad de coordinación", "Reduce la responsabilidad colectiva"], correct: 1 },
      { q: "Según el documento, ¿cuál es la razón por la que la toma de decisiones consensuada, aunque requiere más tiempo, produce resultados más sostenibles?", options: ["Es más rápida que otros métodos", "Refleja el compromiso colectivo del equipo y es aceptada por todos los miembros", "Reduce la participación del equipo", "No requiere consideración de opiniones"], correct: 2 },
      { q: "Según el análisis de barreras para el trabajo en equipo presentado en el documento, ¿cuál es la consecuencia más grave de la falta de liderazgo en un equipo de enfermería?", options: ["Mejora la comunicación interna", "Crea incertidumbre, falta de dirección y disminuye la cohesión, comprometiendo la efectividad del equipo", "Acelera la toma de decisiones", "Aumenta la confianza entre miembros"], correct: 3 }
    ]
  },
  {
    id: 9,
    title: "Imagen Digital de la Enfermera",
    subtitle: "Presencia y reputación online",
    icon: BookOpen,
    questions: [
      { q: "Según el documento, ¿cuál es el impacto fundamental de una imagen digital positiva en la profesión enfermera?", options: ["Genera confianza en pacientes, facilita oportunidades laborales y desarrolla carrera profesional; puede conseguir formación, investigación y liderazgo", "Permite ganar dinero en redes sociales", "Requiere que todos los enfermeros tengan presencia online", "No tiene ningún impacto en la carrera profesional"], correct: 0 },
      { q: "¿Cuál es la composición fundamental de la identidad digital según el documento?", options: ["Solo la foto de perfil", "Nombre, foto de perfil, biografía, publicaciones y actividad en redes", "Únicamente el número de seguidores", "Solo la información profesional"], correct: 1 },
      { q: "Según el documento, ¿cuáles son los CINCO principios clave de la comunicación digital efectiva en enfermería?", options: ["Claridad, precisión, relevancia, concreción y corrección", "Rapidez, popularidad, entretenimiento, diversión y creatividad", "Brevedad, anonimato, confidencialidad, formalidad y silencio", "Autoridad, dominación, control, poder y autoreferencia"], correct: 2 },
      { q: "¿Cuál es la diferencia crítica entre un sitio web personal y las redes sociales como herramientas de proyección profesional?", options: ["El sitio web permite presentar formación, experiencia, visión, valores y servicios de forma completa y controlada; las redes son más breves e inmediatas", "Las redes sociales son mejores porque permiten más interacción", "Un sitio web es innecesario si tienes redes sociales", "No existe diferencia funcional entre ambas herramientas"], correct: 0 },
      { q: "Según el análisis del documento sobre aspectos positivos de la presencia enfermera en redes, ¿cuál es el beneficio más relevante para la profesión?", options: ["Proyectar una imagen experta y profesional que genera confianza en la población hacia las enfermeras", "Aumentar el número de me gusta", "Tener más amigos online", "Poder criticar a otros profesionales"], correct: 1 },
      { q: "¿Cuáles son los objetivos específicos que una enfermera debe definir al construir su imagen digital según el documento?", options: ["Ganar premios y reconocimiento personal", "Visibilidad, reputación, networking, oportunidades laborales y conectar con público específico", "Solo promoción económica", "Entretenimiento y diversión"], correct: 2 },
      { q: "Según el documento, ¿cuál es el propósito fundamental de crear una marca personal coherente en el entorno digital?", options: ["Diferenciarse como profesional único; definir valor diferencial, identidad visual, contenido de calidad, consistencia y autenticidad", "Copiar a otros profesionales exitosos", "Ser lo más polémico posible para generar atención", "Mantener máximo secreto sobre la actividad profesional"], correct: 0 },
      { q: "¿Cuáles son los requisitos CRÍTICOS para el cuidado ético del contenido que una enfermera publica según el documento?", options: ["Comprobar información, respetar privacidad de pacientes, evitar autopromoción excesiva, no publicar contenido inapropiado u ofensivo", "Publicar todo sin revisar", "Compartir casos clínicos detallados con nombres de pacientes", "Maximizar autopromoción y venta de servicios"], correct: 1 },
      { q: "Según el documento, ¿cuál es la función específica de las redes sociales profesionales como LinkedIn versus las redes generalistas?", options: ["LinkedIn permite conectar profesionales, compartir experiencia laboral, curriculum y publicaciones; redes generalistas tienen audiencia más amplia", "Todas las redes son idénticas en función", "LinkedIn no es útil para enfermeras", "Las redes generalistas son más profesionales que LinkedIn"], correct: 3 },
      { q: "¿Cuáles son los retos críticos que enfrenta una enfermera en la construcción de su imagen digital según los aspectos a mejorar descritos?", options: ["Alto nivel de competencia, necesidad de actualización permanente, protección de privacidad y combate contra estereotipos de género", "No hay ningún reto importante", "Solo mantener muchos seguidores", "La única dificultad es tener una foto bonita"], correct: 0 }
    ]
  },
  {
    id: 10,
    title: "Toma de Decisiones",
    subtitle: "Proceso y herramientas críticas",
    icon: Brain,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de la toma de decisiones en enfermería?", options: ["Proceso complejo y continuo que implica seleccionar la mejor opción entre alternativas, considerando evidencia científica, valores del paciente, recursos disponibles y juicio profesional", "Elegir rápidamente sin pensar", "Seguir siempre las órdenes del médico", "Solo tomar decisiones urgentes"], correct: 0 },
      { q: "¿Cuáles son las TRES categorías de factores que influyen en la toma de decisiones según el documento?", options: ["Solo factores del paciente", "Factores individuales, del entorno y del paciente", "Solo factores administrativos", "Factores económicos únicamente"], correct: 1 },
      { q: "Según el documento, ¿cuál es la CORRECTA secuencia de las cinco fases del proceso de toma de decisiones?", options: ["Identificación, análisis, planificación, ejecución y evaluación", "Evaluación, identificación, análisis, planificación, ejecución", "Análisis, identificación, ejecución, planificación, evaluación", "Planificación, identificación, ejecución, análisis, evaluación"], correct: 0 },
      { q: "¿Cuáles son los CUATRO modelos principales de toma de decisiones descritos en el documento?", options: ["Racional, intuitiva, basada en evidencia y en equipo", "Solo racional", "Solo intuitiva", "Autoritaria, democrática, consultiva y autocrática"], correct: 2 },
      { q: "Según el documento, ¿cuál es el rol CRÍTICO del pensamiento crítico en el proceso de toma de decisiones?", options: ["No tiene importancia", "Es esencial; permite evaluar información, identificar problemas, generar soluciones creativas y tomar decisiones bien fundamentadas", "Solo se usa en emergencias", "Es solo para estudiantes"], correct: 3 },
      { q: "¿Cuáles son las características DEFINITORIAS de las situaciones complejas en enfermería según el documento?", options: ["Siempre son urgentes", "Incertidumbre, ambigüedad, falta de información, múltiples factores y presión temporal", "Solo falta de dinero", "Problemas con el personal"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las PRINCIPALES herramientas disponibles para apoyar la toma de decisiones?", options: ["Solo intuición", "Escalas valoración, guías clínicas, protocolos, sistemas información, software análisis datos y técnicas resolución problemas", "Solo experiencia", "Nada, solo juicio profesional"], correct: 2 },
      { q: "¿Cuál es el impacto específico de los factores del entorno en la toma de decisiones según el análisis del documento?", options: ["No influyen en absoluto", "Recursos disponibles, tiempo, presión asistencial y protocolos afectan significativamente la calidad decisiones", "Solo influye el dinero", "La ubicación geográfica es lo único importante"], correct: 0 },
      { q: "Según el documento, ¿cuál es la razón fundamental por la que el trabajo en equipo y colaboración son ESENCIALES en situaciones complejas?", options: ["Para pasar el tiempo", "Proporciona perspectivas múltiples, apoyo mutuo y genera soluciones innovadoras imposibles para una persona sola", "Es simplemente reglamentario", "Para evitar responsabilidades"], correct: 3 },
      { q: "¿Cuáles son las estrategias CLAVE que una enfermera debe aplicar para tomar decisiones efectivas en situaciones complejas?", options: ["Decidir rápido sin información", "Recopilar máxima información, consultar profesionales, usar herramientas apoyo, considerar valores paciente, conocer sesgos propios, tomar decisiones provisionales reviables", "Actuar solo", "Ignorar la información nueva"], correct: 1 }
    ]
  },
  {
    id: 11,
    title: "Planificación y Gestión del Tiempo",
    subtitle: "Eficiencia y productividad",
    icon: Clock,
    questions: [
      { q: "¿Beneficio de planificar?", options: ["Perder más tiempo", "Maximizar recursos", "Aumentar estrés", "Rigidez"], correct: 1 },
      { q: "¿Qué son los objetivos SMART?", options: ["Vagas", "Específicos, Medibles, Alcanzables, Relevantes, Temporales", "Generales", "Sin detalles"], correct: 1 },
      { q: "Procrastinación causa:", options: ["Mejoría", "Estrés y mala calidad", "Más tiempo", "Mejor resultado"], correct: 1 },
      { q: "Técnica Pomodoro implica:", options: ["Trabajar sin parar", "Intervalos trabajo-descanso", "Solo reuniones", "Multitarea"], correct: 1 },
      { q: "¿Cómo priorizar tareas?", options: ["Azar", "Urgencia e importancia", "Tamaño", "Mood del día"], correct: 1 }
    ]
  },
  {
    id: 12,
    title: "Gestión por Procesos",
    subtitle: "Optimización y calidad",
    icon: BarChart3,
    questions: [
      { q: "¿Qué es un proceso?", options: ["Una tarea", "Conjunto actividades para resultado", "Una reunión", "Una persona"], correct: 1 },
      { q: "¿Objetivo gestión procesos?", options: ["Caos", "Eficiencia y consistencia", "Más gasto", "Menos documentación"], correct: 1 },
      { q: "Un indicador de proceso es:", options: ["Opinión", "Métrica medible de desempeño", "Humedad", "Color"], correct: 1 },
      { q: "¿Cómo mejorar procesos?", options: ["Sin cambios", "Analizar, optimizar, implementar", "Cambiar todo", "Hacer más rápido"], correct: 1 },
      { q: "Six Sigma busca:", options: ["Más defectos", "Minimizar variabilidad y defectos", "Duplicar trabajo", "Menos control"], correct: 1 }
    ]
  },
  {
    id: 13,
    title: "Marketing Sanitario",
    subtitle: "Promoción y comunicación",
    icon: Target,
    questions: [
      { q: "¿Qué es marketing sanitario?", options: ["Vender medicinas", "Comunicación valor servicios salud", "Publicidad engañosa", "Vender pacientes"], correct: 1 },
      { q: "¿Componente clave marca hospital?", options: ["Logo bonito", "Reputación y experiencia paciente", "Precio bajo", "Publicidad masiva"], correct: 1 },
      { q: "¿Ética en marketing salud?", options: ["Secundaria", "Esencial, transparencia y veracidad", "Innecesaria", "Para rivales"], correct: 1 },
      { q: "¿Cómo fidelizar pacientes?", options: ["Ignorarlos", "Calidad asistencial y comunicación", "Cobrar más", "Dar falsas promesas"], correct: 1 },
      { q: "¿Riesgo marketing salud?", options: ["Ninguno", "Publicidad engañosa y falsas promesas", "Ser honesto", "Transparencia"], correct: 1 }
    ]
  },
  {
    id: 14,
    title: "Gestión del Cambio",
    subtitle: "Adaptación e innovación",
    icon: Lightbulb,
    questions: [
      { q: "¿Por qué cambio es difícil?", options: ["No lo es", "Miedo a incertidumbre", "Siempre fácil", "Cambio rápido"], correct: 1 },
      { q: "Modelo Kotter de cambio tiene fases:", options: ["Una", "Ocho fases claras", "Dos", "Sin estructura"], correct: 1 },
      { q: "Resistencia al cambio viene de:", options: ["Debilidad", "Miedo, falta info, hábitos", "Fortaleza", "Crecimiento"], correct: 1 },
      { q: "¿Cómo comunicar cambio?", options: ["Sorpresa", "Claro, temprano, frecuente", "Vago", "Después implementar"], correct: 1 },
      { q: "Líder cambio debe:", options: ["Imponer", "Inspirar y apoyar", "Desaparecer", "Criticar"], correct: 1 }
    ]
  },
  {
    id: 15,
    title: "Gestión de la Innovación",
    subtitle: "Creatividad y mejora",
    icon: Zap,
    questions: [
      { q: "¿Qué es innovación?", options: ["Novedad", "Implementar idea nueva con valor", "Cambio pequeño", "Tecnología solo"], correct: 1 },
      { q: "¿Cómo fomentar innovación?", options: ["Control rígido", "Cultura psicológica segura", "Miedo", "Castigo errores"], correct: 1 },
      { q: "Innovación disruptiva es:", options: ["Cambio menor", "Rompe modelos existentes", "Gradual", "Sin impacto"], correct: 1 },
      { q: "¿Ciclo innovación comienza con?", options: ["Implementación", "Identificar problema", "Venta", "Cierre"], correct: 1 },
      { q: "¿Por qué innovar en salud?", options: ["Moda", "Mejorar calidad y eficiencia", "Sin razón", "Gastar presupuesto"], correct: 1 }
    ]
  },
  {
    id: 16,
    title: "Las Cargas de Cuidados",
    subtitle: "Agotamiento profesional",
    icon: Heart,
    questions: [
      { q: "¿Qué es el síndrome burnout?", options: ["Cansancio normal", "Agotamiento emocional y profesional", "Vacaciones", "Entusiasmo"], correct: 1 },
      { q: "¿Síntomas burnout incluyen?", options: ["Alegría constante", "Despersonalización y cinismo", "Promoción", "Satisfacción"], correct: 1 },
      { q: "¿Causa principal carga enfermería?", options: ["Exceso motivación", "Exceso pacientes, estrés, recursos limitados", "Poco trabajo", "Mucho descanso"], correct: 1 },
      { q: "¿Cómo prevenir burnout?", options: ["Más horas", "Límites, apoyo, desarrollo", "Ignorarlo", "Cambiar profesión"], correct: 1 },
      { q: "Carga mental en enfermería:", options: ["No existe", "Es real e impacta salud", "Invento", "Solo imaginación"], correct: 1 }
    ]
  },
  {
    id: 17,
    title: "Los Sistemas de Salud",
    subtitle: "Estructura y salud pública",
    icon: Shield,
    questions: [
      { q: "¿Salud bien público significa?", options: ["Negocio privado", "Derecho universal, responsabilidad colectiva", "Lujo", "Privilegio"], correct: 1 },
      { q: "¿Pilares sistema salud?", options: ["Ganancias", "Acceso, calidad, equidad", "Dinero", "Marketing"], correct: 1 },
      { q: "¿Diferencia Primaria, Secundaria, Terciaria?", options: ["Ninguna", "Prevención, tratamiento, rehabilitación", "Colores", "Tamaño"], correct: 1 },
      { q: "¿Modelo sistema salud español?", options: ["Privado puro", "Público universal con privada", "Sin modelo", "Caótico"], correct: 1 },
      { q: "¿Desafío sistemas salud hoy?", options: ["Ninguno", "Envejecimiento, tecnología, costos", "Exceso dinero", "Exceso personal"], correct: 1 }
    ]
  },
  {
    id: 18,
    title: "La Administración como Ciencia",
    subtitle: "Orígenes y evolución",
    icon: BookOpen,
    questions: [
      { q: "¿Padre administración moderna?", options: ["Hippócrates", "Frederick Taylor", "Aristóteles", "Platón"], correct: 1 },
      { q: "¿Qué fue Revolución Industrial?", options: ["Revolución francesa", "Cambio producción mecanización", "Cambio político", "Cambio agrario"], correct: 1 },
      { q: "¿Escuela administración clásica?", options: ["Teoría X", "Planificación, organización, dirección, control", "Caos", "Intuición"], correct: 1 },
      { q: "¿Teoría relaciones humanas enfatiza?:", options: ["Solo tareas", "Personas y relaciones", "Máquinas", "Ganancias"], correct: 1 },
      { q: "¿Administración moderna es?:", options: ["Igual siempre", "Adaptativa e integradora", "Sin cambios", "Rígida"], correct: 1 }
    ]
  },
  {
    id: 19,
    title: "La Calidad",
    subtitle: "Modelos de calidad",
    icon: ShieldCheck,
    questions: [
      { q: "¿Definición calidad en salud?", options: ["Caro", "Efectivo, seguro, centrado paciente", "Rápido", "Bonito"], correct: 1 },
      { q: "¿Modelo calidad ISO 9001?:", options: ["Gastronomía", "Gestión calidad procesos", "Medicina", "Derecho"], correct: 1 },
      { q: "¿Dimensiones calidad salud?:", options: ["Una", "Múltiples: acceso, seguridad, efectividad, experiencia", "Dos", "Ninguna"], correct: 1 },
      { q: "¿Auditoría de calidad es?:", options: ["Castigo", "Evaluación sistemática conformidad", "Revisión aleatoria", "Sin valor"], correct: 1 },
      { q: "¿Mejora continua significa?:", options: ["Cambios grandes anuales", "Pequeños cambios constantes", "Sin cambios", "Cambio radical frecuente"], correct: 1 }
    ]
  },
  {
    id: 20,
    title: "Dirección Estratégica",
    subtitle: "Visión y posicionamiento",
    icon: Target,
    questions: [
      { q: "¿Qué es estrategia?:", options: ["Táctico", "Plan largo plazo con objetivos claros", "Operacional", "Improvisación"], correct: 1 },
      { q: "¿Diferencia estrategia y táctica?:", options: ["Ninguna", "Estrategia largo plazo, táctica corto plazo", "Misma cosa", "Sinónimos"], correct: 1 },
      { q: "¿DAFO análisis incluye?:", options: ["Dinero", "Debilidades, fortalezas, oportunidades, amenazas", "Datos", "Documentos"], correct: 1 },
      { q: "¿Misión organizacional es?:", options: ["Opcional", "Razón existencia y valor que entrega", "Ganancia", "Crecer solo"], correct: 1 },
      { q: "¿Visión estratégica?:", options: ["Pasado", "Futuro deseado inspirador", "Presente", "Azar"], correct: 1 }
    ]
  },
  {
    id: 21,
    title: "Seguridad del Paciente",
    subtitle: "Gestión del riesgo sanitario",
    icon: Shield,
    questions: [
      { q: "¿Evento adverso en salud es?:", options: ["Mejoría", "Daño no intencional al paciente", "Éxito", "Previsto"], correct: 1 },
      { q: "¿Cultura seguridad implica?:", options: ["Ocultar errores", "Transparencia y aprendizaje", "Culpa", "Ignorancia"], correct: 1 },
      { q: "¿Herramienta FMEA en salud?:", options: ["Medicina", "Identificar y analizar riesgos", "Diagnóstico", "Tratamiento"], correct: 1 },
      { q: "¿Reporte de eventos adversos?:", options: ["Opcional", "Esencial para mejora", "Castigo", "Sin valor"], correct: 1 },
      { q: "¿Cómo mejorar seguridad?:", options: ["Responsabilizar individual", "Rediseño sistemas y procesos", "Ignorar", "Esperar"], correct: 1 }
    ]
  }
];
