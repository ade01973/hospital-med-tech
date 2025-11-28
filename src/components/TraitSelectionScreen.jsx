import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

const TraitSelectionScreen = ({ gender, onComplete, onBack }) => {
  const [avatar, setAvatar] = useState({
    gender: gender,
    skinToneIndex: 3,
    hair: gender === "female" ? "long" : "male_short",
    eyes: "brown",
  });

  const update = (prop, value) =>
    setAvatar((prev) => ({ ...prev, [prop]: value }));

  const skinTones = [
    { index: 1, label: "Muy Pálido" },
    { index: 2, label: "Claro" },
    { index: 3, label: "Beige Claro" },
    { index: 4, label: "Medio Cálido" },
    { index: 5, label: "Oliva" },
  ];

  const skinToneColors = {
    1: "bg-yellow-50",
    2: "bg-yellow-100",
    3: "bg-yellow-200",
    4: "bg-yellow-600",
    5: "bg-orange-600",
  };

  const hairStylesFemale = [
    { value: "long", label: "Largo" },
    { value: "short", label: "Corto" },
    { value: "curly", label: "Rizado" },
  ];

  const hairStylesMale = [
    { value: "male_short", label: "Corto" },
    { value: "male_fade", label: "Fade" },
    { value: "curly", label: "Rizado" },
  ];

  const eyeColors = [
    { value: "brown", label: "Marrón" },
    { value: "blue", label: "Azul" },
    { value: "green", label: "Verde" },
  ];

  const handleComplete = () => {
    onComplete({
      gender: avatar.gender,
      skinToneIndex: avatar.skinToneIndex,
      hair: avatar.hair,
      eyes: avatar.eyes,
      silhouetteIndex: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white mb-3">
            Personaliza tu Avatar
          </h2>
          <p className="text-cyan-400 font-semibold">
            Paso 2: Rasgos y características
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-10">
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>
        </div>

        {/* SKIN TONES */}
        <div className="mb-8">
          <p className="font-bold text-white mb-4 flex items-center gap-2">
            🎨 Tono de piel
          </p>
          <div className="flex gap-3 flex-wrap">
            {skinTones.map((tone) => (
              <button
                key={tone.index}
                onClick={() => update("skinToneIndex", tone.index)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  avatar.skinToneIndex === tone.index
                    ? "scale-110 opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full border-4 ${skinToneColors[tone.index]} transition-all ${
                    avatar.skinToneIndex === tone.index
                      ? "border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                      : "border-slate-600"
                  }`}
                />
                <span className="text-xs text-slate-300">{tone.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* HAIR STYLES */}
        <div className="mb-8">
          <p className="font-bold text-white mb-4 flex items-center gap-2">
            💇 Estilo de cabello
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(gender === "female" ? hairStylesFemale : hairStylesMale).map(
              (h) => (
                <button
                  key={h.value}
                  onClick={() => update("hair", h.value)}
                  className={`p-4 rounded-xl text-center transition-all font-semibold ${
                    avatar.hair === h.value
                      ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-105"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {h.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* EYE COLORS */}
        <div className="mb-10">
          <p className="font-bold text-white mb-4 flex items-center gap-2">
            👀 Color de ojos
          </p>
          <div className="grid grid-cols-3 gap-3">
            {eyeColors.map((e) => (
              <button
                key={e.value}
                onClick={() => update("eyes", e.value)}
                className={`p-4 rounded-xl transition-all font-semibold ${
                  avatar.eyes === e.value
                    ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-105"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex-1 bg-slate-700 text-white hover:bg-slate-600 font-black py-4 rounded-xl shadow-[0_0_10px_rgba(100,116,139,0.3)] hover:shadow-[0_0_20px_rgba(100,116,139,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            ← Atrás
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleComplete}
            className="flex-1 bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            Crear Avatar <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraitSelectionScreen;
