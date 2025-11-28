import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function AvatarCustomization({ onComplete }) {
  const [gender, setGender] = useState(null);
  const [avatar, setAvatar] = useState({
    gender: null,
    silhouetteIndex: 1,
    skinToneIndex: 1,
  });

  const playClick = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Sonido agudo
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.debug("🔇 Audio no disponible");
    }
  };

  const handleGenderChange = (newGender) => {
    playClick();
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
          <div className="flex justify-center gap-8 mt-10">

            {/* MUJER */}
            <button
              onClick={() => { playClick(); setGender("female"); setAvatar({ ...avatar, gender: "female" }); }}
              className={`relative px-10 py-6 rounded-3xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${gender === "female" 
                  ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse" 
                  : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"}
              `}
            >
              {/* Glow animado interno */}
              <div className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "female" ? "bg-cyan-400 animate-pulse" : ""}
              `}></div>

              {/* Borde animado PRO */}
              <span className={`
                absolute inset-0 rounded-3xl border-4
                ${gender === "female"
                  ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                  : "border-transparent"
                }
              `}></span>

              {/* Icono */}
              <span className="text-4xl relative z-10">👩‍⚕️</span>
              <span className="relative z-10">Mujer</span>
            </button>

            {/* HOMBRE */}
            <button
              onClick={() => { playClick(); setGender("male"); setAvatar({ ...avatar, gender: "male" }); }}
              className={`relative px-10 py-6 rounded-3xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${gender === "male"
                  ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse"
                  : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"}
              `}
            >
              {/* Glow animado interno */}
              <div className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "male" ? "bg-blue-400 animate-pulse" : ""}
              `}></div>

              {/* Borde animado PRO */}
              <span className={`
                absolute inset-0 rounded-3xl border-4
                ${gender === "male"
                  ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                  : "border-transparent"
                }
              `}></span>

              {/* Icono */}
              <span className="text-4xl relative z-10">👨‍⚕️</span>
              <span className="relative z-10">Hombre</span>
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
