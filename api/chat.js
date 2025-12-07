import { buildChatContents, callGeminiWithRetry, handleError, withCors } from './_geminiClient';

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message, history = [], systemPrompt } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'El mensaje es obligatorio' });
  }

  try {
    const contents = buildChatContents(message, history, systemPrompt);
    const text = await callGeminiWithRetry({ contents });
    return res.status(200).json({ response: text || 'Lo siento, no pude generar una respuesta.' });
  } catch (error) {
    return handleError(res, error);
  }
}
