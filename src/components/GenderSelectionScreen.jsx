import React from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

export default function GenderSelectionScreen({ gender, setGender, onNext }) {
  // Click suave digital para Mujer
  const playClickFemale = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 920;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.25, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.08);
    } catch (error) {
      console.debug("🔇 Audio no disponible");
    }
  };

  // Click metálico ligero para Hombre
  const playClickMale = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.frequency.value = 1200;
      osc1.type = "triangle";
      gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.12);
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 2000;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.debug("🔇 Audio no disponible");
    }
  };

  const avatar = { gender };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Genera tu Gestora Enfermera</h1>
          <p className="text-center text-cyan-400 font-semibold mb-6 transition-all duration-300">
            {gender === "female"
              ? "Liderazgo, precisión y visión de futuro. Crea tu gestora enfermera."
              : gender === "male"
              ? "Gestión de personas, visión estratégica y excelencia profesional."
              : "Elige tu rol y comienza tu viaje como gestor sanitario."}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          {/* Avatar Preview */}
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>

          {/* Gender Selector */}
          <div className="flex justify-center gap-8 mt-10">
            {/* MUJER */}
            <button
              onClick={() => {
                playClickFemale();
                setGender("female");
              }}
              className={`relative px-10 py-6 rounded-3xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${gender === "female"
                  ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse"
                  : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"}
              `}
            >
              <div
                className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "female" ? "bg-cyan-400 animate-pulse" : ""}
              `}
              ></div>
              <span
                className={`
                absolute inset-0 rounded-3xl border-4
                ${gender === "female"
                  ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                  : "border-transparent"}
              `}
              ></span>
              <span className="text-4xl relative z-10">👩‍⚕️</span>
              <span className="relative z-10">Mujer</span>
            </button>

            {/* HOMBRE */}
            <button
              onClick={() => {
                playClickMale();
                setGender("male");
              }}
              className={`relative px-10 py-6 rounded-3xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${gender === "male"
                  ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse"
                  : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"}
              `}
            >
              <div
                className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "male" ? "bg-blue-400 animate-pulse" : ""}
              `}
              ></div>
              <span
                className={`
                absolute inset-0 rounded-3xl border-4
                ${gender === "male"
                  ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                  : "border-transparent"}
              `}
              ></span>
              <span className="text-4xl relative z-10">👨‍⚕️</span>
              <span className="relative z-10">Hombre</span>
            </button>
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!gender}
            className={`w-full font-black py-4 rounded-xl uppercase tracking-widest text-base transition-all transform flex items-center justify-center gap-2 ${
              gender
                ? "bg-white text-black hover:bg-cyan-50 hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                : "bg-slate-600 text-slate-400 cursor-not-allowed opacity-50"
            }`}
          >
            Siguiente <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
