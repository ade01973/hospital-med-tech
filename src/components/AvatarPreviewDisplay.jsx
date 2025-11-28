import React from "react";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar?.gender || "female";
  const skinToneIndex = avatar?.skinToneIndex || 2;

  // Base layer images (same for all genders, different silhouettes per gender)
  const baseImages = {
    female: "/src/assets/avatar/base/female_base.png",
    male: "/src/assets/avatar/base/male_base.png",
  };

  // Skin tone color layers (universal, applies with multiply blend mode)
  const skinColorLayer = `/src/assets/avatar/skin_layers/skin_tone_${skinToneIndex}.png`;

  const baseImage = baseImages[gender];

  return (
    <div
      className={`${sizeClasses[size]} mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center relative`}
    >
      {/* Base Layer */}
      {baseImage && (
        <img
          src={baseImage}
          alt="Avatar Base"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
          key={`base-${gender}`}
        />
      )}

      {/* Skin Tone Color Layer with Multiply Blend Mode */}
      {skinColorLayer && (
        <img
          src={skinColorLayer}
          alt="Skin Tone"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
          style={{ mixBlendMode: "multiply" }}
          key={`skin-${skinToneIndex}`}
        />
      )}
    </div>
  );
}
