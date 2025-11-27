import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function AvatarCustomization({ onComplete }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("female");
  const [silhouetteIndex, setSilhouetteIndex] = useState(1);
  const [avatar, setAvatar] = useState({
    gender: "female",
    silhouetteIndex: 1,
  });

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setAvatar({ gender: newGender, silhouetteIndex });
  };

  const handleSilhouetteChange = (index) => {
    setSilhouetteIndex(index);
    setAvatar({ gender, silhouetteIndex: index });
  };

  const handleFinish = () => {
    if (!name.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }

    const avatarData = {
      name: name.trim(),
      gender,
      silhouetteIndex,
      // Placeholders para características futuras
      face: null,
      skinColor: null,
      eyeColor: null,
      eyeShape: null,
      noseType: null,
      mouth: null,
      hairType: null,
      hairColor: null,
      uniform: null,
      accessory: null,
    };

    localStorage.setItem("playerAvatar", JSON.stringify(avatarData));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white mb-2">Crea tu Gestora Enfermera</h1>
          <p className="text-cyan-400 font-bold">Personaliza tu perfil profesional</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          
          {/* Avatar Preview */}
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>
          
          {/* Gender Selector */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleGenderChange("female")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                gender === "female"
                  ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              👩 Mujer
            </button>
            <button
              onClick={() => handleGenderChange("male")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                gender === "male"
                  ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              👨 Hombre
            </button>
          </div>

          {/* Silhouette Selector */}
          <div className="w-full">
            <p className="text-white font-bold mb-3">Tipo de silueta:</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  onClick={() => handleSilhouetteChange(index)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    silhouetteIndex === index
                      ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {index}
                </button>
              ))}
            </div>
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

          {/* Confirm Button */}
          <button
            onClick={handleFinish}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
          >
            Confirmar Avatar <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
