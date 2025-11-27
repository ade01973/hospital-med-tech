import React, { useState, useEffect } from "react";
import AvatarPreview from "./AvatarPreview";
import { avatarOptions } from "../data/avatarOptions";
import { ChevronRight, LogOut } from "lucide-react";

export default function AvatarCreation({ onComplete, onLogout }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState({
    base: avatarOptions.base[0].img,
    skin: avatarOptions.skin[0].img,
    hair: avatarOptions.hair[0].img,
    eyes: avatarOptions.eyes[0].img,
    mouth: avatarOptions.mouth[0].img,
    uniform: avatarOptions.uniform[0].img,
    accessory: avatarOptions.accessory[0].img,
  });

  // 🎵 Background music during avatar creation
  useEffect(() => {
    const audio = new Audio("/audio/avatar-theme.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(err => console.log("Audio autoplay blocked:", err));
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleSelect = (category, img) => {
    setAvatar(prev => ({ ...prev, [category]: img }));
  };

  const handleFinish = () => {
    if (!name.trim()) {
      alert("Por favor ingresa un nombre para tu avatar");
      return;
    }
    
    // Guardar avatar en localStorage con el nombre
    const fullAvatarData = {
      name: name.trim(),
      base: avatar.base,
      skin: avatar.skin,
      hair: avatar.hair,
      eyes: avatar.eyes,
      mouth: avatar.mouth,
      uniform: avatar.uniform,
      accessory: avatar.accessory,
    };
    
    localStorage.setItem("playerAvatar", JSON.stringify(fullAvatarData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      {/* Botón logout arriba a la derecha */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-6 right-6 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold py-2 px-4 rounded-lg transition-all border border-slate-700 flex items-center gap-2 uppercase tracking-widest text-xs z-20"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      )}

      {/* Contenedor principal */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-4xl w-full relative z-10">
        
        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">
            Crea tu Avatar
          </h1>
          <p className="text-cyan-400 font-bold">Personaliza tu perfil para el juego</p>
        </div>

        {/* Grid: Preview + Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <AvatarPreview avatar={avatar} />
            </div>
            
            {/* Campo de nombre */}
            <div className="w-full max-w-xs">
              <label className="text-white font-bold mb-2 block text-sm">Tu nombre de jugador:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Dr. García, Enfermera Ana..."
                maxLength={30}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:border-cyan-500 focus:outline-none font-bold text-base transition-all hover:border-slate-500"
              />
              <p className="text-slate-400 text-xs mt-1">{name.length}/30 caracteres</p>
            </div>
          </div>

          {/* Selectores de avatar */}
          <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(avatarOptions).map(([category, options]) => (
              <div key={category}>
                <p className="font-black mb-3 uppercase text-cyan-400 text-sm tracking-wider">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </p>
                <div className={`grid gap-2 ${category === 'base' ? 'grid-cols-2' : category === 'hair' ? 'grid-cols-5' : 'grid-cols-4'}`}>
                  {options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(category, opt.img)}
                      className={`relative p-2 rounded-lg transition-all transform hover:scale-105 border-2 ${
                        avatar[category] === opt.img
                          ? 'bg-cyan-600/20 border-cyan-400 shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      }`}
                      title={opt.label}
                    >
                      <img src={opt.img} alt={opt.label} className="w-full h-12 object-contain" />
                      {avatar[category] === opt.img && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de confirmación */}
        <button
          onClick={handleFinish}
          className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
        >
          Confirmar Avatar <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
}
