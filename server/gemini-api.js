import express from 'express';
import cors from 'cors';
import {
  chatWithGemini,
  generateDecisionTree,
  generateLeadershipScenario,
  generatePriorityExercise,
  generateQuiz,
  generateScenario,
  isRetryableError,
} from './gemini-service.js';

const app = express();
app.use(cors());
app.use(express.json());

function handleError(res, error) {
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

app.post('/api/chat', async (req, res) => {
  try {
    const data = await chatWithGemini(req.body);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/generate-quiz', async (req, res) => {
  try {
    const data = await generateQuiz(req.body.topic);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/generate-scenario', async (req, res) => {
  try {
    const data = await generateScenario(req.body.category);
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/generate-decision-tree', async (_req, res) => {
  try {
    const data = await generateDecisionTree();
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/generate-priority-exercise', async (_req, res) => {
  try {
    const data = await generatePriorityExercise();
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/generate-leadership-scenario', async (_req, res) => {
  try {
    const data = await generateLeadershipScenario();
    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

const PORT = process.env.GEMINI_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
