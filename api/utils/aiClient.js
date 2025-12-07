const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export const TERMINOLOGY_RULES = `
REGLAS OBLIGATORIAS DE TERMINOLOGÍA:
- Usa EXCLUSIVAMENTE los términos "gestor enfermero" o "gestora enfermera" para referirse a profesionales de gestión enfermera.
- NUNCA uses los términos "médico", "doctor", "doctora" ni "facultativo".
- Usa siempre "profesional sanitario/a", "enfermero/a" o "gestor/a enfermero/a" según corresponda.
- El contexto siempre es gestión enfermera, NO gestión médica.
- Habla de "equipos de enfermería", "unidades de enfermería", "supervisores/as de enfermería".
`;

export const DEFAULT_SYSTEM_PROMPT = `Eres un asistente experto en gestión sanitaria para gestores y gestoras enfermeras.
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

function flattenParts(parts = []) {
  return parts.map((part) => part?.text || '').join('').trim();
}

async function callGemini(contents) {
  if (!process.env.GOOGLE_API_KEY_1) {
    throw new Error('GOOGLE_API_KEY_1 no está configurada');
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GOOGLE_API_KEY_1}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini respondió ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part?.text || '').join('').trim();

  if (!text) {
    throw new Error('Gemini no devolvió texto utilizable');
  }

  return text;
}

async function callOpenAI(messages) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.4
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI respondió ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error('OpenAI no devolvió texto utilizable');
  }

  return text;
}

export function mapHistoryToOpenAI(history = []) {
  return history.map((item) => ({
    role: item.role === 'model' ? 'assistant' : 'user',
    content: flattenParts(item.parts)
  }));
}

export async function generateText({ geminiContents, openaiMessages }) {
  const errors = [];

  if (process.env.GOOGLE_API_KEY_1) {
    try {
      const text = await callGemini(geminiContents);
      return { provider: 'gemini', text };
    } catch (error) {
      errors.push(`Gemini: ${error.message}`);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const text = await callOpenAI(openaiMessages);
      return { provider: 'openai', text };
    } catch (error) {
      errors.push(`OpenAI: ${error.message}`);
    }
  }

  if (errors.length === 0) {
    throw new Error('No hay proveedores de IA configurados. Asegúrate de definir GOOGLE_API_KEY_1 u OPENAI_API_KEY.');
  }

  throw new Error(errors.join(' | '));
}

export function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo parsear la respuesta de la IA');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error('JSON inválido en la respuesta de la IA');
  }
}
