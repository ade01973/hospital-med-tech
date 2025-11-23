import { Activity, BookOpen, User, Users, Brain, Stethoscope, MessageSquare, Zap, Target, Clock, BarChart3, Lightbulb, Shield, TrendingUp, Heart, ShieldCheck, Eye } from 'lucide-react';

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
    subtitle: "Procesos y metodologías estratégicas",
    icon: Clock,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de la planificación?", options: ["Hacer listas de tareas sin orden", "Proceso de establecer objetivos y metas, desarrollando plan de acción para alcanzarlos; herramienta esencial para éxito personal, profesional y social", "Solo para empresas grandes", "Una tarea administrativa innecesaria"], correct: 1 },
      { q: "¿Cuáles son los TRES tipos principales de planificación organizacional descritos en el documento?", options: ["Personal, familiar y social", "Estratégica, táctica y operativa", "Rápida, media y lenta", "Financiera, legal y administrativa"], correct: 2 },
      { q: "Según el documento, ¿cuál es la diferencia crítica entre planificación estratégica y planificación táctica?", options: ["Estratégica define dirección a largo plazo basada en análisis FODA; táctica traduce objetivos estratégicos en planes de acción específicos a corto plazo", "No hay diferencia", "Táctica es más importante", "Estratégica es solo teórica"], correct: 0 },
      { q: "¿Cuál es el propósito fundamental de la planificación operativa en contexto de enfermería?", options: ["Establecer visión empresarial", "Desarrollar detalles de implementación día a día; gestión tareas, priorización, seguimiento operaciones", "Solo para reuniones", "Prevenir cambios organizacionales"], correct: 3 },
      { q: "Según el documento, ¿cuáles son los CUATRO pasos clave del método ABC para planificación?", options: ["Identificar tareas, clasificar A-B-C, priorizar A, planificar B-C y revisar regularmente", "Solo hacer lista", "Ignorar importancia", "Hacer todo a la vez"], correct: 0 },
      { q: "¿Cuál es la estructura fundamental de la matriz de Eisenhower según el documento?", options: ["Tres cuadrantes", "Cuatro cuadrantes basados en importancia y urgencia para clasificar tareas", "Solo dos opciones", "Cinco niveles de prioridad"], correct: 1 },
      { q: "Según el documento, ¿cuál es el propósito CRÍTICO del análisis DAFO en planificación estratégica?", options: ["Decorar reportes", "Diagnóstico situación actual identificando factores internos (fortalezas-debilidades) y externos (oportunidades-amenazas) que afectan éxito", "Solo cumplimiento", "Marketing"], correct: 2 },
      { q: "¿Cuáles son las herramientas PRINCIPALES para la planificación táctica según el documento?", options: ["Solo reuniones verbales", "Diagramas flujo, diagramas Gantt, PERT, CPM para visualizar cronogramas y ruta crítica", "Intuición personal", "Secretaría"], correct: 1 },
      { q: "Según el documento, ¿cuál es la función crítica de las herramientas software en la planificación?", options: ["Complicar procesos", "Mejoran eficiencia ofreciendo calendarios, gestión tareas, seguimiento progreso, comunicación y colaboración", "No sirven", "Solo para reportes bonitos"], correct: 3 },
      { q: "¿Cuáles son los CUATRO beneficios esenciales de una planificación eficaz según el análisis del documento?", options: ["Ser más lento", "Ser más productivo, alcanzar objetivos rápido/eficiente, reducir estrés/ansiedad, mejorar calidad vida", "Causas aburrimiento", "Reduce capacidad"], correct: 0 }
    ]
  },
  {
    id: 12,
    title: "Gestión por Procesos",
    subtitle: "Diseño, implementación y mejora continua",
    icon: BarChart3,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de la gestión por procesos?", options: ["Solo una tarea administrativa", "Metodología sistemática de identificación, diseño, implementación y mejora continua de procesos; enfoque orientado a eficiencia, eficacia y satisfacción de clientes", "Un sistema solo de calidad", "Una herramienta de control únicamente"], correct: 1 },
      { q: "¿Cuáles son las CINCO características clave de la gestión por procesos según el documento?", options: ["Autoritarismo, secreto, aislamiento, rigidez, ignorancia", "Enfoque cliente, orientación eficiencia, mejora continua, enfoque sistémico, trabajo equipo", "Solo rapidez", "Solo economía"], correct: 3 },
      { q: "Según la tabla del documento, ¿cuál es la diferencia CRÍTICA en estructura entre gestión tradicional y gestión por procesos?", options: ["No hay diferencia", "Tradicional: jerárquica; por procesos: plana; tradicional enfoque funcional; procesos enfoque horizontal", "Ambas son iguales", "Procesos es más jerárquica"], correct: 2 },
      { q: "¿Cuáles son los TRES tipos principales de procesos en gestión por procesos según el documento?", options: ["Rápidos, medios, lentos", "Asistenciales, apoyo, estratégicos", "Públicos, privados, externos", "Simples, complejos, intermedios"], correct: 0 },
      { q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre procesos asistenciales y procesos de apoyo?", options: ["No existe diferencia", "Asistenciales: directamente con paciente e impacto calidad; apoyo: no directos con paciente pero necesarios para procesos asistenciales", "Todos son iguales", "Apoyo es menos importante"], correct: 1 },
      { q: "¿Cuáles son los CINCO pasos para implementación de gestión por procesos en servicios enfermería?", options: ["Solo planificar", "Identificar, analizar, rediseñar, implementar, evaluar y mejorar continuamente", "Nada específico", "Cambiar todo de golpe"], correct: 3 },
      { q: "Según el documento, ¿cuáles son los CINCO criterios fundamentales para identificar procesos?", options: ["Solo opinion", "Objetivo, inicio-fin, entradas-salidas, clientes, frecuencia", "Nada importante", "Solo documentos"], correct: 1 },
      { q: "¿Cuáles son las CUATRO técnicas principales para la identificación de procesos según el documento?", options: ["Solo observar", "Análisis documentación, observación directa, entrevistas, cuestionarios", "Nada", "Solo preguntar"], correct: 2 },
      { q: "Según el documento, ¿cuál es el rol FUNDAMENTAL de la gestora enfermera en implementación de gestión por procesos?", options: ["No tiene rol importante", "Liderar cambio, diseñar/implementar procesos, evaluar/mejorar, formar equipo, comunicar gestión procesos", "Solo supervisar", "Solo documentar"], correct: 1 },
      { q: "¿Cuáles son los CINCO beneficios esenciales de la gestión por procesos en ámbito sanitario según el documento?", options: ["Menos beneficios", "Mejora calidad atención, mayor eficiencia, mejor coordinación profesionales, mayor satisfacción profesionales, mejora seguridad paciente", "Solo economía", "Menos trabajo"], correct: 3 }
    ]
  },
  {
    id: 13,
    title: "Marketing Sanitario",
    subtitle: "Estrategias de valor y experiencia del paciente",
    icon: Target,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de Marketing Sanitario en contexto sistema sanitario español?", options: ["Solo publicidad de medicinas", "Conjunto de estrategias orientadas a promover salud, prevención, informar sobre servicios, mejorar accesibilidad y fomentar participación pacientes", "Vender servicios médicos", "Marketing comercial tradicional"], correct: 1 },
      { q: "¿Cuáles son las CINCO funciones CLAVE del Marketing Sanitario según el documento?", options: ["Solo publicidad", "Promover salud/prevención, informar sobre servicios, mejorar accesibilidad/calidad, fomentar participación pacientes, educación", "Marketing de lujo", "Solo ganancias"], correct: 3 },
      { q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre Marketing y Publicidad en contexto sanitario?", options: ["No hay diferencia", "Marketing: enfoque integral bidireccional; Publicidad: herramienta unidireccional que comunica mensajes", "Son exactamente iguales", "Marketing es más barato"], correct: 2 },
      { q: "¿Cuáles son los CINCO elementos clave de la propuesta de valor del Marketing Sanitario?", options: ["Solo precios bajos", "Foco paciente, comunicación eficaz, construcción relaciones, promoción salud pública, eficiencia y rentabilidad", "Solo tecnología", "Menos costos"], correct: 0 },
      { q: "Según la evolución histórica documentada, ¿cuál es el enfoque del Marketing Sanitario en la actualidad?", options: ["Años 50-60: publicidad productos", "Años 2000: online; Actualidad: marketing centrado paciente, experiencia paciente, marketing digital", "Solo promoción hospitales", "Publicidad masiva"], correct: 3 },
      { q: "¿Cuáles son los CUATRO criterios principales de segmentación de mercados en ámbito sanitario?", options: ["Solo por precio", "Demográficos, geográficos, psicográficos, criterios relacionados salud", "Solo edad", "Por ubicación únicamente"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las características definitorias del PACIENTE EMPODERADO en contexto actual?", options: ["Pasivo, sin información", "Mayor acceso información, participación decisiones, responsabilidad en autocuidado, acceso tecnologías", "Dependiente del médico", "Sin derechos"], correct: 2 },
      { q: "¿Cuáles son las CINCO características de la atención sanitaria que busca el paciente actual?", options: ["Solo barata", "Accesible, calidad, eficiente, personalizada, humana", "Rápida nomás", "Sin importancia"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las TRES razones por las que Marketing Sanitario cobra mayor importancia actual?", options: ["Solo economía", "Aumento competencia sector, mayor empoderamiento paciente, evolución TIC", "Menos razones", "Sin importancia"], correct: 2 },
      { q: "¿Cuáles son los CINCO objetivos fundamentales del Marketing Sanitario en contexto sistema sanitario español?", options: ["Solo vender", "Promover eficiencia/sostenibilidad, garantizar equidad acceso, responder necesidades ciudadanos, mejorar posicionamiento, satisfacción", "Marketing tradicional", "Sin objetivos"], correct: 1 }
    ]
  },
  {
    id: 14,
    title: "Gestión del Cambio",
    subtitle: "Modelos, resistencia y liderazgo transformacional",
    icon: Lightbulb,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de gestión del cambio?", options: ["Solo implementar nuevas reglas", "Proceso planificado y sistemático que busca implementar modificaciones para mejorar funcionamiento y alcanzar objetivos estratégicos", "Cambio sin planeación", "Cambio rápido sin análisis"], correct: 1 },
      { q: "¿Cuáles son las TRES fases principales del modelo de Lewin según el documento?", options: ["Inicio, medio, fin", "Descongelación, cambio, recongelación", "Análisis, decisión, ejecución", "Planificación, acción, cierre"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las OCHO etapas del modelo de Kotter?", options: ["Menos etapas", "Urgencia, coalición, visión, comunicación, empoderamiento, victorias, consolidación, anclaje cultural", "Tres etapas", "Cinco etapas"], correct: 2 },
      { q: "¿Cuáles son las CINCO etapas del modelo de Kübler-Ross adaptado para cambio organizacional?", options: ["Dos etapas", "Negación, ira, negociación, depresión, aceptación", "Ocho etapas", "Tres etapas"], correct: 0 },
      { q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre cambio incremental y cambio radical?", options: ["No hay diferencia", "Incremental: pequeño y gradual; Radical: profundo y significativo/disruptivo", "Ambos iguales", "Radical es más lento"], correct: 1 },
      { q: "¿Cuáles son las TRES etapas del modelo de Bridges para transición?", options: ["Cuatro etapas", "Fin de antiguo, zona neutral, comienzo nuevo", "Inicio, medio, fin", "Planificación, ejecución, cierre"], correct: 3 },
      { q: "Según el documento, ¿cuál es la definición y rol fundamental de un agente de cambio?", options: ["Solo ejecutor de órdenes", "Persona que facilita/impulsa proceso cambio; identifica necesidad, comunica, planifica, ejecuta, evalúa", "Observador pasivo", "Solo crítico"], correct: 0 },
      { q: "¿Cuáles son los CINCO tipos principales de agentes de cambio según el documento?", options: ["Solo líderes formales", "Líderes formales, informales, expertos, innovadores, campeones cambio", "Dos tipos", "Tres tipos"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las SEIS habilidades y características clave de un agente de cambio efectivo?", options: ["Una habilidad", "Comunicación, liderazgo, gestión proyectos, resolución problemas, adaptación, flexibilidad, paciencia", "Tres habilidades", "Solo liderazgo"], correct: 3 },
      { q: "¿Cuáles son las CUATRO principales CAUSAS de resistencia al cambio según los factores individuales, grupales y organizacionales?", options: ["Solo una causa", "Miedo incertidumbre, falta información, pérdida poder, hábitos establecidos; cultural, conflictos interés, recursos limitados", "Sin causas", "Desconocidas"] , correct: 0 }
    ]
  },
  {
    id: 15,
    title: "Gestión de la Innovación",
    subtitle: "Procesos, liderazgo y competencias enfermeras",
    icon: Zap,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de innovación en enfermería?", options: ["Solo nuevas tecnologías", "Introducción nuevos conocimientos, ideas, procesos, productos/servicios que mejoran calidad atención y resultados paciente", "Cambios administrativos", "Cambios cosmética"], correct: 1 },
      { q: "¿Cuáles son los CUATRO beneficios principales de la innovación para mejora calidad cuidados según el documento?", options: ["Solo eficiencia", "Mejora eficiencia/eficacia, seguridad paciente, satisfacción paciente, promueve salud/bienestar", "Beneficios económicos", "Menos beneficios"], correct: 3 },
      { q: "Según el documento, ¿cuáles son los CUATRO principales RETOS Y DESAFÍOS de la innovación en enfermería?", options: ["Sin retos", "Falta recursos, cultura organizacional no favorable, falta formación, resistencia cambio", "Solo desafíos tecnológicos", "Retos políticos"], correct: 0 },
      { q: "¿Cuáles son las CUATRO FASES del proceso de innovación según el documento?", options: ["Dos fases", "Identificación necesidades, generación ideas, planificación/implementación, evaluación/difusión", "Una fase", "Tres fases"], correct: 3 },
      { q: "Según el documento, ¿cuáles son las TRES metodologías para GENERAR IDEAS Y SOLUCIONES en innovación?", options: ["Solo lluvia ideas", "Brainstorming, mapas mentales, análisis FODA", "Reuniones formales", "Decisiones directivas"], correct: 2 },
      { q: "¿Cuáles son los CUATRO FACTORES CLAVE para el éxito de la innovación en enfermería según el documento?", options: ["Un factor", "Cultura organizacional favorable, liderazgo apoyo, recursos humanos/financieros, gestión conocimiento/aprendizaje", "Solo recursos", "Solo liderazgo"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las CINCO COMPETENCIAS Y HABILIDADES CLAVE para innovar en enfermería?", options: ["Una habilidad", "Pensamiento crítico, resolución problemas, comunicación efectiva, trabajo equipo, liderazgo", "Solo comunicación", "Solo liderazgo"], correct: 3 },
      { q: "¿Cuáles son las CINCO PARTICIPACIONES de la gestora enfermera en proceso innovación según el documento?", options: ["Una participación", "Identificar necesidades, generar ideas, planificar/implementar, evaluar, difundir innovación", "Ejecutar nomás", "Supervisar"], correct: 2 },
      { q: "Según el documento, ¿cuáles son los TRES COMPONENTES de CULTURA ORGANIZACIONAL FAVORABLE A INNOVACIÓN?", options: ["Uno", "Valora creatividad/toma riesgos, apoya aprendizaje/desarrollo, celebra éxito y aprende errores", "Control rígido", "Solo tecnología"], correct: 0 },
      { q: "¿Cuáles son las TRES ESTRATEGIAS PRINCIPALES para FOMENTAR INNOVACIÓN en enfermería según documento?", options: ["Una estrategia", "Programas formación/desarrollo profesional, unidades innovación y gestión cambio, sistemas apoyo investigación", "Solo capacitación", "Solo unidades innovación"], correct: 1 }
    ]
  },
  {
    id: 16,
    title: "La Carga de Cuidados",
    subtitle: "Medición, factores e impacto en enfermería",
    icon: Heart,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de carga de cuidados enfermera?", options: ["Cantidad trabajo físico, emocional y mental que exige atención pacientes", "Solo tareas administrativas", "Cansancio general", "Estrés laboral nomás"], correct: 0 },
      { q: "¿Cuáles son los TRES TIPOS PRINCIPALES de carga de cuidados según el documento?", options: ["Dos tipos", "Carga física, emocional, mental", "Solo carga mental", "Carga administrativa"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS del PACIENTE que influyen en carga cuidados?", options: ["Una característica", "Edad, diagnóstico, dependencia, agudeza proceso, comorbilidades y necesidades especiales", "Solo edad", "Solo diagnóstico"], correct: 2 },
      { q: "¿Cuáles son los CINCO FACTORES de CARACTERÍSTICAS ENFERMERA que influyen en gestión carga?", options: ["Uno", "Experiencia, formación, habilidades, capacidades, nivel estrés", "Solo experiencia", "Solo formación"], correct: 3 },
      { q: "Según el documento, ¿cuáles son los CUATRO FACTORES del ENTORNO TRABAJO que afectan carga cuidados?", options: ["Tipo unidad, ratio enfermera-paciente, recursos disponibles, clima laboral y cultura organizacional", "Solo ratio", "Uno", "Dos"], correct: 0 },
      { q: "¿Cuáles son los CUATRO INSTRUMENTOS DE MEDICIÓN principales según el documento?", options: ["Uno", "Escalas valoración (NAS, WOCN, Aiken), cuestionarios, diarios trabajo", "Solo escalas", "Solo cuestionarios"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de la PARRILLA MONTESINOS?", options: ["Dos", "Evalúa ABVD, valora independencia leve/moderada/grave, sencilla uso, válida fiable, múltiples contextos", "Una", "Tres"], correct: 2 },
      { q: "¿Cuáles son las SEIS CONSECUENCIAS PRINCIPALES de carga cuidados para la ENFERMERA según documento?", options: ["Cuatro", "Agotamiento físico/mental, estrés laboral, deterioro salud, disminución satisfacción, absentismo, deterioro vida", "Dos", "Una"], correct: 3 },
      { q: "Según el documento, ¿cuáles son las CINCO CONSECUENCIAS de carga cuidados para CALIDAD cuidados pacientes?", options: ["Errores medicación, infecciones, caídas pacientes, disminución intimidad, deterioro relación terapéutica", "Una", "Dos", "Tres"], correct: 0 },
      { q: "¿Cuáles son los TRES NIVELES DE ESTRATEGIAS gestión carga cuidados según el documento?", options: ["Uno", "Individual (autocuidado, resiliencia), organizativo (recursos, clima), político (legislación, políticas sanitarias)", "Dos", "Solo individual"], correct: 1 }
    ]
  },
  {
    id: 17,
    title: "Los Sistemas de Salud",
    subtitle: "Estructura, financiación y modelos internacionales",
    icon: Shield,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de sistema de salud?", options: ["Solo hospitales", "Conjunto elementos interrelacionados que organizan provisión servicios salud a población", "Administración pública", "Seguros médicos"], correct: 1 },
      { q: "¿Cuáles son los CINCO ELEMENTOS CLAVE que integran un sistema de salud?", options: ["Dos elementos", "Recursos humanos, financieros, físicos, organización, objetivo mejora salud", "Solo recursos", "Solo financiación"], correct: 2 },
      { q: "Según el documento, ¿cuáles son las CINCO FUNCIONES PRINCIPALES de sistemas de salud?", options: ["Una función", "Provisión servicios, protección financiera, promoción salud, investigación/desarrollo, regulación", "Dos funciones", "Tres funciones"], correct: 2 },
      { q: "¿Cuáles son los CUATRO SISTEMAS SALUD INTERNACIONALES analizados según el documento?", options: ["Dos", "NHS Reino Unido, Bismarck Alemania, Beveridge Canadá, Seguro Social EEUU", "Uno", "Cinco"], correct: 2 },
      { q: "Según el documento, ¿cuáles son las TRES características definitorias del SISTEMA NHS REINO UNIDO?", options: ["Una", "Financiación pública, centralizado, cobertura universal gratuita, impuestos, tiempos espera largos", "Dos", "Mixta"], correct: 2 },
      { q: "¿Cuáles son los TRES NIVELES ESTRUCTURALES del Sistema Nacional Salud español?", options: ["Dos", "Central (Ministerio), autonómico (CCAA servicios), local (Áreas/Centros salud)", "Uno", "Cuatro"], correct: 3 },
      { q: "Según el documento, ¿cuáles son las TRES PRESTACIONES PRINCIPALES del SNS español?", options: ["Una", "Atención primaria, atención especializada, atención sociosanitaria, salud pública", "Dos", "Solo atención primaria"], correct: 1 },
      { q: "¿Cuáles son las DOS PROPIEDADES FUNDAMENTALES de un BIEN PÚBLICO según documento?", options: ["Una propiedad", "No exclusividad y no rivalidad; imposible excluir, no reduce cantidad disponible", "Rivalidad solo", "Exclusividad solo"], correct: 0 },
      { q: "Según el documento, ¿cuáles son los TRES FALLOS DEL MERCADO en provisión salud?", options: ["Uno", "Inequidad (sin recursos no acceso), ineficiencia (exceso/infraprovisión), falta innovación mercado", "Dos", "Ninguno"], correct: 2 },
      { q: "¿Cuáles son los CUATRO PRINCIPALES DESAFÍOS de sistemas salud contemporáneos según documento?", options: ["Dos", "Envejecimiento población, aumento enfermedades crónicas, tecnología, sostenibilidad financiera", "Uno", "Tres"], correct: 1 }
    ]
  },
  {
    id: 18,
    title: "La Administración como Ciencia",
    subtitle: "Orígenes, enfoques y escuelas administrativas",
    icon: BookOpen,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de administración?", options: ["Solo gestión de dinero", "Proceso planificar, organizar, dirigir y controlar recursos humanos, materiales, financieros para alcanzar objetivos", "Supervisión de personal", "Cumplimiento normativo"], correct: 1 },
      { q: "¿Cuáles son los CINCO BENEFICIOS PRINCIPALES de administración en enfermería según documento?", options: ["Uno", "Optimizar recursos, mejorar coordinación, motivar personal, promover investigación, garantizar calidad", "Dos", "Tres"], correct: 3 },
      { q: "Según el documento, ¿quién es considerado PADRE de la ADMINISTRACIÓN CIENTÍFICA?", options: ["Henri Fayol", "Frederick Winslow Taylor con 'Principios Administración Científica' 1911; propuso división trabajo, especialización, estudio tiempos/movimientos", "Frank Gilbreth", "Max Weber"], correct: 1 },
      { q: "¿Cuáles son las SEIS FUNCIONES BÁSICAS de administración según HENRI FAYOL según documento?", options: ["Cuatro", "Previsión, organización, dirección, coordinación, control, mando", "Dos", "Ocho"], correct: 2 },
      { q: "Según el documento, ¿cuál fue la contribución PRINCIPAL de Frank y Lillian Gilbreth?", options: ["División trabajo", "Técnica micromovimientos: filmar/analizar movimientos trabajador para eliminar innecesarios", "Especialización", "Incentivos"], correct: 2 },
      { q: "¿Cuáles son los TRES ENFOQUES PRINCIPALES de administración según documento?", options: ["Dos", "Clásico (estructura eficiencia), neoclásico (factor humano), humanista (desarrollo personal ambiente)", "Uno", "Cuatro"], correct: 1 },
      { q: "Según el documento, ¿cuál es la diferencia CRÍTICA entre TEORÍA X y TEORÍA Y de McGregor?", options: ["No hay diferencia", "Teoría X: trabajadores perezosos necesitan control; Teoría Y: responsables, motivación interna", "X es mejor", "Y es antigua"], correct: 1 },
      { q: "¿Cuáles son los CINCO NIVELES JERÁRQUICOS de necesidades según TEORÍA HUMANISTA en documento?", options: ["Tres", "Fisiológicas, seguridad, sociales, estima, autorrealización", "Dos", "Cuatro"], correct: 0 },
      { q: "Según el documento, ¿cuál fue la contribución de FLORENCE NIGHTINGALE a administración enfermería?", options: ["Medicina solo", "Desarrolló sistema gestión hospitalaria que mejoró higiene/calidad en hospitales militares Guerra Crimea", "Teoría enfermería", "Cuidados paliativos"], correct: 2 },
      { q: "¿Cuáles son los CUATRO PRINCIPIOS FUNDAMENTALES de administración aplicables a enfermería según documento?", options: ["Dos", "Planificación, organización, dirección, control", "Uno", "Cinco"], correct: 1 }
    ]
  },
  {
    id: 19,
    title: "La Calidad",
    subtitle: "Modelos, dimensiones e implementación en enfermería",
    icon: ShieldCheck,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de CALIDAD en contexto sanitario?", options: ["Solo costo", "Grado en que servicios satisfacen necesidades usuarios en resultados (salud) y procesos (personalizado, eficiente, seguro)", "Rapidez", "Tecnología"], correct: 1 },
      { q: "¿Cuáles son las SIETE DIMENSIONES CLAVE de la CALIDAD en enfermería según el documento?", options: ["Tres", "Seguridad, eficacia, eficiencia, satisfacción, oportunidad, equidad, accesibilidad", "Cuatro", "Dos"], correct: 2 },
      { q: "Según el documento, ¿cuál es la definición del MODELO DE DONABEDIAN y sus TRES DIMENSIONES?", options: ["Dos dimensiones", "Modelo 1980 que evalúa: estructura (recursos), proceso (actividades), resultado (impacto salud)", "Cuatro dimensiones", "Una dimensión"], correct: 3 },
      { q: "¿Cuáles son los SEIS CRITERIOS PRINCIPALES del MODELO EFQM según el documento?", options: ["Tres", "Liderazgo, planificación estratégica, gestión personas, recursos/procesos, satisfacción cliente, resultados", "Dos", "Cuatro"], correct: 0 },
      { q: "Según el documento, ¿cuáles son los CINCO MODELOS DE CALIDAD MODERNOS analizados?", options: ["Dos", "EFQM, Seis Sigma, Lean Healthcare, mejora continua, modelo de Donabedian", "Tres", "Uno"], correct: 1 },
      { q: "¿Cuáles son las CINCO FASES DE IMPLEMENTACIÓN de modelos calidad según documento?", options: ["Tres", "Planificación, diseño, desarrollo, evaluación, mejora", "Dos", "Cuatro"], correct: 2 },
      { q: "Según el documento, ¿cuáles son los TRES TIPOS DE INDICADORES de calidad?", options: ["Uno", "Indicadores estructura (recursos), proceso (actividades), resultado (impacto)", "Dos", "Cuatro"], correct: 0 },
      { q: "¿Cuáles son los CUATRO MÉTODOS PRINCIPALES DE EVALUACIÓN de calidad según documento?", options: ["Dos", "Auditorías, encuestas satisfacción, grupos focales, observación directa", "Uno", "Tres"], correct: 2 },
      { q: "Según el documento, ¿cuáles son los CUATRO PRINCIPALES RETOS Y DESAFÍOS para calidad enfermería actual?", options: ["Dos", "Envejecimiento población, enfermedades crónicas, avances tecnológicos, restricciones económicas", "Uno", "Tres"], correct: 3 },
      { q: "¿Cuáles son las CINCO TENDENCIAS PRINCIPALES en gestión calidad según documento?", options: ["Tres", "Enfoque paciente, seguridad paciente, mejora continua, trabajo equipo, uso TIC", "Dos", "Cuatro"], correct: 0 }
    ]
  },
  {
    id: 20,
    title: "Dirección Estratégica",
    subtitle: "Planificación, visión y herramientas estratégicas",
    icon: Target,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de Dirección Estratégica?", options: ["Gestión diaria", "Proceso sistemático continuo que define objetivos largo plazo, establece estrategias, asigna recursos, evalúa progreso", "Control operacional", "Supervisión personal"], correct: 1 },
      { q: "¿Cuáles son los CUATRO BENEFICIOS PRINCIPALES de Dirección Estratégica en enfermería según documento?", options: ["Uno", "Liderar cambio, mejorar calidad cuidados, gestionar recursos eficientemente, responder necesidades pacientes", "Dos", "Tres"], correct: 2 },
      { q: "Según el documento, ¿cuáles son las CUATRO FASES del PROCESO DE PLANIFICACIÓN ESTRATÉGICA?", options: ["Dos", "Análisis estratégico, formulación estrategia, implementación, evaluación/control", "Una", "Tres"], correct: 3 },
      { q: "¿Cuáles son los TRES HERRAMIENTAS PRINCIPALES de planificación estratégica según el documento?", options: ["Una", "Análisis DAFO, Matriz BCG, Cinco Fuerzas Porter", "Dos", "Cuatro"], correct: 2 },
      { q: "Según el documento, ¿cuál es la definición del MODELO DE CINCO FUERZAS DE PORTER?", options: ["Solo competencia", "Herramienta analiza competencia: nuevos competidores, poder proveedores, poder clientes, productos sustitutivos, rivalidad", "Análisis interno", "Estudios mercado"], correct: 1 },
      { q: "¿Cuáles son los TRES ELEMENTOS CLAVE de Dirección Estratégica: VISIÓN, MISIÓN Y VALORES según documento?", options: ["Dos elementos", "Visión (imagen futuro deseado), misión (razón ser organización), valores (principios comportamiento)", "Uno", "Cuatro"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de los OBJETIVOS ESTRATÉGICOS?", options: ["Tres", "Específicos, medibles, alcanzables, relevantes, temporales (SMART)", "Dos", "Cuatro"], correct: 3 },
      { q: "¿Cuáles son los DOS TIPOS DE INDICADORES DESEMPEÑO según el documento?", options: ["Uno", "Indicadores resultados (impacto actividades), indicadores procesos (eficiencia procesos)", "Tres", "Cuatro"], correct: 0 },
      { q: "Según el documento, ¿cuáles son las RESPONSABILIDADES DEL LÍDER en implementación de estrategia?", options: ["Delegación total", "Comunicar visión/estrategia, motivar empleados, gestionar cambio, superar resistencias", "Solo supervisión", "Sin responsabilidad"], correct: 1 },
      { q: "¿Cuáles son las CINCO APLICACIONES de TIC en gestión enfermería según el documento?", options: ["Dos", "Documentación clínica, comunicación profesionales, planificación cuidados, administración medicamentos, educación/investigación", "Uno", "Tres"], correct: 2 }
    ]
  },
  {
    id: 21,
    title: "Seguridad del Paciente",
    subtitle: "Gestión del riesgo, eventos adversos y cultura de seguridad",
    icon: Shield,
    questions: [
      { q: "Según el documento, ¿cuál es la definición fundamental de SEGURIDAD DEL PACIENTE?", options: ["Reducción riesgo daño a mínimo aceptable; ausencia errores, eventos adversos, cultura seguridad", "Ausencia total de riesgo", "Cumplimiento normativo", "Responsabilidad médicos"], correct: 0 },
      { q: "¿Cuáles son los CUATRO BENEFICIOS PRINCIPALES de Seguridad Paciente según documento?", options: ["Uno", "Protege pacientes, mejora calidad, reduce costes, promueve confianza", "Dos", "Tres"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las CINCO FASES del PROCESO GESTIÓN RIESGO SANITARIO?", options: ["Tres", "Identificación, valoración/análisis, priorización, intervención/control, evaluación/seguimiento", "Dos", "Cuatro"], correct: 2 },
      { q: "¿Cuáles son los CUATRO HERRAMIENTAS principales de Gestión Riesgos según el documento?", options: ["Análisis DAFO, Árbol fallos, AMFE, Listas verificación", "Una", "Dos", "Tres"], correct: 3 },
      { q: "Según el documento, ¿cuáles son las CINCO CARACTERÍSTICAS de CULTURA SEGURIDAD PACIENTE?", options: ["Dos", "Compromiso dirección, comunicación abierta, trabajo equipo, aprendizaje continuo, justa cultura", "Una", "Tres"], correct: 0 },
      { q: "¿Cuál es la DEFINICIÓN y CLASIFICACIÓN de EVENTO ADVERSO según el documento?", options: ["Mejora esperada", "Incidente causa daño paciente no relacionado enfermedad; clasificado por gravedad (leve/moderado/grave), intencionalidad, prevenibilidad", "Resultado exitoso", "Evolución natural"], correct: 1 },
      { q: "Según el documento, ¿cuáles son las TRES CAUSAS PRINCIPALES de EVENTOS ADVERSOS?", options: ["Una causa", "Errores humanos, fallos sistemas, factores ambientales", "Dos", "Cuatro"], correct: 2 },
      { q: "¿Cuáles son las CUATRO CONSECUENCIAS PRINCIPALES de Eventos Adversos según documento?", options: ["Daño paciente, aumento costes, disminución satisfacción, daño imagen centro sanitario", "Una", "Dos", "Tres"], correct: 3 },
      { q: "Según el documento, ¿cuáles son los CINCO PASOS para IMPLEMENTACIÓN CULTURA SEGURIDAD?", options: ["Dos", "Política seguridad, formación profesionales, sistema notificación, auditorías, esfuerzo sostenido", "Uno", "Tres"], correct: 0 },
      { q: "¿Cuál es la IMPORTANCIA de NOTIFICACIÓN Y ANÁLISIS de EVENTOS ADVERSOS según documento?", options: ["Sin importancia", "Notificación obligatoria permite identificar riesgos; análisis identifica causas y prevención futura mejorando seguridad", "Solo administrativo", "Castigo profesionales"], correct: 1 }
    ]
  },
  {
    id: 22,
    title: "El Mirador de la Gestión",
    subtitle: "Síntesis integrada de competencias sanitarias",
    icon: Eye,
    questions: [
      { q: "Integrando liderazgo y seguridad del paciente, ¿cómo debe el líder enfermero transformar eventos adversos en oportunidades de mejora?", options: ["Culpabilizando individual", "Fomentando justa cultura, aprendizaje continuo, análisis de causas raíz sin blame para mejorar sistemas", "Ocultándolos", "Despidiendo personal"], correct: 1 },
      { q: "¿Cuál es la relación crítica entre competencias digitales, calidad y seguridad del paciente en gestión moderna?", options: ["Sin relación", "IA y datos mejoran diagnóstico/prevención eventos adversos; sistemas EHR integran seguridad en procesos; TIC facilitan monitoreo", "Solo costos", "Tecnología irrelevante"], correct: 1 },
      { q: "Combinando dirección estratégica con trabajo en equipo, ¿cómo debe gestionar una enfermera la resistencia al cambio?", options: ["Imponer decisiones", "Comunicar visión clara, involucrar equipo en decisiones, entrenar, reconocer esfuerzos, adaptar según feedback", "Ignorarla", "Amenazar con consecuencias"], correct: 1 },
      { q: "Integrando gestión de conflictos, comunicación y motivación, ¿cuál es la estrategia efectiva ante desacuerdos en equipo sanitario?", options: ["Decidir sin consultar", "Escuchar perspectivas, identificar intereses comunes, buscar soluciones win-win, mantener relaciones, celebrar resolución", "Imponer mayoría", "Separar equipos"], correct: 1 },
      { q: "¿Cómo integran las competencias de liderazgo, innovación y gestión de cambio en la implementación de nuevos protocolos?", options: ["Los nuevos protocolos nunca funcionan", "Líder inspira confianza, innova procesos, comunica beneficios, facilita capacitación, monitorea impacto, refuerza logros", "Solo enfermeras ejecutan", "Cambio muy lento"], correct: 1 },
      { q: "Combinando calidad, seguridad y gestión de riesgos, ¿cuál es el propósito de la Parrilla Montesinos y herramientas AMFE?", options: ["Documentación administrativa", "Evaluar dependencia/necesidades cuidados y prevenir fallos identificando causas para mejorar seguridad paciente", "Complicar procesos", "Sin propósito claro"], correct: 1 },
      { q: "Integrando marketing sanitario, clima laboral y satisfacción, ¿cómo contribuye la imagen del profesional enfermero al posicionamiento?", options: ["No contribuye", "Profesionalismo digital, ética, excelencia en cuidados genera confianza, satisfacción paciente y reputación institucional", "Irrelevante para pacientes", "Solo importa dinero"], correct: 1 },
      { q: "¿Cómo se integran los modelos de Donabedian (estructura/proceso/resultado) con dirección estratégica y sistemas de salud?", options: ["No se integran", "Estructura define recursos estratégicos, procesos ejecutan estrategia asegurando calidad, resultados validan modelo sanitario", "Solo administrativo", "Conceptos aislados"], correct: 1 },
      { q: "Combinando planificación del tiempo, productividad y carga de cuidados, ¿cuál es el equilibrio crítico en gestión enfermería?", options: ["Más horas siempre", "Optimizar procesos, evitar desperdicio, monitorear carga, asegurar autocuidado staff para prevenir burnout y mantener calidad", "Ignorar carga personal", "Trabajar indefinidamente"], correct: 1 },
      { q: "Integrando toma de decisiones, ética y seguridad del paciente, ¿cuál es el proceso DAFO aplicado a decisiones sanitarias críticas?", options: ["Decidir rápido sin análisis", "Analizar fortalezas/debilidades de opciones, oportunidades/amenazas contexto, elegir considerando impacto ético y seguridad", "Ignorar análisis", "Basarse solo en intuición"], correct: 1 },
      { q: "¿Cómo integran las teorías de motivación (Maslow, Herzberg) con cultura organizacional y retención de personal?", options: ["Motivación no importa", "Satisfacer necesidades progresivas, proporcionar higiene+motivadores, crear ambiente positivo retiene talento y mejora calidad", "Solo dinero motiva", "La cultura es secundaria"], correct: 1 },
      { q: "Combinando competencias digitales, sistemas sanitarios y acceso equitativo, ¿cuál es el desafío de la telemedicina?", options: ["La telemedicina es obsoleta", "Garantizar acceso digital equitativo, proteger privacidad datos, integrar en sistemas sanitarios públicos, mantener relación humana", "Solo para ricos", "Sin desafíos"], correct: 1 },
      { q: "Integrando liderazgo transformacional y Teoría X/Y, ¿cómo debe evolucionar la gestión enfermera en contexto moderno?", options: ["Permanecer con control-mando", "Pasar de control externo a empoderamiento, confiar en responsabilidad profesional, inspirar excepcionalidad, desarrollar potencial", "Teoría X es mejor", "Las personas no evolucionan"], correct: 1 },
      { q: "¿Cómo relacionan la gestión por procesos, mejora continua y Lean Healthcare para reducir carga asistencial?", options: ["Los procesos no importan", "Mapear procesos, eliminar desperdicio, optimizar flujos, medir mejoras, involucrar staff en kaizen continuo", "Cambios radicales únicamente", "Sin mejora posible"], correct: 1 },
      { q: "Combinando análisis DAFO estratégico con indicadores de desempeño, ¿cuál es el propósito del Balanced Scorecard?", options: ["Solo controlar gastos", "Medir fortalezas/debilidades contra KPIs financieros, clientes, procesos internos, aprendizaje para validar estrategia", "Documento administrativo", "Sin valor práctico"], correct: 1 },
      { q: "Integrando seguridad del paciente, ética y comunicación efectiva, ¿cómo reportar un near-miss en enfermería?", options: ["Ocultarlo para evitar culpa", "Notificar formal, analizar causas sin blame, aprender, comunicar lecciones, implementar mejoras preventivas", "Ignorarlo", "Solo entre colegas"], correct: 1 },
      { q: "¿Cómo integran la imagen digital del profesional, competencias de comunicación y marca personal en enfermería?", options: ["Las redes sociales no importan", "Coherencia online-offline, ética digital, profesionalismo en interacciones, credibilidad basada en excelencia clínica y relacional", "Privacidad absoluta", "La marca es vanidad"], correct: 1 },
      { q: "Combinando gestión de conflictos, resolución de problemas y toma de decisiones, ¿cuál es el enfoque para dilemas ético-clínicos?", options: ["Decir sí a todo", "Diálogo multiperspectiva, análisis valores enfrentados, buscar mejor resultado para paciente, documentar proceso decisión", "Evitar decisiones", "Un solo punto de vista"], correct: 1 },
      { q: "Integrando sistemas de salud, calidad y dirección estratégica, ¿cuál es el rol de acreditación de centros sanitarios?", options: ["Solo cumplimiento normativo", "Validar calidad estructura/procesos/resultados, garantizar seguridad, mejorar confianza, alineamiento con estándares internacionales", "Marketing sin valor", "Costo innecesario"], correct: 1 },
      { q: "Finalmente, ¿cómo sintesiza una gestora enfermera competente: liderazgo, innovación, seguridad, calidad y tecnología?", options: ["Gestor sin visión integrada", "Líder inspirador que innova procesos, protege pacientes, asegura calidad, empodera equipo, usa TIC estratégicamente para excelencia", "Áreas aisladas sin conexión", "Imposible integrar todo"], correct: 1 }
    ]
  }
];
