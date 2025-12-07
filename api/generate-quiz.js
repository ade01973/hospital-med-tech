import { callGeminiWithRetry } from './_utils/gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return res.status(200).json(JSON.parse(jsonMatch[0]));
    }

    throw new Error('No se pudo parsear la respuesta');
  } catch (error) {
    console.error('Error generating quiz:', error);

    if (error.status === 503 || error.message?.includes('overloaded')) {
      return res.status(503).json({
        error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
        retryable: true,
      });
    }

    return res.status(500).json({ error: error.message });
  }
}
