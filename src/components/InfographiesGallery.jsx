import React, { useState, useEffect, useMemo } from 'react';
import { X, ZoomIn, Star, Search, Filter, CheckCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { TOPICS } from '../data/constants';
import moduloGestoraImg from '../assets/infographics/modulo-1-gestora-enfermera.png';
import moduloLiderazgoImg from '../assets/infographics/modulo-2-liderazgo.png';
import moduloCompetenciasImg from '../assets/infographics/modulo-3-competencias-digitales.png';
import moduloComunicacionImg from '../assets/infographics/modulo-4-comunicacion.png';
import moduloClimaImg from '../assets/infographics/modulo-5-clima-laboral.png';
import moduloConflictoImg from '../assets/infographics/modulo-6-conflicto.png';
import moduloMotivacionImg from '../assets/infographics/modulo-7-motivacion.png';
import moduloTrabajoImg from '../assets/infographics/modulo-8-trabajo-equipo.png';
import moduloImagenImg from '../assets/infographics/modulo-9-imagen-digital.png';
import moduloDecisionesImg from '../assets/infographics/modulo-10-decisiones.png';
import moduloPlanificacionImg from '../assets/infographics/modulo-11-planificacion.png';
import moduloProcesosImg from '../assets/infographics/modulo-12-procesos.png';
import moduloCambioImg from '../assets/infographics/modulo-13-cambio.png';
import moduloInnovacionImg from '../assets/infographics/modulo-14-innovacion.png';
import moduloMarketingImg from '../assets/infographics/modulo-15-marketing.png';
import moduloAdministracionImg from '../assets/infographics/modulo-16-administracion.png';
import moduloSistemasImg from '../assets/infographics/modulo-17-sistemas-sanitarios.png';
import moduloCargaImg from '../assets/infographics/modulo-18-carga-cuidados.png';
import moduloSeguridadImg from '../assets/infographics/modulo-19-seguridad-paciente.png';
import moduloCalidadImg from '../assets/infographics/modulo-19-calidad.png';
import moduloDireccionImg from '../assets/infographics/modulo-20-direccion-estrategica.png';

const infographicsMap = {
  1: moduloGestoraImg,
  2: moduloLiderazgoImg,
  3: moduloCompetenciasImg,
  4: moduloComunicacionImg,
  5: moduloClimaImg,
  6: moduloConflictoImg,
  7: moduloMotivacionImg,
  8: moduloTrabajoImg,
  9: moduloImagenImg,
  10: moduloDecisionesImg,
  11: moduloPlanificacionImg,
  12: moduloProcesosImg,
  13: moduloMarketingImg,
  14: moduloCambioImg,
  15: moduloInnovacionImg,
  16: moduloCargaImg,
  17: moduloSistemasImg,
  18: moduloAdministracionImg,
  19: moduloCalidadImg,
  20: moduloDireccionImg,
  21: moduloSeguridadImg,
};

const CATEGORIES = [
  { id: 'all', label: 'Todas', icon: '📊' },
  { id: 'gestion', label: 'Gestión', icon: '🏥' },
  { id: 'liderazgo', label: 'Liderazgo', icon: '👔' },
  { id: 'innovacion', label: 'Innovación', icon: '💡' },
  { id: 'comunicacion', label: 'Comunicación', icon: '💬' },
  { id: 'equipo', label: 'Equipo', icon: '👥' },
];

const getCategoryForTopic = (topicId) => {
  if ([1, 11, 12, 17, 18, 19].includes(topicId)) return 'gestion';
  if ([2, 10, 14, 20].includes(topicId)) return 'liderazgo';
  if ([3, 13, 15].includes(topicId)) return 'innovacion';
  if ([4, 9].includes(topicId)) return 'comunicacion';
  if ([5, 6, 7, 8, 16, 21].includes(topicId)) return 'equipo';
  return 'gestion';
};

const SkeletonLoader = () => (
  <div className="aspect-square w-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden">
    <div className="w-full h-full animate-pulse">
      <div className="h-full w-full bg-gradient-to-r from-transparent via-slate-600/50 to-transparent skeleton-shimmer"></div>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

export default function InfographiesGallery({ isOpen, onClose }) {
  const [selectedInfographic, setSelectedInfographic] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewedInfographics, setViewedInfographics] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoverPreview, setHoverPreview] = useState(null);

  const availableInfographics = Object.keys(infographicsMap).map(Number);
  const totalAvailable = availableInfographics.length;

  useEffect(() => {
    const savedViewed = localStorage.getItem('infographics_viewed');
    const savedFavorites = localStorage.getItem('infographics_favorites');
    if (savedViewed) setViewedInfographics(JSON.parse(savedViewed));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    if (viewedInfographics.length === totalAvailable && totalAvailable > 0 && !showConfetti) {
      const hasShownConfetti = localStorage.getItem('infographics_confetti_shown');
      if (!hasShownConfetti) {
        setShowConfetti(true);
        localStorage.setItem('infographics_confetti_shown', 'true');
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [viewedInfographics, totalAvailable, showConfetti]);

  const markAsViewed = (topicId) => {
    if (!viewedInfographics.includes(topicId)) {
      const newViewed = [...viewedInfographics, topicId];
      setViewedInfographics(newViewed);
      localStorage.setItem('infographics_viewed', JSON.stringify(newViewed));
    }
  };

  const toggleFavorite = (topicId, e) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(topicId)
      ? favorites.filter(id => id !== topicId)
      : [...favorites, topicId];
    setFavorites(newFavorites);
    localStorage.setItem('infographics_favorites', JSON.stringify(newFavorites));
  };

  const handleOpenFullscreen = (topic) => {
    if (infographicsMap[topic.id]) {
      setSelectedTopic(topic);
      setSelectedInfographic(infographicsMap[topic.id]);
      markAsViewed(topic.id);
    }
  };

  const closeFullscreen = () => {
    setSelectedInfographic(null);
    setSelectedTopic(null);
  };

  const filteredTopics = useMemo(() => {
    return TOPICS.slice(0, 21).filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           topic.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || getCategoryForTopic(topic.id) === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.includes(topic.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const viewedCount = viewedInfographics.filter(id => availableInfographics.includes(id)).length;
  const progressPercentage = (viewedCount / totalAvailable) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          colors={['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']}
        />
      )}

      <AnimatePresence>
        {!selectedInfographic && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-400/30 px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📊</div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">Infografías Temáticas</h2>
                    <p className="text-sm text-slate-300 mt-1">Guías visuales de gestión sanitaria</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-full flex items-center justify-center transition-all text-red-400 hover:text-red-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-bold">Progreso de Visualización</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-black text-lg">{viewedCount}/{totalAvailable}</span>
                    {viewedCount === totalAvailable && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                      >
                        <CheckCircle className="w-3 h-3" />
                        ¡Completado!
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-700/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar infografía..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    showFavoritesOnly
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                  Favoritos ({favorites.length})
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {CATEGORIES.map(cat => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTopics.map((topic, index) => {
                    const hasInfographic = infographicsMap[topic.id];
                    const isViewed = viewedInfographics.includes(topic.id);
                    const isFavorite = favorites.includes(topic.id);
                    
                    return (
                      <motion.div
                        key={topic.id}
                        variants={cardVariants}
                        whileHover={hasInfographic ? { 
                          scale: 1.03,
                          transition: { type: "spring", stiffness: 300, damping: 20 }
                        } : {}}
                        onMouseEnter={() => hasInfographic && setHoverPreview(topic.id)}
                        onMouseLeave={() => setHoverPreview(null)}
                        onClick={() => hasInfographic && handleOpenFullscreen(topic)}
                        className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
                          hasInfographic
                            ? 'cursor-pointer border-cyan-400/30 hover:border-cyan-400 bg-slate-800/40 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-cyan-500/20'
                            : 'cursor-not-allowed border-slate-600/30 bg-slate-900/20 opacity-60'
                        } backdrop-blur-sm shadow-lg`}
                      >
                        {!loadedImages[topic.id] && hasInfographic && (
                          <div className="absolute inset-0 z-10">
                            <SkeletonLoader />
                          </div>
                        )}

                        <div className="aspect-square w-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                          
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all duration-300"></div>
                          
                          <div className="relative z-10 text-center">
                            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{topic.icon}</div>
                            <h3 className="text-white font-black text-sm mb-2 line-clamp-2">{topic.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2">{topic.subtitle}</p>
                          </div>

                          <div className="absolute top-3 right-3 perspective-1000">
                            <div 
                              className="bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300"
                              style={{
                                boxShadow: '0 4px 0 rgba(6, 182, 212, 0.5), 0 8px 20px rgba(6, 182, 212, 0.3)',
                                transform: 'perspective(500px) rotateX(10deg) rotateY(-5deg)',
                              }}
                            >
                              {String(topic.id).padStart(2, '0')}
                            </div>
                          </div>

                          {hasInfographic && (
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => toggleFavorite(topic.id, e)}
                              className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isFavorite
                                  ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                                  : 'bg-slate-700/80 text-slate-400 hover:bg-slate-600 hover:text-yellow-400'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                            </motion.button>
                          )}

                          <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                            hasInfographic
                              ? isViewed
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                              : 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-300'
                          }`}>
                            {hasInfographic ? (
                              isViewed ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Vista
                                </>
                              ) : (
                                '✨ Nueva'
                              )
                            ) : (
                              'Próximamente'
                            )}
                          </div>
                        </div>

                        {hasInfographic && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoverPreview === topic.id ? 1 : 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4 pointer-events-none"
                          >
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ 
                                scale: hoverPreview === topic.id ? 1 : 0.8, 
                                opacity: hoverPreview === topic.id ? 1 : 0 
                              }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="w-24 h-24 mb-3 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg"
                            >
                              <img 
                                src={infographicsMap[topic.id]} 
                                alt={topic.title}
                                className="w-full h-full object-cover object-top"
                                onLoad={() => setLoadedImages(prev => ({ ...prev, [topic.id]: true }))}
                              />
                            </motion.div>
                            <button
                              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg pointer-events-auto"
                            >
                              <ZoomIn className="w-4 h-4" />
                              Ver Completa
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>

                {filteredTopics.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-slate-400 text-lg">No se encontraron infografías</p>
                    <p className="text-slate-500 text-sm mt-2">Intenta con otros términos de búsqueda</p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/80 border-t border-cyan-400/20 px-6 py-3 text-center text-sm text-slate-400">
              <p>💡 Haz clic en una infografía para verla a pantalla completa • ⭐ Marca tus favoritas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInfographic && selectedTopic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={closeFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedTopic.icon}</div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedTopic.title}</h3>
                    <p className="text-sm text-slate-400">{selectedTopic.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleFavorite(selectedTopic.id, e)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      favorites.includes(selectedTopic.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:text-yellow-400'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${favorites.includes(selectedTopic.id) ? 'fill-white' : ''}`} />
                  </motion.button>
                  <button
                    onClick={closeFullscreen}
                    className="w-12 h-12 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-full flex items-center justify-center transition-all text-red-400 hover:text-red-300"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <div className="w-full h-auto max-h-[80vh] overflow-auto rounded-2xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 bg-slate-900">
                <img 
                  src={selectedInfographic} 
                  alt={selectedTopic.title}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="text-center mt-4 text-slate-400 text-sm">
                <p>Presiona ESC o haz clic fuera para cerrar</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
