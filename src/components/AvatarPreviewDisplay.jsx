// src/components/AvatarPreviewDisplay.jsx
import React, { useEffect, useState } from "react";
import { defaultAvatarState } from "../data/avatarOptions";
import { hairStyles, uniforms, accessories, skinTones } from "../data/avatarOptions";

const AVATAR_STORAGE_KEY = "hospitalMedTechAvatar";

export default function AvatarPreviewDisplay({ size = "medium" }) {
  const [avatar, setAvatar] = useState(defaultAvatarState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (saved) {
        setAvatar(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading avatar in dashboard", e);
    }
  }, []);

  const hair = hairStyles[avatar.gender]?.find(h => h.id === avatar.hairStyleId);
  const uniform = uniforms[avatar.gender]?.find(u => u.id === avatar.uniformId);
  const selectedAccessories = accessories.filter(a => avatar.accessoryIds?.includes(a.id));
  const skinTone = skinTones.find(t => t.id === avatar.skinTone);

  // Diferentes tamaños para el componente
  const sizeClasses = {
    small: "w-16 h-20",
    medium: "w-24 h-32",
    large: "w-40 h-56",
  };

  const containerSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${containerSize} flex items-center justify-center`}>
        {/* Silueta base - círculo de la cara */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${size === 'small' ? 'top-1 w-8 h-8' : size === 'large' ? 'top-4 w-16 h-16' : 'top-2 w-12 h-12'} rounded-full border border-slate-700/30`}
          style={{
            backgroundColor: skinTone?.color || "#d1a074",
          }}
        />

        {/* Cuerpo básico */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 ${size === 'small' ? 'top-7 w-10 h-12' : size === 'large' ? 'top-16 w-20 h-28' : 'top-11 w-14 h-20'} rounded-t-full`}
          style={{
            backgroundColor: skinTone?.color || "#d1a074",
            opacity: 0.7,
          }}
        />

        {/* Pelo */}
        {hair && (
          <img
            src={hair.asset}
            alt="Pelo"
            className={`absolute left-1/2 -translate-x-1/2 ${size === 'small' ? 'top-0 w-10 h-10' : size === 'large' ? 'top-0 w-20 h-20' : 'top-0 w-14 h-14'} object-contain pointer-events-none z-10`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Uniforme */}
        {uniform && (
          <img
            src={uniform.asset}
            alt="Uniforme"
            className={`absolute left-1/2 -translate-x-1/2 ${size === 'small' ? 'top-5 w-12 h-14' : size === 'large' ? 'top-12 w-24 h-32' : 'top-8 w-16 h-22'} object-contain pointer-events-none z-20`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Accesorios */}
        {selectedAccessories.map((acc, idx) => (
          <img
            key={acc.id}
            src={acc.asset}
            alt={acc.label}
            className={`absolute left-1/2 -translate-x-1/2 ${size === 'small' ? 'top-7 w-10 h-10' : size === 'large' ? 'top-16 w-18 h-18' : 'top-11 w-14 h-14'} object-contain pointer-events-none z-30`}
            style={{
              transform: `translate(-50%, ${idx * 2}px)`,
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>

      {size !== 'small' && (
        <div className="text-center">
          <p className="text-xs text-slate-600 font-medium">
            {avatar.gender === "female" ? "Gestora" : "Gestor"}
          </p>
        </div>
      )}
    </div>
  );
}