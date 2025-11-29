import React, { useState, useEffect } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";
import avatarCreationBg from "../assets/avatar-creation-bg.png";
import avatarMalePreview from "../assets/avatar-male-preview.mp4";
import avatarFemalePreview from "../assets/avatar-female-preview.mp4";
import useBackgroundMusic from "../hooks/useBackgroundMusic";

// Rutas de videos
const VIDEOS = {
  male: avatarMalePreview,
  female: avatarFemalePreview,
};

export default function AvatarCustomization({ onComplete }) {
  const [gender, setGender] = useState(null);
  const [avatar, setAvatar] = useState({
    name: "",
    gender: null,
    silhouetteIndex: 1,
    skinToneIndex: 1,
  });

  // Música de fondo ambiental en avatar
  useBackgroundMusic(true);

  // Click suave digital para Mujer
  const playClickFemale = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = 920; // Sonido suave digital más alto
      osc.type = "sine";
      gain.gain.setValueAtTime(0.25, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.08,
      );

      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.08);
    } catch (error) {
      console.debug("🔇 Audio no disponible");
    }
  };

  // Click metálico ligero para Hombre
  const playClickMale = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();

      // Primera onda: nota principal metálica
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);

      osc1.frequency.value = 1200; // Más agudo y metálico
      osc1.type = "triangle"; // Tipo triangular para efecto metálico
      gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain1.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.12,
      );

      osc1.start(audioContext.currentTime);
      osc1.stop(audioContext.currentTime + 0.12);

      // Segunda onda: armónico superior
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);

      osc2.frequency.value = 2000;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );

      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.debug("🔇 Audio no disponible");
    }
  };

  const handleFinish = () => {
    if (!avatar.name.trim()) {
      alert("Por favor ingresa un nombre para tu gestora enfermera");
      return;
    }

    const avatarData = {
      name: avatar.name.trim(),
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
    // Si es hombre o mujer, ir a personalización; onComplete recibe el gender
    onComplete(gender);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${avatarCreationBg})` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            Genera tu Gestora Enfermera
          </h1>
          <p className="text-center text-cyan-400 font-semibold mb-6 transition-all duration-300">
            {gender === "female"
              ? "Liderazgo, precisión y visión de futuro. Crea tu gestora enfermera."
              : gender === "male"
                ? "Gestión de personas, visión estratégica y excelencia profesional."
                : "Elige tu rol y comienza tu viaje como gestor sanitario."}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          {/* Avatar Preview - Video or Empty Viewer */}
          <div className="border-2 border-cyan-500/30 rounded-xl p-0 bg-slate-800 w-2/3 max-w-xs aspect-square flex items-center justify-center overflow-hidden animate-enter-float animate-glow-pulse hover:scale-110 hover:border-cyan-400/70 hover:animate-breathe transition-all duration-500 ease-in-out cursor-pointer">
            {gender && (
              <video
                key={gender}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              >
                <source src={VIDEOS[gender]} type="video/mp4" />
              </video>
            )}
            {!gender && <AvatarPreviewDisplay avatar={avatar} size="large" />}
          </div>

          {/* Name Input */}
          <div className="w-full mt-3">
            {" "}
            <input
              type="text"
              maxLength="30"
              placeholder="Tu nombre..."
              value={avatar.name}
              onChange={(e) => setAvatar({ ...avatar, name: e.target.value })}
              className="w-full px-6 py-4 bg-slate-800/60 border-2 border-cyan-500/40 rounded-2xl text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all duration-300 font-semibold text-lg"
            />
            <p className="text-xs text-slate-400 mt-2 text-right">
              {avatar.name.length}/30
            </p>
          </div>

          {/* Gender Selector */}
          <div className="flex justify-center gap-4 w-full">
            {" "}
            {/* MUJER */}
            <button
              onClick={() => {
                playClickFemale();
                setGender("female");
                setAvatar({ ...avatar, gender: "female" });
              }}
              className={`relative px-6 py-4 rounded-2xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${
                  gender === "female"
                    ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse"
                    : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"
                }
              `}
            >
              {/* Glow animado interno */}
              <div
                className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "female" ? "bg-cyan-400 animate-pulse" : ""}
              `}
              ></div>

              {/* Borde animado PRO */}
              <span
                className={`
                absolute inset-0 rounded-2xl border-4
                ${
                  gender === "female"
                    ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                    : "border-transparent"
                }
              `}
              ></span>

              {/* Icono */}
              <span className="text-4xl relative z-10">👩‍⚕️</span>
              <span className="relative z-10">Mujer</span>
            </button>
            {/* HOMBRE */}
            <button
              onClick={() => {
                playClickMale();
                setGender("male");
                setAvatar({ ...avatar, gender: "male" });
              }}
              className={`relative px-6 py-4 rounded-2xl font-black text-2xl flex items-center gap-4 transition-all duration-300 backdrop-blur-2xl overflow-hidden group
                ${
                  gender === "male"
                    ? "text-white bg-gradient-to-br from-cyan-500 to-blue-700 shadow-[0_0_30px_rgba(0,200,255,0.6)] scale-[1.03] animate-pulse"
                    : "text-slate-300 bg-slate-800/60 border border-slate-700 hover:border-cyan-300 hover:scale-105"
                }
              `}
            >
              {/* Glow animado interno */}
              <div
                className={`
                absolute inset-0 opacity-30 blur-2xl transition-all duration-500
                ${gender === "male" ? "bg-blue-400 animate-pulse" : ""}
              `}
              ></div>

              {/* Borde animado PRO */}
              <span
                className={`
                absolute inset-0 rounded-2xl border-4
                ${
                  gender === "male"
                    ? "border-cyan-300 animate-[glow_2s_linear_infinite]"
                    : "border-transparent"
                }
              `}
              ></span>

              {/* Icono */}
              <span className="text-4xl relative z-10">👨‍⚕️</span>
              <span className="relative z-10">Hombre</span>
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleFinish}
            disabled={!gender || !avatar.name.trim()}
            className={`w-full font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-base ${
              !gender || !avatar.name.trim()
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-white text-black hover:bg-cyan-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            }`}
          >
            {gender === "male" ? "Personalizar Gestor Enfermero" : "Confirmar"}{" "}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
