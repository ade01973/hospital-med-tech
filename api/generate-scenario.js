import { callGeminiWithRetry, handleError, parseJsonFromText, TERMINOLOGY_RULES, withCors } from './_geminiClient';

const CATEGORIES = [
  'Gestión de Recursos Humanos',
  'Gestión Asistencial',
  'Seguridad del Paciente',
  'Recursos Materiales',
  'Gestión de Conflictos',
  'Gestión Estratégica',
  'Liderazgo Enfermero',
  'Calidad Asistencial'
];

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { category } = req.body || {};
  const selectedCategory = category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const prompt = `Genera un escenario de toma de decisiones para gestoras enfermeras sobre "${selectedCategory}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título breve y descriptivo del escenario",
  "category": "${selectedCategory}",
  "difficulty": "Intermedio",
  "duration": "15-20 min",
  "icon": "📋",
  "color": "from-cyan-500 to-blue-500",
  "description": "Descripción breve del dilema o situación (2-3 frases)",
  "actors": ["Actor 1", "Actor 2", "Actor 3"],
  "topics": ["Tema 1", "Tema 2", "Tema 3"]
}

IMPORTANTE:
- El escenario debe ser REALISTA y basado en situaciones reales de gestión enfermera en hospitales españoles
- Los actores deben ser profesionales de enfermería (supervisoras, enfermeras, TCAEs)
- La descripción debe plantear un DILEMA que requiera toma de decisiones
- Usa colores que combinen bien: from-cyan-500 to-blue-500, from-blue-500 to-indigo-500, from-indigo-500 to-purple-500, from-teal-500 to-cyan-500
- NO incluyas "id" en el JSON, se generará automáticamente`;

  try {
    const text = await callGeminiWithRetry({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const parsed = parseJsonFromText(text);

    if (!parsed.title || !parsed.description || !parsed.actors) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `escenario-ai-${Date.now()}`;
    return res.status(200).json(parsed);
  } catch (error) {
    return handleError(res, error);
  }
}
