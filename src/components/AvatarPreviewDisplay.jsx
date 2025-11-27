import React from "react";

const SKIN_TONE_MAP = {
  1: "very_pale_skin_tone_layer.png",
  2: "fair_light_skin_tone_layer.png",
  3: "light_beige_skin_tone_layer.png",
  4: "warm_medium_skin_tone_layer.png",
  5: "olive_tan_skin_tone_layer.png",
  6: "medium_brown_skin_tone_layer.png",
  7: "deep_dark_brown_skin_tone_layer.png",
  8: "very_dark_black_skin_tone_layer.png",
};

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar.gender || "female";
  const silhouetteIndex = avatar.silhouetteIndex || 1;
  const skinToneIndex = avatar.skinToneIndex || 1;

  const silhouetteImage = `/src/assets/avatar/base/${gender}_silhouette_base_${silhouetteIndex}.png`;
  const skinToneImage = `/src/assets/avatar/skin/${SKIN_TONE_MAP[skinToneIndex]}`;

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      {/* Silhouette Base Layer */}
      <img
        src={silhouetteImage}
        alt="Avatar silhouette"
        className="absolute w-full h-full object-contain"
      />
      
      {/* Skin Tone Layer */}
      <img
        src={skinToneImage}
        alt="Skin tone"
        className="absolute w-full h-full object-contain"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
}
