import { callGeminiWithRetry, handleError, parseJsonFromText, TERMINOLOGY_RULES, withCors } from './_geminiClient';

const CONTEXTS = [
  'Inicio de turno de mañana',
  'Turno de noche con imprevistos',
  'Fin de turno con tareas pendientes',
  'Situación de urgencia en la unidad',
  'Día con alta carga asistencial',
  'Supervisora gestionando múltiples demandas'
];

export default async function handler(req, res) {
  if (withCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const context = CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];

  const prompt = `Genera un ejercicio de priorización de tareas para gestoras enfermeras en el contexto: "${context}".

${TERMINOLOGY_RULES}

Responde SOLO con un JSON válido en este formato exacto:
{
  "title": "Título descriptivo del ejercicio",
  "description": "Contexto de la situación (hora, lugar, circunstancias). Máximo 2 frases.",
  "icon": "emoji representativo",
  "color": "from-cyan-500 to-blue-500",
  "tasks": [
    {
      "id": 1,
      "text": "Descripción de la tarea 1",
      "priority": 1,
      "explanation": "Por qué esta tarea es prioridad 1. Criterio clínico."
    },
    {
      "id": 2,
      "text": "Descripción de la tarea 2",
      "priority": 2,
      "explanation": "Por qué esta tarea es prioridad 2."
    },
    {
      "id": 3,
      "text": "Descripción de la tarea 3",
      "priority": 3,
      "explanation": "Por qué esta tarea es prioridad 3."
    },
    {
      "id": 4,
      "text": "Descripción de la tarea 4",
      "priority": 4,
      "explanation": "Por qué esta tarea es prioridad 4."
    },
    {
      "id": 5,
      "text": "Descripción de la tarea 5",
      "priority": 5,
      "explanation": "Por qué esta tarea es prioridad 5."
    },
    {
      "id": 6,
      "text": "Descripción de la tarea 6",
      "priority": 6,
      "explanation": "Por qué esta tarea es prioridad 6."
    }
  ]
}

CRITERIOS DE PRIORIZACIÓN (de mayor a menor):
1. Emergencias vitales (dolor torácico, dificultad respiratoria, caídas inminentes)
2. Medicación tiempo-dependiente (insulina, antibióticos IV)
3. Valoraciones clínicas urgentes
4. Tareas programadas con hora fija
5. Cuidados de enfermería rutinarios
6. Tareas administrativas y documentación

IMPORTANTE:
- Incluye EXACTAMENTE 6 tareas
- Las prioridades deben ser del 1 al 6 (sin repetir)
- Las explicaciones deben justificar el orden según criterios clínicos
- Situaciones realistas de enfermería en España
- NO incluyas "id" en el JSON principal, se generará automáticamente`;

  try {
    const text = await callGeminiWithRetry({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const parsed = parseJsonFromText(text);

    if (!parsed.title || !parsed.tasks || !Array.isArray(parsed.tasks)) {
      throw new Error('Respuesta incompleta de la IA');
    }

    parsed.id = `priority-ai-${Date.now()}`;
    return res.status(200).json(parsed);
  } catch (error) {
    return handleError(res, error);
  }
}
