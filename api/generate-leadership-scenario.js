import {
  TERMINOLOGY_RULES,
  callGeminiWithRetry,
  handleGeminiError,
  jsonResponse,
  methodNotAllowed,
  missingApiKey
} from './geminiShared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (!process.env.GOOGLE_API_KEY_1) return missingApiKey(res);

  try {
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

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.title || !parsed.description) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `leadership-ai-${Date.now()}`;
    jsonResponse(res, 200, parsed);
  } catch (error) {
    console.error('Error generating leadership scenario:', error);
    handleGeminiError(res, error);
  }
}
