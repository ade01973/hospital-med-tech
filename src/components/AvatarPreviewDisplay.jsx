import React from "react";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar.gender || "female";
  const silhouetteIndex = avatar.silhouetteIndex || 1;
  const silhouetteImage = `/src/assets/avatar/base/${gender}_torso_silhouette_${silhouetteIndex}.png`;

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      <img
        src={silhouetteImage}
        alt="Avatar silhouette"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
