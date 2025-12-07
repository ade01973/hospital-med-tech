import {
  TERMINOLOGY_RULES,
  callGeminiWithRetry,
  ensureRequestBody,
  hasGeminiApiKey,
  handleGeminiError,
  jsonResponse,
  methodNotAllowed,
  missingApiKey
} from './geminiShared.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (!hasGeminiApiKey()) return missingApiKey(res);

  try {
    const categories = [
      'Recursos Humanos',
      'Atención a Reclamaciones',
      'Gestión de Crisis',
      'Conflictos de Equipo',
      'Seguridad del Paciente',
      'Comunicación'
    ];

    const category = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `Genera un árbol de decisiones para gestoras enfermeras sobre "${category}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título descriptivo del caso",
  "description": "Descripción breve de la situación inicial (1-2 frases)",
  "category": "${category}",
  "icon": "🌙",
  "color": "from-blue-500 to-indigo-500",
  "initialNode": "start",
  "nodes": {
    "start": {
      "text": "Descripción detallada de la situación inicial (3-4 frases). Incluye contexto, hora, personas involucradas y el problema específico. Termina con ¿Qué decides hacer?",
      "options": [
        { "text": "Opción 1 - descripción de la acción", "next": "node1" },
        { "text": "Opción 2 - descripción de la acción", "next": "node2" },
        { "text": "Opción 3 - descripción de la acción", "next": "node3" }
      ]
    },
    "node1": {
      "text": "Consecuencia de la opción 1. Qué pasa después.",
      "options": [
        { "text": "Siguiente opción A", "next": "end_good" },
        { "text": "Siguiente opción B", "next": "end_medium" }
      ]
    },
    "node2": {
      "text": "Consecuencia de la opción 2.",
      "options": [
        { "text": "Siguiente opción", "next": "end_medium" }
      ]
    },
    "node3": {
      "text": "Consecuencia de la opción 3.",
      "options": [
        { "text": "Siguiente opción", "next": "end_bad" }
      ]
    },
    "end_good": {
      "text": "Resultado excelente.",
      "isEnd": true,
      "score": 9,
      "feedback": "Excelente gestión."
    },
    "end_medium": {
      "text": "Resultado aceptable.",
      "isEnd": true,
      "score": 6,
      "feedback": "Decisión aceptable."
    },
    "end_bad": {
      "text": "Resultado negativo.",
      "isEnd": true,
      "score": 3,
      "feedback": "Esta decisión tuvo consecuencias negativas."
    }
  }
}

IMPORTANTE:
- Crea al menos 6 nodos con diferentes caminos
- Incluye al menos 3 finales diferentes (bueno, medio, malo)
- Los scores van de 1 a 10
- El feedback debe ser educativo y constructivo
- Situaciones realistas de gestión enfermera en España
- NO incluyas "id" en el JSON, se generará automáticamente`;

    const response = await callGeminiWithRetry(prompt);
    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('No se pudo parsear la respuesta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.title || !parsed.nodes || !parsed.initialNode) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `tree-ai-${Date.now()}`;
    jsonResponse(res, 200, parsed);
  } catch (error) {
    console.error('Error generating decision tree:', error);
    handleGeminiError(res, error);
  }
}
