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

const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️ Falta la variable GOOGLE_API_KEY_1 o GOOGLE_API_KEY para Gemini.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildRequest(input, model = 'gemini-2.5-flash') {
  if (typeof input === 'string') {
    return {
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: input }],
        },
      ],
    };
  }

  return { model, contents: input };
}

async function callGeminiWithRetry(input, maxRetries = 3) {
  if (!ai) {
    throw new Error('Falta la clave de API de Gemini (GOOGLE_API_KEY_1 o GOOGLE_API_KEY)');
  }

  let lastError;
  const request = buildRequest(input);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (error.status === 503 || error.message?.includes('overloaded')) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await sleep(delay);
          continue;
        }
      }

      break;
    }
  }

  throw lastError || new Error('Error desconocido al llamar a Gemini');
}

export { TERMINOLOGY_RULES, DEFAULT_SYSTEM_PROMPT, callGeminiWithRetry };
