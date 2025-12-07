import { GoogleGenAI } from '@google/genai';

const TERMINOLOGY_RULES = `
REGLAS OBLIGATORIAS DE TERMINOLOGÍA:
- Usa EXCLUSIVAMENTE los términos "gestor enfermero" o "gestora enfermera" para referirse a profesionales de gestión enfermera.
- NUNCA uses los términos "médico", "doctor", "doctora" ni "facultativo".
- Usa siempre "profesional sanitario/a", "enfermero/a" o "gestor/a enfermero/a" según corresponda.
- El contexto siempre es gestión enfermera, NO gestión médica.
- Habla de "equipos de enfermería", "unidades de enfermería", "supervisores/as de enfermería".
`;

const DEFAULT_SYSTEM_PROMPT = `Eres un asistente experto en gestión sanitaria para gestores y gestoras enfermeras.
Tu nombre es "Asistente NurseManager".
Ayudas a estudiantes y profesionales de enfermería a aprender sobre:
- Gestión de equipos de enfermería
- Liderazgo enfermero
- Administración sanitaria desde la perspectiva enfermera
- Calidad asistencial
- Seguridad del paciente
- Marketing sanitario
- Innovación en enfermería

${TERMINOLOGY_RULES}

Responde siempre en español de forma clara, profesional y educativa.
Usa ejemplos prácticos cuando sea posible.
Si no sabes algo, admítelo honestamente.`;

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

let aiClient = null;
let generativeModel = null;

function getApiKey() {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY_1 ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.VERCEL_GEMINI_API_KEY ||
    "";
  if (!apiKey) {
    throw new Error(
      "Falta la clave de la API de Gemini (usa GEMINI_API_KEY o GOOGLE_API_KEY_1)"
    );
  }
  return apiKey;
}

function getAiClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return aiClient;
}

function getModel() {
  if (!generativeModel) {
    const ai = getAiClient();
    generativeModel = ai.getGenerativeModel({
      model: MODEL_NAME,
    });
  }
  return generativeModel;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGeminiViaClient(contents) {
  const model = getModel();
  const response = await model.generateContent(contents);
  const text = response?.response?.text?.();

  if (!text) {
    throw new Error("La IA no devolvió contenido");
  }

  return text;
}

async function callGeminiViaRest(contents) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${getApiKey()}`;
  const restResponse = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!restResponse.ok) {
    const message = restResponse.status === 503
      ? 'El servicio de IA está temporalmente sobrecargado'
      : 'La IA no pudo procesar la solicitud';
    throw new Error(message);
  }

  const data = await restResponse.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts
    .map((part) => part?.text || '')
    .filter(Boolean)
    .join('')
    .trim();

  if (!text) {
    throw new Error('La IA no devolvió contenido');
  }

  return text;
}

async function callGeminiWithRetry(contents, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callGeminiViaClient(contents);
    } catch (clientError) {
      console.error(`Attempt ${attempt}/${maxRetries} failed via SDK:`, clientError.message);

      try {
        return await callGeminiViaRest(contents);
      } catch (restError) {
        console.error(`REST fallback failed on attempt ${attempt}:`, restError.message);
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await sleep(delay);
      }
    }
  }

  throw new Error('No se pudo obtener respuesta de la IA tras varios intentos');
}

export function respondGeminiError(res, error) {
  console.error("Error calling Gemini:", error);

  if (error.status === 503 || error.message?.includes('overloaded')) {
    res.status(503).json({
      error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
      retryable: true
    });
  } else {
    res.status(500).json({ error: `Error al comunicarse con la IA: ${error.message}` });
  }
}

export async function chatWithGemini({ message, history = [], systemPrompt: customPrompt }) {
  const systemPrompt = customPrompt
    ? `${customPrompt}\n\n${TERMINOLOGY_RULES}`
    : DEFAULT_SYSTEM_PROMPT;

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?" }] },
    ...history,
    { role: "user", parts: [{ text: message }] }
  ];

  const responseText = await callGeminiWithRetry(contents);
  return responseText || "Lo siento, no pude generar una respuesta.";
}

export async function generateQuizQuestion(topic) {
  const prompt = `Genera una pregunta de quiz sobre "${topic}" para estudiantes de enfermería en gestión sanitaria.

Responde SOLO con un JSON válido en este formato exacto:
{
  "question": "La pregunta aquí",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0,
  "explanation": "Explicación de por qué es correcta"
}

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

  const responseText = await callGeminiWithRetry(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("No se pudo parsear la respuesta");
}

export async function generateDecisionScenario(category) {
  const categories = [
    'Gestión de Recursos Humanos',
    'Gestión Asistencial',
    'Seguridad del Paciente',
    'Recursos Materiales',
    'Gestión de Conflictos',
    'Gestión Estratégica',
    'Liderazgo Enfermero',
    'Calidad Asistencial'
  ];

  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];

  const prompt = `Genera un escenario de toma de decisiones para gestoras enfermeras sobre "${selectedCategory}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título breve y descriptivo del escenario",
  "category": "${selectedCategory}",
  "difficulty": "Intermedio",
  "duration": "15-20 min",
  "icon": "📋",
  "color": "from-cyan-500 to-blue-500",
  "description": "Descripción breve del dilema o situación (2-3 frases)",
  "actors": ["Actor 1", "Actor 2", "Actor 3"],
  "topics": ["Tema 1", "Tema 2", "Tema 3"]
}

IMPORTANTE:
- El escenario debe ser REALISTA y basado en situaciones reales de gestión enfermera en hospitales españoles
- Los actores deben ser profesionales de enfermería (supervisoras, enfermeras, TCAEs)
- La descripción debe plantear un DILEMA que requiera toma de decisiones
- Usa colores que combinen bien: from-cyan-500 to-blue-500, from-blue-500 to-indigo-500, from-indigo-500 to-purple-500, from-teal-500 to-cyan-500
- NO incluyas "id" en el JSON, se generará automáticamente`;

  const responseText = await callGeminiWithRetry(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No se pudo parsear la respuesta");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error("JSON inválido en la respuesta");
  }

  if (!parsed.title || !parsed.description || !parsed.actors) {
    throw new Error("Respuesta incompleta de la IA");
  }

  parsed.id = `escenario-ai-${Date.now()}`;
  return parsed;
}

export async function generateDecisionTree(categoryOverride) {
  const categories = [
    'Recursos Humanos',
    'Atención a Reclamaciones',
    'Gestión de Crisis',
    'Conflictos de Equipo',
    'Seguridad del Paciente',
    'Comunicación'
  ];

  const category = categoryOverride || categories[Math.floor(Math.random() * categories.length)];

  const prompt = `Genera un árbol de decisiones para gestoras enfermeras sobre "${category}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título descriptivo del caso",
  "description": "Descripción breve de la situación inicial (1-2 frases)",
  "category": "${category}",
  "icon": "🌙",
  "color": "from-blue-500 to-indigo-500",
  "initialNode": "start",
  "nodes": {
    "start": {
      "text": "Descripción detallada de la situación inicial (3-4 frases). Incluye contexto, hora, personas involucradas y el problema específico. Termina con ¿Qué decides hacer?",
      "options": [
        { "text": "Opción 1 - descripción de la acción", "next": "node1" },
        { "text": "Opción 2 - descripción de la acción", "next": "node2" },
        { "text": "Opción 3 - descripción de la acción", "next": "node3" }
      ]
    },
    "node1": {
      "text": "Consecuencia de la opción 1. Qué pasa después.",
      "options": [
        { "text": "Siguiente opción A", "next": "end_good" },
        { "text": "Siguiente opción B", "next": "end_medium" }
      ]
    },
    "node2": {
      "text": "Consecuencia de la opción 2.",
      "options": [
        { "text": "Siguiente opción", "next": "end_medium" }
      ]
    },
    "node3": {
      "text": "Consecuencia de la opción 3.",
      "options": [
        { "text": "Siguiente opción", "next": "end_bad" }
      ]
    },
    "end_good": {
      "text": "Resultado excelente.",
      "isEnd": true,
      "score": 9,
      "feedback": "Excelente gestión."
    },
    "end_medium": {
      "text": "Resultado aceptable.",
      "isEnd": true,
      "score": 6,
      "feedback": "Decisión aceptable."
    },
    "end_bad": {
      "text": "Resultado negativo.",
      "isEnd": true,
      "score": 3,
      "feedback": "Esta decisión tuvo consecuencias negativas."
    }
  }
}

IMPORTANTE:
- Crea al menos 6 nodos con diferentes caminos
- Incluye al menos 3 finales diferentes (bueno, medio, malo)
- Los scores van de 1 a 10
- El feedback debe ser educativo y constructivo
- Situaciones realistas de gestión enfermera en España
- NO incluyas "id" en el JSON, se generará automáticamente`;

  const responseText = await callGeminiWithRetry(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No se pudo parsear la respuesta");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error("JSON inválido en la respuesta");
  }

  if (!parsed.title || !parsed.nodes || !parsed.initialNode) {
    throw new Error("Respuesta incompleta de la IA");
  }

  parsed.id = `tree-ai-${Date.now()}`;
  return parsed;
}

export async function generatePriorityExercise(topicOverride) {
  const context = topicOverride ? `sobre ${topicOverride}` : 'en un turno de planta hospitalaria';

  const prompt = `Genera un ejercicio de priorización para una gestora enfermera ${context}.

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título breve del ejercicio",
  "description": "Contexto general del turno (1-2 frases)",
  "tasks": [
    {
      "id": "t1",
      "title": "Título de la tarea",
      "category": "Tipo de tarea (clínica/administrativa/urgencia, etc.)",
      "urgency": "Alta/Media/Baja",
      "impact": "Alto/Medio/Bajo",
      "estimatedTime": "15-20 min",
      "priority": 1,
      "explanation": "Por qué tiene esta prioridad"
    }
  ]
}

CRITERIOS DE PRIORIZACIÓN (de mayor a menor):
1. Emergencias vitales (dolor torácico, dificultad respiratoria, caídas inminentes)
2. Medicación tiempo-dependiente (insulina, antibióticos IV)
3. Valoraciones clínicas urgentes
4. Tareas programadas con hora fija
5. Cuidados de enfermería rutinarios
6. Tareas administrativas y documentación

IMPORTANTE:
- Incluye EXACTAMENTE 6 tareas
- Las prioridades deben ser del 1 al 6 (sin repetir)
- Las explicaciones deben justificar el orden según criterios clínicos
- Situaciones realistas de enfermería en España
- NO incluyas "id" en el JSON principal, se generará automáticamente`;

  const responseText = await callGeminiWithRetry(prompt);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No se pudo parsear la respuesta");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error("JSON inválido en la respuesta");
  }

  if (!parsed.title || !parsed.tasks || !Array.isArray(parsed.tasks)) {
    throw new Error("Respuesta incompleta de la IA");
  }

  parsed.id = `priority-ai-${Date.now()}`;
  return parsed;
}

export async function generateLeadershipScenario(categoryOverride) {
  const categories = [
    'Gestión del Cambio',
    'Resolución de Conflictos',
    'Motivación de Equipos',
    'Desarrollo de Personas',
    'Liderazgo en Crisis',
    'Comunicación Estratégica',
    'Toma de Decisiones'
  ];

  const category = categoryOverride || categories[Math.floor(Math.random() * categories.length)];

  const prompt = `Genera un escenario de liderazgo para gestoras enfermeras sobre "${category}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título breve del escenario de liderazgo",
  "category": "${category}",
  "description": "Descripción del desafío de liderazgo (2-3 frases)",
  "difficulty": "Intermedio",
  "icon": "emoji representativo",
  "color": "from-emerald-500 to-teal-500"
}

IMPORTANTE:
- El escenario debe ser REALISTA y basado en situaciones reales de liderazgo enfermero
- Debe plantear un desafío que requiera habilidades de liderazgo
- Usa colores: from-emerald-500 to-teal-500, from-rose-500 to-pink-500, from-amber-500 to-orange-500
- NO incluyas "id" en el JSON, se generará automáticamente`;

  const response = await callGeminiWithRetry(prompt);
  const text = response.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No se pudo parsear la respuesta");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error("JSON inválido en la respuesta");
  }

  if (!parsed.title || !parsed.description) {
    throw new Error("Respuesta incompleta de la IA");
  }

  parsed.id = `leadership-ai-${Date.now()}`;
  return parsed;
}

export {
  TERMINOLOGY_RULES,
  DEFAULT_SYSTEM_PROMPT
};
