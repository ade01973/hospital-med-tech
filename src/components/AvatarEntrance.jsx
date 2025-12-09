import React, { useEffect, useState } from 'react';
import hospitalEntranceBg from '../assets/hospital-entrance.png';

// --- IMPORTS DE IMÁGENES ---
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

  // --- LÓGICA DEPURADA Y BLINDADA ---
  
  // 1. Obtener el valor crudo del género y limpiarlo
  const rawGender = avatar?.gender ? String(avatar.gender).toLowerCase().trim() : '';
  
  // 2. Traducir cualquier variante a 'male' o 'female'
  let genderKey = 'female'; // Default por seguridad
  
  if (['male', 'hombre', 'masculino', 'man', 'chico'].includes(rawGender)) {
    genderKey = 'male';
  } else if (['female', 'mujer', 'femenino', 'woman', 'chica'].includes(rawGender)) {
    genderKey = 'female';
  }

  // 3. Normalizar el preset (asegurar que es '1', '2' o '3')
  // A veces llega como número (1), a veces como string ("1")
  const presetKey = avatar?.characterPreset ? String(avatar.characterPreset) : '1';

  // 4. Seleccionar imagen con fallback inteligente
  // Si falla la combinación exacta, intenta cargar el preset 1 de ese género
  const selectedImage = characterImages[genderKey]?.[presetKey] || characterImages[genderKey]?.['1'] || characterImages['female']['1'];

  // --- DEBUG EN CONSOLA (IMPORTANTE: Mira esto con F12 si falla) ---
  console.log("%c DEBUG AVATAR ", "background: #222; color: #bada55");
  console.log("1. Género que llega de BD:", avatar?.gender);
  console.log("2. Género traducido:", genderKey);
  console.log("3. Preset:", presetKey);
  console.log("4. Imagen final:", selectedImage);
  // -------------------------------------------------------------

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
              alt={`Avatar ${genderKey}`}
              className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
              onError={(e) => {
                console.error("Error cargando imagen:", e.target.src);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-red-500/50 text-white font-bold rounded-2xl">
              Error de imagen
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
