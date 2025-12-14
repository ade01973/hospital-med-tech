import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";
const TERMINOLOGY_RULES = `
REGLAS OBLIGATORIAS DE TERMINOLOGÍA:
- Usa EXCLUSIVAMENTE los términos "gestor enfermero" o "gestora enfermera" para referirse a profesionales de gestión enfermera.
- NUNCA uses los términos "médico", "doctor", "doctora" ni "facultativo".
- Usa siempre "profesional sanitario/a", "enfermero/a" o "gestor/a enfermero/a" según corresponda.
- El contexto siempre es gestión enfermera, NO gestión médica.
- Habla de "equipos de enfermería", "unidades de enfermería", "supervisores/as de enfermería".`;

const TOPICS = [
  "Liderazgo enfermero",
  "Toma de decisiones",
  "Gestión de equipos",
  "Gestión de conflictos",
  "Comunicación efectiva",
  "Ética en enfermería",
  "Inteligencia artificial en salud",
  "Imagen profesional",
  "Imagen digital",
  "Marketing sanitario",
  "Dirección estratégica",
  "Gestión de recursos humanos",
  "Calidad asistencial",
  "Gestión por procesos"
];

const buildPrompt = (topic) => `Genera un reto corto de ahorcado para gestoras enfermeras sobre "${topic}".

${TERMINOLOGY_RULES}

Devuelve SOLO un JSON válido con este formato:
{
  "topic": "${topic}",
  "question": "Pregunta breve (1 frase) relacionada con el tema",
  "hint": "Pista concisa que ayude a descubrir la palabra",
  "answer": "Palabra o término clave (1-3 palabras, máximo 18 caracteres sin símbolos raros)",
  "celebration": "Frase corta de celebración con emoji",
  "takeaway": "Aprendizaje rápido en una sola frase"
}

Reglas adicionales:
- La respuesta debe ser un concepto de gestión ENFERMERA.
- Usa solo letras y espacios (sin números).
- Prioriza que cada reto cambie de tema para mantener variedad.`;

const parseJsonResponse = (text) => {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo parsear la respuesta de Gemini");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.answer || !parsed.question) {
    throw new Error("Respuesta incompleta del modelo");
  }

  return parsed;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.GOOGLE_API_KEY_1) {
      return res.status(500).json({ error: 'Falta GOOGLE_API_KEY_1 para generar el reto de ahorcado. Configura la clave en tu entorno.' });
    }

    const { topic } = req.body || {};
    const selectedTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_1);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: buildPrompt(selectedTopic) }] }] });
    const response = await result.response;
    const text = response?.text?.();

    if (!text) {
      throw new Error('La respuesta de Gemini llegó vacía.');
    }

    const parsed = parseJsonResponse(text);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error en hangman Gemini API:', error);
    return res.status(500).json({ error: error.message || 'No se pudo generar el reto de ahorcado.' });
  }
}
