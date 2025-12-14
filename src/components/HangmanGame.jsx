import React, { useEffect, useMemo, useState } from 'react';
import { X, RefreshCcw, Sparkles, Volume2, VolumeX, PartyPopper, Skull } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateHangmanChallenge } from '../lib/gemini';
import useSoundEffects from '../hooks/useSoundEffects';

const LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const ENGAGEMENT_EMOJIS = ['🔥','🚀','🌟','💥','🎯','🧠','🎉','💪','✨','🥳','🤩','🌈'];
const THEMES = [
  'Liderazgo enfermero',
  'Toma de decisiones',
  'Gestión de equipos',
  'Gestión de conflictos',
  'Comunicación',
  'Ética profesional',
  'Inteligencia artificial',
  'Imagen profesional',
  'Imagen digital',
  'Marketing sanitario',
  'Dirección estratégica',
  'Gestión de recursos humanos',
  'Calidad asistencial',
  'Gestión por procesos'
];

const normalizeText = (text = '') => text
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .toUpperCase();

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const wordMask = (answer, guessedLetters) => {
  const normalized = normalizeText(answer);
  return answer.split('').map((char, idx) => {
    const normalizedChar = normalized[idx];
    if (/[^A-ZÑ]/.test(normalizedChar)) return char;
    return guessedLetters.includes(normalizedChar) ? char : ' _ ';
  }).join(' ');
};

const HangmanFigure = ({ mistakes }) => {
  const stages = [
    '💙',
    '💙💙',
    '💙💙💙',
    '💙💙💙💙',
    '💙💙💙💙💙',
    '💙💙💙💙💙💙',
    '💙💙💙💙💙💙💙'
  ];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-4xl">{mistakes >= 6 ? <Skull className="w-10 h-10 text-rose-300" /> : '🪢'}</div>
      <p className="text-sm text-slate-200/80">Vida de equipo</p>
      <p className="text-lg font-black text-cyan-100 tracking-wide">{stages[mistakes]}</p>
    </div>
  );
};

export default function HangmanGame({ isOpen, onClose, onExitToDashboard }) {
  const [challenge, setChallenge] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('loading');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastTopic, setLastTopic] = useState(null);

  const { playSuccess, playError, playVictory, soundEnabled, setSoundEnabled, playNotification } = useSoundEffects();

  const normalizedAnswer = useMemo(() => normalizeText(challenge?.answer || ''), [challenge]);
  const lettersToGuess = useMemo(() => {
    return new Set(normalizedAnswer.split('').filter((char) => /[A-ZÑ]/.test(char)));
  }, [normalizedAnswer]);

  useEffect(() => {
    if (isOpen) {
      loadChallenge();
    }
  }, [isOpen]);

  const selectNextTopic = () => {
    const pool = THEMES.filter((topic) => topic !== lastTopic);
    const next = getRandomItem(pool.length ? pool : THEMES);
    setLastTopic(next);
    return next;
  };

  const loadChallenge = async () => {
    setIsLoading(true);
    setError(null);
    setStatus('loading');
    setGuessedLetters([]);
    setMistakes(0);
    setFeedback('');

    const topic = selectNextTopic();

    try {
      const data = await generateHangmanChallenge(topic, lastTopic);
      setChallenge(data);
      setStatus('playing');
      playNotification();
    } catch (err) {
      console.error('Fallo al obtener reto de ahorcado', err);
      setError('No pudimos conectar con la API de Gemini. Verifica GOOGLE_API_KEY_1 en el servidor o reintenta.');

      // Fallback de cortesía para no romper la sesión
      const fallbackChallenge = {
        topic,
        question: `Plan exprés sobre ${topic}: ¿qué concepto clave impulsa a la gestora enfermera?`,
        hint: 'Piensa en liderazgo y gestión de equipos 👩‍⚕️🚀',
        answer: 'LIDERAZGO',
      };

      setChallenge(fallbackChallenge);
      setStatus('playing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (letter) => {
    if (status !== 'playing' || guessedLetters.includes(letter)) return;

    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (normalizedAnswer.includes(letter)) {
      playSuccess();
      setFeedback(`${getRandomItem(ENGAGEMENT_EMOJIS)} ¡Equipo en racha!`);

      const allGuessed = Array.from(lettersToGuess).every((char) => updatedGuesses.includes(char));
      if (allGuessed) {
        setStatus('won');
        playVictory();
        setFeedback('🎉 ¡Victoria estratégica!');
      }
    } else {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      playError();
      setFeedback('⚠️ Pista: revisa la pista IA');

      if (nextMistakes >= 6) {
        setStatus('lost');
      }
    }
  };

  const keyboard = (
    <div className="grid grid-cols-9 gap-2 w-full">
      {LETTERS.map((letter) => {
        const isUsed = guessedLetters.includes(letter);
        const isCorrect = normalizedAnswer.includes(letter);
        const baseClasses = 'rounded-xl py-2 text-sm font-black transition-all shadow-lg border';
        const stateClasses = !isUsed
          ? 'bg-white/10 border-white/10 hover:bg-cyan-500/40 text-white'
          : isCorrect
            ? 'bg-emerald-500/80 border-emerald-400/60 text-white'
            : 'bg-rose-500/80 border-rose-400/60 text-white';
        return (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={isUsed || status !== 'playing'}
            className={`${baseClasses} ${stateClasses} ${isUsed ? 'opacity-80' : ''}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );

  const renderStatus = () => {
    if (status === 'loading') {
      return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-cyan-100 flex items-center justify-between">
          <div>
            <p className="font-black text-lg">Cargando reto IA...</p>
            <p className="text-sm text-cyan-50/80">Generando pista con Gemini</p>
          </div>
          <RefreshCcw className="w-6 h-6 text-cyan-200 animate-spin" />
        </div>
      );
    }

    if (status === 'won') {
      return (
        <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-4 text-emerald-100 flex items-center justify-between">
          <div>
            <p className="font-black text-lg">¡Reto completado!</p>
            <p className="text-sm text-emerald-50/80">Palabra clave: {challenge?.answer}</p>
          </div>
          <PartyPopper className="w-8 h-8 text-emerald-200" />
        </div>
      );
    }

    if (status === 'lost') {
      return (
        <div className="bg-rose-500/20 border border-rose-400/50 rounded-2xl p-4 text-rose-100 flex items-center justify-between">
          <div>
            <p className="font-black text-lg">Se acabaron las vidas</p>
            <p className="text-sm text-rose-50/80">Respuesta: {challenge?.answer}</p>
          </div>
          <Skull className="w-8 h-8 text-rose-200" />
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="bg-rose-500/20 border border-rose-400/50 rounded-2xl p-4 text-rose-100 flex items-center justify-between">
          <div>
            <p className="font-black text-lg">No pudimos cargar el reto</p>
            <p className="text-sm text-rose-50/80">{error}</p>
          </div>
          <button
            onClick={loadChallenge}
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-cyan-100 flex items-center justify-between">
        <div>
          <p className="font-black text-lg">Pregunta IA</p>
          <p className="text-sm text-cyan-50/80">{challenge?.question}</p>
        </div>
        <Sparkles className="w-6 h-6 text-cyan-200" />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900/40 border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-2xl animate-pulse">🪝</span>
            </div>
            <div>
              <p className="text-xs text-cyan-200">Juego IA</p>
              <h2 className="text-xl font-black text-white">Ahorcado Enfermero</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
              title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-6">
          <div className="md:col-span-2 space-y-4">
            {renderStatus()}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-cyan-100/70">Tema IA</p>
                  <p className="text-lg font-black text-white">{challenge?.topic}</p>
                </div>
                <span className="text-2xl">{getRandomItem(ENGAGEMENT_EMOJIS)}</span>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-4 border border-cyan-500/20">
                <p className="text-2xl font-black text-center tracking-widest text-cyan-100">{challenge ? wordMask(challenge.answer, guessedLetters) : '...'}</p>
                <p className="text-sm text-center text-cyan-200/80 mt-2">{feedback || 'Adivina la palabra clave de gestión enfermera'}</p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-cyan-100/70">Pista IA</p>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-sm text-cyan-50 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{challenge?.hint}</span>
                </div>
              </div>

              <div className="mt-4">
                {keyboard}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border border-cyan-500/20 rounded-2xl p-4">
              <p className="text-sm font-black text-white mb-2">Estado del equipo</p>
              <HangmanFigure mistakes={mistakes} />
              <p className="text-xs text-cyan-100/70 text-center mt-2">Errores permitidos: {6 - mistakes}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-black text-white flex items-center gap-2"><Sparkles className="w-4 h-4" /> Movimientos</p>
              <div className="flex flex-wrap gap-2 text-xs text-cyan-100/80">
                {guessedLetters.map((letter) => (
                  <span key={letter} className="px-2 py-1 rounded-lg bg-white/10 border border-white/10">{letter}</span>
                ))}
                {!guessedLetters.length && <span className="text-cyan-100/50">Aún sin intentos</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadChallenge}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black rounded-xl px-3 py-2 shadow-lg shadow-cyan-500/30"
                  disabled={isLoading}
                >
                  <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Nuevo tema
                </button>
                <button
                  onClick={() => {
                    if (status === 'won' || status === 'lost') {
                      onExitToDashboard?.();
                    } else {
                      onClose?.();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-white font-black rounded-xl px-3 py-2 hover:bg-white/15"
                >
                  Salir
                </button>
              </div>
            </div>

            {(status === 'won' || status === 'lost') && (
              <div className="bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-black text-white">¿Te animas a otro reto?</p>
                <div className="flex gap-2">
                  <button
                    onClick={loadChallenge}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black rounded-xl px-3 py-2 shadow-lg shadow-emerald-500/30"
                  >
                    Nuevo juego
                  </button>
                  <button
                    onClick={onExitToDashboard}
                    className="flex-1 bg-white/10 border border-white/20 text-white font-black rounded-xl px-3 py-2 hover:bg-white/15"
                  >
                    Volver al dashboard
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
