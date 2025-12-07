import { DEFAULT_SYSTEM_PROMPT, TERMINOLOGY_RULES, generateText, mapHistoryToOpenAI } from './utils/aiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { message, history = [], systemPrompt: customPrompt } = req.body || {};

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Mensaje no proporcionado' });
    return;
  }

  const systemPrompt = customPrompt ? `${customPrompt}\n\n${TERMINOLOGY_RULES}` : DEFAULT_SYSTEM_PROMPT;

  const geminiContents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    {
      role: 'model',
      parts: [
        {
          text:
            'Entendido. Soy el Asistente NurseManager, especializado en gestión enfermera. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?'
        }
      ]
    },
    ...history,
    { role: 'user', parts: [{ text: message }] }
  ];

  const openaiMessages = [
    { role: 'system', content: systemPrompt },
    ...mapHistoryToOpenAI(history),
    { role: 'user', content: message }
  ];

  try {
    const { text, provider } = await generateText({ geminiContents, openaiMessages });
    res.status(200).json({ response: text, provider });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({ error: error.message });
  }
}
