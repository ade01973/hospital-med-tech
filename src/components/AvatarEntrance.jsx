import React, { useEffect, useState } from 'react';
import hospitalEntranceBg from '../assets/hospital-entrance.png'; 

const AvatarEntrance = ({ avatar, onComplete }) => {
  const [showEntrance, setShowEntrance] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    // Si no hay avatar todavía, no hacemos nada (o ponemos uno por defecto)
    if (!avatar) return;

    // --- 1. LÓGICA DE GÉNERO ROBUSTA ---
    // Convertimos lo que venga de la base de datos a minúsculas y quitamos espacios
    const genderInput = avatar.gender ? String(avatar.gender).toLowerCase().trim() : 'male';
    
    // Por defecto asumimos que es hombre ('male')
    let genderFile = 'male';

    // Si detectamos cualquier variante de mujer, cambiamos a 'female'
    if (['female', 'mujer', 'femenino', 'woman', 'chica'].includes(genderInput)) {
      genderFile = 'female';
    }

    // --- 2. LÓGICA DE NÚMERO ---
    // Usamos el preset que venga, si no hay, usamos el '1'
    const presetFile = avatar.characterPreset ? avatar.characterPreset : '1';

    // --- 3. CREAR LA RUTA ---
    // Resultado: /avatar/male-character-1.png
    const finalPath = `/avatar/${genderFile}-character-${presetFile}.png`;
    
    console.log("Avatar calculado:", finalPath); // Mira la consola si falla
    setImgSrc(finalPath);

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
        <div className="relative mb-20 animate-avatar-entrance w-80 h-80 flex justify-center">
          
          {/* Renderizado Condicional: Solo mostramos la etiqueta img si tenemos una ruta */}
          {imgSrc && (
            <img
              src={imgSrc}
              alt="Personaje"
              className="h-full object-contain drop-shadow-2xl rounded-2xl"
              onError={(e) => {
                console.error("Falló la imagen:", e.target.src);
                // RETROCESO DE SEGURIDAD:
                // Si falla la imagen específica (ej. 59), intenta cargar la número 1
                // para que no se quede vacío el hueco.
                if (!e.target.src.includes('-1.png')) {
                   const currentGender = imgSrc.includes('female') ? 'female' : 'male';
                   e.target.src = `/avatar/${currentGender}-character-1.png`;
                }
              }}
            />
          )}

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
