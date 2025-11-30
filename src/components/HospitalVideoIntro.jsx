import React, { useEffect, useState } from 'react';
import hospitalVideoSrc from '../assets/hospital-intro.mp4';

/**
 * HospitalVideoIntro - Pantalla completa de video de introducción del hospital
 * Se muestra después del avatar entrance
 * Cuando termina el video, transiciona al dashboard
 */
const HospitalVideoIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleVideoEnd = () => {
    // Fade out antes de completar
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[998] bg-black transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Video element - fullscreen */}
      <video
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      >
        <source src={hospitalVideoSrc} type="video/mp4" />
        Tu navegador no soporta reproducción de video
      </video>

      {/* Loading indicator - in case video takes time */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalVideoIntro;
