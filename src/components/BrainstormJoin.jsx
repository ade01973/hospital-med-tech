import React, { useState, useEffect } from 'react';
import { Send, Hash, MessageCircle, Loader2, LogOut, Check, Zap, Sparkles, Trophy } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebase';
import hospitalBg from '../assets/landing-bg.jpg';

// 🔊 SONIDOS DE RECOMPENSA (Satisfactorios)
const SUCCESS_SOUNDS = [
  'https://actions.google.com/sounds/v1/science_fiction/scifi_laser_1.ogg', // Láser
  'https://actions.google.com/sounds/v1/cartoon/pop.ogg', // Pop
  'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg' // Boing
];

// 🗣️ FRASES DE HYPE (Refuerzo Positivo Variable)
const HYPE_FEEDBACK = [
  { text: "¡BOOM! 💥", sub: "Esa ha sido buena." },
  { text: "¡BRUTAL! 🚀", sub: "El equipo te necesita." },
  { text: "¡OTRA MÁS! 🔥", sub: "Estás en racha." },
  { text: "¡CLANK! 🦾", sub: "Idea registrada." },
  { text: "¡DALE CAÑA! ⚡", sub: "No pares ahora." },
  { text: "¡GENIO! 🧠", sub: "Sigue disparando ideas." }
];

const BrainstormJoin = ({ onBack, sessionIdFromUrl }) => {
  const [sessionId, setSessionId] = useState('');
  const [answer, setAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPresetSession, setHasPresetSession] = useState(false);

  // Estado para el feedback aleatorio
  const [currentFeedback, setCurrentFeedback] = useState(HYPE_FEEDBACK[0]);

  useEffect(() => {
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl.toUpperCase());
      setHasPresetSession(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('sala');
    if (codeFromUrl) {
      setSessionId(codeFromUrl.toUpperCase());
      setHasPresetSession(true);
    }
  }, [sessionIdFromUrl]);

  const playSuccessSound = () => {
    const randomSound = SUCCESS_SOUNDS[Math.floor(Math.random() * SUCCESS_SOUNDS.length)];
    const audio = new Audio(randomSound);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  const handleSubmit = async () => {
    if (!sessionId.trim() || !answer.trim()) return;

    setIsLoading(true);

    try {
      const responsesRef = collection(db, 'artifacts', appId, 'brainstorming_sessions', sessionId.toUpperCase().trim(), 'responses');
      
      await addDoc(responsesRef, {
        word: answer,
        timestamp: serverTimestamp(),
      });

      // 🔥 EFECTO WOW
      playSuccessSound();
      setCurrentFeedback(HYPE_FEEDBACK[Math.floor(Math.random() * HYPE_FEEDBACK.length)]);
      
      setHasSubmitted(true);

    } catch (error) {
      alert("Error: Revisa el código.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear y mandar otra rápido
  const handleReset = () => {
    setAnswer('');
    setHasSubmitted(false);
  };

  return (
    <div 
      className="min-h-screen font-sans p-4 flex flex-col items-center justify-center relative bg-slate-950"
      style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-slate-950/80 z-0 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* LOGO SUPERIOR */}
        <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-xs font-bold tracking-widest uppercase">En vivo</span>
            </div>
            <h1 className="text-3xl font-black text-white drop-shadow-md">Brainstorming</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            
            {/* Gradient Glow de fondo */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${hasSubmitted ? 'bg-green-500/40' : 'bg-cyan-500/30'}`}></div>

            {!hasSubmitted ? (
            // --- FASE 1: ESCRIBIR (DISPARAR) ---
            <div className="space-y-6 relative z-10 animate-fade-in">
                
                {/* INPUT CÓDIGO */}
                <div>
                    <label className="text-cyan-400 text-xs font-bold uppercase tracking-widest ml-4 mb-2 block">Código</label>
                    {hasPresetSession ? (
                      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <Hash className="text-green-400 w-5 h-5" />
                          <span className="text-white font-black text-2xl tracking-widest">{sessionId || '----'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-300 font-bold uppercase tracking-widest">Sala detectada</span>
                          <button
                            type="button"
                            onClick={() => { setHasPresetSession(false); setSessionId(''); }}
                            className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 hover:text-white"
                          >
                            Usar otro código
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 flex items-center focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                        <Hash className="text-slate-500 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            value={sessionId}
                            onChange={(e) => setSessionId(e.target.value.toUpperCase())}
                            placeholder="ABCD"
                            className="bg-transparent w-full text-white font-black text-2xl placeholder-slate-600 outline-none uppercase tracking-widest"
                            maxLength={6}
                        />
                      </div>
                    )}
                </div>

                {/* INPUT RESPUESTA */}
                <div>
                    <label className="text-cyan-400 text-xs font-bold uppercase tracking-widest ml-4 mb-2 block">Tu Idea</label>
                    <div className="bg-white rounded-2xl p-1 transform transition-transform focus-within:scale-[1.02]">
                        <textarea 
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Escribe aquí..."
                            className="w-full bg-white text-slate-900 font-bold text-2xl p-4 rounded-xl outline-none placeholder-slate-300 resize-none h-32 text-center pt-10"
                            maxLength={40}
                        />
                    </div>
                    <p className="text-right text-xs text-slate-400 mt-2 mr-2">{answer.length}/40</p>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={isLoading || !sessionId || !answer}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-5 rounded-2xl text-xl shadow-lg shadow-cyan-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send />} DISPARAR IDEA
                </button>
                
                <button onClick={onBack} className="w-full py-3 text-slate-400 text-sm font-bold hover:text-white transition-colors">
                    Cancelar
                </button>
            </div>
            ) : (
            // --- FASE 2: RECOMPENSA (HYPE) ---
            <div className="text-center py-4 animate-bounce-in relative z-10">
                
                {/* ICONO DE ÉXITO GIGANTE */}
                <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform">
                        <Zap className="w-12 h-12 text-white fill-current" />
                    </div>
                    {/* Partículas decorativas */}
                    <Sparkles className="absolute -top-2 -right-2 text-yellow-300 w-8 h-8 animate-bounce" />
                </div>

                {/* TEXTO DE ÁNIMO VARIABLE */}
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight italic drop-shadow-lg">
                    {currentFeedback.text}
                </h2>
                <p className="text-slate-300 mb-8 font-medium text-lg">
                    {currentFeedback.sub}
                </p>
                
                <div className="space-y-3">
                    {/* BOTÓN PRINCIPAL: ENVIAR OTRA (Ciclo rápido) */}
                    <button 
                        onClick={handleReset}
                        className="w-full bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-white/20 flex items-center justify-center gap-2"
                    >
                        <Zap className="w-5 h-5 text-cyan-600" /> ¡ENVIAR OTRA!
                    </button>

                    <button 
                        onClick={onBack}
                        className="w-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" /> Terminar
                    </button>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BrainstormJoin;
