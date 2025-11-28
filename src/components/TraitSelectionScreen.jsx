import React, { useState } from "react";
import AvatarPreviewDisplay from "./AvatarPreviewDisplay";
import { ChevronRight } from "lucide-react";

const TraitSelectionScreen = ({ gender, onComplete, onBack }) => {
  const [avatar, setAvatar] = useState({
    gender: gender,
    skinToneIndex: 3,
  });

  const handleComplete = () => {
    onComplete({
      gender: avatar.gender,
      skinToneIndex: avatar.skinToneIndex,
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
            Paso 2: Rasgos
          </p>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-10">
          <div className="border-2 border-cyan-500/30 rounded-2xl p-4 bg-slate-800">
            <AvatarPreviewDisplay avatar={avatar} size="large" />
          </div>
        </div>

        {/* SKIN TONES */}
        <div className="mb-10">
          <p className="font-bold text-white mb-4">🎨 Tono de piel</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((tone) => (
              <button
                key={tone}
                onClick={() => setAvatar(prev => ({ ...prev, skinToneIndex: tone }))}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  avatar.skinToneIndex === tone
                    ? "border-cyan-400 scale-110"
                    : "border-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-slate-700 text-white hover:bg-slate-600 font-black py-4 rounded-xl transition-all"
          >
            ← Atrás
          </button>

          <button
            onClick={handleComplete}
            className="flex-1 bg-white text-black hover:bg-cyan-50 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Crear Avatar <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraitSelectionScreen;
