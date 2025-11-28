// src/components/AvatarPreview.jsx
import React from "react";
import { hairStyles, uniforms, accessories, skinTones } from "../data/avatarOptions";
import hospitalBg from "../assets/hospital-background.png";

export default function AvatarPreview({ avatar }) {
  const hair = hairStyles[avatar.gender]?.find(h => h.id === avatar.hairStyleId);
  const uniform = uniforms[avatar.gender]?.find(u => u.id === avatar.uniformId);
  const selectedAccessories = accessories.filter(a => avatar.accessoryIds.includes(a.id));
  const skinTone = skinTones.find(t => t.id === avatar.skinTone);

  return (
    <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Fondo del hospital */}
      <img
        src={hospitalBg}
        alt="Hospital"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

      <div className="relative h-full flex flex-col items-center justify-center p-8">
        {/* Contenedor del avatar */}
        <div className="relative w-48 h-64">
          {/* Silueta base - círculo de la cara con tono de piel */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-8 w-24 h-24 rounded-full border-2 border-slate-700/50 shadow-lg"
            style={{
              backgroundColor: skinTone?.color || "#d1a074",
            }}
          />

          {/* Cuerpo básico */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-28 w-28 h-36 rounded-t-full"
            style={{
              backgroundColor: skinTone?.color || "#d1a074",
              opacity: 0.8,
            }}
          />

          {/* Pelo - encima de la cara */}
          {hair && (
            <img
              src={hair.asset}
              alt="Pelo"
              className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-28 object-contain pointer-events-none z-10"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Uniforme - sobre el cuerpo */}
          {uniform && (
            <img
              src={uniform.asset}
              alt="Uniforme"
              className="absolute left-1/2 -translate-x-1/2 top-20 w-36 h-44 object-contain pointer-events-none z-20"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Accesorios - encima de todo */}
          {selectedAccessories.map((acc, idx) => (
            <img
              key={acc.id}
              src={acc.asset}
              alt={acc.label}
              className="absolute left-1/2 -translate-x-1/2 top-24 w-28 h-28 object-contain pointer-events-none z-30"
              style={{
                transform: `translate(-50%, ${idx * 5}px)`,
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>

        {/* Info del avatar */}
        <div className="mt-6 text-center text-slate-100">
          <p className="text-sm uppercase tracking-wide text-sky-300 font-semibold">
            {avatar.gender === "female" ? "Gestora" : "Gestor"} Enfermera
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Este será tu avatar dentro del hospital
          </p>
        </div>
      </div>
    </div>
  );
}