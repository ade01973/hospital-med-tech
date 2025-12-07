import { callGeminiWithRetry, handleError, parseJsonFromText, withCors } from './_geminiClient';

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { topic } = req.body || {};
  if (!topic) {
    return res.status(400).json({ error: 'El campo "topic" es obligatorio' });
  }

  const prompt = `Genera una pregunta de quiz sobre "${topic}" para estudiantes de enfermería en gestión sanitaria.

Responde SOLO con un JSON válido en este formato exacto:
{
  "question": "La pregunta aquí",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0,
  "explanation": "Explicación de por qué es correcta"
}

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

  try {
    const text = await callGeminiWithRetry({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const parsed = parseJsonFromText(text);
    return res.status(200).json(parsed);
  } catch (error) {
    return handleError(res, error);
  }
}
