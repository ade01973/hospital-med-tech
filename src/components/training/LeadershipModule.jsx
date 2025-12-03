import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Brain, Loader2, Trash2 } from 'lucide-react';

const LeadershipModule = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al módulo de **Liderazgo**! 🌟\n\nAquí desarrollarás las competencias de liderazgo esenciales para la gestión enfermera.\n\n**Áreas de entrenamiento:**\n\n👤 **Autoconocimiento** - Descubre tu estilo de liderazgo\n🔄 **Liderazgo Transformacional** - Inspira y motiva a tu equipo\n📊 **Liderazgo Situacional** - Adapta tu estilo al contexto\n🎯 **Gestión del Rendimiento** - Desarrolla a tu equipo\n💪 **Resiliencia** - Lidera en tiempos difíciles\n\n**¿Qué te gustaría explorar?**\n\nPuedes:\n- Pedirme un test de estilo de liderazgo\n- Practicar una situación de liderazgo específica\n- Aprender sobre un modelo de liderazgo\n- Resolver un desafío de equipo\n\n¿Por dónde empezamos?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
          systemPrompt: `Eres un coach de liderazgo experto en gestión sanitaria y enfermería.

Tus áreas de expertise:
1. **Estilos de liderazgo**: Transformacional, Transaccional, Situacional, Servant Leadership
2. **Competencias de liderazgo enfermero**: Visión, comunicación, influencia, desarrollo de equipos
3. **Modelos teóricos**: Hersey-Blanchard, Bass, Kouzes-Posner, Goleman
4. **Inteligencia emocional**: Autoconciencia, autorregulación, motivación, empatía, habilidades sociales

Cuando el usuario quiera:
- **Test de liderazgo**: Hazle preguntas situacionales y evalúa su estilo predominante
- **Práctica**: Simula situaciones donde debe ejercer liderazgo
- **Teoría**: Explica modelos con ejemplos prácticos de enfermería
- **Desafíos**: Presenta problemas reales de liderazgo en equipos sanitarios

Siempre:
- Conecta la teoría con la práctica enfermera
- Ofrece feedback constructivo y específico
- Sugiere acciones concretas de mejora
- Usa ejemplos del ámbito sanitario

Responde en español con tono motivador y profesional.`
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error al procesar. Por favor, intenta de nuevo.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '¡Nuevo entrenamiento de liderazgo! 🌟 ¿Qué competencia quieres desarrollar hoy?'
    }]);
  };

  const quickOptions = [
    "Test de estilo de liderazgo",
    "Liderazgo transformacional",
    "Situación con equipo difícil",
    "Cómo motivar a mi equipo"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/10 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-emerald-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Liderazgo</h1>
            <p className="text-xs text-emerald-300">Desarrolla habilidades de líder</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando coaching...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(opt)}
                className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-emerald-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu pregunta sobre liderazgo..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadershipModule;
