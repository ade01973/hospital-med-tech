import { generateDecisionTree, respondGeminiError } from '../server/gemini-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const tree = await generateDecisionTree(payload.category);
    res.status(200).json(tree);
  } catch (error) {
    respondGeminiError(res, error);
  }
}
