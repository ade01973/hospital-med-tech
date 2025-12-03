import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Users, Loader2, Trash2 } from 'lucide-react';

const TeamworkModule = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Bienvenido al módulo de **Trabajo en Equipo**! 👥\n\nAquí desarrollarás competencias para trabajar eficazmente en equipos sanitarios.\n\n**Áreas de entrenamiento:**\n\n🤝 **Colaboración** - Trabajar juntos hacia objetivos comunes\n📋 **Coordinación** - Organizar tareas y recursos del equipo\n🎯 **Delegación** - Asignar responsabilidades efectivamente\n💪 **Cohesión grupal** - Construir equipos unidos\n🔧 **Resolución de problemas** - Solucionar desafíos en equipo\n⚡ **Equipos de alto rendimiento** - Maximizar el potencial colectivo\n\n**Actividades disponibles:**\n- Simulaciones de dinámicas de equipo\n- Análisis de roles (Belbin)\n- Estrategias de delegación\n- Gestión de equipos multidisciplinares\n\n¿Qué aspecto del trabajo en equipo te interesa desarrollar?'
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
          systemPrompt: `Eres un experto en trabajo en equipo y dinámicas grupales en el ámbito sanitario.

Tus áreas de conocimiento:
1. **Roles de equipo**: Modelo Belbin (9 roles), identificación y equilibrio de roles
2. **Etapas de desarrollo**: Modelo Tuckman (forming, storming, norming, performing)
3. **Delegación efectiva**: Cuándo, qué y cómo delegar, seguimiento
4. **Equipos multidisciplinares**: Coordinación entre diferentes profesionales sanitarios
5. **Reuniones efectivas**: Planificación, conducción, seguimiento de acuerdos
6. **Cohesión grupal**: Actividades de team building, gestión de la diversidad

Cuando el usuario quiera:
- **Test de roles**: Hazle preguntas para identificar su rol Belbin predominante
- **Simulación**: Presenta escenarios de trabajo en equipo para resolver
- **Estrategias**: Ofrece técnicas específicas para mejorar el trabajo en equipo
- **Problemas**: Ayuda a resolver conflictos o disfunciones del equipo

Conceptos clave a trabajar:
- Las 5 disfunciones de un equipo (Lencioni)
- Seguridad psicológica (Edmondson)
- Inteligencia colectiva
- Sinergia grupal

Siempre contextualizado al ámbito sanitario y enfermería, en español.`
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
      content: '¡Nueva sesión de trabajo en equipo! 👥 ¿Qué competencia quieres desarrollar?'
    }]);
  };

  const quickOptions = [
    "Test de roles Belbin",
    "Cómo delegar efectivamente",
    "Equipo desmotivado",
    "Reuniones más productivas"
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-amber-900/10 to-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-b border-amber-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Trabajo en Equipo</h1>
            <p className="text-xs text-amber-300">Potencia la colaboración</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                : 'bg-slate-800/80 border border-slate-700 text-slate-100'
            }`}>
              <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Preparando actividad...</span>
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
                className="text-xs bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-full transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-t border-amber-500/30 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tu pregunta sobre trabajo en equipo..."
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-amber-500/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamworkModule;
