import React, { useEffect, useState } from 'react';
import hospitalEntranceBg from '../assets/hospital-entrance.png'; // Fondo desde assets

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    // --- 1. Determinar Género ---
    const rawGender = avatar?.gender ? String(avatar.gender).toLowerCase().trim() : 'female';
    let genderPrefix = 'female'; // Por defecto
    
    if (['male', 'hombre', 'masculino', 'man', 'chico'].includes(rawGender)) {
      genderPrefix = 'male';
    }

    // --- 2. Determinar Número (Preset) ---
    // Si no hay preset, usamos el '1'.
    const presetNumber = avatar?.characterPreset ? String(avatar.characterPreset) : '1';

    // --- 3. CONSTRUCCIÓN DINÁMICA DE LA RUTA ---
    // Aquí es donde sucede la magia. En lugar de una lista, creamos el texto de la ruta.
    // Estructura: /avatar/male-character-59.png
    
    // IMPORTANTE: Verifica si tus archivos se llaman "male-character-X.png" o solo "male-X.png"
    // Ajusta la línea de abajo según tus nombres reales de archivo:
    const dynamicPath = `/avatar/${genderPrefix}-character-${presetNumber}.png`;

    console.log("Cargando avatar:", dynamicPath); // Para ver en consola qué intenta cargar
    setImgSrc(dynamicPath);

  }, [avatar]);

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
          
          {/* IMAGEN GENERADA DINÁMICAMENTE */}
          <img
            src={imgSrc}
            alt="Tu Avatar"
            className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
            onError={(e) => {
              // Si la imagen 59 no existe o falla, cargamos la 1 como seguridad
              console.warn(`No se encontró la imagen ${imgSrc}, cargando fallback.`);
              if (!e.target.src.includes('-1.png')) {
                 // Intentamos cargar la número 1 del mismo género
                 const currentGender = imgSrc.includes('male') ? 'male' : 'female';
                 e.target.src = `/avatar/${currentGender}-character-1.png`;
              }
            }}
          />

          <div className="absolute inset-0 -m-8 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse -z-10" />
        </div>

        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-5xl font-black text-white mb-2 animate-fadeInUp">
            Bienvenido
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AvatarEntrance;
