import { callGeminiWithRetry, handleError, parseJsonFromText, TERMINOLOGY_RULES, withCors } from './_geminiClient';

const CATEGORIES = [
  'Gestión del Cambio',
  'Resolución de Conflictos',
  'Motivación de Equipos',
  'Desarrollo de Personas',
  'Liderazgo en Crisis',
  'Comunicación Estratégica',
  'Toma de Decisiones'
];

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const prompt = `Genera un escenario de liderazgo para gestoras enfermeras sobre "${category}".

${TERMINOLOGY_RULES}

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

  try {
    const text = await callGeminiWithRetry({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const parsed = parseJsonFromText(text);

    if (!parsed.title || !parsed.description) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `leadership-ai-${Date.now()}`;
    return res.status(200).json(parsed);
  } catch (error) {
    return handleError(res, error);
  }
}
