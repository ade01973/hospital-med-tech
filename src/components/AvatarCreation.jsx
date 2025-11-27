import React, { useState, useEffect } from "react";
import AvatarPreview from "./AvatarPreview";
import { avatarOptions } from "../data/avatarOptions";
import { ChevronRight, LogOut } from "lucide-react";

export default function AvatarCreation({ onComplete, onLogout }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState({
    base: avatarOptions.base[0]?.img || "",
    skin: avatarOptions.skin[0]?.img || "",
    hair: avatarOptions.hair[0]?.img || "",
    eyes: avatarOptions.eyes[0]?.img || "",
    mouth: avatarOptions.mouth[0]?.img || "",
    uniform: avatarOptions.uniform[0]?.img || "",
    accessory: avatarOptions.accessory[0]?.img || "",
  });

  useEffect(() => {
    try {
      const audio = new Audio("/audio/avatar-theme.mp3");
      audio.loop = true;
      audio.volume = 0.3;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => console.log("Autoplay bloqueado"));
      }
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    } catch (err) {
      console.log("Error audio:", err);
    }
  }, []);

  const handleSelect = (category, img) => {
    setAvatar(prev => ({ ...prev, [category]: img }));
  };

  const handleFinish = () => {
    if (!name.trim()) {
      alert("Por favor ingresa un nombre");
      return;
    }
    const fullData = {
      name: name.trim(),
      base: avatar.base,
      skin: avatar.skin,
      hair: avatar.hair,
      eyes: avatar.eyes,
      mouth: avatar.mouth,
      uniform: avatar.uniform,
      accessory: avatar.accessory,
    };
    localStorage.setItem("playerAvatar", JSON.stringify(fullData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-6 right-6 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2 font-bold"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      )}

      <div className="bg-slate-900 border border-cyan-500 rounded-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Crea tu Avatar</h1>
          <p className="text-cyan-400">Personaliza tu profesional médico</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <AvatarPreview avatar={avatar} />
            
            <div className="w-full max-w-xs mt-6">
              <label className="text-white font-bold mb-2 block">Tu nombre:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Dr. García"
                maxLength={30}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-cyan-500 focus:outline-none"
              />
              <p className="text-slate-400 text-sm mt-1">{name.length}/30</p>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(avatarOptions).map(([category, options]) => (
              <div key={category}>
                <p className="text-cyan-400 font-bold uppercase text-sm mb-2">{category}</p>
                <div className="grid grid-cols-3 gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(category, opt.img)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        avatar[category] === opt.img
                          ? "bg-cyan-600 border-cyan-400"
                          : "bg-slate-800 border-slate-600 hover:border-cyan-400"
                      }`}
                      title={opt.label}
                    >
                      <img src={opt.img} alt={opt.label} className="w-full h-12 object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full mt-8 bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 flex items-center justify-center gap-2"
        >
          Confirmar Avatar <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
