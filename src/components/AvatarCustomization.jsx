// src/components/AvatarCustomization.jsx
import React, { useState, useEffect } from "react";
import {
  skinTones,
  hairStyles,
  uniforms,
  accessories,
  defaultAvatarState,
} from "../data/avatarOptions";
import AvatarPreview from "./AvatarPreview";

const AVATAR_STORAGE_KEY = "hospitalMedTechAvatar";

const AvatarCustomization = ({ onComplete }) => {
  const [avatar, setAvatar] = useState(defaultAvatarState);

  // Cargar avatar previo si existe
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        setAvatar(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading avatar from storage", e);
    }
  }, []);

  const handleChange = (field, value) => {
    setAvatar(prev => {
      const updated = { ...prev, [field]: value };

      // Ajustes coherentes al cambiar de género
      if (field === "gender") {
        const gender = value;
        const defaultHair = hairStyles[gender][0]?.id;
        const defaultUniform = uniforms[gender][0]?.id;
        if (defaultHair) updated.hairStyleId = defaultHair;
        if (defaultUniform) updated.uniformId = defaultUniform;
      }

      return updated;
    });
  };

  const toggleAccessory = (id) => {
    setAvatar(prev => {
      const isSelected = prev.accessoryIds.includes(id);
      return {
        ...prev,
        accessoryIds: isSelected
          ? prev.accessoryIds.filter(a => a !== id)
          : [...prev.accessoryIds, id],
      };
    });
  };

  const handleConfirm = () => {
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
    } catch (e) {
      console.error("Error saving avatar", e);
    }
    // Llamar al callback para pasar al dashboard
    if (onComplete) onComplete(avatar);
  };

  const currentHairOptions = hairStyles[avatar.gender] || [];
  const currentUniformOptions = uniforms[avatar.gender] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-slate-100 flex flex-col items-center py-6 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Personaliza tu Gestora Enfermera
      </h1>
      <p className="text-slate-600 mb-6 text-center max-w-xl">
        Elige el aspecto físico y la indumentaria de tu avatar. 
        Este avatar te acompañará en todo el recorrido del juego.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Panel de opciones */}
        <div className="lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Género */}
          <section>
            <h2 className="font-semibold text-slate-800 mb-3 text-lg">Género</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange("gender", "female")}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition
                  ${avatar.gender === "female"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                Mujer
              </button>
              <button
                type="button"
                onClick={() => handleChange("gender", "male")}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition
                  ${avatar.gender === "male"
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
              >
                Hombre
              </button>
            </div>
          </section>

          {/* Tono de piel */}
          <section>
            <h2 className="font-semibold text-slate-800 mb-3 text-lg">Tono de piel</h2>
            <div className="flex gap-3">
              {skinTones.map(tone => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => handleChange("skinTone", tone.id)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border text-xs transition
                    ${avatar.skinTone === tone.id
                      ? "border-sky-600 ring-2 ring-sky-200"
                      : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span
                    className="w-10 h-10 rounded-full border border-slate-300"
                    style={{ backgroundColor: tone.color }}
                  />
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Pelo */}
          <section>
            <h2 className="font-semibold text-slate-800 mb-3 text-lg">Estilo de pelo</h2>
            <div className="grid grid-cols-2 gap-3">
              {currentHairOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleChange("hairStyleId", option.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition
                    ${avatar.hairStyleId === option.id
                      ? "border-sky-600 bg-sky-50"
                      : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={option.asset}
                      alt={option.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Uniforme */}
          <section>
            <h2 className="font-semibold text-slate-800 mb-3 text-lg">Indumentaria</h2>
            <div className="grid grid-cols-2 gap-3">
              {currentUniformOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleChange("uniformId", option.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition
                    ${avatar.uniformId === option.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={option.asset}
                      alt={option.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Accesorios */}
          <section>
            <h2 className="font-semibold text-slate-800 mb-3 text-lg">Accesorios</h2>
            <div className="grid grid-cols-3 gap-3">
              {accessories.map(acc => {
                const selected = avatar.accessoryIds.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccessory(acc.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs transition
                      ${selected
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={acc.asset}
                        alt={acc.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-center leading-tight">{acc.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-700 active:scale-95 transition"
            >
              Confirmar avatar y continuar
            </button>
          </div>
        </div>

        {/* Vista previa grande */}
        <div className="lg:w-1/2">
          <AvatarPreview avatar={avatar} />
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomization;