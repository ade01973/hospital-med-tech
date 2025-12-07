import { extractJson, generateText } from './utils/aiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { topic } = req.body || {};

  if (!topic) {
    res.status(400).json({ error: 'Tema no proporcionado' });
    return;
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

  const geminiContents = [{ role: 'user', parts: [{ text: prompt }] }];
  const openaiMessages = [{ role: 'user', content: prompt }];

  try {
    const { text, provider } = await generateText({ geminiContents, openaiMessages });
    const json = extractJson(text);
    res.status(200).json({ ...json, provider });
  } catch (error) {
    console.error('Error en /api/generate-quiz:', error);
    res.status(500).json({ error: error.message });
  }
}
