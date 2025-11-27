import React, { useState } from "react";
import { avatarNurseOptions } from "../data/avatarNurseOptions";
import { ChevronRight, LogOut } from "lucide-react";

export default function NurseManagerAvatarCreation({ onComplete, onLogout }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState({
    head: avatarNurseOptions.head[0].img,
    hair: avatarNurseOptions.hair[0].img,
    skin: avatarNurseOptions.skin[0].img,
    uniform: avatarNurseOptions.uniform[0].img,
    accessory: "",
  });

  const handleSelect = (category, img) => {
    setAvatar(prev => ({ ...prev, [category]: img }));
  };

  const handleFinish = () => {
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }
    
    const nurseAvatarData = {
      name: name.trim(),
      ...avatar,
    };
    
    localStorage.setItem("nurseManagerAvatar", JSON.stringify(nurseAvatarData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute top-6 right-6 bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold py-2 px-4 rounded-lg transition-all border border-slate-700 flex items-center gap-2 uppercase tracking-widest text-xs z-20"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      )}

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-5xl w-full relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">
            Genera tu Gestora Enfermera
          </h1>
          <p className="text-cyan-400 font-bold">Personaliza tu perfil profesional médico</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center lg:col-span-1">
            <div className="relative w-56 h-72 mx-auto mb-6 bg-slate-800 rounded-2xl p-4 flex items-center justify-center border-2 border-cyan-500/30">
              {avatar.head && <img src={avatar.head} alt="head" className="absolute w-full h-32 object-contain" />}
              {avatar.hair && <img src={avatar.hair} alt="hair" className="absolute w-full h-24 object-contain top-0" />}
              {avatar.skin && <img src={avatar.skin} alt="skin" className="absolute w-full h-40 object-contain" />}
              {avatar.uniform && <img src={avatar.uniform} alt="uniform" className="absolute bottom-0 w-full h-32 object-contain" />}
              {avatar.accessory && <img src={avatar.accessory} alt="accessory" className="absolute w-full h-40 object-contain" />}
            </div>
            
            <div className="w-full max-w-xs">
              <label className="text-white font-bold mb-2 block text-sm">Tu nombre profesional:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Dra. García, Enfermero Juan..."
                maxLength={30}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 text-white placeholder-slate-400 rounded-lg focus:border-cyan-500 focus:outline-none font-bold text-base transition-all"
              />
              <p className="text-slate-400 text-xs mt-1">{name.length}/30 caracteres</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="lg:col-span-2 space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(avatarNurseOptions).map(([category, options]) => (
              <div key={category}>
                <p className="font-black mb-3 uppercase text-cyan-400 text-sm tracking-wider">
                  {category === 'head' && 'Cara'} 
                  {category === 'hair' && 'Cabello'}
                  {category === 'skin' && 'Tono de piel'}
                  {category === 'uniform' && 'Uniforme'}
                  {category === 'accessory' && 'Accesorios'}
                </p>
                <div className={`grid gap-2 ${category === 'head' ? 'grid-cols-2' : 'grid-cols-3'}`}>
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
                      {opt.img ? (
                        <img src={opt.img} alt={opt.label} className="w-full h-16 object-contain" />
                      ) : (
                        <div className="w-full h-16 flex items-center justify-center text-slate-400 text-xs">
                          {opt.label}
                        </div>
                      )}
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

        <button
          onClick={handleFinish}
          className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
        >
          Ir al Dashboard <ChevronRight className="w-5 h-5" />
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
