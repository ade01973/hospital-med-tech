import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function AvatarCustomization({ onComplete }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState({
    base: "female",
    skin: "light",
    hair: "long",
    eyes: "brown",
    mouth: "smile",
    uniform: "teal",
    accessory: "none",
  });

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

          {/* Options Placeholder - to be developed later */}
          <div className="flex items-center justify-center">
            <div className="text-center text-slate-400">
              <p className="text-lg font-bold mb-4">Opciones de personalización</p>
              <p className="text-sm">(Se desarrollarán próximamente)</p>
              <div className="mt-6 space-y-2 text-xs text-slate-500">
                <p>• Base</p>
                <p>• Piel</p>
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
