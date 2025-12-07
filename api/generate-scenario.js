import { TERMINOLOGY_RULES, callGeminiWithRetry } from './_utils/gemini.js';

const CATEGORIES = [
  'Gestión de Recursos Humanos',
  'Gestión Asistencial',
  'Seguridad del Paciente',
  'Recursos Materiales',
  'Gestión de Conflictos',
  'Gestión Estratégica',
  'Liderazgo Enfermero',
  'Calidad Asistencial',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      throw new Error('JSON inválido en la respuesta');
    }

    if (!parsed.title || !parsed.description || !parsed.actors) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `escenario-ai-${Date.now()}`;
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error generating scenario:', error);

    if (error.status === 503 || error.message?.includes('overloaded')) {
      return res.status(503).json({
        error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
        retryable: true,
      });
    }

    return res.status(500).json({ error: error.message });
  }
}
