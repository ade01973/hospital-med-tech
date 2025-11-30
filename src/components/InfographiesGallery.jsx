import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { TOPICS } from '../data/constants';
import moduloGestoraImg from '../assets/infographics/modulo-1-gestora-enfermera.png';
import moduloLiderazgoImg from '../assets/infographics/modulo-2-liderazgo.png';
import moduloCompetenciasImg from '../assets/infographics/modulo-3-competencias-digitales.png';
import moduloComunicacionImg from '../assets/infographics/modulo-4-comunicacion.png';
import moduloClimaImg from '../assets/infographics/modulo-5-clima-laboral.png';
import moduloConflictoImg from '../assets/infographics/modulo-6-conflicto.png';
import moduloMotivacionImg from '../assets/infographics/modulo-7-motivacion.png';

// Mapeo de infografías por módulo
const infographicsMap = {
  1: moduloGestoraImg, // La Gestora Enfermera
  2: moduloLiderazgoImg, // Liderazgo
  3: moduloCompetenciasImg, // Competencias Digitales
  4: moduloComunicacionImg, // Comunicación
  5: moduloClimaImg, // Clima Laboral
  6: moduloConflictoImg, // Gestión del Conflicto
  7: moduloMotivacionImg, // Gestión de la Motivación
};

export default function InfographiesGallery({ isOpen, onClose }) {
  const [selectedInfographic, setSelectedInfographic] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (!isOpen) return null;

  const handleOpenFullscreen = (topic) => {
    if (infographicsMap[topic.id]) {
      setSelectedTopic(topic);
      setSelectedInfographic(infographicsMap[topic.id]);
    }
  };

  const closeFullscreen = () => {
    setSelectedInfographic(null);
    setSelectedTopic(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      {/* Modal Principal - Gallery */}
      {!selectedInfographic && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-400/30 px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h2 className="text-3xl font-black text-white">Infografías Temáticas</h2>
                <p className="text-sm text-slate-300 mt-1">Guías visuales de los 21 módulos de gestión sanitaria</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-full flex items-center justify-center transition-all text-red-400 hover:text-red-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content Grid */}
          <div className="overflow-y-auto flex-1">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOPICS.slice(0, 21).map((topic) => {
                  const hasInfographic = infographicsMap[topic.id];
                  
                  return (
                    <div
                      key={topic.id}
                      onClick={() => hasInfographic && handleOpenFullscreen(topic)}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all transform ${
                        hasInfographic
                          ? 'cursor-pointer hover:scale-105 border-cyan-400/30 hover:border-cyan-400 bg-slate-800/40 hover:bg-slate-800/80'
                          : 'cursor-not-allowed border-slate-600/30 bg-slate-900/20 opacity-60'
                      } backdrop-blur-sm shadow-lg`}
                    >
                      {/* Placeholder Infografía */}
                      <div className="aspect-square w-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                        
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 text-center">
                          <div className="text-5xl mb-3">{topic.icon}</div>
                          <h3 className="text-white font-black text-sm mb-2 line-clamp-2">{topic.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{topic.subtitle}</p>
                        </div>

                        {/* Module Number Badge */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                          {String(topic.id).padStart(2, '0')}
                        </div>

                        {/* Status Badge */}
                        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-bold ${
                          hasInfographic
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                            : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300'
                        }`}>
                          {hasInfographic ? '✓ Disponible' : 'Próximamente'}
                        </div>
                      </div>

                      {/* Hover Overlay - Ver a Pantalla Completa */}
                      {hasInfographic && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFullscreen(topic);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105"
                          >
                            <ZoomIn className="w-4 h-4" />
                            Ver en Pantalla Completa
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-900/80 border-t border-cyan-400/20 px-8 py-4 text-center text-sm text-slate-400">
            <p>💡 Haz clic en una infografía disponible para verla a pantalla completa.</p>
          </div>
        </div>
      )}

      {/* Fullscreen Infographic Modal */}
      {selectedInfographic && selectedTopic && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={closeFullscreen}
        >
          {/* Header */}
          <div className="w-full max-w-5xl flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedTopic.icon}</div>
              <div>
                <h3 className="text-2xl font-black text-white">{selectedTopic.title}</h3>
                <p className="text-sm text-slate-400">{selectedTopic.subtitle}</p>
              </div>
            </div>
            <button
              onClick={closeFullscreen}
              className="w-12 h-12 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-full flex items-center justify-center transition-all text-red-400 hover:text-red-300"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Image Container */}
          <div 
            className="w-full max-w-5xl h-auto max-h-[85vh] overflow-auto rounded-2xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedInfographic} 
              alt={selectedTopic.title}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Footer */}
          <div className="w-full max-w-5xl text-center mt-4 text-slate-400 text-sm">
            <p>Presiona ESC o haz clic fuera para cerrar</p>
          </div>
        </div>
      )}
    </div>
  );
}
