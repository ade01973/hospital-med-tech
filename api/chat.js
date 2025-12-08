import { chatWithGemini } from '../server/gemini-service.js';
import { ensurePostMethod, sendError } from './_helpers.js';

export default async function handler(req, res) {
  if (!ensurePostMethod(req, res)) return;

  try {
    const data = await chatWithGemini(req.body || {});
    res.status(200).json(data);
  } catch (error) {
    sendError(res, error);
  }
}
