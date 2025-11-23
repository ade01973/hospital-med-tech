import { Activity, BookOpen, User, Users, Brain, Stethoscope } from 'lucide-react';

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
    title: "Liderazgo y Estilos",
    subtitle: "Fundamentos de Influencia",
    icon: User,
    questions: [
      { q: "¿Qué estilo de liderazgo se caracteriza por la toma de decisiones unilateral sin consultar al equipo?", options: ["Democrático", "Autoritario (Autocrático)", "Laissez-faire", "Transformacional"], correct: 1 },
      { q: "¿Cuál es la principal diferencia entre un jefe y un líder?", options: ["El jefe inspira, el líder manda", "El jefe tiene autoridad formal, el líder influye", "No hay diferencia", "El líder siempre cobra más"], correct: 1 },
      { q: "El liderazgo 'Laissez-faire' se caracteriza por:", options: ["Control absoluto", "Alta participación", "Ausencia de dirección y control", "Motivación constante"], correct: 2 },
      { q: "¿Qué estilo de liderazgo es más adecuado en una situación de parada cardiorrespiratoria?", options: ["Participativo", "Autoritario", "Laissez-faire", "Coaching"], correct: 1 },
      { q: "El líder transformacional busca:", options: ["Mantener el status quo", "Intercambiar premios por trabajo", "Inspirar y motivar el cambio", "Evitar conflictos a toda costa"], correct: 2 }
    ]
  },
  {
    id: 2,
    title: "La Gestora Enfermera",
    subtitle: "Competencias Clave",
    icon: Stethoscope,
    questions: [
      { q: "¿Cuál NO es una función básica del proceso administrativo enfermero?", options: ["Planificar", "Diagnosticar clínicamente", "Organizar", "Evaluar/Controlar"], correct: 1 },
      { q: "La Supervisora de Unidad es un cargo de gestión:", options: ["Alta Dirección", "Gestión Intermedia (Mesogestión)", "Gestión Clínica (Microgestión)", "Gestión Política"], correct: 2 },
      { q: "¿Qué competencia es esencial para una gestora enfermera?", options: ["Saber canalizar vías centrales", "Inteligencia Emocional y Comunicación", "Memorizar el vademécum", "Ser la más antigua de la planta"], correct: 1 },
      { q: "La Dirección de Enfermería se encarga de:", options: ["La gestión estratégica de los cuidados del hospital", "Repartir la medicación", "Limpiar los quirófanos", "Atender las urgencias leves"], correct: 0 },
      { q: "¿Qué responsabilidad tiene la gestora respecto a los recursos materiales?", options: ["Usar los más caros siempre", "Eficiencia y uso racional", "No es su responsabilidad", "Esconderlos para que no falten"], correct: 1 }
    ]
  },
  {
    id: 3,
    title: "Trabajo en Equipo",
    subtitle: "Sinergia y Roles",
    icon: Users,
    questions: [
      { q: "¿Cuál es la diferencia clave entre un grupo y un equipo?", options: ["El número de personas", "El equipo tiene un objetivo común y sinergia", "El grupo trabaja en el mismo turno", "No hay diferencia"], correct: 1 },
      { q: "¿Qué es la sinergia en un equipo de enfermería?", options: ["Llevarse bien", "Que el resultado del equipo es superior a la suma de las partes (1+1=3)", "Trabajar rápido", "Evitar hablar durante el turno"], correct: 1 },
      { q: "Según Belbin, ¿qué son los roles de equipo?", options: ["Los cargos del contrato", "Patrones de comportamiento que adoptan los miembros", "Las tareas asignadas por la supervisora", "La antigüedad en el puesto"], correct: 1 },
      { q: "Un elemento barrera para el trabajo en equipo es:", options: ["La comunicación asertiva", "La confianza mutua", "La falta de claridad en los objetivos", "La diversidad de habilidades"], correct: 2 },
      { q: "Para fomentar el trabajo en equipo es vital:", options: ["Competir entre compañeros", "Criticar los errores públicamente", "Comunicación abierta y respeto", "Aislarse para concentrarse"], correct: 2 }
    ]
  },
  {
    id: 4,
    title: "Toma de Decisiones",
    subtitle: "Resolución de Problemas",
    icon: Brain,
    questions: [
      { q: "¿Cuál es el primer paso en el proceso de toma de decisiones?", options: ["Evaluar alternativas", "Identificar y definir el problema", "Implementar la solución", "Consultar con el gerente"], correct: 1 },
      { q: "En la matriz de Eisenhower, una tarea 'Importante pero NO Urgente' se debe:", options: ["Hacer ya", "Planificar", "Delegar", "Eliminar"], correct: 1 },
      { q: "¿Qué es el coste de oportunidad?", options: ["El dinero que cuesta decidir", "El valor de la mejor opción no seleccionada", "El tiempo perdido pensando", "El coste del material gastado"], correct: 1 },
      { q: "La toma de decisiones basada en la evidencia implica:", options: ["Hacer lo que siempre se ha hecho", "Usar la mejor investigación científica disponible", "Decidir por intuición", "Preguntar al paciente qué quiere"], correct: 1 },
      { q: "Ante una situación crítica y urgente, la toma de decisiones suele ser:", options: ["Consensuada y lenta", "Rápida y directiva", "Pospuesta", "Aleatoria"], correct: 1 }
    ]
  },
  {
    id: 5,
    title: "Gestión del Conflicto",
    subtitle: "Negociación y Mediación",
    icon: Activity,
    questions: [
      { q: "¿Es el conflicto siempre negativo en una organización?", options: ["Sí, siempre rompe el equipo", "No, puede ser una oportunidad de mejora y cambio", "Solo si hay gritos", "Sí, debe evitarse a toda costa"], correct: 1 },
      { q: "El estilo de afrontamiento 'Evitación' consiste en:", options: ["Buscar una solución media", "Ignorar el conflicto esperando que desaparezca", "Imponer mi criterio", "Cooperar al máximo"], correct: 1 },
      { q: "¿Qué es la negociación 'Ganar-Ganar'?", options: ["Yo gano, tú pierdes", "Ambas partes ceden para obtener beneficio mutuo", "El jefe decide quién gana", "Se lanza una moneda"], correct: 1 },
      { q: "En la mediación de conflictos:", options: ["El mediador decide la solución", "Un tercero neutral ayuda a las partes a encontrar solución", "Se sanciona al culpable", "Se ignora el problema"], correct: 1 },
      { q: "¿Cuál es una causa común de conflicto en enfermería?", options: ["Exceso de personal", "Ambigüedad de roles y falta de recursos", "Demasiado tiempo libre", "Salarios excesivamente altos"], correct: 1 }
    ]
  },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: i + 6,
    title: `Módulo ${i + 6}`,
    subtitle: "Contenido Avanzado",
    icon: BookOpen,
    questions: Array(5).fill({
      q: "¿Pregunta pendiente de definir por el docente?",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct: 0
    })
  }))
];
