import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY_1 || "";
const ai = new GoogleGenAI({ apiKey });

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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function ensureApiKey(res) {
  if (!apiKey) {
    res.status(500).json({
      error: 'La API de Gemini no está configurada. Define GOOGLE_API_KEY_1 en las variables de entorno.'
    });
    return false;
  }
  return true;
}

async function callGeminiWithRetry(contents, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });
      return response;
    } catch (error) {
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (error.status === 503 || error.message?.includes('overloaded')) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await sleep(delay);
          continue;
        }
      }
      
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const { message, history = [], systemPrompt: customPrompt } = req.body;

    const systemPrompt = customPrompt 
      ? `${customPrompt}\n\n${TERMINOLOGY_RULES}`
      : DEFAULT_SYSTEM_PROMPT;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?" }] },
      ...history,
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await callGeminiWithRetry(contents);
    res.json({ response: response.text || "Lo siento, no pude generar una respuesta." });
  } catch (error) {
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
});

app.post('/api/generate-quiz', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const { topic } = req.body;

    const prompt = `Genera una pregunta de quiz sobre "${topic}" para estudiantes de enfermería en gestión sanitaria.

Responde SOLO con un JSON válido en este formato exacto:
{
  "question": "La pregunta aquí",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0,
  "explanation": "Explicación de por qué es correcta"
}

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      throw new Error("No se pudo parsear la respuesta");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
        retryable: true
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/generate-scenario', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const { category } = req.body;
    
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
    
    if (!parsed.title || !parsed.description || !parsed.actors) {
      throw new Error("Respuesta incompleta de la IA");
    }
    
    parsed.id = `escenario-ai-${Date.now()}`;
    res.json(parsed);
  } catch (error) {
    console.error("Error generating scenario:", error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'El servicio de IA está temporalmente sobrecargado.',
        retryable: true
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/generate-decision-tree', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const categories = [
      'Recursos Humanos',
      'Atención a Reclamaciones',
      'Gestión de Crisis',
      'Conflictos de Equipo',
      'Seguridad del Paciente',
      'Comunicación'
    ];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    
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
    
    if (!parsed.title || !parsed.nodes || !parsed.initialNode) {
      throw new Error("Respuesta incompleta de la IA");
    }
    
    parsed.id = `tree-ai-${Date.now()}`;
    res.json(parsed);
  } catch (error) {
    console.error("Error generating decision tree:", error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'El servicio de IA está temporalmente sobrecargado.',
        retryable: true
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/generate-priority-exercise', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const contexts = [
      'Inicio de turno de mañana',
      'Turno de noche con imprevistos',
      'Fin de turno con tareas pendientes',
      'Situación de urgencia en la unidad',
      'Día con alta carga asistencial',
      'Supervisora gestionando múltiples demandas'
    ];
    
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    
    const prompt = `Genera un ejercicio de priorización de tareas para gestoras enfermeras en el contexto: "${context}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título descriptivo del ejercicio",
  "description": "Contexto de la situación (hora, lugar, circunstancias). Máximo 2 frases.",
  "icon": "emoji representativo",
  "color": "from-cyan-500 to-blue-500",
  "tasks": [
    {
      "id": 1,
      "text": "Descripción de la tarea 1",
      "priority": 1,
      "explanation": "Por qué esta tarea es prioridad 1. Criterio clínico."
    },
    {
      "id": 2,
      "text": "Descripción de la tarea 2",
      "priority": 2,
      "explanation": "Por qué esta tarea es prioridad 2."
    },
    {
      "id": 3,
      "text": "Descripción de la tarea 3",
      "priority": 3,
      "explanation": "Por qué esta tarea es prioridad 3."
    },
    {
      "id": 4,
      "text": "Descripción de la tarea 4",
      "priority": 4,
      "explanation": "Por qué esta tarea es prioridad 4."
    },
    {
      "id": 5,
      "text": "Descripción de la tarea 5",
      "priority": 5,
      "explanation": "Por qué esta tarea es prioridad 5."
    },
    {
      "id": 6,
      "text": "Descripción de la tarea 6",
      "priority": 6,
      "explanation": "Por qué esta tarea es prioridad 6."
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
    
    if (!parsed.title || !parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error("Respuesta incompleta de la IA");
    }
    
    parsed.id = `priority-ai-${Date.now()}`;
    res.json(parsed);
  } catch (error) {
    console.error("Error generating priority exercise:", error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'El servicio de IA está temporalmente sobrecargado.',
        retryable: true
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/generate-leadership-scenario', async (req, res) => {
  try {
    if (!ensureApiKey(res)) return;
    const categories = [
      'Gestión del Cambio',
      'Resolución de Conflictos',
      'Motivación de Equipos',
      'Desarrollo de Personas',
      'Liderazgo en Crisis',
      'Comunicación Estratégica',
      'Toma de Decisiones'
    ];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    
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
    res.json(parsed);
  } catch (error) {
    console.error("Error generating leadership scenario:", error);
    
    if (error.status === 503 || error.message?.includes('overloaded')) {
      res.status(503).json({ 
        error: 'El servicio de IA está temporalmente sobrecargado.',
        retryable: true
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.GEMINI_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
