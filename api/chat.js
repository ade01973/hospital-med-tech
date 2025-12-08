import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // Configuración de seguridad (CORS) para que Vercel acepte la petición
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Si el navegador pregunta "¿puedo pasar?", le decimos que sí
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, systemPrompt } = req.body;

    // Verificamos que la clave existe en Vercel
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Falta la API Key de Gemini. Configúrala en Vercel." });
    }

    // Usamos el modelo Flash porque es rápido y fiable
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt 
    });

    // Preparamos la conversación
    const chat = model.startChat({
      history: history ? history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.parts[0].text }]
      })) : [],
    });

    // Enviamos el mensaje a Google
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error("Error en API Gemini:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}
