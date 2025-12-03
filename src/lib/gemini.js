const API_BASE = '/api';

export async function chatWithGemini(message, conversationHistory = []) {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al comunicarse con el servidor');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

export async function generateQuizQuestion(topic) {
  try {
    const response = await fetch(`${API_BASE}/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al generar pregunta');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
