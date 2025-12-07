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

const MODEL_NAME = 'gemini-2.5-flash';
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getApiKey = () => {
  const key = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  if (!key) {
    const error = new Error('No se ha configurado la clave de API de Gemini (GOOGLE_API_KEY_1).');
    error.code = 'NO_API_KEY';
    throw error;
  }
  return key;
};

const createModel = () => {
  const client = new GoogleGenAI({ apiKey: getApiKey() });
  return client.getGenerativeModel({ model: MODEL_NAME });
};

const extractText = (response) => {
  if (!response) return '';
  if (typeof response.text === 'function') return response.text();
  if (response.response && typeof response.response.text === 'function') return response.response.text();
  if (typeof response.text === 'string') return response.text;
  return '';
};

export async function callGeminiWithRetry(payload) {
  const model = createModel();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(payload);
      return extractText(result);
    } catch (error) {
      const overloaded = error.status === 503 || error.message?.includes('overloaded');
      if (attempt === MAX_RETRIES || !overloaded) {
        throw error;
      }
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}. Retrying in ${delay}ms`);
      await sleep(delay);
    }
  }
}

export const buildChatContents = (message, history = [], systemPrompt = null) => {
  const appliedPrompt = systemPrompt ? `${systemPrompt}\n\n${TERMINOLOGY_RULES}` : DEFAULT_SYSTEM_PROMPT;

  return [
    { role: 'user', parts: [{ text: appliedPrompt }] },
    {
      role: 'model',
      parts: [{
        text: 'Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?'
      }]
    },
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ];
};

export const parseJsonFromText = (text) => {
  if (!text) throw new Error('Respuesta vacía de la IA');

  const jsonMatch = typeof text === 'string'
    ? text.match(/\{[\s\S]*\}/)
    : null;

  const rawJson = jsonMatch ? jsonMatch[0] : text;
  return typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
};

export const withCors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
};

export const handleError = (res, error) => {
  console.error('Error calling Gemini:', error);

  if (error.code === 'NO_API_KEY') {
    return res.status(500).json({
      error: 'Falta configurar la clave de Gemini. Añade GOOGLE_API_KEY_1 en las variables de entorno de Vercel.'
    });
  }

  if (error.status === 503 || error.message?.includes('overloaded')) {
    return res.status(503).json({
      error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
      retryable: true
    });
  }

  return res.status(500).json({ error: `Error al comunicarse con la IA: ${error.message}` });
};

export { DEFAULT_SYSTEM_PROMPT, TERMINOLOGY_RULES };
