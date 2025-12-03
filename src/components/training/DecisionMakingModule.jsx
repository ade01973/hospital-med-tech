import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Target, Loader2, Trash2, Zap } from 'lucide-react';

const DecisionMakingModule = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al módulo de **Toma de Decisiones**! 🎯\n\nAquí entrenarás tu capacidad para tomar decisiones efectivas en contextos de gestión sanitaria.\n\n**Modalidades de entrenamiento:**\n\n🔹 **Escenarios rápidos** - Decisiones bajo presión de tiempo\n🔹 **Análisis profundo** - Decisiones estratégicas complejas\n🔹 **Dilemas éticos** - Decisiones con implicaciones morales\n🔹 **Gestión de crisis** - Decisiones en situaciones críticas\n\n**¿Cómo empezamos?**\n\nEscribe una de estas opciones:\n- "Escenario rápido" - Te daré una situación y 30 segundos mentales para decidir\n- "Caso complejo" - Analizaremos una decisión estratégica paso a paso\n- "Dilema ético" - Exploraremos una situación con conflicto de valores\n\n¿Qué tipo de entrenamiento prefieres?'
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
          systemPrompt: `Eres un coach experto en toma de decisiones para gestión sanitaria y enfermería.

Tu metodología incluye:
1. **Escenarios rápidos**: Presenta situaciones que requieren decisión inmediata. Después de que el usuario decida, analiza pros/contras y alternativas.

2. **Casos complejos**: Guía al usuario a través del proceso de decisión:
   - Identificar el problema
   - Recopilar información relevante
   - Generar alternativas
   - Evaluar consecuencias
   - Tomar la decisión
   - Plan de implementación

3. **Dilemas éticos**: Presenta situaciones con conflicto de valores, explora diferentes perspectivas éticas.

4. **Gestión de crisis**: Simula situaciones de emergencia que requieren decisiones rápidas y coordinadas.

Cuando el usuario tome una decisión:
- Valida su razonamiento
- Señala aspectos que podría haber considerado
- Ofrece feedback constructivo
- Sugiere herramientas de decisión (matriz de decisión, árbol de decisiones, etc.)

Siempre en español, con tono de coaching positivo y constructivo.`
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
      content: '¡Nuevo entrenamiento! 🎯 ¿Qué modalidad de toma de decisiones quieres practicar?'
    }]);
  };

  const quickOptions = [
    "Escenario rápido",
    "Caso complejo", 
    "Dilema ético",
    "Gestión de crisis"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-purple-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Toma de Decisiones</h1>
            <p className="text-xs text-purple-300">Entrena tu capacidad de decisión</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-purple-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando escenario...</span>
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
                className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-purple-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu respuesta o decisión..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-purple-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DecisionMakingModule;
