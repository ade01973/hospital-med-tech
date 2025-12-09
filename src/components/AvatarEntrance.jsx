import React, { useEffect, useState } from 'react';
// Asegúrate de que este fondo existe o cambia la ruta
import hospitalEntranceBg from '../assets/hospital-entrance.png'; 

// 1. CONFIGURA AQUÍ TUS RUTAS EXACTAS
// Si tus archivos están en "public/avatar/male-character-1.png", usa esta estructura:
const characterImages = {
  female: {
    '1': '/avatar/female-character-1.png',
    '2': '/avatar/female-character-2.png',
    '3': '/avatar/female-character-3.png',
  },
  male: {
    '1': '/avatar/male-character-1.png',
    '2': '/avatar/male-character-2.png',
    '3': '/avatar/male-character-3.png',
  }
};

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);

  // --- LÓGICA DE SELECCIÓN ---
  
  // 1. Limpieza de género
  const rawGender = avatar?.gender ? String(avatar.gender).toLowerCase().trim() : '';
  let genderKey = 'female'; // Default
  
  if (['male', 'hombre', 'masculino', 'man', 'chico'].includes(rawGender)) {
    genderKey = 'male';
  } else if (['female', 'mujer', 'femenino', 'woman', 'chica'].includes(rawGender)) {
    genderKey = 'female';
  }

  // 2. Limpieza de preset (El número del personaje)
  // Convertimos a string para asegurar que coincida con las claves '1', '2', '3'
  const presetKey = avatar?.characterPreset ? String(avatar.characterPreset) : '1';

  // 3. Intentamos obtener la imagen exacta
  let selectedImage = characterImages[genderKey]?.[presetKey];
  let isFallback = false;

  // 4. Si no existe la exacta, usamos la 1 del género correspondiente (Fallback)
  if (!selectedImage) {
    selectedImage = characterImages[genderKey]?.['1'];
    isFallback = true;
  }

  // --- DEBUG CRÍTICO: MIRA LA CONSOLA DEL NAVEGADOR (F12) ---
  console.log("--- DEBUG AVATAR ---");
  console.log(`Género detectado: ${genderKey} (Original: ${rawGender})`);
  console.log(`Preset elegido: ${presetKey} (Original: ${avatar?.characterPreset})`);
  console.log(`Ruta generada: ${selectedImage}`);
  if (isFallback) {
    console.warn("⚠️ NO SE ENCONTRÓ EL PRESET SELECCIONADO. Se está mostrando la imagen nº 1 por defecto.");
    console.warn("Verifica que el número que llega de la BD (Preset elegido) coincida con las claves '1', '2', '3' del código.");
  }
  // ----------------------------------------------------------

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
          
          {/* IMAGEN DEL AVATAR */}
          <img
            src={selectedImage}
            alt="Avatar personaje"
            className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
            onError={(e) => {
              console.error("❌ ERROR CARGANDO IMAGEN:", e.target.src);
              console.error("Verifica que el archivo exista realmente en la carpeta public/avatar/");
              e.target.style.display = 'none'; // Ocultar si falla
            }}
          />

          {/* Decoración */}
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
