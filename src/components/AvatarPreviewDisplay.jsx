import React from "react";
import { getFemaleCharacterImage, getMaleCharacterImage } from "../lib/characterImages";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-16 h-24",
    medium: "w-32 h-48",
    large: "w-48 h-64",
  };

  const gender = avatar?.gender || "female";
  
  // Placeholder avatars by gender using bundled assets to avoid 404s
  const avatarImages = {
    female: getFemaleCharacterImage(1),
    male: getMaleCharacterImage(1),
  };

  const avatarImage = avatarImages[gender];

  return (
    <div className={`${sizeClasses[size]} mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      {avatarImage && (
        <img
          src={avatarImage}
          alt="Avatar"
          className="w-full h-full object-contain object-top transition-all duration-500 ease-out opacity-0 animate-fadeInUp"
          key={gender}
        />
      )}
    </div>
  );
}
