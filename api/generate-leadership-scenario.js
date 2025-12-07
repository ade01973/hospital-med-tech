import { extractJson, generateText } from './utils/aiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const categories = [
    'Gestión del Cambio',
    'Resolución de Conflictos',
    'Motivación de Equipos',
    'Desarrollo de Personas',
    'Liderazgo en Crisis',
    'Comunicación Estratégica',
    'Toma de Decisiones'
  ];

  const category = categories[Math.floor(Math.random() * categories.length)];

  const prompt = `Genera un escenario de liderazgo para gestoras enfermeras sobre "${category}".

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título breve del escenario de liderazgo",
  "category": "${category}",
  "description": "Descripción del desafío de liderazgo (2-3 frases)",
  "difficulty": "Intermedio",
  "icon": "emoji representativo",
  "color": "from-emerald-500 to-teal-500"
}

IMPORTANTE:
- El escenario debe ser REALISTA y basado en situaciones reales de liderazgo enfermero
- Debe plantear un desafío que requiera habilidades de liderazgo
- Usa colores: from-emerald-500 to-teal-500, from-rose-500 to-pink-500, from-amber-500 to-orange-500
- NO incluyas "id" en el JSON, se generará automáticamente`;

  const geminiContents = [{ role: 'user', parts: [{ text: prompt }] }];
  const openaiMessages = [{ role: 'user', content: prompt }];

  try {
    const { text, provider } = await generateText({ geminiContents, openaiMessages });
    const json = extractJson(text);

    if (!json.title || !json.description) {
      throw new Error('Respuesta incompleta de la IA');
    }

    json.id = `leadership-ai-${Date.now()}`;

    res.status(200).json({ ...json, provider });
  } catch (error) {
    console.error('Error en /api/generate-leadership-scenario:', error);
    res.status(500).json({ error: error.message });
  }
}
