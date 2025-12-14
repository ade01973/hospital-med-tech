const API_BASE = '/api';
const REQUEST_TIMEOUT = 60000; // 60 segundos

export async function chatWithGemini(message, conversationHistory = [], systemPrompt = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: conversationHistory,
        ...(systemPrompt && { systemPrompt })
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al comunicarse con el servidor');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
    }
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

export async function generateHangmanChallenge(topic, excludeTopic = null) {
  try {
    const response = await fetch(`${API_BASE}/generate-hangman`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, excludeTopic })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al generar reto de ahorcado');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating hangman challenge:", error);
    throw error;
  }
}
