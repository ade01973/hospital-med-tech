import { GoogleGenerativeAI } from "@google/generative-ai";

// OJO AQUÍ: Asegúrate de que pone GOOGLE_API_KEY_1
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_1);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, systemPrompt } = req.body;

    // OJO AQUÍ TAMBIÉN: Tiene que poner GOOGLE_API_KEY_1
    if (!process.env.GOOGLE_API_KEY_1) {
      return res.status(500).json({ error: "Falta la API Key de Gemini (GOOGLE_API_KEY_1). Configúrala en Vercel." });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history ? history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.parts[0].text }]
      })) : [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error("Error en API Gemini:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}
