const REQUEST_TIMEOUT_MS = 60000;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent';

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

function resolveGeminiApiKey() {
  const key =
    process.env.GOOGLE_API_KEY_1 ||
    process.env.GOOGLE_API_KEY ||
    process.env.API_KEY ||
    '';

  return key.trim();
}

export function hasGeminiApiKey() {
  return Boolean(resolveGeminiApiKey());
}

export async function callGeminiWithRetry(contents, maxRetries = 3) {
  const apiKey = resolveGeminiApiKey();

  if (!apiKey) {
    throw new Error('Falta la API Key de Gemini');
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(
        GEMINI_URL.replace('${MODEL_ID}', GEMINI_MODEL) + `?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ contents }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const error = new Error(errorBody.error?.message || 'Error en la respuesta de Gemini');
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join(' ')
        .trim();

      return { text: text || '', raw: data };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
      }

      const isRetryable = error.status === 503 || error.message?.includes('overloaded');
      if (isRetryable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}

export async function ensureRequestBody(req) {
  if (req.body !== undefined) return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error('El cuerpo de la solicitud no es un JSON válido.');
  }
}

export function jsonResponse(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function methodNotAllowed(res, allowed = ['POST']) {
  res.setHeader('Allow', allowed.join(', '));
  jsonResponse(res, 405, { error: 'Método no permitido' });
}

export function missingApiKey(res) {
  jsonResponse(res, 500, {
    error:
      'No se encontró la API Key de Gemini en las variables de entorno (GOOGLE_API_KEY_1, GOOGLE_API_KEY o API_KEY).'
  });
}

export function handleGeminiError(res, error) {
  const isRetryable = error.status === 503 || error.message?.includes('overloaded');
  if (isRetryable) {
    jsonResponse(res, 503, {
      error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
      retryable: true
    });
    return;
  }

  jsonResponse(res, 500, { error: `Error al comunicarse con la IA: ${error.message}` });
}
