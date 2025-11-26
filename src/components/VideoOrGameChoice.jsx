import React from 'react';
import { X, Play, Video } from 'lucide-react';

export default function VideoOrGameChoice({ isOpen, topic, videoId, onPlayVideo, onPlayGame, onClose }) {
  if (!isOpen) return null;

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
        <div className="flex items-center gap-3 mb-6">
          <div className="text-5xl">{topic?.icon}</div>
          <div>
            <h2 className="text-2xl font-black text-white">{topic?.title}</h2>
            <p className="text-sm text-slate-300">{topic?.subtitle}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl mb-8 border border-slate-700">
          <p className="text-slate-300 text-center text-sm">¿Qué quieres hacer?</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Video Button */}
          <button
            onClick={() => {
              onPlayVideo();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
          >
            <Video className="w-6 h-6" />
            Ver Video
          </button>

          {/* Game Button */}
          <button
            onClick={() => {
              onPlayGame();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/50"
          >
            <Play className="w-6 h-6" />
            Jugar Ahora
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            Puedes ver el video para aprender antes de jugar, o saltar directamente al juego.
          </p>
        </div>
      </div>
    </div>
  );
}
