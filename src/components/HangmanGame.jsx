import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Brain,
  Heart,
  RefreshCw,
  Sparkles,
  Volume2,
  X,
  Zap
} from 'lucide-react';
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
const STAGE_SEGMENTS = [
  { icon: '🧠', label: 'Enfoque clínico' },
  { icon: '🎯', label: 'Estrategia' },
  { icon: '🤝', label: 'Equipo' },
  { icon: '📡', label: 'Comunicación' },
  { icon: '🛡️', label: 'Calma' },
  { icon: '🚀', label: 'Impulso' }
];

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
  const [activeKey, setActiveKey] = useState(null);
  const [motivation, setMotivation] = useState('Listas para liderar con foco clínico.');

  const normalizedAnswer = useMemo(
    () => (challenge?.answer ? normalize(challenge.answer) : ''),
    [challenge]
  );

  const uniqueLetters = useMemo(() => {
    return new Set(normalizedAnswer.replace(/[^A-ZÑ]/g, '').split('').filter(Boolean));
  }, [normalizedAnswer]);

  const masteryProgress = useMemo(() => {
    if (!uniqueLetters.size) return 0;
    const hits = [...uniqueLetters].filter((char) => guessedLetters.includes(char)).length;
    return Math.round((hits / uniqueLetters.size) * 100);
  }, [uniqueLetters, guessedLetters]);

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

    setActiveKey(letter);
    setTimeout(() => setActiveKey(null), 280);

    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (uniqueLetters.has(letter)) {
      playSound(SUCCESS_SOUNDS);
      const hypeEmojis = ['🔥', '🚀', '🧠', '⚡', '🏆', '💫'];
      setEmojiMood(hypeEmojis[Math.floor(Math.random() * hypeEmojis.length)]);
      const boosts = [
        '¡Equipo alineado y motivado! 💪',
        'Liderazgo que inspira resultados. 🌟',
        'Decisión acertada, servicio brillante. 🎯',
        'Comunicación impecable, seguimos. 📢',
        'Gestión premium, excelencia asistencial. 🏆'
      ];
      setMotivation(boosts[Math.floor(Math.random() * boosts.length)]);

      const hasWon = [...uniqueLetters].every((char) => updatedGuesses.includes(char));
      if (hasWon) {
        setStatus('won');
      }
    } else {
      playSound(FAIL_SOUNDS);
      const misses = ['😅', '🫣', '🤔', '🥶'];
      setEmojiMood(misses[Math.floor(Math.random() * misses.length)]);
      const setbacks = [
        'Reajusta el plan, la gestora sigue. 🔄',
        'Calma, vuelve a la evidencia. 📚',
        'Respira, piensa en el equipo. 🤝',
        'Cada error es feedback de mejora. ✨'
      ];
      setMotivation(setbacks[Math.floor(Math.random() * setbacks.length)]);
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
          className={`w-8 h-10 flex items-center justify-center text-xl font-black rounded-xl border-2 ${
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
    <div className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 animate-pulse" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-10 w-36 h-36 bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute -right-10 top-8 w-40 h-40 bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute left-8 bottom-6 w-32 h-32 bg-emerald-400/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />
      </div>

      <div className="relative bg-slate-900/90 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[88vh] overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.2)] flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-gradient-to-r from-slate-900/70 to-slate-800/70">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
              <Brain className="w-6 h-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-white text-slate-900 text-[10px] font-black rounded-full px-2 py-0.5 shadow-lg">
                {emojiMood}
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-base md:text-lg font-black text-white flex items-center gap-2 leading-tight">El reto de la Gestora Enfermera</h2>
              <p className="text-[11px] text-cyan-100/80 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> {motivation}
              </p>
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

        <div className="grid md:grid-cols-[2fr,1fr] gap-3 p-4 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-[10px] font-black uppercase tracking-widest">
                {currentTopic || challenge?.topic}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 text-[10px] font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Pregunta nueva en cada partida
              </span>
              <div className="flex items-center gap-1 text-xl" aria-hidden>
                {hypeTrail.map((emoji, idx) => (
                  <span key={`${emoji}-${idx}`} className="animate-pulse">
                    {emoji}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-3">
              <p className="text-[11px] text-cyan-100/80 mb-1.5 font-semibold">Pregunta generada por Gemini</p>
              <h3 className="text-base md:text-lg font-black text-white leading-snug break-words">{challenge?.question || 'Cargando pregunta...'}</h3>
              <p className="text-slate-300 mt-1.5 text-[11px] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-300" />
                <span>{challenge?.hint || 'Descifra el concepto clave.'}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-slate-800/60 border border-white/5 rounded-2xl p-2.5">
              {renderWord()}
            </div>

            {error && (
              <div className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="bg-slate-800/60 border border-white/5 rounded-2xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Intentos</p>
                <div className="flex items-center gap-2 mt-2">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => (
                    <Heart
                      key={idx}
                      className={`w-4 h-4 ${idx < MAX_ATTEMPTS - wrongGuesses ? 'text-rose-400' : 'text-slate-700'}`}
                      fill={idx < MAX_ATTEMPTS - wrongGuesses ? '#fb7185' : 'none'}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Estado</p>
                <div className="mt-2 px-3 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-100 border border-cyan-400/30">
                  {status === 'won' && <Award className="w-4 h-4" />} {status === 'lost' && <X className="w-4 h-4" />} {status === 'playing' && <Zap className="w-4 h-4" />} {status === 'loading' ? 'Preparando...' : status === 'playing' ? 'En juego' : status === 'won' ? '¡Victoria!' : status === 'lost' ? 'Derrota' : 'Listo'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-2.5 shadow-inner shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-cyan-300 font-black">Escudo de la gestora</p>
                  <p className="text-[11px] text-slate-200 font-semibold">Se apaga con cada error, ¡protégelo!</p>
                </div>
                <span className="text-2xl" aria-hidden>
                  {wrongGuesses >= MAX_ATTEMPTS - 1 ? '🛑' : '🛡️'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {STAGE_SEGMENTS.map((segment, idx) => {
                  const isActive = idx < MAX_ATTEMPTS - wrongGuesses;
                  return (
                    <div
                      key={segment.label}
                      className={`rounded-xl px-2 py-1.5 border text-[9px] font-semibold flex items-center gap-1 transition-all overflow-hidden ${
                        isActive
                          ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-800 text-slate-500 saturate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-sm animate-pulse' : 'text-sm'}>{segment.icon}</span>
                      <span className="leading-tight text-[9px] break-words whitespace-normal text-center">
                        {segment.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/70 border border-white/10 rounded-2xl p-2.5 shadow-inner shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-cyan-300 font-black">Energía del reto</p>
                  <p className="text-[11px] text-slate-200 font-semibold">{masteryProgress}% concepto desbloqueado</p>
                </div>
                <div className="flex items-center gap-2 text-xl" aria-hidden>
                  {hypeTrail.map((emoji, idx) => (
                    <span key={`trail-${emoji}-${idx}`} className="animate-bounce">
                      {emoji}
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/40 transition-all duration-500"
                  style={{ width: `${masteryProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {LETTERS.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter) || status !== 'playing' || isLoading}
                  className={`h-9 rounded-xl text-xs font-black transition-all border relative overflow-hidden ${
                    guessedLetters.includes(letter)
                      ? uniqueLetters.has(letter)
                        ? 'bg-gradient-to-br from-emerald-500/70 to-cyan-500/70 text-white border-emerald-200/60 shadow-lg shadow-emerald-400/30'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                      : 'bg-slate-900/60 border-white/5 text-white hover:bg-cyan-500/20 hover:border-cyan-400/40'
                  } ${
                    activeKey === letter ? 'ring-2 ring-cyan-300/80 ring-offset-2 ring-offset-slate-900 scale-105' : ''
                  }`}
                >
                  {!guessedLetters.includes(letter) && (
                    <span className="absolute inset-0 bg-gradient-to-br from-white/5 to-cyan-500/10 opacity-0 hover:opacity-60 transition-opacity" aria-hidden />
                  )}
                  {letter}
                </button>
              ))}
            </div>

            {(status === 'won' || status === 'lost') && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 rounded-2xl p-3 text-center space-y-2">
                <p className="text-2xl">{status === 'won' ? '🎉' : '💡'}</p>
                <h4 className="text-sm font-black text-white">
                  {status === 'won'
                    ? (challenge?.celebration || '¡Palabra salvada!')
                    : `La respuesta era: ${challenge?.answer}`}
                </h4>
                {challenge?.takeaway && (
                  <p className="text-[11px] text-slate-300">{challenge.takeaway}</p>
                )}
                <div className="flex gap-2 justify-center pt-1 flex-wrap">
                  <button
                    onClick={startNewGame}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[11px] flex items-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerar reto
                  </button>
                  <button
                    onClick={startNewGame}
                    className="px-3 py-2 rounded-xl bg-emerald-500/90 text-white font-black text-[11px] flex items-center gap-2 shadow-lg shadow-emerald-400/30"
                  >
                    <Sparkles className="w-4 h-4" /> Volver a jugar
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-[11px] border border-white/10 hover:bg-slate-700"
                  >
                    Salir al dashboard
                  </button>
                </div>
              </div>
            )}

            {status === 'playing' && (
              <div className="text-center text-slate-300 text-[11px] bg-slate-900/50 border border-white/5 rounded-xl p-2">
                <span className="font-black text-cyan-200">Tip:</span> Cada nueva partida trae una pregunta distinta de gestión enfermera.
              </div>
            )}

            {status === 'playing' && (
              <div className="flex gap-2 pt-1 flex-wrap justify-center md:justify-start">
                <button
                  onClick={startNewGame}
                  disabled={isLoading}
                  className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-white text-slate-900 font-black text-[11px] shadow-lg hover:shadow-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Cargando...' : 'Regenerar reto'}
                </button>
                <button
                  onClick={startNewGame}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-xl bg-emerald-500/90 text-white font-black text-[11px] shadow-lg shadow-emerald-400/30 hover:shadow-emerald-300/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> Volver a jugar
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-[11px] border border-white/10 hover:bg-slate-700"
                >
                  Salir al dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;
