import React from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

const SKIN_TONES = [
  { index: 1, label: "Muy Pálido", color: "bg-yellow-50" },
  { index: 2, label: "Claro", color: "bg-yellow-100" },
  { index: 3, label: "Beige Claro", color: "bg-yellow-200" },
  { index: 4, label: "Medio Cálido", color: "bg-yellow-600" },
  { index: 5, label: "Oliva", color: "bg-orange-600" },
  { index: 6, label: "Marrón Medio", color: "bg-orange-700" },
  { index: 7, label: "Marrón Oscuro", color: "bg-amber-900" },
  { index: 8, label: "Muy Oscuro", color: "bg-gray-900" },
];

export default function TraitSelectionScreen({ gender, onComplete, onBack }) {
  const [skinTone, setSkinTone] = React.useState(3);

  const avatar = { gender, skinToneIndex: skinTone };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Personaliza tu Avatar</h1>
          <p className="text-center text-cyan-400 font-semibold mb-6">
            Paso 2: Rasgos y características
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          {/* Avatar Preview */}
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>

          {/* Skin Tone Selector */}
          <div className="w-full">
            <p className="text-white font-bold mb-4 text-sm">
              Tono de piel: {SKIN_TONES.find((t) => t.index === skinTone)?.label}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.index}
                  onClick={() => setSkinTone(tone.index)}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    skinTone === tone.index
                      ? `${tone.color} border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)] scale-110`
                      : `${tone.color} border-slate-600 hover:border-slate-500 hover:scale-105`
                  }`}
                  title={tone.label}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex gap-3 mt-6">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-1/3 bg-slate-700 text-white hover:bg-slate-600 font-black py-3 rounded-xl shadow-[0_0_10px_rgba(100,116,139,0.3)] hover:shadow-[0_0_20px_rgba(100,116,139,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-1 uppercase tracking-wide text-sm"
            >
              ← Atrás
            </button>

            {/* Confirm Button */}
            <button
              onClick={() => onComplete(avatar)}
              className="flex-1 bg-white text-black hover:bg-cyan-50 font-black py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Crear Avatar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
