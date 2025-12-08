import { isRetryableError } from '../server/gemini-service.js';

export function ensurePostMethod(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return false;
  }
  return true;
}

export function sendError(res, error) {
  console.error('Error calling Gemini:', error);

  if (isRetryableError(error)) {
    res.status(503).json({
      error: 'El servicio de IA está temporalmente sobrecargado. Por favor, espera unos segundos e intenta de nuevo.',
      retryable: true,
    });
  } else {
    res.status(500).json({ error: error.message || 'Error al comunicarse con la IA' });
  }
}
