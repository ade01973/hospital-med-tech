
import React, { useState } from 'react';
import { X, Twitter, Linkedin, Facebook, MessageCircle, Link, Check } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, moduleTitle, score, streak, rankTitle }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // URL base de la aplicación (actualizar con tu dominio real)
  const appUrl = window.location.origin;
  
  // Mensaje personalizado
  const getMessage = () => {
    if (rankTitle) {
      return `¡Alcancé el rango ${rankTitle} en Hospital Gest-Tech! 🏥 Puntuación total: ${score} pts ⭐ Racha: 🔥${streak} días #EnfermeríaDigital #GestiónSanitaria`;
    }
    return `¡Completé el módulo "${moduleTitle}" en Hospital Gest-Tech! 🏥 Puntuación: ${score} pts ⭐ Racha: 🔥${streak} días #EnfermeríaDigital #GestiónSanitaria`;
  };

  const message = getMessage();
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(appUrl);

  // URLs de compartir
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${message} ${appUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-2 border-cyan-500/50 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              📢
            </div>
            <h2 className="text-xl font-black text-white">COMPARTIR LOGRO</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Preview Message */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase font-bold mb-2">Vista previa</p>
            <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Compartir en:</p>
            
            {/* Twitter/X */}
            <button
              onClick={() => handleShare('twitter')}
              className="w-full bg-black hover:bg-gray-900 border border-white/10 text-white px-4 py-3 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 font-bold"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter / X</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full bg-[#0077B5] hover:bg-[#006399] text-white px-4 py-3 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 font-bold"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare('facebook')}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-3 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 font-bold"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 font-bold"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`w-full ${
                copied 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-slate-700 hover:bg-slate-600'
              } text-white px-4 py-3 rounded-xl transition-all transform hover:scale-102 flex items-center gap-3 font-bold`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Link className="w-5 h-5" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-all border border-white/20"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
