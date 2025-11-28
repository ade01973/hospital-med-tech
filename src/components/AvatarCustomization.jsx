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
          <h1 className="text-4xl font-black text-white mb-2">genera tu Gestora Enfermera</h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          
          {/* Avatar Preview - Empty Viewer */}
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
