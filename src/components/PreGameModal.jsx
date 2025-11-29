import React, { useState } from 'react';
import { X, Play, Video } from 'lucide-react';

/**
 * PreGameModal - Modal para elegir ver video o jugar
 * Aparece cuando se presiona "Iniciar Nivel"
 */
const PreGameModal = ({ isOpen, onClose, onPlayGame, videoId, moduleName, moduleSubtitle, moduleIcon }) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-cyan-500/50 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950/30 to-slate-950 border-b border-cyan-500/20 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{moduleIcon}</span>
            <div>
              <h2 className="text-2xl font-black text-white">{moduleName}</h2>
              <p className="text-sm text-cyan-300">{moduleSubtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!showVideo ? (
            <>
              {/* Introducción */}
              <p className="text-center text-slate-300 mb-8 leading-relaxed">
                ¿Deseas ver el video de introducción del módulo o prefieres comenzar directamente con el quiz?
              </p>

              {/* Video Preview */}
              <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="aspect-video bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-lg flex items-center justify-center mb-4 border border-cyan-500/20">
                  <div className="text-center">
                    <Video size={48} className="text-cyan-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-300 font-bold">Video de Introducción</p>
                    <p className="text-xs text-slate-500">~5 minutos</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  El video te brindará contexto e información importante del módulo
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Video size={20} />
                  Ver Video
                </button>
                <button
                  onClick={onPlayGame}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Jugar Ahora
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Video Player */}
              <div className="mb-6">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-500/30">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="Video de introducción del módulo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <p className="text-center text-slate-300 mb-6">
                Video completado. ¿Listo para comenzar el quiz?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVideo(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-xl transition-all"
                >
                  ← Volver
                </button>
                <button
                  onClick={onPlayGame}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Play size={18} />
                  Comenzar Quiz
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreGameModal;
