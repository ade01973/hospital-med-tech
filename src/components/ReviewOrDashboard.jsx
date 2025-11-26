import React from 'react';
import { X, Play, RotateCcw } from 'lucide-react';

export default function ReviewOrDashboard({ isOpen, score, totalQuestions, topic, videoId, onViewVideo, onGoToDashboard, onClose }) {
  if (!isOpen) return null;

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 max-w-md w-full mx-4 border-2 border-cyan-400/30 shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl font-black mb-4">
            {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">¡Módulo Completado!</h2>
          <p className="text-slate-300">{topic?.title}</p>
        </div>

        {/* Score Display */}
        <div className="bg-slate-800/50 p-6 rounded-xl mb-8 border border-slate-700 text-center">
          <p className="text-sm text-slate-400 mb-2">PUNTUACIÓN</p>
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-4xl font-black text-cyan-300">{score}</p>
              <p className="text-xs text-slate-400">/ {totalQuestions}</p>
            </div>
            <div className="text-5xl font-black text-yellow-400">{percentage}%</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-xl mb-8 border border-slate-700">
          <p className="text-slate-300 text-center text-sm">¿Qué quieres hacer ahora?</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Review Video Button */}
          <button
            onClick={() => {
              onViewVideo();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
          >
            <RotateCcw className="w-6 h-6" />
            Ver Video de Repaso
          </button>

          {/* Dashboard Button */}
          <button
            onClick={() => {
              onClose();
              setTimeout(() => onGoToDashboard(), 50);
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/50"
          >
            <Play className="w-6 h-6" />
            Ir a Módulos
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            El video de repaso te ayudará a reforzar lo aprendido.
          </p>
        </div>
      </div>
    </div>
  );
}
