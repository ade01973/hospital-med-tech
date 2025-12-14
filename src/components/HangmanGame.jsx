import React, { useMemo, useState } from 'react';
import { X, RefreshCw, Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { TOPICS } from '../data/constants';

const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const MAX_ATTEMPTS = 6;

const normalizeWord = (text) =>
  text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-ZÑ]/g, '');

const pickRandomTopic = () => {
  const pool = TOPICS.slice(0, 21);
  const random = pool[Math.floor(Math.random() * pool.length)];
  const keyword = normalizeWord(random.title).split(' ')[0];
  return {
    word: keyword || 'ENFERMERIA',
    clue: random.subtitle,
    title: random.title,
  };
};

const buildDisplayWord = (word, guesses) =>
  word
    .split('')
    .map((letter) => (guesses.includes(letter) ? letter : '_'))
    .join(' ');

export default function HangmanGame({ isOpen, onClose }) {
  const [secret, setSecret] = useState(pickRandomTopic());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const isWinner = useMemo(
    () => secret.word.split('').every((letter) => guessedLetters.includes(letter)),
    [secret.word, guessedLetters]
  );

  const isLoser = wrongAttempts >= MAX_ATTEMPTS;
  const displayWord = buildDisplayWord(secret.word, guessedLetters);

  const handleGuess = (letter) => {
    if (isWinner || isLoser || guessedLetters.includes(letter)) return;

    if (secret.word.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);
    } else {
      setWrongAttempts((prev) => prev + 1);
      setGuessedLetters((prev) => [...prev, letter]);
    }
  };

  const resetGame = () => {
    setSecret(pickRandomTopic());
    setGuessedLetters([]);
    setWrongAttempts(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400/40 rounded-3xl shadow-2xl shadow-cyan-900/40 w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80 font-bold">Mini-juego</p>
            <h2 className="text-2xl font-black text-white">Ahorcado Gest-Tech</h2>
            <p className="text-sm text-cyan-100/70">Adivina términos clave de los módulos</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-red-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-700/70 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Heart className="w-5 h-5" />
                <span>{Math.max(0, MAX_ATTEMPTS - wrongAttempts)} vidas</span>
              </div>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 px-3 py-1.5 rounded-lg text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" /> Reiniciar
              </button>
            </div>

            <div className="text-center py-8 bg-slate-800/50 rounded-xl border border-slate-700/80">
              <p className="text-sm text-slate-300 mb-3">Pista: {secret.clue}</p>
              <p className="text-3xl md:text-4xl font-black tracking-[0.35em] text-white mb-2">{displayWord}</p>
              <p className="text-xs text-slate-400">Módulo: {secret.title}</p>
            </div>

            <div className="mt-6 grid grid-cols-7 sm:grid-cols-9 gap-2">
              {LETTERS.map((letter) => {
                const isUsed = guessedLetters.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={isUsed || isWinner || isLoser}
                    className={`h-10 rounded-lg font-bold text-sm transition-all border
                      ${secret.word.includes(letter) && isUsed ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-100' : ''}
                      ${!secret.word.includes(letter) && isUsed ? 'bg-red-500/15 border-red-400/30 text-red-100/80' : ''}
                      ${!isUsed ? 'bg-slate-800/70 border-slate-700 hover:bg-cyan-500/20 hover:border-cyan-400/40 text-slate-100' : ''}
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/70 rounded-2xl p-5 space-y-4">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl p-4">
              <p className="text-amber-200 font-black flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" /> Intentos restantes
              </p>
              <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${((MAX_ATTEMPTS - wrongAttempts) / MAX_ATTEMPTS) * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-200 mt-2">Tienes {MAX_ATTEMPTS - wrongAttempts} oportunidades.</p>
            </div>

            {(isWinner || isLoser) && (
              <div className={`rounded-xl p-4 border ${isWinner ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-red-500/20 border-red-400/40'}`}>
                <p className="font-black text-lg flex items-center gap-2 text-white">
                  {isWinner ? <CheckCircle className="w-5 h-5 text-emerald-300" /> : <AlertTriangle className="w-5 h-5 text-red-200" />}
                  {isWinner ? '¡Lo lograste!' : 'Sin vidas disponibles'}
                </p>
                <p className="text-slate-200 mt-1">
                  {isWinner ? 'Has completado la palabra clave del módulo.' : `La palabra era "${secret.word}"`}
                </p>
                <button
                  onClick={resetGame}
                  className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg border border-white/20 transition-all"
                >
                  Jugar de nuevo
                </button>
              </div>
            )}

            <div className="text-xs text-slate-400">
              <p>El juego utiliza palabras clave de los 21 módulos disponibles.</p>
              <p>Perfecto para repasar los conceptos básicos antes de los niveles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
