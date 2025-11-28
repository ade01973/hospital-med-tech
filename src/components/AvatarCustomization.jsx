import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function AvatarCustomization({ onComplete }) {
  const [gender, setGender] = useState("female");
  const [avatar, setAvatar] = useState({
    gender: "female",
    silhouetteIndex: 1,
    skinToneIndex: 1,
  });

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setAvatar({ ...avatar, gender: newGender });
  };

  const handleFinish = () => {
    const avatarData = {
      name: "Gestora Enfermera",
      gender,
      silhouetteIndex: 1,
      skinToneIndex: 1,
      face: null,
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
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Genera tu Gestora Enfermera</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          
          {/* Avatar Preview - Empty Viewer */}
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>
          
          {/* Gender Selector */}
          <div className="flex justify-center gap-6 mt-8">

            {/* MUJER */}
            <button
              onClick={() => handleGenderChange("female")}
              className={`
                group px-8 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 
                transition-all duration-300 backdrop-blur-xl border 
                ${gender === "female" 
                  ? "bg-gradient-to-br from-cyan-500/40 to-blue-600/30 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] scale-105" 
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-cyan-300 hover:scale-105 hover:bg-slate-700/50"
                }
              `}
            >
              <span className="text-3xl">👩</span> 
              Mujer
            </button>

            {/* HOMBRE */}
            <button
              onClick={() => handleGenderChange("male")}
              className={`
                group px-8 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 
                transition-all duration-300 backdrop-blur-xl border 
                ${gender === "male" 
                  ? "bg-gradient-to-br from-cyan-500/40 to-blue-600/30 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)] scale-105" 
                  : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-cyan-300 hover:scale-105 hover:bg-slate-700/50"
                }
              `}
            >
              <span className="text-3xl">👨</span> 
              Hombre
            </button>

          </div>

          {/* Confirm Button */}
          <button
            onClick={handleFinish}
            className="w-full bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base"
          >
            Confirmar <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
