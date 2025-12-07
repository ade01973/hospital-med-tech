import {
  TERMINOLOGY_RULES,
  callGeminiWithRetry,
  ensureRequestBody,
  hasGeminiApiKey,
  handleGeminiError,
  jsonResponse,
  methodNotAllowed,
  missingApiKey
} from './geminiShared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (!hasGeminiApiKey()) return missingApiKey(res);

  try {
    const { topic } = await ensureRequestBody(req);

    const prompt = `Genera una pregunta de quiz sobre "${topic}" para estudiantes de enfermería en gestión sanitaria.

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "question": "La pregunta aquí",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0,
  "explanation": "Explicación de por qué es correcta"
}

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      jsonResponse(res, 200, JSON.parse(jsonMatch[0]));
      return;
    }

    throw new Error('No se pudo parsear la respuesta');
  } catch (error) {
    console.error('Error generating quiz:', error);
    handleGeminiError(res, error);
  }
}
