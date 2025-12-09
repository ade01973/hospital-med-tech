import React, { useEffect, useState } from 'react';
import hospitalEntranceBg from '../assets/hospital-entrance.png';

// --- IMPORTS DE IMÁGENES ---
// Asegúrate de que estos nombres coinciden EXACTAMENTE con tus archivos
import female1 from '../assets/female-characters/female-character-1.png';
import female2 from '../assets/female-characters/female-character-2.png';
import female3 from '../assets/female-characters/female-character-3.png';

import male1 from '../assets/male-characters/male-character-1.png';
import male2 from '../assets/male-characters/male-character-2.png';
import male3 from '../assets/male-characters/male-character-3.png';

const characterImages = {
  female: {
    '1': female1,
    '2': female2,
    '3': female3,
  },
  male: {
    '1': male1,
    '2': male2,
    '3': male3,
  }
};

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);

  // --- LÓGICA DE DEPURACIÓN Y SELECCIÓN DE IMAGEN ---
  
  // 1. Normalizamos el género a minúsculas para evitar errores (ej: "Female" -> "female")
  // Si no hay género, asumimos 'female' por defecto para que no falle.
  const genderKey = avatar?.gender ? avatar.gender.toLowerCase() : 'female';
  
  // 2. Obtenemos el preset o usamos '1' por defecto
  const presetKey = avatar?.characterPreset ? String(avatar.characterPreset) : '1';

  // 3. Seleccionamos la imagen final
  const selectedImage = characterImages[genderKey]?.[presetKey] || characterImages['female']['1'];

  // 4. CHIVATO EN CONSOLA: Esto nos dirá qué está intentando cargar
  console.log("--- DEBUG AVATAR ---");
  console.log("Datos del avatar:", avatar);
  console.log("Género detectado:", genderKey);
  console.log("Preset detectado:", presetKey);
  console.log("Imagen final:", selectedImage);
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntrance(false);
      if (onComplete) onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showEntrance) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${hospitalEntranceBg})`,
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10">
        <div className="relative mb-20 animate-avatar-entrance w-80 h-80">
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-56 h-3 bg-gradient-to-r from-transparent via-black/40 to-transparent rounded-full blur-xl" />
          
          {/* IMAGEN DEL AVATAR */}
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Avatar Seleccionado"
              className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
              onError={(e) => {
                console.error("Error cargando la imagen:", e.target.src);
                e.target.style.display = 'none'; // Ocultar si falla
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-red-500/20 rounded-2xl">
              Avatar no encontrado
            </div>
          )}

          <div className="absolute inset-0 -m-8 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-5xl font-black text-white mb-2 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            Bienvenido al Hospital Gest-Tech
          </h1>
          <p className="text-xl text-cyan-300 font-bold animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Tu aventura comienza ahora...
          </p>
        </div>

        {/* Particle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float-particle"
              style={{
                left: `${20 + i * 10}%`,
                top: '60%',
                animationDelay: `${i * 0.1}s`,
                '--duration': `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-lg animate-pulse" />
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="relative w-40 h-64 border-4 border-cyan-500/30 rounded-t-3xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl text-red-500/50">+</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2 items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <p className="text-xs text-slate-400 font-bold">Entrando al sistema...</p>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
};

export default AvatarEntrance;
