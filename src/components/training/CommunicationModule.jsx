import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, MessageSquare, Loader2, Trash2 } from 'lucide-react';

const CommunicationModule = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al módulo de **Comunicación**! 💬\n\nAquí mejorarás tus habilidades de comunicación efectiva en el entorno sanitario.\n\n**Áreas de entrenamiento:**\n\n🗣️ **Comunicación Asertiva** - Expresa tus ideas con claridad y respeto\n👂 **Escucha Activa** - Comprende realmente a tu interlocutor\n🔄 **Feedback** - Da y recibe retroalimentación constructiva\n⚡ **Gestión de Conflictos** - Comunica en situaciones tensas\n📋 **Comunicación con Pacientes** - Empatía y claridad\n👥 **Comunicación con Equipos** - Reuniones y coordinación\n\n**Modalidades:**\n- **Role-play**: Practica conversaciones difíciles conmigo\n- **Análisis**: Evalúa ejemplos de comunicación\n- **Teoría aplicada**: Aprende técnicas con ejemplos\n\n¿Qué aspecto de la comunicación quieres trabajar?'
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
          systemPrompt: `Eres un experto en comunicación profesional para el ámbito sanitario y enfermería.

Tus competencias:
1. **Comunicación asertiva**: Técnicas DESC, mensajes yo, expresión de necesidades
2. **Escucha activa**: Parafraseo, preguntas abiertas, reflejo emocional
3. **Feedback efectivo**: Modelo SBI (Situación-Comportamiento-Impacto), sandwich, feedforward
4. **Gestión de conflictos**: Comunicación no violenta, mediación, desescalada
5. **Comunicación con pacientes**: Malas noticias, educación sanitaria, consentimiento informado
6. **Comunicación de equipos**: Briefings, debriefings, handovers, reuniones efectivas

Cuando practiques role-play:
- Interpreta diferentes personajes (paciente difícil, compañero conflictivo, jefe exigente)
- Después del role-play, analiza la comunicación del usuario
- Sugiere mejoras específicas con ejemplos de frases alternativas

Técnicas a enseñar:
- Comunicación No Violenta (CNV) de Marshall Rosenberg
- Modelo SBAR para comunicación clínica
- Técnica del disco rayado
- Técnica del banco de niebla

Siempre en español, con ejemplos prácticos del entorno sanitario.`
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
      content: '¡Nueva sesión de comunicación! 💬 ¿Qué habilidad comunicativa quieres practicar?'
    }]);
  };

  const quickOptions = [
    "Practicar comunicación asertiva",
    "Role-play: conversación difícil",
    "Cómo dar feedback negativo",
    "Técnica SBAR"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-cyan-900/10 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Comunicación</h1>
            <p className="text-xs text-cyan-300">Mejora tu comunicación efectiva</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando respuesta...</span>
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
                className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-cyan-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommunicationModule;
