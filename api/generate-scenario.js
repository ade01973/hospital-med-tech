import { extractJson, generateText } from './utils/aiClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { category } = req.body || {};

  const categories = [
    'Gestión de Recursos Humanos',
    'Gestión Asistencial',
    'Seguridad del Paciente',
    'Recursos Materiales',
    'Gestión de Conflictos',
    'Gestión Estratégica',
    'Liderazgo Enfermero',
    'Calidad Asistencial'
  ];

  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];

  const prompt = `Genera un escenario de toma de decisiones para gestoras enfermeras sobre "${selectedCategory}".

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

  const geminiContents = [{ role: 'user', parts: [{ text: prompt }] }];
  const openaiMessages = [{ role: 'user', content: prompt }];

  try {
    const { text, provider } = await generateText({ geminiContents, openaiMessages });
    const json = extractJson(text);

    if (!json.title || !json.description || !json.actors) {
      throw new Error('Respuesta incompleta de la IA');
    }

    json.id = `escenario-ai-${Date.now()}`;

    res.status(200).json({ ...json, provider });
  } catch (error) {
    console.error('Error en /api/generate-scenario:', error);
    res.status(500).json({ error: error.message });
  }
}
