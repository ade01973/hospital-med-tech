import React, { useState } from 'react';
import { X, Play } from 'lucide-react';

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

              {/* Video Preview - IRRESISTIBLE */}
              <div className="mb-8 group cursor-pointer">
                {/* Video Card Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]">
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-emerald-500 opacity-90 animate-gradient-shift"></div>
                  
                  {/* Content Overlay */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
                    {/* Large Movie Emoji */}
                    <div className="text-7xl mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      🎬
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                        <Play size={40} className="text-cyan-600 ml-1" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-white text-center mb-4 drop-shadow-lg">
                      Domina los Conceptos Clave
                    </h3>

                    {/* Badges */}
                    <div className="flex gap-2 justify-center mb-4 flex-wrap">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-xs font-bold text-white">
                        ⭐ Esencial
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-xs font-bold text-white">
                        ⏱️ 5 min
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-xs font-bold text-white">
                        📝 Subtítulos
                      </span>
                    </div>

                    {/* Motivational Text */}
                    <p className="text-center text-white/95 text-sm font-semibold drop-shadow-lg max-w-xs">
                      Aprende de expertos en gestión sanitaria
                    </p>
                  </div>
                </div>

                {/* Click to Watch Label */}
                <p className="text-center text-cyan-300 text-xs font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  ✨ Haz clic para ver el video
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                >
                  <Play size={20} />
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
