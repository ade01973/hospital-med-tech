import {
  DEFAULT_SYSTEM_PROMPT,
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
    const { message, history = [], systemPrompt: customPrompt } = await ensureRequestBody(req);

    const systemPrompt = customPrompt
      ? `${customPrompt}\n\n${TERMINOLOGY_RULES}`
      : DEFAULT_SYSTEM_PROMPT;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      {
        role: 'model',
        parts: [{
          text: 'Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?'
        }]
      },
      ...(Array.isArray(history) ? history : []),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await callGeminiWithRetry(contents);
    jsonResponse(res, 200, { response: response.text || 'Lo siento, no pude generar una respuesta.' });
  } catch (error) {
    console.error('Error calling Gemini:', error);
    handleGeminiError(res, error);
  }
}
