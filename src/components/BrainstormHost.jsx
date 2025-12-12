import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { 
  ArrowLeft, Send, Users, Cpu, Loader2, MessageSquare, BrainCircuit, 
  CheckCircle, X, Sparkles, BarChart3, PieChart, Zap, Trophy, Crown, 
  Medal, Star, Clock 
} from 'lucide-react';
import { doc, setDoc, serverTimestamp, collection, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../firebase';
import hospitalBg from '../assets/landing-bg.jpg'; 

// 🎨 COLORES NEÓN VIBRANTES
const CARD_COLORS = [
  'bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] border-cyan-400',
  'bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.6)] border-purple-400',
  'bg-pink-600 shadow-[0_0_20px_rgba(236,72,153,0.6)] border-pink-400',
  'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.6)] border-emerald-400',
  'bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.6)] border-orange-400',
];

// 🗣️ FRASES DEL COACH
const IDLE_PHRASES = [ "Tic, tac... ⏳", "El podio está vacío 🏆", "¿Quién tiene la idea ganadora? 🧠", "¡Necesito chispas! ✨" ];
const HYPE_PHRASES = [ "¡ASÍ SE HACE! 🔥", "¡RITMO BRUTAL! 🚀", "¡MENUDO CEREBRO! ⚡", "¡Lluvia torrencial! ⛈️" ];

// 🔊 SONIDOS
const SOUND_EFFECTS = [
  'https://actions.google.com/sounds/v1/cartoon/pop.ogg', 
  'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'
];
const ALARM_SOUND = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';
const VICTORY_SOUND = 'https://actions.google.com/sounds/v1/cartoon/clown_horn_fanfare.ogg';

// 🎰 COMPONENTE DE CONTADOR ANIMADO (VERSIÓN SEGURA)
const AnimatedNumber = ({ value }) => {
    const [count, setCount] = useState(0);
    const safeValue = Number(value) || 0; 

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = safeValue > 0 ? safeValue / (duration / 16) : 0;
        
        if (safeValue === 0) { setCount(0); return; }

        const timer = setInterval(() => {
            start += increment;
            if (start >= safeValue) { setCount(safeValue); clearInterval(timer); } 
            else { setCount(Math.ceil(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [safeValue]);
    
    return <span>{count}</span>;
};

const BrainstormHost = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); 

  // Engagement
  const [motivationalPhrase, setMotivationalPhrase] = useState("¡Esperando al primer valiente!");
  const [floatingEmojis, setFloatingEmojis] = useState([]); 
  const [energyLevel, setEnergyLevel] = useState(0); 

  // IA y Resultados
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const prevCountRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const idleTimerRef = useRef(null);

  // --- EMOJIS FLOTANTES ---
  const spawnFloatingEmojis = () => {
    const emojis = ['👍', '💡', '🔥', '🚀', '✨', '🧠', '⚡'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const id = Date.now();
    const leftPos = Math.floor(Math.random() * 80) + 10; 
    setFloatingEmojis(prev => [...prev, { id, emoji: randomEmoji, left: leftPos }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 3000);
  };

  const playRandomSound = () => {
    const randomUrl = SOUND_EFFECTS[Math.floor(Math.random() * SOUND_EFFECTS.length)];
    const audio = new Audio(randomUrl);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  const triggerHype = () => {
    const phrase = HYPE_PHRASES[Math.floor(Math.random() * HYPE_PHRASES.length)];
    setMotivationalPhrase(phrase);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        const idle = IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)];
        setMotivationalPhrase(idle);
    }, 5000);
  };

  // --- TEMPORIZADOR Y AUDIO ---
  useEffect(() => {
    if (!isSessionActive || isAnalyzing || timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    if (timeLeft === 1) new Audio(ALARM_SOUND).play().catch(()=>{});
    if (timeLeft === 0 && !analysisResult && !isAnalyzing) { }
    return () => clearInterval(timerId);
  }, [isSessionActive, isAnalyzing, timeLeft, analysisResult]);

  // --- FIREBASE LISTENER ---
  useEffect(() => {
    if (!sessionId) return;
    const responsesRef = collection(db, 'artifacts', appId, 'brainstorming_sessions', sessionId, 'responses');
    const unsubscribe = onSnapshot(responsesRef, (snapshot) => {
      const currentCount = snapshot.docs.length;
      setEnergyLevel(Math.min((currentCount / 20) * 100, 100));

      if (!isInitialLoadRef.current && currentCount > prevCountRef.current) {
        playRandomSound();
        spawnFloatingEmojis(); 
        triggerHype();         
      }
      isInitialLoadRef.current = false;
      prevCountRef.current = currentCount;
      const newResponses = snapshot.docs.map(doc => ({
        ...doc.data(),
        color: CARD_COLORS[doc.data().word.length % CARD_COLORS.length],
        rotation: (doc.data().word.length % 6) - 3 
      }));
      setResponses(newResponses);
    });
    idleTimerRef.current = setTimeout(() => setMotivationalPhrase("¿Quién rompe el hielo? 🧊🔨"), 5000);
    return () => { unsubscribe(); if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [sessionId]);

  const handleLaunch = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    isInitialLoadRef.current = true;
    prevCountRef.current = 0;
    setTimeLeft(60); 
    const newSessionId = Math.random().toString(36).substr(2, 4).toUpperCase(); 
    try {
      await setDoc(doc(db, 'artifacts', appId, 'brainstorming_sessions', newSessionId), {
        sessionId: newSessionId,
        question: question,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      setSessionId(newSessionId);
      setIsSessionActive(true);
    } catch (error) { alert("Error de conexión"); } finally { setIsLoading(false); }
  };

  const handleAnalyzeSession = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const currentResponses = [...responses];
      const totalWords = currentResponses.length;
      
      const frequencyMap = {};
      currentResponses.forEach(r => {
        const word = r.word ? r.word.trim().toUpperCase() : "DESCONOCIDO";
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      });

      const rankedWords = Object.keys(frequencyMap)
        .map(word => ({
            word: word,
            count: frequencyMap[word],
            percentage: totalWords > 0 ? Math.round((frequencyMap[word] / totalWords) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      let conclusion = "Sin datos suficientes.";
      if (totalWords > 0 && rankedWords.length > 0) {
        const topWord = rankedWords[0];
        if (topWord.percentage > 50) conclusion = `¡Consenso masivo! El concepto "${topWord.word}" domina la sala.`;
        else if (rankedWords.length > 3 && rankedWords[0].percentage < 20) conclusion = "Gran diversidad de pensamiento. No hay una idea dominante.";
        else conclusion = `La idea "${topWord.word}" lidera, pero hay debate interesante.`;
      }

      new Audio(VICTORY_SOUND).play().catch(()=>{});

      setAnalysisResult({ totalWords, uniqueConcepts: Object.keys(frequencyMap).length, rankedWords, text: conclusion });
      setIsAnalyzing(false);
    }, 2500);
  };

  const joinUrl = `${window.location.origin}?code=${sessionId}`;

  return (
    <div className="min-h-screen font-sans p-6 flex flex-col items-center relative overflow-hidden selection:bg-cyan-300 selection:text-black" style={{ backgroundImage: `url(${hospitalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-950/85 z-0 backdrop-blur-md" />

      {/* --- EMOJIS FLOTANTES --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingEmojis.map(emoji => (
            <div key={emoji.id} className="absolute bottom-0 text-6xl animate-float-up opacity-0" style={{ left: `${emoji.left}%` }}>{emoji.emoji}</div>
        ))}
      </div>

      {/* 🏆 MODAL DE RESULTADOS ÉPICOS 🏆 */}
      {analysisResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fade-in p-4 overflow-y-auto">
             {/* Confeti CSS */}
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-confetti-1"></div>
                <div className="absolute top-0 left-3/4 w-4 h-4 bg-red-500 rounded-full animate-confetti-2"></div>
                <div className="absolute top-0 left-1/2 w-3 h-5 bg-blue-400 rotate-45 animate-confetti-3"></div>
             </div>

             <div className="bg-slate-900 border-2 border-yellow-500/30 rounded-[2.5rem] max-w-5xl w-full p-8 relative flex flex-col shadow-[0_0_80px_rgba(234,179,8,0.2)] my-auto">
                
                {/* Header Victoria */}
                <div className="text-center mb-8 relative">
                    <Sparkles className="absolute top-0 left-1/4 text-yellow-300 w-10 h-10 animate-bounce" />
                    <h2 className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 tracking-tight drop-shadow-lg">
                        TOP TENDENCIAS
                    </h2>
                    <p className="text-slate-400 font-bold tracking-[0.3em] uppercase mt-2">Informe de Inteligencia</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                    
                    {/* COLUMNA IZQ: ESTADÍSTICAS e INSIGHT */}
                    <div className="space-y-6 flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 text-center">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Participación</p>
                                <p className="text-5xl font-black text-white"><AnimatedNumber value={analysisResult.totalWords} /></p>
                             </div>
                             <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 text-center">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-2">Conceptos</p>
                                <p className="text-5xl font-black text-white"><AnimatedNumber value={analysisResult.uniqueConcepts} /></p>
                             </div>
                        </div>

                        {/* INSIGHT IA */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-8 rounded-3xl border border-purple-500/30 relative shadow-lg">
                            <BrainCircuit className="absolute top-4 right-4 text-purple-400 w-8 h-8 opacity-50 animate-pulse" />
                            <h4 className="text-purple-300 font-bold text-sm uppercase tracking-wider mb-4">Conclusión del Sistema</h4>
                            <p className="text-white text-xl font-medium leading-relaxed italic">"{analysisResult.text}"</p>
                        </div>
                    </div>

                    {/* COLUMNA DER: PODIO MEJORADO Y LIMPIO */}
                    <div className="bg-slate-800/30 rounded-3xl p-8 border border-white/5 flex flex-col justify-end min-h-[400px] relative relative overflow-hidden">
                        {/* Fondo de brillo */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-yellow-500/10 blur-3xl pointer-events-none"></div>

                        {/* PODIO */}
                        <div className="flex items-end justify-center gap-4 h-72 mb-6 z-10 relative">
                            
                            {/* 🥈 SEGUNDO LUGAR */}
                            <div className="flex flex-col items-center justify-end w-1/3 animate-slide-up-2 opacity-0" style={{animationFillMode: 'forwards'}}>
                                {analysisResult.rankedWords[1] ? (
                                    <>
                                        <div className="flex flex-col items-center mb-2">
                                            <Medal className="w-8 h-8 text-slate-300 mb-1" />
                                            <div className="bg-slate-300 text-slate-900 font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-100 text-sm shadow-md relative z-20">2</div>
                                            <span className="text-slate-200 font-bold mt-1 text-sm text-center uppercase tracking-wider line-clamp-1">{analysisResult.rankedWords[1].word}</span>
                                        </div>
                                        <div className="w-full bg-gradient-to-b from-slate-300 to-slate-500 rounded-t-2xl shadow-lg relative flex items-end justify-center pb-3 border-t border-white/20" style={{ height: '140px' }}>
                                            <span className="text-2xl font-black text-white drop-shadow-md">{analysisResult.rankedWords[1].percentage}%</span>
                                        </div>
                                    </>
                                ) : <div className="h-32 w-full bg-white/5 rounded-t-2xl animate-pulse"></div>}
                            </div>

                            {/* 🥇 PRIMER LUGAR (GIGANTE) */}
                            <div className="flex flex-col items-center justify-end w-1/3 z-10 -mt-8 animate-slide-up-1 opacity-0" style={{animationFillMode: 'forwards'}}>
                                {analysisResult.rankedWords[0] ? (
                                    <>
                                        <div className="flex flex-col items-center mb-2">
                                            <Crown className="w-12 h-12 text-yellow-400 animate-bounce drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                            <div className="bg-yellow-400 text-yellow-900 font-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-yellow-200 text-lg shadow-lg -mt-4 relative z-20">1</div>
                                            <span className="text-yellow-200 font-black mt-2 text-lg text-center uppercase tracking-wider line-clamp-1">{analysisResult.rankedWords[0].word}</span>
                                        </div>
                                        <div className="w-full bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-500 rounded-t-2xl shadow-[0_0_30px_rgba(250,204,21,0.3)] relative flex items-end justify-center pb-4 border-t border-white/20" style={{ height: '200px' }}>
                                            <span className="text-4xl font-black text-white drop-shadow-md">{analysisResult.rankedWords[0].percentage}%</span>
                                        </div>
                                    </>
                                ) : <div className="h-48 w-full bg-white/5 rounded-t-2xl animate-pulse"></div>}
                            </div>

                            {/* 🥉 TERCER LUGAR */}
                            <div className="flex flex-col items-center justify-end w-1/3 animate-slide-up-3 opacity-0" style={{animationFillMode: 'forwards'}}>
                                {analysisResult.rankedWords[2] ? (
                                    <>
                                        <div className="flex flex-col items-center mb-2">
                                            <Trophy className="w-8 h-8 text-orange-400 mb-1" />
                                            <div className="bg-orange-400 text-orange-900 font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-orange-200 text-sm shadow-md relative z-20">3</div>
                                            <span className="text-orange-200 font-bold mt-1 text-sm text-center uppercase tracking-wider line-clamp-1">{analysisResult.rankedWords[2].word}</span>
                                        </div>
                                        <div className="w-full bg-gradient-to-b from-orange-400 to-orange-600 rounded-t-2xl shadow-lg relative flex items-end justify-center pb-3 border-t border-white/20" style={{ height: '100px' }}>
                                            <span className="text-2xl font-black text-white drop-shadow-md">{analysisResult.rankedWords[2].percentage}%</span>
                                        </div>
                                    </>
                                ) : <div className="h-24 w-full bg-white/5 rounded-t-2xl animate-pulse"></div>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                    <button onClick={onBack} className="bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" /> GUARDAR Y SALIR
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* --- RESTO DE PANTALLA --- */}
      <div className="relative z-10 w-full flex flex-col h-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 py-2">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"><ArrowLeft className="w-4 h-4" /> <span className="font-bold text-sm">Salir</span></button>
          
          {isSessionActive && !analysisResult && (
             <div className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 shadow-2xl transition-all scale-110 ${timeLeft < 10 ? 'bg-red-900/80 border-red-500 animate-pulse' : 'bg-slate-800/80 border-cyan-500'}`}>
                <Clock className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-400' : 'text-cyan-400'}`} />
                <span className={`text-3xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
             </div>
          )}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-950/30 border border-cyan-500/20 rounded-full"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /><span className="text-cyan-400 font-bold text-xs uppercase">En vivo</span></div>
        </div>

        {!isSessionActive ? (
          <div className="flex-1 flex flex-col items-center justify-center -mt-20 animate-fade-in">
             <div className="w-full max-w-3xl text-center">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h1 className="text-6xl font-black mb-6 text-white tracking-tight">Brainstorming <span className="text-cyan-400">Pro</span></h1>
              <div className="bg-slate-900 rounded-2xl border border-slate-700 p-2 flex items-center shadow-2xl mb-8"><input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="¿Qué tema debatimos hoy?" className="flex-1 bg-transparent p-4 text-xl text-white outline-none font-bold text-center" disabled={isLoading}/></div>
              <button onClick={handleLaunch} disabled={!question.trim() || isLoading} className="bg-white hover:bg-cyan-50 text-slate-900 font-black py-4 px-12 rounded-full text-lg shadow-xl transition-all flex items-center gap-3 mx-auto">{isLoading ? <Loader2 className="animate-spin" /> : <Send />} LANZAR SESIÓN (60s)</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-8 animate-fade-in">
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-white p-4 rounded-3xl shadow-2xl text-center"><QRCode value={joinUrl} size={140} /><p className="text-slate-900 font-black text-4xl mt-2 tracking-widest">{sessionId}</p><p className="text-slate-500 text-xs font-bold uppercase">Código de acceso</p></div>
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/10">
                <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-2"><Zap className="w-4 h-4" /> Energía</span><span className="text-white font-black">{responses.length}/20</span></div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700"><div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out relative" style={{width: `${energyLevel}%`}}><div className="absolute inset-0 bg-white/30 animate-pulse"></div></div></div>
                <p className="text-slate-400 text-[10px] mt-2 text-center">{energyLevel >= 100 ? "¡OBJETIVO CUMPLIDO! 🎉" : "¡Llenad la barra!"}</p>
              </div>
              <div className="flex-1"></div>
              <button onClick={handleAnalyzeSession} disabled={isAnalyzing} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all">{isAnalyzing ? <Loader2 className="animate-spin" /> : <BrainCircuit className="w-6 h-6" />} <span className="tracking-widest text-xs">ACABAR YA</span></button>
            </div>
            <div className="lg:col-span-9 flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-12 flex items-center justify-center"><p className="text-cyan-300 font-black uppercase tracking-widest text-sm animate-pulse flex items-center gap-2">{motivationalPhrase}</p></div>
              <div className="mt-8 mb-4 z-10"><h3 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg text-center">{question}</h3></div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar z-10 relative">
                {responses.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500/30"><Users className="w-20 h-20 mb-4 opacity-50" /><p className="text-xl font-black uppercase tracking-widest opacity-50">Esperando...</p></div>
                ) : (
                  <div className="flex flex-wrap justify-center content-start gap-4 pb-20">
                    {responses.map((res, index) => (
                      <div key={index} className={`${res.color} text-white font-black px-6 py-4 rounded-2xl shadow-lg border-b-4 border-black/10 transform transition-all duration-300 hover:scale-110 cursor-default animate-bounce-in`} style={{ fontSize: res.word.length > 10 ? '1.2rem' : '1.8rem', transform: `rotate(${res.rotation}deg)` }}>{res.word}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp { 0% { transform: translateY(0) scale(0.5); opacity: 1; } 100% { transform: translateY(-80vh) scale(1.5); opacity: 0; } }
        .animate-float-up { animation: floatUp 3s ease-out forwards; }
        @keyframes slideUp { 0% { height: 0; opacity: 0; } 100% { opacity: 1; } }
        .animate-slide-up-1 { animation: slideUp 1s ease-out forwards; }
        .animate-slide-up-2 { animation: slideUp 1s ease-out 0.3s forwards; }
        .animate-slide-up-3 { animation: slideUp 1s ease-out 0.6s forwards; }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); } 100% { transform: translateY(100vh) rotate(720deg); } }
        .animate-confetti-1 { animation: confetti 3s linear infinite; left: 20%; }
        .animate-confetti-2 { animation: confetti 4s linear infinite; left: 50%; }
        .animate-confetti-3 { animation: confetti 2.5s linear infinite; left: 80%; }
      `}</style>
    </div>
  );
};

export default BrainstormHost;
