import React from "react";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar?.gender || "female";
  const skinToneIndex = avatar?.skinToneIndex || 2;

  // Base layer images
  const baseImages = {
    female: "/src/assets/avatar/base/female_base.png",
    male: "/src/assets/avatar/base/male_base.png",
  };

  // Skin tone layer images
  const skinImages = {
    female: `/src/assets/avatar/skin_layers/female_skin_layer_${skinToneIndex}.png`,
    male: `/src/assets/avatar/skin_layers/male_skin_layer_${skinToneIndex}.png`,
  };

  const baseImage = baseImages[gender];
  const skinImage = skinImages[gender];

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

      {/* Skin Tone Layer */}
      {skinImage && (
        <img
          src={skinImage}
          alt="Avatar Skin"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
          key={`skin-${gender}-${skinToneIndex}`}
        />
      )}
    </div>
  );
}
