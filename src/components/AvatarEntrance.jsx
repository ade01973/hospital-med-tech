import React, { useEffect, useState } from 'react';
// La imagen de fondo si está en assets se importa, si está en public se pone la ruta como abajo.
// Asumo que el fondo sigue en assets, si no, cámbialo a string también.
import hospitalEntranceBg from '../assets/hospital-entrance.png'; 

const characterImages = {
  female: {
    // NOTA: Ajusta estas rutas si tus carpetas dentro de 'public/avatar' son diferentes.
    // La ruta '/' equivale a la carpeta 'public'.
    '1': '/avatar/female-characters/female-character-1.png',
    '2': '/avatar/female-characters/female-character-2.png',
    '3': '/avatar/female-characters/female-character-3.png',
  },
  male: {
    '1': '/avatar/male-characters/male-character-1.png',
    '2': '/avatar/male-characters/male-character-2.png',
    '3': '/avatar/male-characters/male-character-3.png',
  }
};

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);

  // --- LÓGICA DEPURADA (Mantenemos la lógica que arreglamos antes) ---
  
  // 1. Limpieza de género
  const rawGender = avatar?.gender ? String(avatar.gender).toLowerCase().trim() : '';
  
  let genderKey = 'female'; 
  
  if (['male', 'hombre', 'masculino', 'man', 'chico'].includes(rawGender)) {
    genderKey = 'male';
  } else if (['female', 'mujer', 'femenino', 'woman', 'chica'].includes(rawGender)) {
    genderKey = 'female';
  }

  // 2. Limpieza de preset
  const presetKey = avatar?.characterPreset ? String(avatar.characterPreset) : '1';

  // 3. Selección de imagen
  const selectedImage = characterImages[genderKey]?.[presetKey] || characterImages[genderKey]?.['1'] || characterImages['female']['1'];

  // --- DEBUG ---
  console.log("--- DEBUG PUBLIC FOLDER ---");
  console.log("Buscando imagen en:", selectedImage);
  // -------------

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
          <img
            src={selectedImage}
            alt={`Avatar ${genderKey}`}
            className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
            onError={(e) => {
              console.error("No se encuentra la imagen en public:", e.target.src);
              // Opcional: poner una imagen de error visual
            }}
          />

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
        
        {/* Efectos decorativos... */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-lg animate-pulse" />
      </div>
    </div>
  );
};

export default AvatarEntrance;
