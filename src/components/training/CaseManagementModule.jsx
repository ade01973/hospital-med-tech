import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Briefcase, Loader2, Trash2, FileText, Upload } from 'lucide-react';

const CaseManagementModule = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al módulo de **Gestión de Casos**! 📋\n\nSoy tu asistente especializado en análisis de casos de gestión sanitaria.\n\n**¿Cómo puedo ayudarte?**\n- 📄 Comparte un caso clínico o de gestión\n- 🔍 Te ayudaré a analizarlo desde diferentes perspectivas\n- 💡 Recibirás recomendaciones basadas en evidencia\n- ❓ Puedo generar preguntas de reflexión sobre el caso\n\n**Para empezar**, puedes:\n1. Copiar y pegar un caso que tengas\n2. Describir una situación real que hayas vivido\n3. Pedirme que genere un caso de ejemplo\n\n¿Qué caso te gustaría trabajar hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          systemPrompt: `Eres un experto en gestión de casos clínicos y sanitarios para enfermería.
Tu rol es:
1. Analizar casos de gestión sanitaria que el usuario comparta
2. Identificar los problemas clave, stakeholders y factores relevantes
3. Proponer soluciones basadas en evidencia y buenas prácticas
4. Generar preguntas de reflexión para profundizar el aprendizaje
5. Evaluar diferentes alternativas de acción
6. Considerar aspectos éticos, legales y organizacionales

Cuando el usuario comparta un caso:
- Primero resume los puntos clave
- Identifica el problema principal y los secundarios
- Analiza desde perspectiva de gestión enfermera
- Propón al menos 2-3 alternativas de acción
- Sugiere preguntas para reflexionar

Responde siempre en español, de forma estructurada y profesional.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar el mensaje. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Chat reiniciado! 📋 Comparte un nuevo caso para analizar.'
    }]);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-red-900/10 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-red-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Gestión de Casos</h1>
            <p className="text-xs text-red-300">Análisis de casos clínicos y de gestión</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-red-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analizando caso...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-red-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Comparte un caso o pregunta..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-red-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaseManagementModule;
