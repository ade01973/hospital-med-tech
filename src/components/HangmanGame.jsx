import React, { useEffect, useMemo, useState } from 'react';
import { Award, Brain, Heart, RefreshCw, Sparkles, Volume2, X, Zap } from 'lucide-react';
import { generateHangmanChallenge } from '../lib/gemini';

const HANGMAN_TOPICS = [
  'Liderazgo enfermero',
  'Toma de decisiones',
  'Gestión de equipos',
  'Gestión de conflictos',
  'Comunicación efectiva',
  'Ética en enfermería',
  'Inteligencia artificial en salud',
  'Imagen profesional',
  'Imagen digital',
  'Marketing sanitario',
  'Dirección estratégica',
  'Gestión de recursos humanos',
  'Calidad asistencial',
  'Gestión por procesos'
];

const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const MAX_ATTEMPTS = 6;

const SUCCESS_SOUNDS = [
  'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg',
  'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'
];
const FAIL_SOUNDS = [
  'https://actions.google.com/sounds/v1/cartoon/poof.ogg',
  'https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg'
];
const WIN_SOUND = 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg';
const LOSE_SOUND = 'https://actions.google.com/sounds/v1/cartoon/trombone_wah_wah.ogg';

const normalize = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const HangmanGame = ({ isOpen, onClose }) => {
  const [challenge, setChallenge] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [status, setStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emojiMood, setEmojiMood] = useState('🧠');
  const [hypeTrail, setHypeTrail] = useState(['✨', '🎯', '🚀']);
  const [topicDeck, setTopicDeck] = useState(() => shuffle(HANGMAN_TOPICS));
  const [currentTopic, setCurrentTopic] = useState(null);

  const normalizedAnswer = useMemo(
    () => (challenge?.answer ? normalize(challenge.answer) : ''),
    [challenge]
  );

  const uniqueLetters = useMemo(() => {
    return new Set(normalizedAnswer.replace(/[^A-ZÑ]/g, '').split('').filter(Boolean));
  }, [normalizedAnswer]);

  useEffect(() => {
    if (isOpen) {
      startNewGame();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!status || status === 'playing') return;
    const soundUrl = status === 'won' ? WIN_SOUND : LOSE_SOUND;
    new Audio(soundUrl).play().catch(() => {});
  }, [status]);

  const playSound = (soundArray) => {
    const url = soundArray[Math.floor(Math.random() * soundArray.length)];
    new Audio(url).play().catch(() => {});
  };

  const rotateHypeTrail = () => {
    const emojiPool = ['✨', '🌟', '🚀', '🎉', '💥', '🧠', '⚡', '🏆', '🎯', '🌈'];
    const shuffled = shuffle(emojiPool).slice(0, 3);
    setHypeTrail(shuffled);
  };

  const pickTopic = () => {
    if (topicDeck.length === 0) {
      const reshuffled = shuffle(HANGMAN_TOPICS);
      setTopicDeck(reshuffled);
      return reshuffled[0];
    }
    return topicDeck[0];
  };

  const consumeTopic = () => {
    const nextTopic = pickTopic();
    const [, ...rest] = topicDeck.length ? topicDeck : shuffle(HANGMAN_TOPICS);
    setTopicDeck(rest.length ? rest : shuffle(HANGMAN_TOPICS));
    setCurrentTopic(nextTopic);
    return nextTopic;
  };

  const startNewGame = async () => {
    setIsLoading(true);
    setError(null);
    setStatus('loading');
    setGuessedLetters([]);
    setWrongGuesses(0);
    setEmojiMood('🧠');
    rotateHypeTrail();

    const topic = consumeTopic();

    try {
      const data = await generateHangmanChallenge(topic);
      setChallenge(data);
      setStatus('playing');
      setHypeTrail((trail) => trail.map((emoji, idx) => (idx === 0 ? '🧠' : emoji)));
    } catch (err) {
      const friendlyMessage = err.message?.includes('GOOGLE_API_KEY_1')
        ? 'Configura la variable GOOGLE_API_KEY_1 para conectar con Gemini y recarga el juego.'
        : err.message || 'No se pudo cargar el reto.';
      setError(friendlyMessage);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (letter) => {
    if (status !== 'playing' || guessedLetters.includes(letter)) return;

    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (uniqueLetters.has(letter)) {
      playSound(SUCCESS_SOUNDS);
      const hypeEmojis = ['🔥', '🚀', '🧠', '⚡', '🏆', '💫'];
      setEmojiMood(hypeEmojis[Math.floor(Math.random() * hypeEmojis.length)]);

      const hasWon = [...uniqueLetters].every((char) => updatedGuesses.includes(char));
      if (hasWon) {
        setStatus('won');
      }
    } else {
      playSound(FAIL_SOUNDS);
      const misses = ['😅', '🫣', '🤔', '🥶'];
      setEmojiMood(misses[Math.floor(Math.random() * misses.length)]);
      const nextWrong = wrongGuesses + 1;
      setWrongGuesses(nextWrong);
      if (nextWrong >= MAX_ATTEMPTS) {
        setStatus('lost');
      }
    }
  };

  const renderWord = () => {
    if (!challenge) return null;

    return challenge.answer.split('').map((char, idx) => {
      const normalizedChar = normalize(char);
      const isLetter = /[A-ZÑ]/.test(normalizedChar);

      return (
        <span
          key={`${char}-${idx}`}
          className={`w-10 h-14 flex items-center justify-center text-3xl font-black rounded-xl border-2 ${
            isLetter
              ? 'border-white/10 bg-white/5 text-white'
              : 'border-transparent text-cyan-200'
          } ${
            isLetter && guessedLetters.includes(normalizedChar)
              ? 'bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-cyan-300/40 shadow-lg shadow-cyan-500/20'
              : ''
          }`}
        >
          {isLetter && guessedLetters.includes(normalizedChar) ? char.toUpperCase() : isLetter ? '_' : char}
        </span>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 animate-pulse" />

      <div className="relative bg-slate-900/90 border border-white/10 rounded-3xl max-w-5xl w-full overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.2)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-900/70 to-slate-800/70">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
              <Brain className="w-7 h-7 text-white" />
              <span className="absolute -top-2 -right-2 bg-white text-slate-900 text-xs font-black rounded-full px-2 py-1 shadow-lg">
                {emojiMood}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-200 font-bold">Reto Gemini</p>
              <h2 className="text-xl font-black text-white">El reto de la Gestora Enfermera</h2>
              <p className="text-sm text-cyan-100/80 font-semibold">Temas de liderazgo y gestión enfermera, con vibe de gamificación 2025.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-[2fr,1fr] gap-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs font-black uppercase tracking-widest">
                {currentTopic || challenge?.topic}
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 text-xs font-black flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Pregunta nueva en cada partida
              </span>
              <div className="flex items-center gap-1 text-xl" aria-hidden>
                {hypeTrail.map((emoji, idx) => (
                  <span key={`${emoji}-${idx}`} className="animate-pulse">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
              <p className="text-sm text-cyan-100/80 mb-2 font-semibold">Pregunta generada por Gemini</p>
              <h3 className="text-2xl font-black text-white leading-snug">{challenge?.question || 'Cargando pregunta...'}</h3>
              <p className="text-slate-300 mt-3 text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-300" />
                <span>{challenge?.hint || 'Descifra el concepto clave.'}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 bg-slate-800/60 border border-white/5 rounded-2xl p-4">
              {renderWord()}
            </div>

            {error && (
              <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Intentos</p>
                <div className="flex items-center gap-2 mt-2">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => (
                    <Heart
                      key={idx}
                      className={`w-5 h-5 ${idx < MAX_ATTEMPTS - wrongGuesses ? 'text-rose-400' : 'text-slate-700'}`}
                      fill={idx < MAX_ATTEMPTS - wrongGuesses ? '#fb7185' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Estado</p>
                <div className="mt-2 px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-100 border border-cyan-400/30">
                  {status === 'won' && <Award className="w-4 h-4" />} {status === 'lost' && <X className="w-4 h-4" />} {status === 'playing' && <Zap className="w-4 h-4" />} {status === 'loading' ? 'Preparando...' : status === 'playing' ? 'En juego' : status === 'won' ? '¡Victoria!' : status === 'lost' ? 'Derrota' : 'Listo'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {LETTERS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter) || status !== 'playing' || isLoading}
                  className={`h-10 rounded-xl text-sm font-black transition-all border ${
                    guessedLetters.includes(letter)
                      ? uniqueLetters.has(letter)
                        ? 'bg-gradient-to-br from-emerald-500/70 to-cyan-500/70 text-white border-emerald-200/60'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                      : 'bg-slate-900/60 border-white/5 text-white hover:bg-cyan-500/20 hover:border-cyan-400/40'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            {(status === 'won' || status === 'lost') && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 rounded-2xl p-4 text-center space-y-2">
                <p className="text-3xl">{status === 'won' ? '🎉' : '💡'}</p>
                <h4 className="text-lg font-black text-white">
                  {status === 'won'
                    ? (challenge?.celebration || '¡Palabra salvada!')
                    : `La respuesta era: ${challenge?.answer}`}
                </h4>
                {challenge?.takeaway && (
                  <p className="text-sm text-slate-300">{challenge.takeaway}</p>
                )}
                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={startNewGame}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    <RefreshCw className="w-4 h-4" /> Nuevo tema
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm border border-white/10 hover:bg-slate-700"
                  >
                    Salir al dashboard
                  </button>
                </div>
              </div>
            )}

            {status === 'playing' && (
              <div className="text-center text-slate-300 text-sm bg-slate-900/50 border border-white/5 rounded-xl p-3">
                <span className="font-black text-cyan-200">Tip:</span> Cada nueva partida trae una pregunta distinta de gestión enfermera.
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={startNewGame}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 font-black text-sm shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Cargando...' : 'Cambiar de reto'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm border border-white/10 hover:bg-slate-700"
              >
                Salir al dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;
