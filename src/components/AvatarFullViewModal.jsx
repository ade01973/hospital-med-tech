import React from 'react';
import { X } from 'lucide-react';
import avatarModalBg from '../assets/avatar-modal-bg.png';
import { getCharacterImage } from '../lib/avatarAssets';

const AvatarFullViewModal = ({ isOpen, onClose, playerAvatar }) => {
  if (!isOpen || !playerAvatar) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="rounded-2xl border-2 border-cyan-500/50 max-w-md w-full shadow-2xl overflow-hidden bg-cover bg-center relative"
        style={{ backgroundImage: `url(${avatarModalBg})` }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content Container */}
        <div className="relative z-10">
          {/* Header - Solo botón cerrar */}
          <div className="p-4 flex justify-end">
            <button 
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-all bg-black/30"
              title="Cerrar"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Avatar Display */}
          <div className="px-6 pb-6 flex flex-col items-center">
            {/* Título */}
            <h2 className="text-white font-bold text-2xl mb-1 text-center">Gestor Enfermero</h2>
            
            {/* Nombre */}
            <h3 className="text-cyan-300 font-semibold text-lg mb-6 text-center">{playerAvatar.name}</h3>
            
            {/* Avatar Image */}
            <div className="w-64 h-80 rounded-xl overflow-hidden bg-slate-800/30 border-2 border-cyan-400/60 mb-6 shadow-lg backdrop-blur-sm">
              {playerAvatar.characterPreset ? (
                <img
                  src={getCharacterImage(playerAvatar.gender, playerAvatar.characterPreset)}
                  alt="Avatar"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center">
                  <span className="text-slate-300 text-center font-semibold">
                    {playerAvatar.gender === 'male' ? 'Gestor Enfermero' : 'Gestora Enfermera'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="px-6 pb-6">
            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarFullViewModal;
