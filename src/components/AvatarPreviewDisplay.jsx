import React from "react";

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const gender = avatar?.gender || "female";
  
  const avatarImages = {
    female: "/src/assets/avatar/base/female_base.png",
    male: "/src/assets/avatar/base/male_base.png",
  };

  const avatarImage = avatarImages[gender];

  return (
    <div className={`${sizeClasses[size]} mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      {avatarImage && (
        <img
          src={avatarImage}
          alt="Avatar"
          className="w-full h-full object-cover transition-all duration-500 ease-out"
          key={gender}
        />
      )}
    </div>
  );
}
