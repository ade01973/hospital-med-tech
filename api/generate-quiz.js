import { generateQuizQuestion, respondGeminiError } from '../server/gemini-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { topic } = payload;
    const quiz = await generateQuizQuestion(topic);
    res.status(200).json(quiz);
  } catch (error) {
    respondGeminiError(res, error);
  }
}
