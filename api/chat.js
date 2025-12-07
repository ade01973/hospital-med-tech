import { DEFAULT_SYSTEM_PROMPT, TERMINOLOGY_RULES, callGeminiWithRetry } from './_utils/gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [], systemPrompt: customPrompt } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'El campo "message" es obligatorio' });
    }

    const systemPrompt = customPrompt
      ? `${customPrompt}\n\n${TERMINOLOGY_RULES}`
      : DEFAULT_SYSTEM_PROMPT;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      {
        role: 'model',
        parts: [
          {
            text:
              'Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?',
          },
        ],
      },
      ...history,
      { role: 'user', parts: [{ text: message }] },
    ];

    const { text } = await callGeminiWithRetry(contents);

    if (!text) {
      throw new Error('La IA no devolvió contenido de texto');
    }

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error calling Gemini:', error);

    if (error.status === 503 || error.message?.includes('overloaded')) {
      return res.status(503).json({
        error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
        retryable: true,
      });
    }

    return res.status(500).json({ error: `Error al comunicarse con la IA: ${error.message}` });
  }
}
