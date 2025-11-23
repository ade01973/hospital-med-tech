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
      { q: "¿Cuál NO es una función básica del proceso administrativo enfermero?", options: ["Planificar", "Diagnosticar clínicamente", "Organizar", "Evaluar/Controlar"], correct: 1 },
      { q: "La Supervisora de Unidad es un cargo de gestión:", options: ["Alta Dirección", "Gestión Intermedia (Mesogestión)", "Gestión Clínica (Microgestión)", "Gestión Política"], correct: 1 },
      { q: "¿Qué competencia es esencial para una gestora enfermera?", options: ["Saber canalizar vías centrales", "Inteligencia Emocional y Comunicación", "Memorizar el vademécum", "Ser la más antigua de la planta"], correct: 1 },
      { q: "La Dirección de Enfermería se encarga de:", options: ["La gestión estratégica de los cuidados del hospital", "Repartir la medicación", "Limpiar los quirófanos", "Atender las urgencias leves"], correct: 0 },
      { q: "¿Qué responsabilidad tiene la gestora respecto a los recursos?", options: ["Usar los más caros", "Eficiencia y uso racional", "No es su responsabilidad", "Maximizar gastos"], correct: 1 }
    ]
  },
  {
    id: 2,
    title: "Liderazgo",
    subtitle: "Estilos de liderazgo",
    icon: User,
    questions: [
      { q: "¿Qué estilo de liderazgo se caracteriza por decisiones unilaterales?", options: ["Democrático", "Autoritario", "Laissez-faire", "Transformacional"], correct: 1 },
      { q: "¿Cuál es la principal diferencia entre un jefe y un líder?", options: ["El jefe inspira", "El jefe tiene autoridad formal, el líder influye", "No hay diferencia", "El líder cobra más"], correct: 1 },
      { q: "El liderazgo Laissez-faire se caracteriza por:", options: ["Control absoluto", "Alta participación", "Ausencia de dirección", "Motivación constante"], correct: 2 },
      { q: "¿Qué estilo es más adecuado en emergencia?", options: ["Participativo", "Autoritario", "Laissez-faire", "Coaching"], correct: 1 },
      { q: "El líder transformacional busca:", options: ["Mantener status quo", "Intercambiar premios", "Inspirar cambio", "Evitar conflictos"], correct: 2 }
    ]
  },
  {
    id: 3,
    title: "Competencias Digitales",
    subtitle: "IA y escenarios futuros",
    icon: Lightbulb,
    questions: [
      { q: "¿Cuál es una ventaja clave de la IA en salud?", options: ["Reemplazar enfermeras", "Mejorar diagnósticos y eficiencia", "Reducir costos solo", "Automatizar todo"], correct: 1 },
      { q: "¿Qué competencia digital es esencial hoy?", options: ["Navegar internet", "Pensamiento crítico y adaptabilidad", "Programación avanzada", "Reparar computadoras"], correct: 1 },
      { q: "¿Cuál es un riesgo de la IA en enfermería?", options: ["Crear más trabajo", "Pérdida de humanidad en cuidados", "Mejorar siempre todo", "No hay riesgos"], correct: 1 },
      { q: "¿Qué es la transformación digital?", options: ["Cambiar de dispositivos", "Integrar tecnología en procesos y cultura", "Solo usar email", "Tener un sitio web"], correct: 1 },
      { q: "¿Cuál es un escenario futuro probable?", options: ["Menos tecnología", "Más automatización e IA colaborativa", "Sin cambios", "Volver al papel"], correct: 1 }
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
