import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

// DON'T DELETE THIS COMMENT
// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const systemPrompt = `Eres un asistente experto en gestión sanitaria y enfermería. 
Tu nombre es "Asistente NurseManager".
Ayudas a estudiantes de enfermería a aprender sobre:
- Gestión de equipos de enfermería
- Liderazgo en salud
- Administración sanitaria
- Calidad asistencial
- Seguridad del paciente
- Marketing sanitario
- Innovación en enfermería

Responde siempre en español de forma clara, profesional y educativa.
Usa ejemplos prácticos cuando sea posible.
Si no sabes algo, admítelo honestamente.`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Entendido. Soy el Asistente NurseManager, especializado en gestión sanitaria y enfermería. Estoy aquí para ayudarte con tus dudas sobre liderazgo, administración, calidad y todos los temas relacionados con la gestión enfermera. ¿En qué puedo ayudarte?" }] },
      ...history,
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    res.json({ response: response.text || "Lo siento, no pude generar una respuesta." });
  } catch (error) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({ error: `Error al comunicarse con Gemini: ${error.message}` });
  }
});

app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `Genera una pregunta de quiz sobre "${topic}" para estudiantes de enfermería en gestión sanitaria.

Responde SOLO con un JSON válido en este formato exacto:
{
  "question": "La pregunta aquí",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correct": 0,
  "explanation": "Explicación de por qué es correcta"
}

El campo "correct" es el índice (0-3) de la respuesta correcta.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      throw new Error("No se pudo parsear la respuesta");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.GEMINI_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
