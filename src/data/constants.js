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
      { q: "Según el documento, ¿cuál es el aspecto MÁS crítico que diferencia a la gestora enfermera moderna de un simple administrador?", options: ["La capacidad de controlar costos", "La capacidad de inspirar, colaborar y empoderar a través del liderazgo transformacional", "El número de tareas que realiza", "La antigüedad en el puesto"], correct: 1 },
      { q: "¿Cuál es el propósito principal de que la gestora enfermera cree 'ambientes de trabajo seguros y saludables'?", options: ["Cumplir normativa laboral", "Promover el trabajo en equipo y mejorar la calidad asistencial", "Reducir costos operativos", "Aumentar el número de empleados"], correct: 1 },
      { q: "La evaluación continua de los servicios prestados por la gestora enfermera está orientada principalmente a:", options: ["Castigar errores", "Garantizar que la atención se alinee con estándares de excelencia", "Documentar fallos", "Justificar presupuestos"], correct: 1 },
      { q: "¿Qué aspecto hace que la gestión en enfermería 'trascienda la mera administración de recursos'?", options: ["El uso de tecnología avanzada", "La capacidad de influir, motivar y promover excelencia mediante liderazgo ético", "El tamaño del presupuesto", "La cantidad de personal disponible"], correct: 1 },
      { q: "Según González García (2019), ¿cuáles son los pilares fundamentales sobre los que descansa el rol de la gestora enfermera?", options: ["Autoridad y control únicamente", "Planificación, organización de servicios, ambientes seguros, participación y evaluación", "Solo planificación estratégica", "Únicamente tareas operativas"], correct: 1 },
      { q: "¿Por qué se describe la gestión enfermera como un 'acto de equilibrio delicado y dinámico'?", options: ["Porque es impredecible", "Porque requiere conocimiento, habilidad, pasión, empatía y compromiso con valores fundamentales", "Porque es muy fácil", "Porque no tiene estabilidad"], correct: 1 }
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
      { q: "¿Cuál es el principio fundamental de las teorías situacionales o de contingencia?", options: ["Existe un único estilo de liderazgo efectivo para todas las situaciones", "El éxito del liderazgo depende de factores situacionales y requiere flexibilidad adaptativa", "El liderazgo es independiente del contexto", "Las situaciones nunca afectan el resultado"], correct: 1 },
      { q: "¿Cuál es la diferencia crítica entre liderazgo transformacional y transaccional?", options: ["No hay diferencia significativa", "Transformacional inspira cambio y excepcionalidad; transaccional usa recompensas/castigos por tareas", "Transaccional es más efectivo en enfermería", "Transformacional solo usa castigos"], correct: 1 },
      { q: "¿Cuándo es ESPECIALMENTE apropiado aplicar un liderazgo autocrático en enfermería?", options: ["En la mayoría de situaciones", "En emergencias que requieren decisiones rápidas y precisas", "Nunca es apropiado", "Solo en reuniones administrativas"], correct: 1 },
      { q: "¿Cuál es el riesgo principal de un liderazgo democrático si se aplica inadecuadamente en enfermería?", options: ["Es demasiado eficiente", "Puede comprometer la efectividad en situaciones que requieren decisiones rápidas", "Mejora siempre la retención", "Reduce la comunicación"], correct: 1 },
      { q: "El liderazgo Laissez-Faire es más efectivo cuando los miembros del equipo son:", options: ["Inexpertos y necesitan supervisión", "Altamente experimentados, motivados y capaces de autogestión", "Nuevos en la organización", "Desinteresados en el trabajo"], correct: 1 },
      { q: "Según el documento, ¿cuál es la relación entre la definición de liderazgo en enfermería y la función de influencia?", options: ["El liderazgo NO implica influencia", "El liderazgo es el proceso de influir en otros para alcanzar un objetivo común en cuidados", "La influencia es lo opuesto al liderazgo", "La influencia y el liderazgo son términos sinónimos sin matices"], correct: 1 },
      { q: "¿Cuál es la conclusión clave sobre la aplicación de estilos de liderazgo en la práctica moderna de enfermería?", options: ["Usar un solo estilo siempre", "La mayoría de líderes encuentran equilibrio entre estilos, ajustándose a las necesidades del equipo y contexto", "Los estilos nunca se deben mezclar", "No importa qué estilo se use"], correct: 1 }
    ]
  },
  {
    id: 3,
    title: "Competencias Digitales",
    subtitle: "IA y escenarios futuros",
    icon: Lightbulb,
    questions: [
      { q: "¿Cuál es la definición más precisa de competencias digitales en enfermería según el contexto académico?", options: ["Solo la capacidad de usar email y programas básicos", "Conjunto de habilidades para utilizar efectivamente TIC incluyendo datos electrónicos, telemedicina, seguridad y herramientas de IA", "La capacidad exclusiva de programar sistemas de salud", "El conocimiento de las redes sociales"], correct: 1 },
      { q: "¿Cuál es la distinción fundamental entre IA débil (estrecha) y IA fuerte (general)?", options: ["La IA débil es más costosa que la fuerte", "IA débil realiza tareas específicas; IA fuerte posee capacidades cognitivas similares a humanos", "No hay diferencia real entre ambas", "La IA fuerte solo se usa en laboratorios"], correct: 1 },
      { q: "En el contexto de diagnóstico asistido por IA en enfermería, ¿cuál es el principal beneficio de los algoritmos de IA en imágenes médicas?", options: ["Reemplazar completamente al profesional sanitario", "Detectar patrones no evidentes al ojo humano para diagnósticos más rápidos y precisos", "Reducir únicamente costos operativos", "Aumentar el tiempo de consulta"], correct: 1 },
      { q: "¿Cuál es el propósito principal de la gestión de grandes volúmenes de datos de salud mediante IA?", options: ["Almacenar información sin procesar", "Analizar datos para extraer información que guíe el cuidado, identificar tendencias y predecir resultados", "Solo crear copias de seguridad", "Difundir información del paciente"], correct: 1 },
      { q: "¿Cuál es la diferencia crítica entre Sistemas EHR y plataformas de telemedicina en términos de competencias digitales requeridas?", options: ["Son exactamente lo mismo", "EHR gestiona registros electrónicos; telemedicina facilita consultas virtuales y monitoreo remoto", "Ambos solo sirven para almacenar datos", "La telemedicina es obsoleta"], correct: 1 },
      { q: "Según el documento, ¿cuáles son los principios éticos fundamentales que las enfermeras deben comprender al usar sistemas de IA?", options: ["Solo la eficiencia económica", "Autonomía del paciente, beneficencia, no maleficencia y justicia", "Únicamente la velocidad de procesamiento", "La ganancia institucional"], correct: 1 },
      { q: "¿Cuál es la responsabilidad principal de las enfermeras en equipos multidisciplinares de desarrollo de IA?", options: ["Solo ejecutar órdenes técnicas", "Aportar experiencia clínica, perspectiva del paciente, y guiar desarrollo de herramientas clínicamente relevantes y centradas en el paciente", "Programar algoritmos", "Reemplazar a ingenieros"], correct: 1 },
      { q: "¿Cuáles son las barreras técnicas más significativas para la adopción de IA en salud mencionadas en el documento?", options: ["Falta de dinero solamente", "Falta de interoperabilidad entre sistemas y necesidad de infraestructuras robustas de datos", "La resistencia de los pacientes", "Los hospitales no quieren cambiar"], correct: 1 },
      { q: "¿Cuál es el rol crítico de las enfermeras en la fase de evaluación de herramientas de IA según el documento?", options: ["No participan en evaluación", "Probar en entornos reales, evaluar usabilidad/eficacia/seguridad, monitorear resultados y sugerir mejoras basadas en retroalimentación", "Solo observar desde lejos", "Reportar problemas técnicos al departamento IT"], correct: 1 },
      { q: "¿Cuál es la conclusión principal sobre el futuro de la enfermería en la era digital según el documento?", options: ["La tecnología reemplazará a las enfermeras", "Las enfermeras deben ser líderes en transformación digital, integrando tecnología con cuidado humano centrado en el paciente", "La enfermería permanecerá sin cambios", "Solo los ingenieros importan en salud digital"], correct: 1 }
    ]
  },
  {
    id: 4,
    title: "Gestión de la Comunicación",
    subtitle: "Efectiva y asertiva",
    icon: MessageSquare,
    questions: [
      { q: "¿Cuál es el elemento MENOS importante en comunicación?", options: ["Escucha activa", "Empatía", "Feedback", "La forma física del emisor"], correct: 3 },
      { q: "La comunicación asertiva implica:", options: ["Ser agresivo", "Expresar opiniones respetando a otros", "Ser pasivo", "Manipular"], correct: 1 },
      { q: "¿Qué porcentaje es comunicación NO verbal?", options: ["10%", "35%", "55-60%", "90%"], correct: 2 },
      { q: "En un conflicto, la comunicación debe ser:", options: ["Vaga", "Clara, honesta y respetuosa", "Pasiva", "Agresiva"], correct: 1 },
      { q: "¿Qué es el feedback constructivo?", options: ["Crítica personal", "Evaluación específica para mejorar", "Halago siempre", "Ignorar errores"], correct: 1 }
    ]
  },
  {
    id: 5,
    title: "El Clima Laboral",
    subtitle: "Ambiente y satisfacción",
    icon: Zap,
    questions: [
      { q: "¿Cuál es un indicador de buen clima laboral?", options: ["Muchos conflictos", "Confianza y respeto mutuo", "Alta rotación", "Aislamiento"], correct: 1 },
      { q: "¿Qué factor NO impacta el clima laboral?", options: ["Comunicación", "Reconocimiento", "Liderazgo", "El color de la pared"], correct: 3 },
      { q: "Un mal clima laboral provoca:", options: ["Mejoría de resultados", "Mayor absentismo y rotación", "Mayor productividad", "Mejor calidad"], correct: 1 },
      { q: "¿Cómo mejorar el clima laboral?", options: ["Ignorar problemas", "Fomentar comunicación y reconocimiento", "Aumentar estrés", "Reducir personal"], correct: 1 },
      { q: "El engagement de los empleados está relacionado con:", options: ["Solo el sueldo", "Propósito y desarrollo", "Cantidad de horas", "Número de supervisores"], correct: 1 }
    ]
  },
  {
    id: 6,
    title: "La Gestión del Conflicto",
    subtitle: "Negociación y mediación",
    icon: Activity,
    questions: [
      { q: "¿Es el conflicto siempre negativo?", options: ["Sí siempre", "No, puede generar mejora", "Depende del jefe", "Nunca hay conflictos"], correct: 1 },
      { q: "El estilo Evitación consiste en:", options: ["Buscar solución", "Ignorar el problema", "Imponer criterio", "Cooperar"], correct: 1 },
      { q: "Negociación Ganar-Ganar significa:", options: ["Yo gano", "Beneficio mutuo", "El jefe decide", "Moneda al aire"], correct: 1 },
      { q: "En mediación de conflictos:", options: ["El mediador decide", "Un tercero neutral facilita solución", "Se sanciona", "Se ignora"], correct: 1 },
      { q: "Una causa común de conflicto es:", options: ["Exceso de personal", "Ambigüedad de roles y falta de recursos", "Tiempo libre", "Salarios altos"], correct: 1 }
    ]
  },
  {
    id: 7,
    title: "La Motivación en Gestión",
    subtitle: "Teorías y aplicación",
    icon: TrendingUp,
    questions: [
      { q: "Según Maslow, ¿cuál es la primera necesidad?", options: ["Autorrealización", "Fisiológica", "Social", "Estima"], correct: 1 },
      { q: "La teoría de Herzberg habla de:", options: ["Necesidades", "Factores de higiene y motivadores", "Liderazgo", "Comunicación"], correct: 1 },
      { q: "¿Qué motiva más a un empleado?", options: ["Solo dinero", "Propósito, reconocimiento y desarrollo", "Miedo", "Supervisión constante"], correct: 1 },
      { q: "La desmotivación en enfermería se debe a:", options: ["Falta de descanso", "Falta de reconocimiento y desarrollo", "Exceso de paciencia", "Demasiada autonomía"], correct: 1 },
      { q: "¿Cómo mantener motivado el equipo?", options: ["Amenazas", "Reconocimiento, desarrollo y propósito claro", "Competencia interna", "Aislamiento"], correct: 1 }
    ]
  },
  {
    id: 8,
    title: "Trabajo en Equipo",
    subtitle: "Sinergia y roles",
    icon: Users,
    questions: [
      { q: "¿Diferencia entre grupo y equipo?", options: ["El número", "Objetivo común y sinergia", "Mismo turno", "No hay diferencia"], correct: 1 },
      { q: "¿Qué es sinergia?", options: ["Llevarse bien", "Resultado > suma partes (1+1=3)", "Trabajar rápido", "Hablar durante turno"], correct: 1 },
      { q: "Según Belbin, ¿qué son roles de equipo?", options: ["Cargos", "Patrones de comportamiento", "Tareas asignadas", "Antigüedad"], correct: 1 },
      { q: "Barrera para trabajo en equipo:", options: ["Comunicación asertiva", "Confianza", "Falta de claridad en objetivos", "Diversidad"], correct: 2 },
      { q: "Para fomentar equipo vital:", options: ["Competencia", "Crítica pública", "Comunicación abierta y respeto", "Aislarse"], correct: 2 }
    ]
  },
  {
    id: 9,
    title: "Imagen Digital de la Enfermera",
    subtitle: "Redes y reputación",
    icon: BookOpen,
    questions: [
      { q: "¿Qué es la reputación digital?", options: ["Tener muchos seguidores", "Percepción en línea de una persona", "Usar redes sociales", "Vender online"], correct: 1 },
      { q: "¿Cuál es un riesgo de compartir info sanitaria?", options: ["Mejorar marca", "Violar confidencialidad paciente", "Ganar seguidores", "Promocionar hospital"], correct: 1 },
      { q: "¿Qué debe hacer una enfermera online?", options: ["Compartir casos", "Ser profesional y respetuoso", "Mostrar todo", "Criticar colegas"], correct: 1 },
      { q: "La huella digital es:", options: ["Datos de login", "Rastro de actividad en línea", "Foto de perfil", "Contraseña"], correct: 1 },
      { q: "¿Cómo proteger imagen digital?", options: ["Compartir todo", "Privacidad, cuidado contenido, profesionalismo", "No usar redes", "Anonimato absoluto"], correct: 1 }
    ]
  },
  {
    id: 10,
    title: "Toma de Decisiones",
    subtitle: "Resolución de problemas",
    icon: Brain,
    questions: [
      { q: "¿Primer paso en decisiones?", options: ["Evaluar alternativas", "Identificar problema", "Implementar", "Consultar gerente"], correct: 1 },
      { q: "Matriz Eisenhower, tarea importante NO urgente:", options: ["Hacer ya", "Planificar", "Delegar", "Eliminar"], correct: 1 },
      { q: "¿Qué es coste de oportunidad?", options: ["Dinero de decidir", "Valor opción no elegida", "Tiempo pensando", "Coste material"], correct: 1 },
      { q: "Decisiones basadas en evidencia:", options: ["Tradición", "Mejor investigación disponible", "Intuición", "Paciente quiere"], correct: 1 },
      { q: "Situación urgente, decisión:", options: ["Lenta", "Rápida y directiva", "Pospuesta", "Aleatoria"], correct: 1 }
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
