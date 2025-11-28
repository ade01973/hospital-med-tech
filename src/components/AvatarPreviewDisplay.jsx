import React from "react";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar?.gender || "female";
  const skinToneIndex = avatar?.skinToneIndex || 3;
  const hair = avatar?.hair || (gender === "female" ? "long" : "male_short");
  const eyes = avatar?.eyes || "brown";

  // Layer paths
  const layers = [
    { id: "base", src: `/src/assets/avatar/base/${gender}_base.png` },
    { id: "skin", src: `/src/assets/avatar/skin/skin_${skinToneIndex}.png` },
    { id: "hair", src: `/src/assets/avatar/hair/${hair}.png` },
    { id: "eyes", src: `/src/assets/avatar/eyes/${eyes}.png` },
  ];

  return (
    <div
      className={`${sizeClasses[size]} mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center relative`}
    >
      {/* Render layers in correct order */}
      {layers.map((layer) => (
        <img
          key={`${gender}-${skinToneIndex}-${hair}-${eyes}-${layer.id}`}
          src={layer.src}
          alt={`Avatar ${layer.id}`}
          className="absolute w-full h-full object-cover"
          style={{
            opacity: 1,
            mixBlendMode: layer.id === "skin" ? "multiply" : "normal",
          }}
          onError={(e) => {
            console.debug(`❌ Avatar layer failed to load: ${layer.src}`);
          }}
        />
      ))}
    </div>
  );
}
