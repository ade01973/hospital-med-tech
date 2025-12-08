import { generateLeadershipScenario } from '../server/gemini-service.js';
import { ensurePostMethod, sendError } from './_helpers.js';

export default async function handler(req, res) {
  if (!ensurePostMethod(req, res)) return;

  try {
    const data = await generateLeadershipScenario();
    res.status(200).json(data);
  } catch (error) {
    sendError(res, error);
  }
}
