import express from 'express';
import cors from 'cors';
import {
  chatWithGemini,
  generateQuizQuestion,
  generateDecisionScenario,
  generateDecisionTree,
  generatePriorityExercise,
  generateLeadershipScenario,
  respondGeminiError
} from './gemini-service.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], systemPrompt } = req.body;
    const response = await chatWithGemini({ message, history, systemPrompt });
    res.json({ response });
  } catch (error) {
    respondGeminiError(res, error);
  }
});

app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic } = req.body;
    const quiz = await generateQuizQuestion(topic);
    res.json(quiz);
  } catch (error) {
    respondGeminiError(res, error);
  }
});

app.post('/api/generate-scenario', async (req, res) => {
  try {
    const { category } = req.body;
    const scenario = await generateDecisionScenario(category);
    res.json(scenario);
  } catch (error) {
    respondGeminiError(res, error);
  }
});

app.post('/api/generate-decision-tree', async (_req, res) => {
  try {
    const decisionTree = await generateDecisionTree();
    res.json(decisionTree);
  } catch (error) {
    respondGeminiError(res, error);
  }
});

app.post('/api/generate-priority-exercise', async (_req, res) => {
  try {
    const exercise = await generatePriorityExercise();
    res.json(exercise);
  } catch (error) {
    respondGeminiError(res, error);
  }
});

app.post('/api/generate-leadership-scenario', async (_req, res) => {
  try {
    const scenario = await generateLeadershipScenario();
    res.json(scenario);
  } catch (error) {
    respondGeminiError(res, error);
  }
});

const PORT = process.env.GEMINI_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
