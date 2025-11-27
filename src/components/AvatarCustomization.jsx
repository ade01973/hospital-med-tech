import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function AvatarCustomization({ onComplete }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState({
    base: "female",
    face: 1,
    skin: "light",
    hair: "long",
    eyes: "brown",
    mouth: "smile",
    uniform: "teal",
    accessory: "none",
  });

  const skinTones = [
    { id: "very-light", label: "Muy Claro", emoji: "🟡" },
    { id: "light", label: "Claro", emoji: "🟠" },
    { id: "medium", label: "Medio", emoji: "🟠" },
    { id: "olive-tan", label: "Aceitunado", emoji: "🟠" },
    { id: "dark", label: "Oscuro", emoji: "⚫" },
  ];

  const handleFinish = () => {
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    const avatarData = {
      name: name.trim(),
      ...avatar,
    };

    localStorage.setItem("playerAvatar", JSON.stringify(avatarData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-2">Crea tu Gestora Enfermera</h1>
          <p className="text-cyan-400 font-bold">Personaliza tu perfil profesional</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
              <AvatarPreviewDisplay avatar={avatar} size="large" />
            </div>
            
            {/* Name Input */}
            <div className="w-full max-w-xs">
              <label className="text-white font-bold mb-2 block text-sm">Tu nombre:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                maxLength={30}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:border-cyan-500 focus:outline-none font-bold"
              />
              <p className="text-slate-400 text-xs mt-1">{name.length}/30 caracteres</p>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-black mb-4 uppercase text-cyan-400 text-sm tracking-wider">Selecciona tu género</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Male Button */}
                <button
                  onClick={() => setAvatar(prev => ({ ...prev, base: 'male' }))}
                  className={`relative p-6 rounded-xl transition-all transform hover:scale-105 border-2 ${
                    avatar.base === 'male'
                      ? 'bg-cyan-600/20 border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-5xl mb-2">👨‍⚕️</div>
                  <p className="text-white font-bold">Hombre</p>
                  {avatar.base === 'male' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                      ✓
                    </div>
                  )}
                </button>

                {/* Female Button */}
                <button
                  onClick={() => setAvatar(prev => ({ ...prev, base: 'female' }))}
                  className={`relative p-6 rounded-xl transition-all transform hover:scale-105 border-2 ${
                    avatar.base === 'female'
                      ? 'bg-cyan-600/20 border-cyan-400 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="text-5xl mb-2">👩‍⚕️</div>
                  <p className="text-white font-bold">Mujer</p>
                  {avatar.base === 'female' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                      ✓
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Skin Tone Selection */}
            <div>
              <p className="font-black mb-3 uppercase text-cyan-400 text-sm tracking-wider">Tono de piel</p>
              <div className="grid grid-cols-5 gap-2">
                {skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setAvatar(prev => ({ ...prev, skin: tone.id }))}
                    className={`relative p-3 rounded-lg transition-all transform hover:scale-110 border-2 flex flex-col items-center justify-center gap-1 ${
                      avatar.skin === tone.id
                        ? 'bg-cyan-600/20 border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                    }`}
                    title={tone.label}
                  >
                    <div className="text-2xl">{tone.emoji}</div>
                    <p className="text-white text-xs font-bold text-center leading-tight">{tone.label}</p>
                    {avatar.skin === tone.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Options Placeholder */}
            <div className="text-center text-slate-400">
              <p className="text-sm font-bold">Más opciones próximamente:</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>• Cabello</p>
                <p>• Ojos</p>
                <p>• Boca</p>
                <p>• Uniforme</p>
                <p>• Accesorios</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleFinish}
          className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
        >
          Confirmar Avatar <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
