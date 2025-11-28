import React from 'react';
import { X } from 'lucide-react';

const AvatarFullViewModal = ({ isOpen, onClose, playerAvatar }) => {
  if (!isOpen || !playerAvatar) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-cyan-500/50 max-w-md w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Mi Gestor Enfermero</h2>
          <button 
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Avatar Display */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-64 h-80 rounded-xl overflow-hidden bg-slate-800 border-2 border-cyan-500/50 mb-6 shadow-lg">
            {playerAvatar.gender === 'male' && playerAvatar.characterPreset ? (
              <img 
                src={`/src/assets/male-characters/male-character-${playerAvatar.characterPreset}.png`}
                alt="Mi Gestor Enfermero"
                className="w-full h-full object-contain bg-gradient-to-b from-slate-700 to-slate-900"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center">
                <span className="text-slate-400 text-center">Avatar Femenino</span>
              </div>
            )}
          </div>

          {/* Avatar Info */}
          <div className="text-center w-full">
            <h3 className="text-white font-bold text-2xl mb-2">{playerAvatar.name}</h3>
            <p className="text-cyan-400 font-semibold text-sm mb-4">
              {playerAvatar.gender === 'male' ? 'Gestor Enfermero' : 'Gestora Enfermera'}
            </p>
            
            {/* Character Info */}
            {playerAvatar.characterPreset && (
              <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/30">
                <p className="text-slate-300 text-xs">Personaje #{playerAvatar.characterPreset}</p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarFullViewModal;
